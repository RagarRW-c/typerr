// Streak System - Track daily practice streaks

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: string | null;
  totalDays: number;
  practiceHistory: string[]; // Array of dates (YYYY-MM-DD)
}

export interface StreakReward {
  days: number;
  title: string;
  description: string;
  icon: string;
  xpBonus: number;
}

const STREAK_STORAGE_KEY = 'typrr_streak';

// Streak Rewards
export const STREAK_REWARDS: StreakReward[] = [
  { days: 3, title: 'Getting Started', description: 'Practice 3 days in a row', icon: '🔥', xpBonus: 50 },
  { days: 7, title: 'Week Warrior', description: 'Practice 7 days in a row', icon: '⚡', xpBonus: 100 },
  { days: 14, title: 'Two Week Champion', description: 'Practice 14 days in a row', icon: '💪', xpBonus: 200 },
  { days: 30, title: 'Month Master', description: 'Practice 30 days in a row', icon: '🏆', xpBonus: 500 },
  { days: 60, title: 'Dedicated Coder', description: 'Practice 60 days in a row', icon: '👑', xpBonus: 1000 },
  { days: 100, title: 'Century Club', description: 'Practice 100 days in a row', icon: '💎', xpBonus: 2000 },
];

// Get XP Multiplier based on streak
export function getStreakMultiplier(streak: number): number {
  if (streak >= 30) return 2.0;
  if (streak >= 21) return 1.8;
  if (streak >= 14) return 1.6;
  if (streak >= 7) return 1.4;
  if (streak >= 3) return 1.2;
  return 1.0;
}

// Get today's date string (YYYY-MM-DD)
function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}

// Get yesterday's date string
function getYesterdayString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().slice(0, 10);
}

// Get streak data from localStorage
export function getStreakData(): StreakData {
  try {
    const saved = localStorage.getItem(STREAK_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading streak data:', error);
  }

  return {
    currentStreak: 0,
    longestStreak: 0,
    lastPracticeDate: null,
    totalDays: 0,
    practiceHistory: [],
  };
}

// Save streak data to localStorage
function saveStreakData(data: StreakData): void {
  try {
    localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving streak data:', error);
  }
}

// Update streak when user completes a snippet
export function updateStreak(): {
  streakData: StreakData;
  isNewDay: boolean;
  streakIncreased: boolean;
  newReward?: StreakReward;
} {
  const data = getStreakData();
  const today = getTodayString();
  const yesterday = getYesterdayString();

  // Already practiced today
  if (data.lastPracticeDate === today) {
    return {
      streakData: data,
      isNewDay: false,
      streakIncreased: false,
    };
  }

  const isNewDay = true;
  let streakIncreased = false;
  let newReward: StreakReward | undefined;

  // First time ever or practiced yesterday (continue streak)
  if (data.lastPracticeDate === null || data.lastPracticeDate === yesterday) {
    data.currentStreak += 1;
    streakIncreased = true;

    // Check for streak rewards
    const reward = STREAK_REWARDS.find(r => r.days === data.currentStreak);
    if (reward) {
      newReward = reward;
    }
  } else {
    // Streak broken - reset to 1
    data.currentStreak = 1;
  }

  // Update longest streak
  if (data.currentStreak > data.longestStreak) {
    data.longestStreak = data.currentStreak;
  }

  // Update history
  if (!data.practiceHistory.includes(today)) {
    data.practiceHistory.push(today);
    data.totalDays = data.practiceHistory.length;
  }

  // Update last practice date
  data.lastPracticeDate = today;

  saveStreakData(data);

  return {
    streakData: data,
    isNewDay,
    streakIncreased,
    newReward,
  };
}

// Check if practiced today
export function hasPracticedToday(): boolean {
  const data = getStreakData();
  return data.lastPracticeDate === getTodayString();
}

// Get calendar data for visualization (last 60 days)
export function getCalendarData(days: number = 60): { date: string; practiced: boolean }[] {
  const data = getStreakData();
  const calendar: { date: string; practiced: boolean }[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().slice(0, 10);

    calendar.push({
      date: dateString,
      practiced: data.practiceHistory.includes(dateString),
    });
  }

  return calendar;
}

// Get days until next reward
export function getDaysUntilNextReward(currentStreak: number): number | null {
  const nextReward = STREAK_REWARDS.find(r => r.days > currentStreak);
  return nextReward ? nextReward.days - currentStreak : null;
}

// Get next reward info
export function getNextReward(currentStreak: number): StreakReward | null {
  return STREAK_REWARDS.find(r => r.days > currentStreak) || null;
}
