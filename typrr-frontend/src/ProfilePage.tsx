import { useState } from 'react';
import { useAuth } from './AuthContext';
import { apiClient } from './api';
import { showToast } from './Toast';
import { LoadingSpinner } from './LoadingSpinner';
import { getTotalStats } from './stats';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const stats = getTotalStats();

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.updateProfile({
        username: formData.username,
        email: formData.email,
      });
      
      await refreshUser();
      setIsEditing(false);
      showToast('Profile updated successfully!', 'success');
    } catch (error: any) {
      showToast(error.response?.data?.detail || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setLoading(true);

    try {
      await apiClient.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showToast('Password changed successfully!', 'success');
    } catch (error: any) {
      showToast(error.response?.data?.detail || 'Failed to change password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="mt-8 space-y-6 animate-fade-in">
      {/* Profile Header */}
      <div className="glass-card p-8 rounded-3xl">
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
            {getInitials(user?.username || 'U')}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold">{user?.username}</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">{user?.email}</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 rounded-lg glass-button text-sm hover-lift"
              >
                {isEditing ? 'Cancel' : '✏️ Edit Profile'}
              </button>
              <button
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                className="px-4 py-2 rounded-lg glass-button text-sm hover-lift"
              >
                {isChangingPassword ? 'Cancel' : '🔐 Change Password'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      {isEditing && (
        <div className="glass-card p-6 rounded-2xl animate-slide-in-left">
          <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 hover-lift"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Save Changes'}
            </button>
          </form>
        </div>
      )}

      {/* Change Password Form */}
      {isChangingPassword && (
        <div className="glass-card p-6 rounded-2xl animate-slide-in-left">
          <h3 className="text-xl font-semibold mb-4">Change Password</h3>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Current Password</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 hover-lift"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Change Password'}
            </button>
          </form>
        </div>
      )}

      {/* Stats Overview */}
      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-xl font-semibold mb-4">📊 Your Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-xl glass-card">
            <div className="text-3xl font-bold gradient-text">{stats.totalAttempts}</div>
            <div className="text-sm text-zinc-500 mt-1">Total Attempts</div>
          </div>
          <div className="text-center p-4 rounded-xl glass-card">
            <div className="text-3xl font-bold gradient-text">{Math.round(stats.averageWpm)}</div>
            <div className="text-sm text-zinc-500 mt-1">Average WPM</div>
          </div>
          <div className="text-center p-4 rounded-xl glass-card">
            <div className="text-3xl font-bold gradient-text">{Math.round(stats.bestWpm)}</div>
            <div className="text-sm text-zinc-500 mt-1">Best WPM</div>
          </div>
          <div className="text-center p-4 rounded-xl glass-card">
            <div className="text-3xl font-bold gradient-text">{(stats.averageAccuracy * 100).toFixed(0)}%</div>
            <div className="text-sm text-zinc-500 mt-1">Avg Accuracy</div>
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-xl font-semibold mb-4">ℹ️ Account Information</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-600 dark:text-zinc-400">User ID:</span>
            <span className="font-mono">{user?.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-600 dark:text-zinc-400">Username:</span>
            <span className="font-semibold">{user?.username}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-600 dark:text-zinc-400">Email:</span>
            <span>{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-600 dark:text-zinc-400">Account Created:</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
