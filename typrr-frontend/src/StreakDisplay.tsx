import { getStreakData, getStreakMultiplier, STREAK_REWARDS } from './streakSystem';
import { Tooltip } from './Tooltip';

export function StreakDisplay() {
  const streakData = getStreakData();
  const { currentStreak } = streakData;
  const multiplier = getStreakMultiplier(currentStreak);
  
  // Find next reward
  const nextReward = STREAK_REWARDS.find(r => r.days > currentStreak);
  const daysToNextReward = nextReward ? nextReward.days - currentStreak : 0;
  
  // Get streak emoji based on streak count
  const getStreakEmoji = (streak: number): string => {
    if (streak === 0) return '⭕';
    if (streak >= 30) return '🔥🔥🔥';
    if (streak >= 7) return '🔥🔥';
    return '🔥';
  };
  
  const tooltipContent = (
    <div className="text-sm">
      <div className="font-semibold mb-1">Daily Streak</div>
      <div>Current: {currentStreak} {currentStreak === 1 ? 'day' : 'days'}</div>
      <div>Longest: {streakData.longestStreak} {streakData.longestStreak === 1 ? 'day' : 'days'}</div>
      {multiplier > 1 && (
        <div className="mt-1 text-yellow-400">
          {multiplier}x XP Bonus Active!
        </div>
      )}
      {nextReward && (
        <div className="mt-1 text-zinc-400">
          {daysToNextReward} {daysToNextReward === 1 ? 'day' : 'days'} to {nextReward.icon}
        </div>
      )}
    </div>
  );
  
  return (
    <Tooltip content={tooltipContent}>
      <div className="glass-card px-3 py-2 rounded-xl flex items-center gap-2 cursor-help hover-lift">
        <div className="text-xl">{getStreakEmoji(currentStreak)}</div>
        <div>
          <div className="text-xs text-zinc-500">Streak</div>
          <div className="font-bold text-sm">{currentStreak} {currentStreak === 1 ? 'day' : 'days'}</div>
          {multiplier > 1 && (
            <div className="text-xs text-yellow-500">{multiplier}x XP</div>
          )}
        </div>
      </div>
    </Tooltip>
  );
}
