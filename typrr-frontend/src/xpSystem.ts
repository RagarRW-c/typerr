// XP and Level System

export interface UserXP {
  totalXP: number;
  level: number;
  xpToNextLevel: number;
  currentLevelXP: number;
}

export interface Level {
  level: number;
  name: string;
  minXP: number;
  icon: string;
  color: string;
}

// Level definitions
export const LEVELS: Level[] = [
  { level: 1, name: 'Beginner', minXP: 0, icon: '🌱', color: 'text-green-500' },
  { level: 2, name: 'Novice', minXP: 100, icon: '🌿', color: 'text-green-600' },
  { level: 3, name: 'Apprentice', minXP: 250, icon: '🍃', color: 'text-emerald-500' },
  { level: 4, name: 'Intermediate', minXP: 500, icon: '🌳', color: 'text-emerald-600' },
  { level: 5, name: 'Advanced', minXP: 1000, icon: '⚡', color: 'text-yellow-500' },
  { level: 6, name: 'Expert', minXP: 2000, icon: '🔥', color: 'text-orange-500' },
  { level: 7, name: 'Master', minXP: 4000, icon: '💎', color: 'text-blue-500' },
  { level: 8, name: 'Grandmaster', minXP: 8000, icon: '👑', color: 'text-purple-500' },
  { level: 9, name: 'Elite', minXP: 15000, icon: '⭐', color: 'text-yellow-400' },
  { level: 10, name: 'Legend', minXP: 30000, icon: '🏆', color: 'text-amber-500' },
];

const XP_STORAGE_KEY = 'typrr_xp';

// Calculate XP earned from a typing session
export function calculateXP(wpm: number, accuracy: number, errors: number, difficulty: string): number {
  let baseXP = 10;
  
  // WPM bonus
  if (wpm >= 100) baseXP += 50;
  else if (wpm >= 80) baseXP += 30;
  else if (wpm >= 60) baseXP += 20;
  else if (wpm >= 40) baseXP += 10;
  
  // Accuracy bonus
  if (accuracy >= 0.99) baseXP += 20;
  else if (accuracy >= 0.95) baseXP += 15;
  else if (accuracy >= 0.90) baseXP += 10;
  else if (accuracy >= 0.80) baseXP += 5;
  
  // Error penalty
  baseXP -= Math.min(errors * 2, 20);
  
  // Difficulty multiplier
  const difficultyMultiplier = {
    easy: 1.0,
    medium: 1.5,
    hard: 2.0,
  }[difficulty] || 1.0;
  
  const totalXP = Math.max(5, Math.round(baseXP * difficultyMultiplier));
  
  return totalXP;
}

// Get current user XP data
export function getUserXP(): UserXP {
  try {
    const saved = localStorage.getItem(XP_STORAGE_KEY);
    const totalXP = saved ? parseInt(saved, 10) : 0;
    
    const currentLevel = getCurrentLevel(totalXP);
    const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1);
    
    const currentLevelXP = totalXP - currentLevel.minXP;
    const xpToNextLevel = nextLevel ? nextLevel.minXP - totalXP : 0;
    
    return {
      totalXP,
      level: currentLevel.level,
      xpToNextLevel,
      currentLevelXP,
    };
  } catch {
    return {
      totalXP: 0,
      level: 1,
      xpToNextLevel: 100,
      currentLevelXP: 0,
    };
  }
}

// Get current level based on total XP
export function getCurrentLevel(totalXP: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVELS[i].minXP) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

// Add XP and check for level up
export function addXP(amount: number): { leveledUp: boolean; newLevel?: Level; oldLevel?: Level } {
  const oldUserXP = getUserXP();
  const oldLevel = getCurrentLevel(oldUserXP.totalXP);
  
  const newTotalXP = oldUserXP.totalXP + amount;
  localStorage.setItem(XP_STORAGE_KEY, String(newTotalXP));
  
  const newLevel = getCurrentLevel(newTotalXP);
  const leveledUp = newLevel.level > oldLevel.level;
  
  return {
    leveledUp,
    newLevel: leveledUp ? newLevel : undefined,
    oldLevel: leveledUp ? oldLevel : undefined,
  };
}

// Get XP needed for next level
export function getXPForNextLevel(currentLevel: number): number {
  const nextLevel = LEVELS.find(l => l.level === currentLevel + 1);
  return nextLevel ? nextLevel.minXP : 0;
}

// Get progress percentage to next level
export function getLevelProgress(totalXP: number): number {
  const currentLevel = getCurrentLevel(totalXP);
  const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1);
  
  if (!nextLevel) return 100; // Max level
  
  const currentLevelXP = totalXP - currentLevel.minXP;
  const xpNeeded = nextLevel.minXP - currentLevel.minXP;
  
  return Math.min(100, (currentLevelXP / xpNeeded) * 100);
}
