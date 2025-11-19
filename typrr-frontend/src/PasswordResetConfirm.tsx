import { useState } from 'react';
import { showToast } from './Toast';
import { LoadingSpinner } from './LoadingSpinner';

interface PasswordResetConfirmProps {
  token: string;
  onSuccess: () => void;
}

export default function PasswordResetConfirm({ token, onSuccess }: PasswordResetConfirmProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setLoading(true);

    try {
      // Mock - w prawdziwej aplikacji byłoby to API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showToast('Password reset successfully!', 'success');
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (error: any) {
      showToast('Failed to reset password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="glass-card p-8 rounded-2xl">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🔐</div>
          <h2 className="text-2xl font-bold mb-2">Create New Password</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Enter new password"
              required
              minLength={6}
            />
            <p className="text-xs text-zinc-500 mt-1">At least 6 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Confirm new password"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 hover-lift font-semibold flex items-center justify-center"
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Reset Password'}
          </button>
        </form>
      </div>

      <div className="text-center text-xs text-zinc-500">
        <p className="flex items-center justify-center gap-1">
          <span>🔒</span> Your password will be securely encrypted
        </p>
      </div>
    </div>
  );
}
