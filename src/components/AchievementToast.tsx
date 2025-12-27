import { useEffect, useState, useRef } from "react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

const RARITY_CONFIG = {
  common: { 
    label: "COMMON",
    color: "#9ca3af",
    bgColor: "rgba(156, 163, 175, 0.1)",
    borderColor: "rgba(156, 163, 175, 0.3)",
  },
  rare: { 
    label: "RARE",
    color: "#60a5fa",
    bgColor: "rgba(96, 165, 250, 0.1)",
    borderColor: "rgba(96, 165, 250, 0.3)",
  },
  epic: { 
    label: "EPIC",
    color: "#a78bfa",
    bgColor: "rgba(167, 139, 250, 0.1)",
    borderColor: "rgba(167, 139, 250, 0.3)",
  },
  legendary: { 
    label: "LEGENDARY",
    color: "#fc7a00",
    bgColor: "rgba(252, 122, 0, 0.15)",
    borderColor: "rgba(252, 122, 0, 0.4)",
  },
};

interface AchievementToastProps {
  achievement: Achievement;
  onClose: () => void;
}

export const AchievementToast = ({ achievement, onClose }: AchievementToastProps) => {
  const [phase, setPhase] = useState<"enter" | "show" | "exit">("enter");
  const [progress, setProgress] = useState(100);
  const timerRef = useRef<number>();
  const config = RARITY_CONFIG[achievement.rarity];

  useEffect(() => {
    // Enter animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setPhase("show"));
    });

    // Progress countdown
    const startTime = Date.now();
    const duration = 4000;
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      
      if (remaining > 0) {
        timerRef.current = requestAnimationFrame(updateProgress);
      }
    };
    timerRef.current = requestAnimationFrame(updateProgress);

    // Auto dismiss
    const timeout = setTimeout(() => {
      setPhase("exit");
      setTimeout(onClose, 300);
    }, duration);

    return () => {
      clearTimeout(timeout);
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, [onClose]);

  const handleClick = () => {
    setPhase("exit");
    if (timerRef.current) cancelAnimationFrame(timerRef.current);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed top-4 left-1/2 z-[10000] transition-all duration-300 ease-out ${
        phase === "show"
          ? "opacity-100 -translate-x-1/2 translate-y-0 scale-100"
          : phase === "enter"
          ? "opacity-0 -translate-x-1/2 -translate-y-4 scale-95"
          : "opacity-0 -translate-x-1/2 -translate-y-2 scale-95"
      }`}
      onClick={handleClick}
    >
      {/* Main container */}
      <div 
        className="relative nes-container is-dark is-rounded cursor-pointer overflow-hidden"
        style={{ 
          padding: "12px 16px",
          minWidth: "300px",
          maxWidth: "380px",
          background: "#1a1a2e",
          borderColor: config.borderColor,
        }}
      >
        {/* Glow effect for legendary */}
        {achievement.rarity === "legendary" && (
          <div 
            className="absolute -inset-1 rounded-lg opacity-30 blur-md animate-pulse"
            style={{ background: config.color }}
          />
        )}

        {/* Content wrapper */}
        <div className="relative z-10">
          {/* Header row */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs">🏆</span>
              <span 
                className="text-[8px] uppercase tracking-wider"
                style={{ fontFamily: "'Press Start 2P'", color: config.color }}
              >
                Achievement Unlocked!
              </span>
            </div>
            <span 
              className="text-[7px] uppercase px-2 py-0.5 rounded"
              style={{ 
                fontFamily: "'Press Start 2P'", 
                color: config.color,
                background: config.bgColor,
              }}
            >
              {config.label}
            </span>
          </div>

          {/* Main content */}
          <div className="flex items-center gap-3">
            {/* Icon with animation */}
            <div 
              className={`text-3xl flex-shrink-0 transition-transform duration-500 ${
                phase === "show" ? "scale-100" : "scale-0"
              }`}
              style={{ 
                filter: achievement.rarity === "legendary" ? `drop-shadow(0 0 8px ${config.color})` : undefined,
              }}
            >
              {achievement.icon}
            </div>

            {/* Text content */}
            <div className="flex-1 min-w-0">
              <h3 
                className="text-white text-xs mb-1 truncate"
                style={{ fontFamily: "'Press Start 2P'" }}
              >
                {achievement.title}
              </h3>
              <p 
                className="text-gray-400 text-[10px] leading-relaxed"
                style={{ lineHeight: "1.4" }}
              >
                {achievement.description}
              </p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden"
          style={{ background: "rgba(0,0,0,0.3)" }}
        >
          <div 
            className="h-full transition-none"
            style={{ 
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${config.color}, ${config.color}80)`,
              boxShadow: `0 0 8px ${config.color}`,
            }}
          />
        </div>

        {/* Corner accents */}
        <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l" style={{ borderColor: config.color, opacity: 0.5 }} />
        <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r" style={{ borderColor: config.color, opacity: 0.5 }} />
        <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l" style={{ borderColor: config.color, opacity: 0.5 }} />
        <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r" style={{ borderColor: config.color, opacity: 0.5 }} />
      </div>
    </div>
  );
};

