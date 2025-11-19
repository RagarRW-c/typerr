import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { getWpmOverTime, getLanguageStats, getTotalStats, getRecentHistory, getStreak, formatTime } from "./stats";
import Achievements from "./Achievements";
import Leaderboard from "./Leaderboard";
import StatsCharts from './StatsCharts';
import { exportStatsToCSV } from './exportStats';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"stats" | "achievements" | "leaderboard">("stats");
  const wpmData = getWpmOverTime();
  const languageStats = getLanguageStats();
  const totalStats = getTotalStats();
  const recentHistory = getRecentHistory(10);
  const streak = getStreak();

  if (totalStats.totalAttempts === 0) {
    return (
      <div className="mt-8 p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-center">
        <p className="text-zinc-500">No practice history yet. Complete some snippets to see your stats!</p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => setActiveTab("stats")}
          className={`px-4 py-2 font-medium transition-colors relative ${
            activeTab === "stats"
              ? "text-indigo-600 dark:text-indigo-400"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          📊 Statistics
          {activeTab === "stats" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("achievements")}
          className={`px-4 py-2 font-medium transition-colors relative ${
            activeTab === "achievements"
              ? "text-indigo-600 dark:text-indigo-400"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          🏆 Achievements
          {activeTab === "achievements" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("leaderboard")}
          className={`px-4 py-2 font-medium transition-colors relative ${
            activeTab === "leaderboard"
              ? "text-indigo-600 dark:text-indigo-400"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          🌍 Leaderboard
          {activeTab === "leaderboard" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400" />
          )}
        </button>
      </div>

      {/* Content */}
      {activeTab === "leaderboard" ? (
        <Leaderboard />
      ) : activeTab === "achievements" ? (
        <Achievements />
      ) : (
        <>
          {/* Overall Stats Cards */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">📊 Overall Statistics</h2>
              <button
                onClick={exportStatsToCSV}
                className="px-4 py-2 rounded-lg glass-button text-sm font-medium hover-lift"
              >
                📥 Export CSV
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="animate-fade-in stagger-1">
                <StatCard
                  label="Total Attempts"
                  value={totalStats.totalAttempts.toString()}
                  icon="🎯"
                />
              </div>
              <div className="animate-fade-in stagger-2">
                <StatCard
                  label="Total Time"
                  value={formatTime(totalStats.totalTime)}
                  icon="⏱️"
                />
              </div>
              <div className="animate-fade-in stagger-3">
                <StatCard
                  label="Average WPM"
                  value={Math.round(totalStats.averageWpm).toString()}
                  icon="⚡"
                />
              </div>
              <div className="animate-fade-in stagger-4">
                <StatCard
                  label="Best WPM"
                  value={Math.round(totalStats.bestWpm).toString()}
                  icon="🏆"
                />
              </div>
            </div>
          </div>

          {/* Streak */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border border-orange-200 dark:border-orange-800 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100">🔥 Daily Streak</h3>
                <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">Keep practicing every day!</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{streak.currentStreak}</div>
                <div className="text-xs text-orange-600 dark:text-orange-400">days</div>
                <div className="text-xs text-orange-700 dark:text-orange-300 mt-1">Best: {streak.longestStreak} days</div>
              </div>
            </div>
          </div>

          {/* WPM Over Time Chart */}
          {wpmData.length > 1 && (
            <div className="animate-slide-in-left">
              <h2 className="text-xl font-semibold mb-4">📈 WPM Progress</h2>
              <div className="p-4 rounded-2xl glass-card">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={wpmData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: "12px" }} />
                    <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#18181b",
                        border: "1px solid #3f3f46",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="wpm" stroke="#8b5cf6" strokeWidth={2} name="WPM" />
                    <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} name="Accuracy %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Language Stats */}
          {languageStats.length > 0 && (
            <div className="animate-slide-in-right">
              <h2 className="text-xl font-semibold mb-4">💻 Stats by Language</h2>
              <div className="p-4 rounded-2xl glass-card">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={languageStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="language" stroke="#9ca3af" style={{ fontSize: "12px" }} />
                    <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#18181b",
                        border: "1px solid #3f3f46",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="averageWpm" fill="#8b5cf6" name="Avg WPM" />
                    <Bar dataKey="bestWpm" fill="#10b981" name="Best WPM" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 space-y-2">
                {languageStats.map((stat) => (
                  <div
                    key={stat.language}
                    className="p-3 rounded-xl glass-card hover-lift flex items-center justify-between"
                  >
                    <div>
                      <span className="font-medium">{stat.language}</span>
                      <span className="ml-2 text-sm text-zinc-500">
                        {stat.totalAttempts} attempts
                      </span>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-semibold">{Math.round(stat.averageWpm)} WPM avg</div>
                      <div className="text-zinc-500">{Math.round(stat.bestWpm)} best</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent History */}
          <div>
            <h2 className="text-xl font-semibold mb-4">📜 Recent History</h2>
            <div className="space-y-2">
              {recentHistory.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`p-3 rounded-xl glass-card hover-lift flex items-center justify-between text-sm animate-fade-in`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 font-mono text-xs">
                      {entry.language}
                    </span>
                    <span className="text-zinc-500">{entry.snippetId}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      entry.difficulty === 'easy' ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300' :
                      entry.difficulty === 'medium' ? 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300' :
                      'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                    }`}>
                      {entry.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="font-semibold">{Math.round(entry.wpm)} WPM</div>
                      <div className="text-xs text-zinc-500">{(entry.accuracy * 100).toFixed(1)}%</div>
                    </div>
                    <div className="text-xs text-zinc-500">
                      {new Date(entry.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Charts Section */}
          <div className="mt-8">
            <StatsCharts />
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="p-4 rounded-2xl glass-card hover-lift">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-zinc-500 text-xs uppercase tracking-wider">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}
