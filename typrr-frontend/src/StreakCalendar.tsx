import { getCalendarData, getStreakData } from './streakSystem';

export function StreakCalendar() {
  const calendarData = getCalendarData(60);
  const streakData = getStreakData();

  // Group by weeks
  const weeks: typeof calendarData[] = [];
  for (let i = 0; i < calendarData.length; i += 7) {
    weeks.push(calendarData.slice(i, i + 7));
  }

  return (
    <div className="glass-card p-6 rounded-2xl">
      <h3 className="text-xl font-bold mb-4">🔥 Practice Calendar</h3>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 rounded-xl glass-card">
          <div className="text-2xl font-bold">{streakData.currentStreak}</div>
          <div className="text-xs text-zinc-500">Current</div>
        </div>
        <div className="text-center p-3 rounded-xl glass-card">
          <div className="text-2xl font-bold">{streakData.longestStreak}</div>
          <div className="text-xs text-zinc-500">Longest</div>
        </div>
        <div className="text-center p-3 rounded-xl glass-card">
          <div className="text-2xl font-bold">{streakData.totalDays}</div>
          <div className="text-xs text-zinc-500">Total Days</div>
        </div>
      </div>

      <div className="space-y-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex gap-1">
            {week.map((day, dayIndex) => {
              const date = new Date(day.date);
              const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
              
              return (
                <div
                  key={dayIndex}
                  className={`flex-1 h-8 rounded flex items-center justify-center text-xs transition-all ${
                    day.practiced
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-700'
                  }`}
                  title={`${day.date} - ${day.practiced ? 'Practiced' : 'No practice'}`}
                >
                  {weekIndex === weeks.length - 1 && dayName.charAt(0)}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-zinc-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-500"></div>
          <span>Practiced</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-zinc-300 dark:bg-zinc-700"></div>
          <span>Missed</span>
        </div>
      </div>
    </div>
  );
}
