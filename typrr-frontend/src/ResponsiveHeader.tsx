import { useState } from 'react';
import { Tooltip } from './Tooltip';
import { useIsMobileDevice } from './useMediaQuery';
import { MobileMenu, HamburgerButton } from './MobileMenu';

interface ResponsiveHeaderProps {
  // Mode controls
  mode: 'daily' | 'practice';
  onModeChange: (mode: 'daily' | 'practice') => void;
  
  // View controls
  showDashboard: boolean;
  showProfile: boolean;
  showAdmin: boolean;
  onDashboardToggle: () => void;
  onProfileToggle: () => void;
  onAdminToggle: () => void;
  
  // Auth
  isAuthenticated: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  
  // XP Display (optional - for authenticated users)
  xpDisplay?: React.ReactNode;
  
  // Streak Display
  streakDisplay?: React.ReactNode;
  
  // Theme Selector
  themeSelector?: React.ReactNode;
  
  // Controls
  soundToggle?: React.ReactNode;
  themeToggle?: React.ReactNode;
  keyboardShortcuts?: React.ReactNode;
}

export function ResponsiveHeader({
  mode,
  onModeChange,
  showDashboard,
  showProfile,
  showAdmin,
  onDashboardToggle,
  onProfileToggle,
  onAdminToggle,
  isAuthenticated,
  onLoginClick,
  onLogoutClick,
  xpDisplay,
  streakDisplay,
  themeSelector,
  soundToggle,
  themeToggle,
  keyboardShortcuts,
}: ResponsiveHeaderProps) {
  const isMobile = useIsMobileDevice();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Desktop Header
  if (!isMobile) {
    return (
      <header className="flex items-center justify-between flex-wrap gap-2 animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          typrr-like <span className="text-zinc-500">demo</span>
        </h1>
        <div className="flex gap-2 flex-wrap items-center">
          {/* Theme Selector */}
          {themeSelector}
          
          {/* Streak Display */}
          {streakDisplay}
          
          {/* XP Display */}
          {xpDisplay}

          {/* Mode Buttons */}
          <Tooltip content="Daily challenges">
            <button
              className={`px-3 py-1.5 rounded-full text-sm border hover-lift ${
                mode === 'daily'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-black'
                  : 'border-zinc-300 dark:border-zinc-700'
              }`}
              onClick={() => onModeChange('daily')}
            >
              Daily
            </button>
          </Tooltip>
          <Tooltip content="Unlimited practice">
            <button
              className={`px-3 py-1.5 rounded-full text-sm border hover-lift ${
                mode === 'practice'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-black'
                  : 'border-zinc-300 dark:border-zinc-700'
              }`}
              onClick={() => onModeChange('practice')}
            >
              Practice
            </button>
          </Tooltip>

          {/* View Buttons */}
          <Tooltip content="View your statistics">
            <button
              className={`px-3 py-1.5 rounded-full text-sm border hover-lift ${
                showDashboard ? 'bg-indigo-600 text-white' : 'border-zinc-300 dark:border-zinc-700'
              }`}
              onClick={onDashboardToggle}
            >
              📊
            </button>
          </Tooltip>

          {isAuthenticated && (
            <Tooltip content="View your profile">
              <button
                className={`px-3 py-1.5 rounded-full text-sm border hover-lift ${
                  showProfile ? 'bg-purple-600 text-white' : 'border-zinc-300 dark:border-zinc-700'
                }`}
                onClick={onProfileToggle}
              >
                👤 Profile
              </button>
            </Tooltip>
          )}

          <Tooltip content="Admin panel">
            <button
              className={`px-3 py-1.5 rounded-full text-sm border hover-lift ${
                showAdmin ? 'bg-orange-600 text-white' : 'border-zinc-300 dark:border-zinc-700'
              }`}
              onClick={onAdminToggle}
            >
              🔧
            </button>
          </Tooltip>

          {/* Auth Button */}
          {isAuthenticated ? (
            <Tooltip content="Logout">
              <button
                onClick={onLogoutClick}
                className="px-3 py-1.5 rounded-full text-sm border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover-lift"
              >
                Logout
              </button>
            </Tooltip>
          ) : (
            <Tooltip content="Login or create account">
              <button
                onClick={onLoginClick}
                className="px-3 py-1.5 rounded-full text-sm bg-indigo-600 text-white hover:bg-indigo-700 hover-lift"
              >
                Login
              </button>
            </Tooltip>
          )}

          {/* Controls */}
          {soundToggle}
          {themeToggle}
          {keyboardShortcuts}
        </div>
      </header>
    );
  }

  // Mobile Header
  return (
    <>
      <header className="flex items-center justify-between gap-2 animate-fade-in">
        <h1 className="text-xl font-semibold tracking-tight">
          typrr-like <span className="text-zinc-500">demo</span>
        </h1>
        
        <div className="flex items-center gap-2">
          {/* Essential buttons always visible on mobile */}
          <button
            className={`px-3 py-2 rounded-lg text-sm font-medium min-h-[44px] ${
              mode === 'daily'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-black'
                : 'border border-zinc-300 dark:border-zinc-700'
            }`}
            onClick={() => onModeChange('daily')}
          >
            Daily
          </button>
          <button
            className={`px-3 py-2 rounded-lg text-sm font-medium min-h-[44px] ${
              mode === 'practice'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-black'
                : 'border border-zinc-300 dark:border-zinc-700'
            }`}
            onClick={() => onModeChange('practice')}
          >
            Practice
          </button>
          
          {/* Hamburger Button */}
          <HamburgerButton
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            isOpen={isMobileMenuOpen}
          />
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      >
        {/* Theme Selector */}
        {themeSelector && (
          <div className="w-full">
            {themeSelector}
          </div>
        )}

        {/* Streak Display */}
        {streakDisplay && (
          <div className="w-full">
            {streakDisplay}
          </div>
        )}

        {/* XP Display */}
        {xpDisplay && (
          <div className="w-full">
            {xpDisplay}
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2" />

        {/* View Buttons */}
        <button
          className={`w-full px-4 py-3 rounded-lg text-left font-medium min-h-[44px] ${
            showDashboard
              ? 'bg-indigo-600 text-white'
              : 'border border-zinc-300 dark:border-zinc-700'
          }`}
          onClick={() => {
            onDashboardToggle();
            setIsMobileMenuOpen(false);
          }}
        >
          📊 Statistics
        </button>

        {isAuthenticated && (
          <button
            className={`w-full px-4 py-3 rounded-lg text-left font-medium min-h-[44px] ${
              showProfile
                ? 'bg-purple-600 text-white'
                : 'border border-zinc-300 dark:border-zinc-700'
            }`}
            onClick={() => {
              onProfileToggle();
              setIsMobileMenuOpen(false);
            }}
          >
            👤 Profile
          </button>
        )}

        <button
          className={`w-full px-4 py-3 rounded-lg text-left font-medium min-h-[44px] ${
            showAdmin
              ? 'bg-orange-600 text-white'
              : 'border border-zinc-300 dark:border-zinc-700'
          }`}
          onClick={() => {
            onAdminToggle();
            setIsMobileMenuOpen(false);
          }}
        >
          🔧 Admin
        </button>

        {/* Divider */}
        <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2" />

        {/* Auth Button */}
        {isAuthenticated ? (
          <button
            onClick={() => {
              onLogoutClick();
              setIsMobileMenuOpen(false);
            }}
            className="w-full px-4 py-3 rounded-lg text-left font-medium border border-zinc-300 dark:border-zinc-700 min-h-[44px]"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => {
              onLoginClick();
              setIsMobileMenuOpen(false);
            }}
            className="w-full px-4 py-3 rounded-lg font-medium bg-indigo-600 text-white min-h-[44px]"
          >
            Login
          </button>
        )}

        {/* Divider */}
        <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2" />

        {/* Controls */}
        <div className="flex gap-2 justify-center">
          {soundToggle}
          {themeToggle}
          {keyboardShortcuts}
        </div>
      </MobileMenu>
    </>
  );
}
