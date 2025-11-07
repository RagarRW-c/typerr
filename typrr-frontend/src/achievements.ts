import { getHistory, getTotalStats, getStreak, getLanguageStats } from "./stats";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "speed" | "accuracy" | "consistency" | "diversity" | "volume";
  requirement: number;
  unlocked: boolean;
  progress: number;
  unlockedAt?: string;
}

const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, "unlocked" | "progress" | "unlockedAt">[] = [
  // Speed Achievements
  {
    id: "speed_50",
    title: "Speedster",
    description: "Reach 50 WPM",
    icon: "⚡",
    category: "speed",
    requirement: 50,
  },
  {
    id: "speed_75",
    title: "Fast Typer",
    description: "Reach 75 WPM",
    icon: "🏃",
    category: "speed",
    requirement: 75,
  },
  {
    id: "speed_100",
    title: "Speed Demon",
    description: "Reach 100 WPM",
    icon: "🚀",
    category: "speed",
    requirement: 100,
  },
  {
    id: "speed_150",
    title: "Lightning Fast",
    description: "Reach 150 WPM",
    icon: "⚡💨",
    category: "speed",
    requirement: 150,
  },

  // Accuracy Achievements
  {
    id: "accuracy_95",
    title: "Precise",
    description: "95% accuracy on any snippet",
    icon: "🎯",
    category: "accuracy",
    requirement: 95,
  },
  {
    id: "accuracy_99",
    title: "Nearly Perfect",
    description: "99% accuracy on any snippet",
    icon: "💎",
    category: "accuracy",
    requirement: 99,
  },
  {
    id: "accuracy_100",
    title: "Perfectionist",
    description: "100% accuracy on any snippet",
    icon: "✨",
    category: "accuracy",
    requirement: 100,
  },

  // Consistency Achievements (Streak)
  {
    id: "streak_3",
    title: "Getting Started",
    description: "3 day streak",
    icon: "🔥",
    category: "consistency",
    requirement: 3,
  },
  {
    id: "streak_7",
    title: "Week Warrior",
    description: "7 day streak",
    icon: "💪",
    category: "consistency",
    requirement: 7,
  },
  {
    id: "streak_14",
    title: "Two Weeks Strong",
    description: "14 day streak",
    icon: "🏆",
    category: "consistency",
    requirement: 14,
  },
  {
    id: "streak_30",
    title: "Monthly Master",
    description: "30 day streak",
    icon: "👑",
    category: "consistency",
    requirement: 30,
  },
  {
    id: "streak_100",
    title: "Century Streak",
    description: "100 day streak",
    icon: "🌟",
    category: "consistency",
    requirement: 100,
  },

  // Diversity Achievements (Languages)
  {
    id: "lang_3",
    title: "Trilingual",
    description: "Practice 3 different languages",
    icon: "🌍",
    category: "diversity",
    requirement: 3,
  },
  {
    id: "lang_5",
    title: "Polyglot",
    description: "Practice 5 different languages",
    icon: "🗣️",
    category: "diversity",
    requirement: 5,
  },
  {
    id: "lang_10",
    title: "Language Master",
    description: "Practice 10 different languages",
    icon: "📚",
    category: "diversity",
    requirement: 10,
  },

  // Volume Achievements (Total attempts)
  {
    id: "attempts_10",
    title: "Beginner",
    description: "Complete 10 snippets",
    icon: "🌱",
    category: "volume",
    requirement: 10,
  },
  {
    id: "attempts_50",
    title: "Dedicated",
    description: "Complete 50 snippets",
    icon: "💼",
    category: "volume",
    requirement: 50,
  },
  {
    id: "attempts_100",
    title: "Century Club",
    description: "Complete 100 snippets",
    icon: "💯",
    category: "volume",
    requirement: 100,
  },
  {
    id: "attempts_500",
    title: "Elite Typer",
    description: "Complete 500 snippets",
    icon: "👔",
    category: "volume",
    requirement: 500,
  },
  {
    id: "attempts_1000",
    title: "Legend",
    description: "Complete 1000 snippets",
    icon: "🏅",
    category: "volume",
    requirement: 1000,
  },

  // Special Achievements
  {
    id: "hard_50",
    title: "Hard Mode Master",
    description: "Complete 50 hard difficulty snippets",
    icon: "😤",
    category: "volume",
    requirement: 50,
  },
  {
    id: "first_practice",
    title: "First Steps",
    description: "Complete your first snippet",
    icon: "🎉",
    category: "volume",
    requirement: 1,
  },
];