export const ACHIEVEMENTS: Record<string, Achievement> = {
  PROFILE_COMPLETE: {
    id: "profile_complete",
    title: "Identity Revealed",
    description: "You completed your profile. The fox knows you now!",
    icon: "👤",
    rarity: "common",
  },
  FIRST_TASK: {
    id: "first_task",
    title: "Quest Accepted",
    description: "You viewed your first task. Adventure awaits!",
    icon: "📜",
    rarity: "common",
  },
  TASK_SUBMITTED: {
    id: "task_submitted",
    title: "Challenge Complete",
    description: "You submitted a task successfully!",
    icon: "⚔️",
    rarity: "rare",
  },
  ALL_DOMAINS: {
    id: "all_domains",
    title: "Jack of All Trades",
    description: "Selected all three domains. True polymath!",
    icon: "🏆",
    rarity: "epic",
  },
  KONAMI_MASTER: {
    id: "konami_master",
    title: "Retro Gamer",
    description: "Found the secret Konami Code!",
    icon: "🎮",
    rarity: "legendary",
  },
  NIGHT_OWL: {
    id: "night_owl",
    title: "Night Owl",
    description: "Applying between midnight and 4 AM!",
    icon: "🦉",
    rarity: "rare",
  },
  MEETING_BOOKED: {
    id: "meeting_booked",
    title: "Rendezvous Set",
    description: "Interview scheduled. Prepare for glory!",
    icon: "📅",
    rarity: "epic",
  },
  TRIPLE_THREAT: {
    id: "triple_threat",
    title: "Triple Threat",
    description: "Submitted tasks in all domains!",
    icon: "👑",
    rarity: "legendary",
  },
};

export const useAchievements = () => {
  const [queue, setQueue] = useState<Achievement[]>([]);
  const [current, setCurrent] = useState<Achievement | null>(null);

  const unlockAchievement = (achievementId: string) => {
    const achievement = ACHIEVEMENTS[achievementId];
    if (!achievement) return;

    const unlocked = JSON.parse(localStorage.getItem("mfc_achievements") || "[]");
    if (unlocked.includes(achievementId)) return;

    localStorage.setItem("mfc_achievements", JSON.stringify([...unlocked, achievementId]));
    setQueue((prev) => [...prev, achievement]);
  };

  const isUnlocked = (achievementId: string): boolean => {
    const unlocked = JSON.parse(localStorage.getItem("mfc_achievements") || "[]");
    return unlocked.includes(achievementId);
  };

  const getUnlockedCount = (): number => {
    const unlocked = JSON.parse(localStorage.getItem("mfc_achievements") || "[]");
    return unlocked.length;
  };

  useEffect(() => {
    if (queue.length > 0 && !current) {
      setCurrent(queue[0]);
      setQueue((prev) => prev.slice(1));
    }
  }, [queue, current]);

  const dismissCurrent = () => setCurrent(null);

  return { current, dismissCurrent, unlockAchievement, isUnlocked, getUnlockedCount };
};

export default AchievementToast;
