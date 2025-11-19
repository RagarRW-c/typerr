import { useEffect, useRef, useState } from 'react';

export function useMilestones(wpm: number, isTyping: boolean) {
  const [currentMilestone, setCurrentMilestone] = useState<number | null>(null);
  const lastMilestoneRef = useRef<number>(0);
  const shownMilestonesRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!isTyping) {
      // Reset everything when not typing
      lastMilestoneRef.current = 0;
      shownMilestonesRef.current.clear();
      setCurrentMilestone(null);
      return;
    }

    const milestones = [50, 75, 100, 125, 150, 200];
    const roundedWpm = Math.floor(wpm);

    for (const milestone of milestones) {
      // Show milestone only if:
      // 1. WPM is >= milestone
      // 2. Haven't shown this milestone in THIS session
      // 3. Last milestone was lower than current
      if (
        roundedWpm >= milestone && 
        !shownMilestonesRef.current.has(milestone) &&
        lastMilestoneRef.current < milestone
      ) {
        lastMilestoneRef.current = milestone;
        shownMilestonesRef.current.add(milestone);
        setCurrentMilestone(milestone);
        
        // Auto-dismiss after 3 seconds
        setTimeout(() => {
          setCurrentMilestone(null);
        }, 3000);
        
        break;
      }
    }
  }, [wpm, isTyping]);

  const dismissMilestone = () => {
    setCurrentMilestone(null);
  };

  return { currentMilestone, dismissMilestone };
}
