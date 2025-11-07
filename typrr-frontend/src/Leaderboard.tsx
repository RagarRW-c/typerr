import { useState, useEffect } from 'react';
import { apiClient } from './api';
import { useAuth } from './AuthContext';

interface LeaderboardEntry {
  userId: string;
  username: string;
  bestWpm: number;
  accuracy: number;
  language: string;
  difficulty: string;
  createdAt: string;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const { user } = useAuth();

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedLanguage, selectedDifficulty]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError('');
    
    try {
      const params: any = { limit: 100 };
      if (selectedLanguage) params.language = selectedLanguage;
      if (selectedDifficulty) params.difficulty = selectedDifficulty;

      const response = await apiClient.getGlobalLeaderboard(params);
      setLeaderboard(response.data.leaderboard);
    } catch (err: any) {
      setError(err.message || 'Failed to load leaderboard');
      console.error('Leaderboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  const userRank = user ? leaderboard.findIndex((entry: LeaderboardEntry) => entry.userId === user.id) + 1 : 0;

  if (loading) {
    return (
      <div className="mt-8 flex items-center justify-center py-12">
        <div className="text-zinc-500">Loading leaderboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 p-6 rounded-2xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={fetchLeaderboard}
          className="mt-3 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="mt-8 text-center py-12 text-zinc-500">
        No leaderboard entries yet. Be the first to compete!
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">🏆 Global Leaderboard</h2>
        <div className="text-sm text-zinc-500">
          {leaderboard.length} {leaderboard.length === 1 ? 'player' : 'players'}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div>
          <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-1">
            Language
          </label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm"
          >
            <option value="">All Languages</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="sql">SQL</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-1">
            Difficulty
          </label>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm"
          >
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {(selectedLanguage || selectedDifficulty) && (
          <button
            onClick={() => {
              setSelectedLanguage('');
              setSelectedDifficulty('');
            }}
            className="self-end px-3 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-sm hover:bg-zinc-300 dark:hover:bg-zinc-700"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Your Rank */}
      {user && userRank > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                Your Rank
              </div>
              <div className="text-2xl font-bold mt-1">
                {getMedalEmoji(userRank)} #{userRank}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Best WPM</div>
              <div className="text-xl font-semibold">
                {Math.round(leaderboard[userRank - 1].bestWpm)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Player
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  WPM
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Accuracy
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Language
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Difficulty
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {leaderboard.map((entry: LeaderboardEntry, index: number) => {
                const rank = index + 1;
                const medal = getMedalEmoji(rank);
                const isCurrentUser = user && entry.userId === user.id;

                return (
                  <tr
                    key={entry.userId + index}
                    className={`${
                      isCurrentUser
                        ? 'bg-indigo-50 dark:bg-indigo-950/20'
                        : 'bg-white dark:bg-zinc-900'
                    } hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {medal && <span className="text-xl">{medal}</span>}
                        <span className={`font-medium ${rank <= 3 ? 'text-lg' : ''}`}>
                          #{rank}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${isCurrentUser ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
                          {entry.username}
                        </span>
                        {isCurrentUser && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-semibold text-lg">
                        {Math.round(entry.bestWpm)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm">
                        {(entry.accuracy * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-xs font-mono">
                        {entry.language}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-md text-xs ${
                        entry.difficulty === 'easy'
                          ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300'
                          : entry.difficulty === 'medium'
                          ? 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300'
                          : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                      }`}>
                        {entry.difficulty}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center text-sm text-zinc-500">
        <p>Compete with players worldwide! Complete snippets to climb the ranks.</p>
      </div>
    </div>
  );
}
