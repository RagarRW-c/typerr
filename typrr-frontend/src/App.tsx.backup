import React, { useEffect, useMemo, useRef, useState } from "react";
import { SNIPPETS, getAllLanguages, type Difficulty } from "./snippets";
import { saveEntry } from "./stats";
import { getNewlyUnlockedAchievements, type Achievement } from "./achievements";
import { ToastManager } from "./Toast";
import Dashboard from "./Dashboard";
import { useAuth } from './AuthContext';
import { apiClient } from './api';
import AuthModal from './AuthModal';

// --- Utilities ---

const DAY_KEY = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD
const STORAGE_PREFIX = "typrr_like";
const MAX_DAILY_ATTEMPTS = 3;

function hashToIndex(key: string, max: number) {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return h % max;
}

function useDailyState() {
  const day = DAY_KEY();
  const attemptsKey = `${STORAGE_PREFIX}:attempts:${day}`;
  const bestKey = `${STORAGE_PREFIX}:best:${day}`;

  const [attemptsLeft, setAttemptsLeft] = useState(() => {
    try {
      const saved = localStorage.getItem(attemptsKey);
      return saved ? parseInt(saved, 10) : MAX_DAILY_ATTEMPTS;
    } catch {
      return MAX_DAILY_ATTEMPTS;
    }
  });
  const [bestWpm, setBestWpm] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem(bestKey);
      return saved ? parseFloat(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(attemptsKey, String(attemptsLeft));
    } catch {}
  }, [attemptsLeft, attemptsKey]);

  const recordAttempt = (wpm: number) => {
    setAttemptsLeft((n) => Math.max(0, n - 1));
    if (bestWpm == null || wpm > bestWpm) {
      setBestWpm(wpm);
      try {
        localStorage.setItem(bestKey, String(wpm));
      } catch {}
    }
  };

  return { day, attemptsLeft, bestWpm, recordAttempt };
}

function useTimer(active: boolean) {
  const [ms, setMs] = useState(0);
  const startedRef = useRef<number | null>(null);

  useEffect(() => {
    let id: number | null = null;
    if (active) {
      if (startedRef.current == null) startedRef.current = performance.now();
      const tick = () => {
        setMs(performance.now() - (startedRef.current as number));
        id = requestAnimationFrame(tick);
      };
      id = requestAnimationFrame(tick);
    }
    return () => {
      if (id != null) cancelAnimationFrame(id);
    };
  }, [active]);

  const reset = () => {
    startedRef.current = null;
    setMs(0);
  };

  return { ms, reset };
}

function caretClass(blink: boolean) {
  return blink ? "opacity-100" : "opacity-20";
}

function useBlink(interval = 600) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setOn((v) => !v), interval);
    return () => clearInterval(id);
  }, [interval]);
  return on;
}

function Stats({ wpm, accuracy, errors, timeMs }: { wpm: number; accuracy: number; errors: number; timeMs: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mt-4">
      <div className="p-3 rounded-2xl bg-gray-100 dark:bg-zinc-800">
        <div className="text-zinc-500">WPM</div>
        <div className="text-xl font-semibold">{Math.round(wpm)}</div>
      </div>
      <div className="p-3 rounded-2xl bg-gray-100 dark:bg-zinc-800">
        <div className="text-zinc-500">Accuracy</div>
        <div className="text-xl font-semibold">{(accuracy*100).toFixed(1)}%</div>
      </div>
      <div className="p-3 rounded-2xl bg-gray-100 dark:bg-zinc-800">
        <div className="text-zinc-500">Errors</div>
        <div className="text-xl font-semibold">{errors}</div>
      </div>
      <div className="p-3 rounded-2xl bg-gray-100 dark:bg-zinc-800">
        <div className="text-zinc-500">Time</div>
        <div className="text-xl font-semibold">{(timeMs/1000).toFixed(2)}s</div>
      </div>
    </div>
  )
}

