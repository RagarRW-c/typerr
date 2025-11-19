import { useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getWpmOverTime, getLanguageStats } from './stats';

export default function StatsCharts() {
  const wpmData = getWpmOverTime();
  const languageStats = getLanguageStats();
  
  if (wpmData.length === 0) {
    return (
      <div className="text-center p-8 text-zinc-500">
        No data yet. Complete some typing tests to see your progress! 📊
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* WPM Progress */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800">
        <h3 className="text-xl font-semibold mb-4">📈 Your Progress Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={wpmData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#18181b', 
                border: '1px solid #3f3f46',
                borderRadius: '8px'
              }} 
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="wpm" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', r: 5 }}
              name="WPM"
            />
            <Line 
              type="monotone" 
              dataKey="accuracy" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 4 }}
              name="Accuracy %"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Language Stats */}
      {languageStats.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800">
          <h3 className="text-xl font-semibold mb-4">🌐 Performance by Language</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={languageStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="language" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#18181b', 
                  border: '1px solid #3f3f46',
                  borderRadius: '8px'
                }} 
              />
              <Legend />
              <Bar dataKey="averageWpm" fill="#8b5cf6" name="Average WPM" radius={[8, 8, 0, 0]} />
              <Bar dataKey="bestWpm" fill="#10b981" name="Best WPM" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
