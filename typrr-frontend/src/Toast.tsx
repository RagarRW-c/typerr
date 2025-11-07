import { useEffect, useState } from "react";
import type { Achievement } from "./achievements";

interface ToastProps {
  achievement: Achievement;
  onClose: () => void;
}

export function AchievementToast({ achievement, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 transform transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-2xl min-w-[320px] max-w-md">
        <div className="text-4xl animate-bounce">
          🎉
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{achievement.icon}</span>
            <h3 className="font-bold text-lg">Achievement Unlocked!</h3>
          </div>
          <p className="font-semibold">{achievement.title}</p>
          <p className="text-sm text-indigo-100">{achievement.description}</p>
        </div>

        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="text-white/80 hover:text-white text-xl"
        >
          ×
        </button>
      </div>
    </div>
  );
}

interface ToastManagerProps {
  achievements: Achievement[];
  onDismiss: (id: string) => void;
}

export function ToastManager({ achievements, onDismiss }: ToastManagerProps) {
  return (
    <>
      {achievements.map((achievement, index) => (
        <div
          key={achievement.id}
          style={{ 
            bottom: `${24 + index * 120}px`,
            right: '24px'
          }}
          className="fixed z-50"
        >
          <AchievementToast
            achievement={achievement}
            onClose={() => onDismiss(achievement.id)}
          />
        </div>
      ))}
    </>
  );
}
