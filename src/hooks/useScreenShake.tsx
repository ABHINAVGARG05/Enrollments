import React, { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from "react";

type ShakePattern = "basic" | "light" | "heavy" | "bounce";

interface ScreenShakeContextType {
  triggerShake: (options?: ShakeOptions) => void;
  triggerPatternShake: (pattern: ShakePattern, intensity?: number) => void;
  isShaking: boolean;
}

interface ShakeOptions {
  intensity?: number;
  duration?: number;
  pattern?: ShakePattern;
}

const ScreenShakeContext = createContext<ScreenShakeContextType | null>(null);

let globalTriggerShake: ((options?: ShakeOptions) => void) | null = null;
let globalTriggerPatternShake: ((pattern: ShakePattern, intensity?: number) => void) | null = null;

export function triggerScreenShake(intensity: number = 5, duration: number = 300) {
  if (globalTriggerShake) {
    globalTriggerShake({ intensity, duration });
  }
}

export function triggerPatternShake(pattern: ShakePattern, intensity: number = 5) {
  if (globalTriggerPatternShake) {
    globalTriggerPatternShake(pattern, intensity);
  }
}

// Pattern configurations - optimized for smooth animation
const PATTERN_CONFIGS: Record<ShakePattern, { keyframes: (i: number) => string; duration: number }> = {
  basic: {
    keyframes: (i) => `
      0%, 100% { transform: translate3d(0, 0, 0); }
      10% { transform: translate3d(-${i}px, 0, 0); }
      20% { transform: translate3d(${i}px, 0, 0); }
      30% { transform: translate3d(-${i}px, 0, 0); }
      40% { transform: translate3d(${i}px, 0, 0); }
      50% { transform: translate3d(-${i * 0.7}px, 0, 0); }
      60% { transform: translate3d(${i * 0.7}px, 0, 0); }
      70% { transform: translate3d(-${i * 0.4}px, 0, 0); }
      80% { transform: translate3d(${i * 0.4}px, 0, 0); }
      90% { transform: translate3d(-${i * 0.2}px, 0, 0); }
    `,
    duration: 400,
  },
  light: {
    keyframes: (i) => `
      0%, 100% { transform: translate3d(0, 0, 0); }
      20% { transform: translate3d(-${i * 0.5}px, ${i * 0.2}px, 0); }
      40% { transform: translate3d(${i * 0.5}px, -${i * 0.2}px, 0); }
      60% { transform: translate3d(-${i * 0.3}px, ${i * 0.1}px, 0); }
      80% { transform: translate3d(${i * 0.2}px, 0, 0); }
    `,
    duration: 250,
  },
  heavy: {
    keyframes: (i) => `
      0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
      10% { transform: translate3d(-${i * 1.5}px, ${i * 0.5}px, 0) rotate(-${i * 0.3}deg); }
      20% { transform: translate3d(${i * 1.5}px, -${i * 0.5}px, 0) rotate(${i * 0.3}deg); }
      30% { transform: translate3d(-${i}px, ${i * 0.7}px, 0) rotate(-${i * 0.2}deg); }
      40% { transform: translate3d(${i}px, -${i * 0.7}px, 0) rotate(${i * 0.2}deg); }
      50% { transform: translate3d(-${i * 0.8}px, ${i * 0.3}px, 0) rotate(-${i * 0.1}deg); }
      60% { transform: translate3d(${i * 0.6}px, 0, 0) rotate(${i * 0.1}deg); }
      70% { transform: translate3d(-${i * 0.4}px, ${i * 0.2}px, 0) rotate(0deg); }
      80% { transform: translate3d(${i * 0.3}px, -${i * 0.1}px, 0); }
      90% { transform: translate3d(-${i * 0.1}px, 0, 0); }
    `,
    duration: 500,
  },
  bounce: {
    keyframes: (i) => `
      0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
      20% { transform: translate3d(0, -${i * 2}px, 0) scale(1.02); }
      40% { transform: translate3d(0, 0, 0) scale(0.98); }
      60% { transform: translate3d(0, -${i}px, 0) scale(1.01); }
      80% { transform: translate3d(0, 0, 0) scale(0.99); }
    `,
    duration: 400,
  },
};

interface ScreenShakeProviderProps {
  children: ReactNode;
}

// Unique ID for keyframe rules
let keyframeId = 0;

export function ScreenShakeProvider({ children }: ScreenShakeProviderProps) {
  const [shakeClass, setShakeClass] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const shakeTimeoutRef = useRef<number | null>(null);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  // Create stylesheet on mount
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "screen-shake-styles";
    document.head.appendChild(style);
    styleRef.current = style;
    return () => style.remove();
  }, []);

  const triggerShake = useCallback((options: ShakeOptions = {}) => {
    const { 
      intensity = 5, 
      duration, 
      pattern = "basic" 
    } = options;

    if (shakeTimeoutRef.current) {
      clearTimeout(shakeTimeoutRef.current);
    }

    const config = PATTERN_CONFIGS[pattern];
    const actualDuration = duration ?? config.duration;
    const animationName = `shake_${++keyframeId}`;
    const className = `shaking_${keyframeId}`;

    if (styleRef.current) {
      styleRef.current.textContent = `
        @keyframes ${animationName} {
          ${config.keyframes(intensity)}
        }
        .${className} {
          animation: ${animationName} ${actualDuration}ms ease-in-out !important;
        }
      `;
    }

    setIsShaking(true);
    setShakeClass(className);

    shakeTimeoutRef.current = window.setTimeout(() => {
      setShakeClass("");
      setIsShaking(false);
    }, actualDuration);
  }, []);

  const triggerPatternShake = useCallback((pattern: ShakePattern, intensity: number = 5) => {
    triggerShake({ pattern, intensity });
  }, [triggerShake]);

  globalTriggerShake = triggerShake;
  globalTriggerPatternShake = triggerPatternShake;

  return (
    <ScreenShakeContext.Provider value={{ triggerShake, triggerPatternShake, isShaking }}>
      <div 
        className={shakeClass} 
        style={{ 
          minHeight: "100vh",
          willChange: isShaking ? "transform" : "auto",
        }}
      >
        {children}
      </div>
    </ScreenShakeContext.Provider>
  );
}

export function useScreenShake() {
  const context = useContext(ScreenShakeContext);
  if (!context) {
    throw new Error("useScreenShake must be used within a ScreenShakeProvider");
  }
  return context;
}

// Presets for different scenarios
export const shakePresets = {
  light: () => triggerPatternShake("light", 3),
  basic: () => triggerScreenShake(5, 300),
  heavy: () => triggerPatternShake("heavy", 8),
  bounce: () => triggerPatternShake("bounce", 6),
  success: () => triggerPatternShake("bounce", 4),
  error: () => triggerPatternShake("heavy", 6),
};

export default useScreenShake;
