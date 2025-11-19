import { useState } from 'react';
import { showToast } from './Toast';
import { LoadingSpinner } from './LoadingSpinner';

interface PasswordResetRequestProps {
  onBack: () => void;
}

export default function PasswordResetRequest({ onBack }: PasswordResetRequestProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock - w prawdziwej aplikacji byłoby to API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSent(true);
      showToast('Password reset link sent to your email!', 'success');
    } catch (error: any) {
      showToast('Failed to send reset link', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="text-center p-8 glass-card rounded-2xl">
          <div className="text-6xl mb-4">📧</div>
          <h3 className="text-xl font-bold mb-2">Check Your Email</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <p className="text-xs text-zinc-500 mb-4">
            Didn't receive the email? Check your spam folder or try again.
          </p>
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-lg glass-button hover-lift"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        ← Back to Login
      </button>

      <div className="glass-card p-8 rounded-2xl">
        <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="your@email.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 hover-lift font-semibold flex items-center justify-center"
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Send Reset Link'}
          </button>
        </form>
      </div>

      <div className="text-center text-xs text-zinc-500">
        <p>Remember your password? <button onClick={onBack} className="text-indigo-600 hover:underline">Sign in</button></p>
      </div>
    </div>
  );
}
