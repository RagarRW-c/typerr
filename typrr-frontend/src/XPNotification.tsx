import { useEffect } from 'react';

interface XPNotificationProps {
  xpEarned: number;
  onDismiss: () => void;
}

export function XPNotification({ xpEarned, onDismiss }: XPNotificationProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed bottom-20 right-4 z-50 animate-slide-in-right">
      <div className="glass-card px-6 py-4 rounded-xl border-l-4 border-yellow-500">
        <div className="flex items-center gap-3">
          <span className="text-3xl">⭐</span>
          <div>
            <div className="font-bold text-lg">+{xpEarned} XP</div>
            <div className="text-xs text-zinc-500">Experience gained!</div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface LevelUpNotificationProps {
  newLevel: { level: number; name: string; icon: string };
  onDismiss: () => void;
}

export function LevelUpNotification({ newLevel, onDismiss }: LevelUpNotificationProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-scale-in">
      <div className="glass-card px-8 py-6 rounded-2xl text-center min-w-[300px] border-4 border-yellow-500 shadow-2xl glow">
        <div className="text-6xl mb-3 animate-bounce">{newLevel.icon}</div>
        <h3 className="text-2xl font-bold mb-1 gradient-text">LEVEL UP!</h3>
        <p className="text-3xl font-bold mb-1">Level {newLevel.level}</p>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">{newLevel.name}</p>
      </div>
    </div>
  );
}
