import { useEffect, useState } from 'react';
import type { StreakReward } from './streakSystem';

interface StreakNotificationProps {
  streak: number;
  multiplier: number;
  onDismiss: () => void;
}

export function StreakNotification({ streak, multiplier, onDismiss }: StreakNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 100);
    
    // Auto dismiss after 4 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 300);
    }, 4000);
    
    return () => clearTimeout(timer);
  }, [onDismiss]);
  
  return (
    <div
      className={`fixed bottom-8 left-8 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="glass-card p-4 rounded-2xl shadow-2xl max-w-xs border-2 border-orange-500/50 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/50 dark:to-yellow-950/50">
        <div className="flex items-center gap-3">
          <div className="text-4xl">🔥</div>
          <div>
            <div className="font-bold text-lg gradient-text">
              {streak} Day Streak!
            </div>
            {multiplier > 1 && (
              <div className="text-sm text-orange-600 dark:text-orange-400">
                {multiplier}x XP Multiplier Active!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface StreakRewardNotificationProps {
  reward: StreakReward;
  onDismiss: () => void;
}

export function StreakRewardNotification({ reward, onDismiss }: StreakRewardNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 100);
    
    // Auto dismiss after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 300);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onDismiss]);
  
  return (
    <div
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-500 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
      }`}
    >
      <div className="glass-card p-8 rounded-3xl shadow-2xl max-w-md border-4 border-yellow-500/50 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-950/50 dark:via-orange-950/50 dark:to-red-950/50">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">{reward.icon}</div>
          <div className="text-2xl font-bold gradient-text mb-2">
            STREAK REWARD!
          </div>
          <div className="text-xl font-semibold text-orange-700 dark:text-orange-300 mb-2">
            {reward.title}
          </div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            {reward.description}
          </div>
          <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
            +{reward.xpBonus} Bonus XP!
          </div>
        </div>
      </div>
    </div>
  );
}