const STORAGE_KEY = "typrr_like:achievements";

// ============ ACHIEVEMENT CHECKING ============

export function checkAchievements(): Achievement[] {
  const history = getHistory();
  const totalStats = getTotalStats();
  const streak = getStreak();
  const languageStats = getLanguageStats();

  const savedAchievements = getSavedAchievements();
  
  const achievements: Achievement[] = ACHIEVEMENT_DEFINITIONS.map(def => {
    let progress = 0;
    let unlocked = false;

    const saved = savedAchievements.find(a => a.id === def.id);

    switch (def.category) {
      case "speed":
        progress = totalStats.bestWpm;
        unlocked = totalStats.bestWpm >= def.requirement;
        break;

      case "accuracy":
        const bestAccuracy = history.length > 0 
          ? Math.max(...history.map(h => h.accuracy * 100))
          : 0;
        progress = bestAccuracy;
        unlocked = bestAccuracy >= def.requirement;
        break;

      case "consistency":
        progress = streak.longestStreak;
        unlocked = streak.longestStreak >= def.requirement;
        break;

      case "diversity":
        progress = languageStats.length;
        unlocked = languageStats.length >= def.requirement;
        break;

      case "volume":
        if (def.id === "hard_50") {
          const hardCount = history.filter(h => h.difficulty === "hard").length;
          progress = hardCount;
          unlocked = hardCount >= def.requirement;
        } else {
          progress = totalStats.totalAttempts;
          unlocked = totalStats.totalAttempts >= def.requirement;
        }
        break;
    }

    return {
      ...def,
      unlocked,
      progress: Math.min(progress, def.requirement),
      unlockedAt: saved?.unlockedAt,
    };
  });

  // Save newly unlocked achievements
  const newlyUnlocked = achievements.filter(
    a => a.unlocked && !savedAchievements.find(s => s.id === a.id)
  );

  if (newlyUnlocked.length > 0) {
    saveAchievements(achievements);
  }

  return achievements;
}

export function getNewlyUnlockedAchievements(): Achievement[] {
  const current = checkAchievements();
  const saved = getSavedAchievements();
  
  return current.filter(
    a => a.unlocked && !saved.find(s => s.id === a.id && s.unlocked)
  );
}

function getSavedAchievements(): Achievement[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveAchievements(achievements: Achievement[]): void {
  try {
    const toSave = achievements
      .filter(a => a.unlocked)
      .map(a => ({
        ...a,
        unlockedAt: a.unlockedAt || new Date().toISOString(),
      }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (error) {
    console.error("Failed to save achievements:", error);
  }
}

export function getAchievementStats() {
  const achievements = checkAchievements();
  const unlocked = achievements.filter(a => a.unlocked).length;
  const total = achievements.length;

  return {
    unlocked,
    total,
    percentage: (unlocked / total) * 100,
  };
}

export function getAchievementsByCategory() {
  const achievements = checkAchievements();
  
  const categories = {
    speed: achievements.filter(a => a.category === "speed"),
    accuracy: achievements.filter(a => a.category === "accuracy"),
    consistency: achievements.filter(a => a.category === "consistency"),
    diversity: achievements.filter(a => a.category === "diversity"),
    volume: achievements.filter(a => a.category === "volume"),
  };

  return categories;
}
