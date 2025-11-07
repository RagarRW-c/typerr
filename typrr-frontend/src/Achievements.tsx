import { getAchievementsByCategory, getAchievementStats, type Achievement } from "./achievements";

export default function Achievements() {
  const stats = getAchievementStats();
  const categories = getAchievementsByCategory();

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">🏆 Achievements</h2>
        <div className="text-right">
          <div className="text-2xl font-bold">{stats.unlocked}/{stats.total}</div>
          <div className="text-sm text-zinc-500">{stats.percentage.toFixed(0)}% Complete</div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="relative w-full h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
          style={{ width: `${stats.percentage}%` }}
        />
      </div>

      {/* Categories */}
      <div className="space-y-8">
        <CategorySection title="⚡ Speed" achievements={categories.speed} />
        <CategorySection title="🎯 Accuracy" achievements={categories.accuracy} />
        <CategorySection title="🔥 Consistency" achievements={categories.consistency} />
        <CategorySection title="🌍 Diversity" achievements={categories.diversity} />
        <CategorySection title="💪 Volume" achievements={categories.volume} />
      </div>
    </div>
  );
}

function CategorySection({ title, achievements }: { title: string; achievements: Achievement[] }) {
  const unlocked = achievements.filter(a => a.unlocked).length;
  const total = achievements.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-sm text-zinc-500">{unlocked}/{total}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {achievements.map(achievement => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </div>
  );
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const progressPercentage = (achievement.progress / achievement.requirement) * 100;
  const isUnlocked = achievement.unlocked;

  return (
    <div 
      className={`relative p-4 rounded-xl border transition-all ${
        isUnlocked 
          ? "bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-indigo-200 dark:border-indigo-800" 
          : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 opacity-60"
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className={`text-3xl ${isUnlocked ? "grayscale-0" : "grayscale"}`}>
          {achievement.icon}
        </div>
        {isUnlocked && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 text-xs font-medium">
            ✓ Unlocked
          </div>
        )}
      </div>

      <div className="mb-3">
        <h4 className="font-semibold text-sm">{achievement.title}</h4>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
          {achievement.description}
        </p>
      </div>

      {!isUnlocked && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>Progress</span>
            <span>{Math.floor(achievement.progress)}/{achievement.requirement}</span>
          </div>
          <div className="relative w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>
      )}

      {isUnlocked && achievement.unlockedAt && (
        <div className="mt-2 text-xs text-zinc-500">
          Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}
