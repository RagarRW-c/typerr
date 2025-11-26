import React, { useEffect, useMemo, useRef, useState } from "react";
import { SNIPPETS, getAllLanguages, type Difficulty } from "./snippets";
import { saveEntry } from "./stats";
import { getNewlyUnlockedAchievements, type Achievement } from "./achievements";
import { ToastManager } from "./Toast";
import { ToastContainer, showToast } from "./Toast";
import Dashboard from "./Dashboard";
import AdminDashboard from "./AdminDashboard";
import SuccessScreen from "./SuccessScreen";
import ParticleBackground from "./ParticleBackground";
import TypingParticles, { createTypingParticle } from "./TypingParticles";
import MilestoneNotification from "./MilestoneNotification";
import { useMilestones } from "./useMilestones";
import { Tooltip } from "./Tooltip";
import { KeyboardShortcutsButton } from "./KeyboardShortcuts";
import { Footer } from "./Footer";
import { useAuth } from './AuthContext';
import { apiClient } from './api';
import AuthModal from './AuthModal';
import ProfilePage from './ProfilePage';
import { soundManager } from './soundEffects';
import { calculateXP, addXP, getUserXP, getCurrentLevel } from './xpSystem';
import { XPNotification, LevelUpNotification } from './XPNotification';

// --- Utilities ---

const DAY_KEY = () => new Date().toISOString().slice(0, 10);
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
      <div className="p-3 rounded-2xl glass-card hover-lift">
        <div className="text-zinc-500">WPM</div>
        <div className="text-xl font-semibold">{Math.round(wpm)}</div>
      </div>
      <div className="p-3 rounded-2xl glass-card hover-lift">
        <div className="text-zinc-500">Accuracy</div>
        <div className="text-xl font-semibold">{(accuracy*100).toFixed(1)}%</div>
      </div>
      <div className="p-3 rounded-2xl glass-card hover-lift">
        <div className="text-zinc-500">Errors</div>
        <div className="text-xl font-semibold">{errors}</div>
      </div>
      <div className="p-3 rounded-2xl glass-card hover-lift">
        <div className="text-zinc-500">Time</div>
        <div className="text-xl font-semibold">{(timeMs/1000).toFixed(2)}s</div>
      </div>
    </div>
  )
}

function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    // Dark mode is default
    return saved === 'dark' || !saved;
  });

  const toggle = () => {
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newTheme);
    setIsDark(!isDark);
  };

  return (
    <Tooltip content="Toggle dark/light mode">
      <button
        className="px-3 py-1.5 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 hover-lift"
        onClick={toggle}
      >
        {isDark ? '☀️' : '🌙'}
      </button>
    </Tooltip>
  );
}

function SoundToggle() {
  const [enabled, setEnabled] = useState(soundManager.isEnabled());
  
  const toggle = () => {
    const newState = soundManager.toggle();
    setEnabled(newState);
    showToast(newState ? 'Sound enabled' : 'Sound disabled', 'info', 2000);
  };
  
  return (
    <Tooltip content={enabled ? "Disable sound" : "Enable sound"}>
      <button
        className={`px-3 py-1.5 text-sm rounded-lg border hover-lift ${
          enabled ? 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700' : 'border-zinc-300 dark:border-zinc-700'
        }`}
        onClick={toggle}
      >
        {enabled ? '🔊' : '🔇'}
      </button>
    </Tooltip>
  );
}