// ---------------------- THEME TOGGLE ---------------------- //
function ThemeToggle() {
  return (
    <button
      className="px-3 py-1.5 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700"
      onClick={() => document.documentElement.classList.toggle("dark")}
    >
      Toggle Theme
    </button>
  );
}
// --------------------------------------------------------- //

export default function TyprrLikeApp() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const [mode, setMode] = useState<"daily" | "practice">("daily");
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [showDashboard, setShowDashboard] = useState(false);
  const [achievementToasts, setAchievementToasts] = useState<Achievement[]>([]);
  
  const { day, attemptsLeft, bestWpm, recordAttempt } = useDailyState();
  const dailyIndex = useMemo(() => hashToIndex(day, SNIPPETS.length), [day]);
  
  // Filter snippets based on selection
  const availableSnippets = useMemo(() => {
    let filtered = SNIPPETS;
    if (selectedLang) {
      filtered = filtered.filter(s => s.lang === selectedLang);
    }
    if (selectedDifficulty) {
      filtered = filtered.filter(s => s.difficulty === selectedDifficulty);
    }
    return filtered;
  }, [selectedLang, selectedDifficulty]);
  
  // Reset practice index when filters change
  useEffect(() => {
    if (mode === "practice") {
      setPracticeIndex(0);
      resetRun();
    }
  }, [selectedLang, selectedDifficulty, mode]);
  
  const snippet = mode === "daily" 
    ? SNIPPETS[dailyIndex] 
    : availableSnippets[practiceIndex % availableSnippets.length];

  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [errors, setErrors] = useState(0);
  const [typed, setTyped] = useState(0);
  const blink = useBlink();
  const { ms, reset } = useTimer(started && !finished);
  const divRef = useRef<HTMLDivElement | null>(null);
  const savedRef = useRef(false);

  const target = snippet.text;
  const correctCount = useMemo(() => {
    let ok = 0;
    for (let i = 0; i < input.length; i++) if (input[i] === target[i]) ok++;
    return ok;
  }, [input, target]);

  const accuracy = typed === 0 ? 1 : correctCount / typed;
  const minutes = Math.max(ms / 1000 / 60, 1e-6);
  const wpm = (correctCount / 5) / minutes;

  useEffect(() => {
    if (input === target && target.length > 0 && !finished && !savedRef.current) {
      setFinished(true);
      savedRef.current = true;
      
      // Save to localStorage
      saveEntry({
        date: new Date().toISOString().slice(0, 10),
        language: snippet.lang,
        snippetId: snippet.id,
        difficulty: snippet.difficulty,
        wpm,
        accuracy,
        errors,
        timeMs: ms,
        mode,
      });
      
      // Save to backend if authenticated
      if (isAuthenticated) {
        apiClient.saveAttempt({
          snippetId: snippet.id,
          language: snippet.lang,
          difficulty: snippet.difficulty,
          category: snippet.category,
          wpm,
          accuracy,
          errors,
          timeMs: ms,
          mode,
        }).catch(err => console.error('Failed to save to backend:', err));
      }
      
      if (mode === "daily") recordAttempt(wpm);
      
      // Check for newly unlocked achievements
      setTimeout(() => {
        const newAchievements = getNewlyUnlockedAchievements();
        if (newAchievements.length > 0) {
          setAchievementToasts(prev => [...prev, ...newAchievements]);
        }
      }, 500);
    }
  }, [input, target, finished, isAuthenticated, snippet, wpm, accuracy, errors, ms, mode, recordAttempt]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (finished || (mode === "daily" && attemptsLeft <= 0)) return;
    if (!started) setStarted(true);

    if (e.key === "Backspace") {
      setInput((prev) => prev.slice(0, -1));
      setTyped((t) => Math.max(0, t - 1));
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      
      const currentIndex = input.length;
      if (currentIndex >= target.length) return;
      
      const expectedChar = target[currentIndex];
      let newInput = input;
      let addedChars = 1;
      let hasError = false;
      
      if (expectedChar === '\n') {
        newInput += '\n';
      } else {
        newInput += '\n';
        hasError = true;
      }
      
      let nextIndex = currentIndex + 1;
      while (nextIndex < target.length && target[nextIndex] === ' ') {
        newInput += ' ';
        addedChars++;
        nextIndex++;
      }
      
      setInput(newInput);
      setTyped(prev => prev + addedChars);
      if (hasError) {
        setErrors(prev => prev + 1);
      }
      
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const currentIndex = input.length;
      if (currentIndex < target.length) {
        const expectedChar = target[currentIndex];
        setTyped((t) => t + 1);
        
        if (expectedChar === "\t") {
          setInput(prev => prev + "\t");
        } else {
          setErrors((e) => e + 1);
          setInput(prev => prev + "\t");
        }
      }
      return;
    }

    if (e.key.length === 1) {
      const currentIndex = input.length;
      if (currentIndex < target.length) {
        const expectedChar = target[currentIndex];
        setTyped((t) => t + 1);
        
        if (e.key === expectedChar) {
          setInput(prev => prev + e.key);
        } else {
          setErrors((e) => e + 1);
          setInput(prev => prev + e.key);
        }
      }
    }
  }

  function resetRun() {
    setInput("");
    setStarted(false);
    setFinished(false);
    setErrors(0);
    setTyped(0);
    savedRef.current = false;
    reset();
    divRef.current?.focus();
  }

  useEffect(() => {
    function handleGlobalKeyDown(e: KeyboardEvent) {
      if (e.altKey && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        resetRun();
      }
    }
    
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const dailyLocked = mode === "daily" && attemptsLeft <= 0;

  useEffect(() => {
    divRef.current?.focus();
  }, []);

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-[#0b0b0c] dark:text-zinc-100 transition-colors">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <header className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            typrr-like <span className="text-zinc-500">demo</span>
          </h1>
          <div className="flex gap-2 flex-wrap items-center">
            <button
              className={`px-3 py-1.5 rounded-full text-sm border ${mode === "daily" ? "bg-zinc-900 text-white dark:bg-white dark:text-black" : "border-zinc-300 dark:border-zinc-700"}`}
              onClick={() => { setMode("daily"); setShowDashboard(false); }}
            >Daily</button>
            <button
              className={`px-3 py-1.5 rounded-full text-sm border ${mode === "practice" ? "bg-zinc-900 text-white dark:bg-white dark:text-black" : "border-zinc-300 dark:border-zinc-700"}`}
              onClick={() => { setMode("practice"); setShowDashboard(false); }}
            >Practice</button>
            <button
              className={`px-3 py-1.5 rounded-full text-sm border ${showDashboard ? "bg-indigo-600 text-white" : "border-zinc-300 dark:border-zinc-700"}`}
              onClick={() => setShowDashboard(!showDashboard)}
            >📊 Stats</button>
            
            {/* Login/Logout button */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  👤 {user?.username}
                </span>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 rounded-full text-sm border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-3 py-1.5 rounded-full text-sm bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Login
              </button>
            )}
            
            <ThemeToggle />
          </div>
        </header>

        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          {mode === "daily" ? (
            <>Three attempts per day. Today: <span className="font-medium">{day}</span>. Attempts left: <span className="font-medium">{attemptsLeft}</span>{bestWpm != null && <> · Best: <span className="font-medium">{Math.round(bestWpm)} WPM</span></>}.</>
          ) : (
            <>Practice is unlimited. Your score won't affect daily attempts.</>
          )}
        </p>

        {showDashboard ? (
          <Dashboard />
        ) : (
          <>
            {mode === "practice" && (
              <div className="mt-4 flex flex-wrap gap-2">
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-widest">Language:</label>
                  <select 
                    value={selectedLang || ""} 
                    onChange={(e) => setSelectedLang(e.target.value || null)}
                    className="ml-2 px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm"
                  >
                    <option value="">All Languages</option>
                    {getAllLanguages().map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-widest">Difficulty:</label>
                  <select 
                    value={selectedDifficulty || ""} 
                    onChange={(e) => setSelectedDifficulty((e.target.value || null) as Difficulty | null)}
                    className="ml-2 px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm"
                  >
                    <option value="">All Difficulties</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                
                <button
                  onClick={() => {
                    if (availableSnippets.length > 0) {
                      let newIndex;
                      do {
                        newIndex = Math.floor(Math.random() * availableSnippets.length);
                      } while (newIndex === (practiceIndex % availableSnippets.length) && availableSnippets.length > 1);
                      
                      setPracticeIndex(newIndex);
                      resetRun();
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-sm hover:bg-zinc-300 dark:hover:bg-zinc-700"
                >
                  🎲 Random Snippet
                </button>
              </div>
            )}

            <section className="mt-6">
              <div className="flex items-center gap-2 text-xs text-zinc-500 flex-wrap">
                <span className="uppercase tracking-widest">Snippet</span>
                <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">{snippet.lang}</span>
                <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">{snippet.id}</span>
                <span className={`px-2 py-0.5 rounded-full border ${
                  snippet.difficulty === 'easy' ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300' :
                  snippet.difficulty === 'medium' ? 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300' :
                  'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                }`}>
                  {snippet.difficulty}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300">
                  {snippet.category}
                </span>
              </div>
              {snippet.description && (
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 italic">
                  {snippet.description}
                </p>
              )}

              <div
                ref={divRef}
                tabIndex={0}
                onKeyDown={handleKeyDown}
                className={`mt-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-4 font-mono text-sm leading-6 overflow-x-auto min-h-[150px] outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-900 cursor-text`}
              >
                <Highlighted target={target} input={input} showCaret={!finished} blink={blink} />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button onClick={resetRun} className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40" disabled={dailyLocked}>
                  Reset (Alt+R)
                </button>
                {mode === "daily" && (
                  <span className="text-xs text-zinc-500">Attempts left today: {attemptsLeft}</span>
                )}
              </div>

              <Stats wpm={wpm} accuracy={accuracy} errors={errors} timeMs={ms} />

              {finished && (
                <button
                  className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
                  onClick={() => {
                    const text = `I just typed today's snippet at ${Math.round(wpm)} WPM with ${(accuracy*100).toFixed(1)}% accuracy! #typrrlike`;
                    navigator.clipboard.writeText(text);
                    alert("✅ Result copied to clipboard!");
                  }}
                >
                  Share Result
                </button>
              )}

              <div className="mt-6 text-xs text-zinc-500">
                <p>Shortcuts: <kbd className="px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-800">Alt</kbd> + <kbd className="px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-800">R</kbd> to reset.</p>
              </div>
            </section>
          </>
        )}
      </div>
      
      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
      
      {/* Achievement Toasts */}
      <ToastManager 
        achievements={achievementToasts}
        onDismiss={(id) => setAchievementToasts(prev => prev.filter(a => a.id !== id))}
      />
    </div>
  );
}

function Highlighted({ target, input, showCaret, blink }: { target: string; input: string; showCaret: boolean; blink: boolean }) {
  const caretIndex = input.length;
  const chars = [...target];
  return (
    <pre className="whitespace-pre break-words overflow-x-auto">{
      chars.map((ch, idx) => {
        const typed = idx < input.length ? input[idx] : null;
        const correct = typed != null && typed === ch;
        const wrong = typed != null && typed !== ch;
        const atCaret = showCaret && idx === caretIndex;
        return (
          <span key={idx} className={
            correct ? "text-emerald-600" : wrong ? "text-rose-600 bg-rose-50 dark:bg-rose-950/30" : "text-zinc-900 dark:text-zinc-100"
          }>
            {atCaret && (
              <span className={`inline-block w-0.5 align-middle h-5 -ml-0.5 mr-0.5 bg-zinc-900 dark:bg-zinc-100 transition-opacity ${caretClass(blink)}`} />
            )}
            {ch}
          </span>
        );
      })
    }
    {showCaret && caretIndex === chars.length && (
      <span className={`inline-block w-0.5 align-middle h-5 ml-0.5 bg-zinc-900 dark:bg-zinc-100 transition-opacity ${caretClass(blink)}`} />
    )}
    </pre>
  );
}
