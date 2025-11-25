import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

interface MilestoneNotificationProps {
  wpm: number;
  onDismiss: () => void;
}

export default function MilestoneNotification({ wpm, onDismiss }: MilestoneNotificationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Mniejsze confetti burst dla milestones
    const duration = 1000; // Skrócone z 2000 do 1000ms
    const animationEnd = Date.now() + duration;

    const colors = wpm >= 100 ? ['#9333ea', '#c026d3', '#ec4899'] : 
                   wpm >= 75 ? ['#f59e0b', '#f97316', '#ef4444'] :
                   ['#3b82f6', '#8b5cf6', '#06b6d4'];

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 30, // Zmniejszone z 100 na 30
        spread: 100, // Zmniejszone z 160 na 100
        origin: { y: 0.6 },
        colors,
        startVelocity: 20, // Mniejsza prędkość
        gravity: 1.2, // Szybsze spadanie
        scalar: 0.7, // Mniejsze cząsteczki
        ticks: 80, // Krótsza żywotność
      });
    }, 300); // Rzadsze wystrzeliwanie - z 100ms na 300ms

    // Auto dismiss
    const timeout = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 500);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [wpm, onDismiss]);

  const getMilestoneData = () => {
    if (wpm >= 100) return {
      emoji: '🚀',
      title: 'LEGENDARY!',
      message: '100+ WPM! You\'re a typing master!',
      gradient: 'from-purple-600 to-pink-600',
      glow: 'shadow-purple-500/50',
    };
    if (wpm >= 75) return {
      emoji: '🔥',
      title: 'ON FIRE!',
      message: '75+ WPM! Incredible speed!',
      gradient: 'from-orange-600 to-red-600',
      glow: 'shadow-orange-500/50',
    };
    return {
      emoji: '⚡',
      title: 'SPEED BOOST!',
      message: '50+ WPM! Great progress!',
      gradient: 'from-blue-600 to-purple-600',
      glow: 'shadow-blue-500/50',
    };
  };

  const milestone = getMilestoneData();

  if (!visible) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-scale-in">
      <div className={`glass-card p-6 rounded-2xl text-center min-w-[300px] shadow-2xl ${milestone.glow}`}>
        <div className="text-6xl mb-2 animate-bounce">
          {milestone.emoji}
        </div>
        <h3 className={`text-2xl font-bold mb-1 bg-gradient-to-r ${milestone.gradient} bg-clip-text text-transparent`}>
          {milestone.title}
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {milestone.message}
        </p>
        <div className="mt-3 text-3xl font-bold gradient-text">
          {Math.round(wpm)} WPM
        </div>
      </div>
    </div>
  );
}
