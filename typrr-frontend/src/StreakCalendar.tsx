import { getStreakData, getCalendarData } from './streakSystem';
import { Tooltip } from './Tooltip';

export function StreakCalendar({ days = 60 }: { days?: number }) {
  const streakData = getStreakData();
  const calendarData = getCalendarData(days);
  
  // Group by weeks (7 days each)
  const weeks: Array<Array<{ date: string; practiced: boolean }>> = [];
  for (let i = 0; i < calendarData.length; i += 7) {
    weeks.push(calendarData.slice(i, i + 7));
  }
  
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  return (
    <div className="glass-card p-6 rounded-2xl">
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Practice Calendar</h3>
        <div className="text-sm text-zinc-600 dark:text-zinc-400">
          Last {days} days
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800">
          <div className="text-2xl font-bold gradient-text">
            {streakData.currentStreak}
          </div>
          <div className="text-xs text-zinc-500">Current Streak</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800">
          <div className="text-2xl font-bold gradient-text">
            {streakData.longestStreak}
          </div>
          <div className="text-xs text-zinc-500">Longest Streak</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800">
          <div className="text-2xl font-bold gradient-text">
            {streakData.totalDays}
          </div>
          <div className="text-xs text-zinc-500">Total Days</div>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="space-y-2">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="flex gap-2">
            {week.map((day, dayIdx) => (
              <Tooltip
                key={dayIdx}
                content={
                  <div className="text-sm">
                    <div>{formatDate(day.date)}</div>
                    <div className={day.practiced ? 'text-green-400' : 'text-zinc-400'}>
                      {day.practiced ? '✓ Practiced' : 'No practice'}
                    </div>
                  </div>
                }
              >
                <div
                  className={`w-8 h-8 rounded-md transition-all cursor-help ${
                    day.practiced
                      ? 'bg-green-500 dark:bg-green-600 hover:scale-110'
                      : 'bg-zinc-200 dark:bg-zinc-700 hover:scale-105'
                  }`}
                />
              </Tooltip>
            ))}
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-green-500 dark:bg-green-600" />
          <span>Practiced</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-zinc-200 dark:bg-zinc-700" />
          <span>Missed</span>
        </div>
      </div>
    </div>
  );
}