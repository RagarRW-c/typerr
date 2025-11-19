import { getHistory } from './stats';

export function exportStatsToCSV() {
  const entries = getHistory();
  
  if (entries.length === 0) {
    alert('No data to export!');
    return;
  }
  
  // CSV Header
  const headers = ['Date', 'Time', 'Language', 'Snippet ID', 'Difficulty', 'WPM', 'Accuracy %', 'Errors', 'Time (seconds)', 'Mode'];
  
  // CSV Rows
  const rows = entries.map(entry => {
    const date = new Date(entry.timestamp);
    return [
      date.toLocaleDateString(),
      date.toLocaleTimeString(),
      entry.language,
      entry.snippetId,
      entry.difficulty,
      Math.round(entry.wpm),
      (entry.accuracy * 100).toFixed(2),
      entry.errors,
      (entry.timeMs / 1000).toFixed(2),
      entry.mode
    ];
  });
  
  // Combine
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  // Download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `typrr-stats-${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
