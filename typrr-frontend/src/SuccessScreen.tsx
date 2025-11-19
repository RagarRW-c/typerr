import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

interface SuccessScreenProps {
  wpm: number;
  accuracy: number;
  errors: number;
  timeMs: number;
  onClose: () => void;
  onShare: () => void;
}

export default function SuccessScreen({ wpm, accuracy, errors, timeMs, onClose, onShare }: SuccessScreenProps) {
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    // Minimal confetti burst - tylko na początku, krótko
    const duration = 1500; // Skrócone z 3000 do 1500ms
    const animationEnd = Date.now() + duration;
    
    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };
    
    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }
      
      // Zmniejszona liczba cząsteczek z 50 na 15
      const particleCount = 15 * (timeLeft / duration);
      
      confetti({
        particleCount,
        angle: randomInRange(55, 125),
        spread: randomInRange(40, 60), // Mniejszy spread
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        startVelocity: 20, // Mniejsza prędkość
        gravity: 1.5, // Szybsze spadanie
        scalar: 0.6, // Mniejsze cząsteczki
        ticks: 100, // Krótsza żywotność
      });
      confetti({
        particleCount,
        angle: randomInRange(55, 125),
        spread: randomInRange(40, 60),
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        startVelocity: 20,
        gravity: 1.5,
        scalar: 0.6,
        ticks: 100,
      });
    }, 400); // Rzadsze wystrzeliwanie - z 250ms na 400ms

    // Show stats after delay
    setTimeout(() => setShowStats(true), 500);

    return () => clearInterval(interval);
  }, []);

  const getPerformanceMessage = () => {
    if (wpm >= 100) return { emoji: '🚀', text: 'INCREDIBLE!', color: 'text-purple-600 dark:text-purple-400' };
    if (wpm >= 80) return { emoji: '🔥', text: 'AMAZING!', color: 'text-orange-600 dark:text-orange-400' };
    if (wpm >= 60) return { emoji: '⚡', text: 'GREAT JOB!', color: 'text-yellow-600 dark:text-yellow-400' };
    if (wpm >= 40) return { emoji: '👍', text: 'GOOD WORK!', color: 'text-green-600 dark:text-green-400' };
    return { emoji: '💪', text: 'KEEP GOING!', color: 'text-blue-600 dark:text-blue-400' };
  };

  const performance = getPerformanceMessage();

  // Handle click on backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="glass-card max-w-lg w-full p-8 rounded-3xl text-center animate-scale-in relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Success Icon */}
        <div className="text-8xl mb-4 animate-bounce">
          {performance.emoji}
        </div>

        {/* Performance Message */}
        <h2 className={`text-4xl font-bold mb-2 ${performance.color}`}>
          {performance.text}
        </h2>

        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          You've completed the snippet!
        </p>

        {/* Stats Grid */}
        {showStats && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="glass-card p-6 rounded-2xl animate-fade-in stagger-1">
              <div className="text-4xl font-bold gradient-text mb-1">
                {Math.round(wpm)}
              </div>
              <div className="text-sm text-zinc-500">WPM</div>
            </div>
            <div className="glass-card p-6 rounded-2xl animate-fade-in stagger-2">
              <div className="text-4xl font-bold gradient-text mb-1">
                {(accuracy * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-zinc-500">Accuracy</div>
            </div>
            <div className="glass-card p-6 rounded-2xl animate-fade-in stagger-3">
              <div className="text-4xl font-bold gradient-text mb-1">
                {errors}
              </div>
              <div className="text-sm text-zinc-500">Errors</div>
            </div>
            <div className="glass-card p-6 rounded-2xl animate-fade-in stagger-4">
              <div className="text-4xl font-bold gradient-text mb-1">
                {(timeMs / 1000).toFixed(1)}s
              </div>
              <div className="text-sm text-zinc-500">Time</div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={onShare}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover-lift"
          >
            📤 Share Result
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl glass-button font-semibold hover-lift"
          >
            ✨ Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
