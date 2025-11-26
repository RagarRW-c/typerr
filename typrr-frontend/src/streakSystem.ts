// Streak System - Daily Practice Tracking
// Tracks user's daily practice streaks and provides rewards

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: string | null;
  totalDays: number;
  practiceHistory: string[]; // Array of ISO date strings
}

export interface StreakReward {
  days: number;
  title: string;
  description: string;
  icon: string;
  xpBonus: number;
}

// Streak milestone rewards
export const STREAK_REWARDS: StreakReward[] = [
  {
    days: 3,
    title: "Getting Started",
    description: "3 days in a row!",
    icon: "🔥",
    xpBonus: 50
  },
  {
    days: 7,
    title: "Week Warrior",
    description: "A full week of practice!",
    icon: "⚡",
    xpBonus: 100
  },
  {
    days: 14,
    title: "Two Week Champion",
    description: "14 days of dedication!",
    icon: "💪",
    xpBonus: 200
  },
  {
    days: 30,
    title: "Month Master",
    description: "30 days of consistent practice!",
    icon: "🏆",
    xpBonus: 500
  },
  {
    days: 60,
    title: "Dedicated Coder",
    description: "60 days of unwavering commitment!",
    icon: "👑",
    xpBonus: 1000
  },
  {
    days: 100,
    title: "Century Club",
    description: "100 days of mastery!",
    icon: "💎",
    xpBonus: 2000
  }
];

const STORAGE_KEY = 'typrr_streak';

// Get current streak data from localStorage
export function getStreakData(): StreakData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading streak data:', error);
  }
  
  // Return default data
  return {
    currentStreak: 0,
    longestStreak: 0,
    lastPracticeDate: null,
    totalDays: 0,
    practiceHistory: []
  };
}

// Save streak data to localStorage
function saveStreakData(data: StreakData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving streak data:', error);
  }
}

// Get today's date as ISO string (YYYY-MM-DD)
function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

// Check if two dates are consecutive days
function isConsecutiveDay(date1: string, date2: string): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1;
}

// Get XP multiplier based on current streak
export function getStreakMultiplier(streak: number): number {
  if (streak >= 30) return 2.0;
  if (streak >= 21) return 1.8;
  if (streak >= 14) return 1.6;
  if (streak >= 7) return 1.4;
  if (streak >= 3) return 1.2;
  return 1.0;
}

// Update streak after completing a practice session
export function updateStreak(): {
  streakData: StreakData;
  isNewDay: boolean;
  streakIncreased: boolean;
  newReward: StreakReward | null;
} {
  const data = getStreakData();
  const today = getTodayISO();
  
  // Check if already practiced today
  if (data.lastPracticeDate === today) {
    return {
      streakData: data,
      isNewDay: false,
      streakIncreased: false,
      newReward: null
    };
  }
  
  let streakIncreased = false;
  let newReward: StreakReward | null = null;
  
  // First practice ever
  if (!data.lastPracticeDate) {
    data.currentStreak = 1;
    data.longestStreak = 1;
    data.totalDays = 1;
    data.practiceHistory = [today];
    streakIncreased = true;
  }
  // Consecutive day
  else if (isConsecutiveDay(data.lastPracticeDate, today)) {
    data.currentStreak += 1;
    data.totalDays += 1;
    data.practiceHistory.push(today);
    streakIncreased = true;
    
    // Update longest streak if needed
    if (data.currentStreak > data.longestStreak) {
      data.longestStreak = data.currentStreak;
    }
    
    // Check for streak rewards
    const reward = STREAK_REWARDS.find(r => r.days === data.currentStreak);
    if (reward) {
      newReward = reward;
    }
  }
  // Streak broken - reset
  else {
    data.currentStreak = 1;
    data.totalDays += 1;
    data.practiceHistory.push(today);
    streakIncreased = true;
  }
  
  data.lastPracticeDate = today;
  
  // Keep only last 365 days of history to prevent storage bloat
  if (data.practiceHistory.length > 365) {
    data.practiceHistory = data.practiceHistory.slice(-365);
  }
  
  saveStreakData(data);
  
  return {
    streakData: data,
    isNewDay: true,
    streakIncreased,
    newReward
  };
}

// Get calendar data for visualization (last N days)
export function getCalendarData(days: number = 60): Array<{
  date: string;
  practiced: boolean;
}> {
  const data = getStreakData();
  const result: Array<{ date: string; practiced: boolean }> = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    result.push({
      date: dateStr,
      practiced: data.practiceHistory.includes(dateStr)
    });
  }
  
  return result;
}

// Reset streak data (for testing/debugging)
export function resetStreakData(): void {
  localStorage.removeItem(STORAGE_KEY);
}