export default function TyprrLikeApp() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const { user: _user, isAuthenticated, logout } = useAuth();
  const [mode, setMode] = useState<"daily" | "practice">("daily");
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [achievementToasts, setAchievementToasts] = useState<Achievement[]>([]);
  
  // XP System State
  const [xpNotification, setXpNotification] = useState<{ xp: number } | null>(null);
  const [levelUpNotification, setLevelUpNotification] = useState<{ level: any } | null>(null);
  const [userXP, setUserXP] = useState(getUserXP());
  
  const { day, attemptsLeft, bestWpm, recordAttempt } = useDailyState();
  const dailyIndex = useMemo(() => hashToIndex(day, SNIPPETS.length), [day]);
  
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
  
  useEffect(() => {
    if (mode === "practice") {
      setPracticeIndex(0);
      resetRun();
    }
  }, [selectedLang, selectedDifficulty]);

  useEffect(() => {
    resetRun();
  }, [mode]);
  
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

  const { currentMilestone, dismissMilestone } = useMilestones(wpm, started && !finished);

  useEffect(() => {
    if (input === target && target.length > 0 && !finished && !savedRef.current) {
      setFinished(true);
      savedRef.current = true;
      
      soundManager.playSuccess();
      setShowSuccessScreen(true);
      
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
        }).then(() => {
          showToast('Results saved successfully!', 'success');
        }).catch(err => {
          console.error('Failed to save to backend:', err);
          showToast('Failed to save results', 'error');
        });
      }
      
      // Calculate and add XP
      const earnedXP = calculateXP(wpm, accuracy, errors, snippet.difficulty);
      const xpResult = addXP(earnedXP);
      
      // Show XP notification
      setXpNotification({ xp: earnedXP });
      setTimeout(() => setXpNotification(null), 3000);
      
      // Check for level up
      if (xpResult.leveledUp && xpResult.newLevel) {
        setTimeout(() => {
          setLevelUpNotification({ level: xpResult.newLevel });
          showToast(`🎉 Level Up! You're now ${xpResult.newLevel!.name}!`, 'success', 5000);
          setTimeout(() => setLevelUpNotification(null), 5000);
        }, 3500);
      }
      
      // Update user XP display
      setUserXP(getUserXP());
      
      if (mode === "daily") recordAttempt(wpm);
      
      setTimeout(() => {
        const newAchievements = getNewlyUnlockedAchievements();
        if (newAchievements.length > 0) {
          setAchievementToasts(prev => [...prev, ...newAchievements]);
          showToast(`🏆 ${newAchievements.length} new achievement${newAchievements.length > 1 ? 's' : ''} unlocked!`, 'success');
        }
      }, 500);
    }
  }, [input, target, finished, isAuthenticated, snippet, wpm, accuracy, errors, ms, mode, recordAttempt]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (mode === "daily" && attemptsLeft <= 0) {
      e.preventDefault();
      showToast('No attempts left today!', 'warning');
      return;
    }
    
    if (finished) return;
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
      
      soundManager.playKeyPress(!hasError);
      if (divRef.current) {
        const rect = divRef.current.getBoundingClientRect();
        createTypingParticle(rect.left + 20, rect.top + 20, !hasError);
      }
      
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const currentIndex = input.length;
      if (currentIndex < target.length) {
        const expectedChar = target[currentIndex];
        setTyped((t) => t + 1);
        
        const isCorrect = expectedChar === "\t";
        if (isCorrect) {
          setInput(prev => prev + "\t");
        } else {
          setErrors((e) => e + 1);
          setInput(prev => prev + "\t");
        }
        
        soundManager.playKeyPress(isCorrect);
        if (divRef.current) {
          const rect = divRef.current.getBoundingClientRect();
          createTypingParticle(rect.left + 20, rect.top + 20, isCorrect);
        }
      }
      return;
    }

    if (e.key.length === 1) {
      const currentIndex = input.length;
      if (currentIndex < target.length) {
        const expectedChar = target[currentIndex];
        setTyped((t) => t + 1);
        
        const isCorrect = e.key === expectedChar;
        if (isCorrect) {
          setInput(prev => prev + e.key);
        } else {
          setErrors((e) => e + 1);
          setInput(prev => prev + e.key);
        }
        
        soundManager.playKeyPress(isCorrect);
        if (divRef.current) {
          const rect = divRef.current.getBoundingClientRect();
          createTypingParticle(rect.left + 20, rect.top + 20, isCorrect);
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
    setShowSuccessScreen(false);
    reset();
    setTimeout(() => divRef.current?.focus(), 0);
  }

  useEffect(() => {
    function handleGlobalKeyDown(e: KeyboardEvent) {
      if (e.altKey && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        resetRun();
        showToast('Snippet reset', 'info', 1500);
      }
    }
    
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const dailyLocked = mode === "daily" && attemptsLeft <= 0;

  useEffect(() => {
    divRef.current?.focus();
  }, [snippet]);

  const handleShare = () => {
    const text = `I just typed a snippet at ${Math.round(wpm)} WPM with ${(accuracy*100).toFixed(1)}% accuracy! #typrrlike`;
    navigator.clipboard.writeText(text);
    showToast('Result copied to clipboard!', 'success');
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-[#0b0b0c] dark:text-zinc-100 transition-colors relative flex flex-col">
      <ParticleBackground />
      <TypingParticles />

      <div className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-8 relative z-20">
          <header className="flex items-center justify-between flex-wrap gap-2 animate-fade-in">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              typrr-like <span className="text-zinc-500">demo</span>
            </h1>
            <div className="flex gap-2 flex-wrap items-center">
              {/* XP Display - tylko dla zalogowanych */}
              {isAuthenticated && (
                <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-3 animate-fade-in">
                  <div className="text-center">
                    <div className="text-2xl">{getCurrentLevel(userXP.totalXP).icon}</div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500">Level {userXP.level}</div>
                    <div className="font-bold text-sm">{getCurrentLevel(userXP.totalXP).name}</div>
                    <div className="w-24 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full mt-1 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300"
                        style={{ 
                          width: `${userXP.xpToNextLevel > 0 
                            ? ((userXP.currentLevelXP / (userXP.currentLevelXP + userXP.xpToNextLevel)) * 100) 
                            : 100}%` 
                        }}
                      />
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5">
                      {userXP.xpToNextLevel > 0 ? `${userXP.xpToNextLevel} XP to next` : 'Max Level!'}
                    </div>
                  </div>
                </div>
              )}

              <Tooltip content="Daily challenges">
                <button
                  className={`px-3 py-1.5 rounded-full text-sm border hover-lift ${mode === "daily" ? "bg-zinc-900 text-white dark:bg-white dark:text-black" : "border-zinc-300 dark:border-zinc-700"}`}
                  onClick={() => { setMode("daily"); setShowDashboard(false); setShowAdmin(false); setShowProfile(false); }}
                >Daily</button>
              </Tooltip>
              <Tooltip content="Unlimited practice">
                <button
                  className={`px-3 py-1.5 rounded-full text-sm border hover-lift ${mode === "practice" ? "bg-zinc-900 text-white dark:bg-white dark:text-black" : "border-zinc-300 dark:border-zinc-700"}`}
                  onClick={() => { setMode("practice"); setShowDashboard(false); setShowAdmin(false); setShowProfile(false); }}
                >Practice</button>
              </Tooltip>
              <Tooltip content="View your statistics">
                <button
                  className={`px-3 py-1.5 rounded-full text-sm border hover-lift ${showDashboard ? "bg-indigo-600 text-white" : "border-zinc-300 dark:border-zinc-700"}`}
                  onClick={() => { setShowDashboard(!showDashboard); setShowAdmin(false); setShowProfile(false); }}
                >📊</button>
              </Tooltip>
              
              {isAuthenticated && (
                <Tooltip content="View your profile">
                  <button
                    className={`px-3 py-1.5 rounded-full text-sm border hover-lift ${showProfile ? "bg-purple-600 text-white" : "border-zinc-300 dark:border-zinc-700"}`}
                    onClick={() => { setShowProfile(!showProfile); setShowDashboard(false); setShowAdmin(false); }}
                  >👤 Profile</button>
                </Tooltip>
              )}
              
              <Tooltip content="Admin panel">
                <button
                  className={`px-3 py-1.5 rounded-full text-sm border hover-lift ${showAdmin ? "bg-orange-600 text-white" : "border-zinc-300 dark:border-zinc-700"}`}
                  onClick={() => { setShowAdmin(!showAdmin); setShowDashboard(false); setShowProfile(false); }}
                >🔧</button>
              </Tooltip>
              
              {isAuthenticated ? (
                <Tooltip content="Logout">
                  <button
                    onClick={() => {
                      logout();
                      setShowProfile(false);
                      showToast('Logged out successfully', 'success');
                    }}
                    className="px-3 py-1.5 rounded-full text-sm border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover-lift"
                  >
                    Logout
                  </button>
                </Tooltip>
              ) : (
                <Tooltip content="Login or create account">
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="px-3 py-1.5 rounded-full text-sm bg-indigo-600 text-white hover:bg-indigo-700 hover-lift"
                  >
                    Login
                  </button>
                </Tooltip>
              )}
              
              <SoundToggle />
              <ThemeToggle />
              <KeyboardShortcutsButton />
            </div>
          </header>

          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 animate-fade-in">
            {mode === "daily" ? (
              <>Three attempts per day. Today: <span className="font-medium">{day}</span>. Attempts left: <span className="font-medium">{attemptsLeft}</span>{bestWpm != null && <> · Best: <span className="font-medium">{Math.round(bestWpm)} WPM</span></>}.</>
            ) : (
              <>Practice is unlimited. Your score won't affect daily attempts.</>
            )}
          </p>

          {showAdmin ? (
            <AdminDashboard />
          ) : showDashboard ? (
            <Dashboard />
          ) : showProfile ? (
            <ProfilePage />
          ) : (
            <>
              {mode === "practice" && (
                <div className="mt-4 flex flex-wrap gap-2 animate-slide-in-left">
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
                  
                  <Tooltip content="Get a random snippet">
                    <button
                      onClick={() => {
                        if (availableSnippets.length > 0) {
                          let newIndex;
                          do {
                            newIndex = Math.floor(Math.random() * availableSnippets.length);
                          } while (newIndex === (practiceIndex % availableSnippets.length) && availableSnippets.length > 1);
                          
                          setPracticeIndex(newIndex);
                          resetRun();
                          showToast('Random snippet loaded', 'info', 1500);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-sm hover:bg-zinc-300 dark:hover:bg-zinc-700 hover-lift"
                    >
                      🎲 Random
                    </button>
                  </Tooltip>
                </div>
              )}

              <section className="mt-6 animate-scale-in">
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

                {dailyLocked && (
                  <div className="mt-4 p-4 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
                    <p className="text-orange-900 dark:text-orange-200 font-medium">
                      ⏰ You've used all your daily attempts! Come back tomorrow or try Practice mode.
                    </p>
                  </div>
                )}

                {started && !finished && !dailyLocked && (
                  <div className="mt-3 mb-3 animate-fade-in">
                    <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
                      <span>Progress</span>
                      <span>{Math.round((input.length / target.length) * 100)}%</span>
                    </div>
                    <div className="relative w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                        style={{ width: `${Math.min((input.length / target.length) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {started && !finished && typed > 0 && !dailyLocked && (
                  <div className="mb-3 flex items-center justify-center gap-4 animate-fade-in">
                    <div className="glass-card px-6 py-3 rounded-xl glow-pulse">
                      <div className="text-xs text-zinc-500">Live WPM</div>
                      <div className="text-3xl font-bold gradient-text">
                        {Math.round(wpm)}
                      </div>
                    </div>
                    <div className="glass-card px-6 py-3 rounded-xl">
                      <div className="text-xs text-zinc-500">Accuracy</div>
                      <div className="text-2xl font-bold gradient-text">
                        {(accuracy * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                )}

                <div
                  ref={divRef}
                  tabIndex={0}
                  onKeyDown={handleKeyDown}
                  className={`mt-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-4 font-mono text-sm leading-6 overflow-x-auto min-h-[150px] outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-900 cursor-text ${dailyLocked ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <Highlighted target={target} input={input} showCaret={!finished && !dailyLocked} blink={blink} />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Tooltip content="Reset this snippet (Alt+R)">
                    <button onClick={resetRun} className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 hover-lift" disabled={dailyLocked}>
                      Reset
                    </button>
                  </Tooltip>
                  {mode === "daily" && (
                    <span className="text-xs text-zinc-500">Attempts left today: {attemptsLeft}</span>
                  )}
                </div>

                <Stats wpm={wpm} accuracy={accuracy} errors={errors} timeMs={ms} />
              </section>
            </>
          )}
        </div>
      </div>

      <Footer />
      
      {currentMilestone && (
        <MilestoneNotification 
          wpm={currentMilestone} 
          onDismiss={dismissMilestone}
        />
      )}
      
      {showSuccessScreen && (
        <SuccessScreen
          wpm={wpm}
          accuracy={accuracy}
          errors={errors}
          timeMs={ms}
          onClose={resetRun}
          onShare={handleShare}
        />
      )}
      
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
      
      <ToastManager 
        achievements={achievementToasts}
        onDismiss={(id) => setAchievementToasts(prev => prev.filter(a => a.id !== id))}
      />
      
      <ToastContainer />
      
      {/* XP Notifications */}
      {xpNotification && (
        <XPNotification 
          xpEarned={xpNotification.xp}
          onDismiss={() => setXpNotification(null)}
        />
      )}
      
      {/* Level Up Notification */}
      {levelUpNotification && (
        <LevelUpNotification
          newLevel={levelUpNotification.level}
          onDismiss={() => setLevelUpNotification(null)}
        />
      )}
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