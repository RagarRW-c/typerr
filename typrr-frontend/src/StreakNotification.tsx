import { useEffect } from 'react';

interface StreakNotificationProps {
  streak: number;
  multiplier: number;
  onDismiss: () => void;
}

export function StreakNotification({ streak, multiplier, onDismiss }: StreakNotificationProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed bottom-20 left-4 z-50 animate-slide-in-left">
      <div className="glass-card px-6 py-4 rounded-xl border-l-4 border-orange-500 min-w-[300px]">
        <div className="flex items-center gap-3">
          <span className="text-4xl animate-bounce">🔥</span>
          <div>
            <div className="font-bold text-lg">{streak} Day Streak!</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              {multiplier > 1 ? `${multiplier}x XP Multiplier Active!` : 'Keep it up!'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StreakRewardNotificationProps {
  reward: {
    days: number;
    title: string;
    description: string;
    icon: string;
    xpBonus: number;
  };
  onDismiss: () => void;
}

export function StreakRewardNotification({ reward, onDismiss }: StreakRewardNotificationProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-scale-in">
      <div className="glass-card px-8 py-6 rounded-2xl text-center min-w-[350px] border-4 border-orange-500 shadow-2xl">
        <div className="text-6xl mb-3 animate-bounce">{reward.icon}</div>
        <h3 className="text-2xl font-bold mb-1 gradient-text">Streak Reward!</h3>
        <p className="text-xl font-bold mb-1">{reward.title}</p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">{reward.description}</p>
        <div className="mt-3 px-4 py-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 inline-block">
          <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
            +{reward.xpBonus} Bonus XP!
          </span>
        </div>
      </div>
    </div>
  );
}
