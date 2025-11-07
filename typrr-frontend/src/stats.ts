export interface PracticeEntry {
  id: string;
  date: string;
  timestamp: number;
  language: string;
  snippetId: string;
  difficulty: string;
  wpm: number;
  accuracy: number;
  errors: number;
  timeMs: number;
  mode: "daily" | "practice";
}

export interface LanguageStats {
  language: string;
  totalAttempts: number;
  averageWpm: number;
  bestWpm: number;
  averageAccuracy: number;
  totalTime: number;
}

export interface DailyStreak {
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: string;
}

const STORAGE_KEY = "typrr_like:history";
const STREAK_KEY = "typrr_like:streak";

// ============ HISTORY MANAGEMENT ============

export function saveEntry(entry: Omit<PracticeEntry, "id" | "timestamp">): void {
  try {
    const history = getHistory();
    const newEntry: PracticeEntry = {
      ...entry,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    history.push(newEntry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    updateStreak(entry.date);
  } catch (error) {
    console.error("Failed to save entry:", error);
  }
}

export function getHistory(): PracticeEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear history:", error);
  }
}

// ============ STATISTICS ============

export function getLanguageStats(): LanguageStats[] {
  const history = getHistory();
  const statsMap = new Map<string, {
    attempts: number;
    totalWpm: number;
    bestWpm: number;
    totalAccuracy: number;
    totalTime: number;
  }>();

  history.forEach(entry => {
    const existing = statsMap.get(entry.language) || {
      attempts: 0,
      totalWpm: 0,
      bestWpm: 0,
      totalAccuracy: 0,
      totalTime: 0,
    };

    existing.attempts++;
    existing.totalWpm += entry.wpm;
    existing.bestWpm = Math.max(existing.bestWpm, entry.wpm);
    existing.totalAccuracy += entry.accuracy;
    existing.totalTime += entry.timeMs;

    statsMap.set(entry.language, existing);
  });

  return Array.from(statsMap.entries()).map(([language, stats]) => ({
    language,
    totalAttempts: stats.attempts,
    averageWpm: stats.totalWpm / stats.attempts,
    bestWpm: stats.bestWpm,
    averageAccuracy: stats.totalAccuracy / stats.attempts,
    totalTime: stats.totalTime,
  })).sort((a, b) => b.totalAttempts - a.totalAttempts);
}

export function getTotalStats() {
  const history = getHistory();
  
  if (history.length === 0) {
    return {
      totalAttempts: 0,
      totalTime: 0,
      averageWpm: 0,
      bestWpm: 0,
      averageAccuracy: 0,
    };
  }

  const totalTime = history.reduce((sum, e) => sum + e.timeMs, 0);
  const totalWpm = history.reduce((sum, e) => sum + e.wpm, 0);
  const totalAccuracy = history.reduce((sum, e) => sum + e.accuracy, 0);
  const bestWpm = Math.max(...history.map(e => e.wpm));

  return {
    totalAttempts: history.length,
    totalTime,
    averageWpm: totalWpm / history.length,
    bestWpm,
    averageAccuracy: totalAccuracy / history.length,
  };
}

export function getRecentHistory(limit: number = 10): PracticeEntry[] {
  return getHistory()
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
}

export function getWpmOverTime(): { date: string; wpm: number; accuracy: number }[] {
  const history = getHistory();
  return history
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(entry => ({
      date: new Date(entry.timestamp).toLocaleDateString(),
      wpm: Math.round(entry.wpm),
      accuracy: entry.accuracy * 100,
    }));
}

// ============ STREAK MANAGEMENT ============

function updateStreak(dateString: string): void {
  try {
    const streak = getStreak();
    const today = new Date(dateString);
    const lastDate = streak.lastPracticeDate ? new Date(streak.lastPracticeDate) : null;

    if (!lastDate) {
      // First practice ever
      streak.currentStreak = 1;
      streak.longestStreak = 1;
      streak.lastPracticeDate = dateString;
    } else {
      const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Same day, don't update streak
        return;
      } else if (diffDays === 1) {
        // Consecutive day
        streak.currentStreak++;
        streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
      } else {
        // Streak broken
        streak.currentStreak = 1;
      }

      streak.lastPracticeDate = dateString;
    }

    localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
  } catch (error) {
    console.error("Failed to update streak:", error);
  }
}

export function getStreak(): DailyStreak {
  try {
    const data = localStorage.getItem(STREAK_KEY);
    return data ? JSON.parse(data) : {
      currentStreak: 0,
      longestStreak: 0,
      lastPracticeDate: "",
    };
  } catch {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastPracticeDate: "",
    };
  }
}

export function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}
