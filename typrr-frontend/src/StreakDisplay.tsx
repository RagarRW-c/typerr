import { getStreakData, getStreakMultiplier, getNextReward } from './streakSystem';
import { Tooltip } from './Tooltip';

export function StreakDisplay() {
  const streakData = getStreakData();
  const multiplier = getStreakMultiplier(streakData.currentStreak);
  const nextReward = getNextReward(streakData.currentStreak);

  return (
    <Tooltip content={`${streakData.currentStreak} day streak! ${multiplier > 1 ? `${multiplier}x XP bonus` : ''}`}>
      <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-3 hover-lift cursor-pointer">
        <div className="text-2xl animate-pulse">
          {streakData.currentStreak >= 30 ? '🔥🔥🔥' :
           streakData.currentStreak >= 7 ? '🔥🔥' :
           streakData.currentStreak >= 3 ? '🔥' : '⭕'}
        </div>
        <div>
          <div className="text-xs text-zinc-500">Streak</div>
          <div className="font-bold text-lg">{streakData.currentStreak} days</div>
          {multiplier > 1 && (
            <div className="text-xs text-orange-500 font-semibold">
              {multiplier}x XP
            </div>
          )}
          {nextReward && (
            <div className="text-xs text-zinc-400 mt-0.5">
              {nextReward.days - streakData.currentStreak} days to {nextReward.icon}
            </div>
          )}
        </div>
      </div>
    </Tooltip>
  );
}
