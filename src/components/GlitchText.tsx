import { useState, useEffect, ReactNode, useCallback } from "react";

interface GlitchTextProps {
  children: ReactNode;
  text?: string;
  className?: string;
  glitchOnHover?: boolean;
  continuous?: boolean;
  intensity?: "low" | "medium" | "high" | "extreme";
  colors?: { primary: string; secondary: string };
}

const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;:',.<>?/\\`~█▓▒░▄▀■□◆◇○●";
const CYBER_CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノ01";

const GlitchText = ({ 
  children,
  text: textProp, 
  className = "", 
  glitchOnHover = true,
  continuous = false,
  intensity = "medium",
  colors = { primary: "#fc7a00", secondary: "#4ecdc4" },
}: GlitchTextProps) => {
  const text = textProp || (typeof children === 'string' ? children : String(children));
  const [isGlitching, setIsGlitching] = useState(continuous);
  const [displayText, setDisplayText] = useState(text);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [clipPaths, setClipPaths] = useState({ top: "0%", bottom: "100%" });

  const glitchChars = intensity === "extreme" ? CYBER_CHARS : GLITCH_CHARS;
  
  const speeds = {
    low: 50,
    medium: 30,
    high: 20,
    extreme: 10,
  };

  const intensityValues = {
    low: { offset: 2, scrambleRatio: 0.3 },
    medium: { offset: 4, scrambleRatio: 0.5 },
    high: { offset: 6, scrambleRatio: 0.7 },
    extreme: { offset: 10, scrambleRatio: 0.9 },
  };

  const randomClipPath = useCallback(() => {
    const top = Math.random() * 80;
    const height = 10 + Math.random() * 30;
    return { top: `${top}%`, bottom: `${Math.min(top + height, 100)}%` };
  }, []);

  useEffect(() => {
    if (!isGlitching) {
      setDisplayText(text);
      setOffset({ x: 0, y: 0 });
      return;
    }

    let iteration = 0;
    const maxIterations = text.length * 3;
    const { offset: maxOffset, scrambleRatio } = intensityValues[intensity];

    const interval = setInterval(() => {
      // Scramble text
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < iteration / 3) return text[index];
            if (char === " ") return " ";
            if (Math.random() > scrambleRatio) return char;
            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
          })
          .join("")
      );

      // Random offset
      if (Math.random() > 0.7) {
        setOffset({
          x: (Math.random() - 0.5) * maxOffset,
          y: (Math.random() - 0.5) * maxOffset,
        });
      }

      // Random clip paths for glitch layers
      if (Math.random() > 0.8) {
        setClipPaths(randomClipPath());
      }

      iteration++;

      if (iteration >= maxIterations && !continuous) {
        clearInterval(interval);
        setDisplayText(text);
        setOffset({ x: 0, y: 0 });
        setIsGlitching(false);
      }
    }, speeds[intensity]);

    return () => clearInterval(interval);
  }, [isGlitching, text, continuous, intensity, glitchChars, randomClipPath]);

  // Occasional random glitch when continuous
  useEffect(() => {
    if (!continuous) return;

    const randomGlitch = setInterval(() => {
      if (Math.random() > 0.95) {
        setOffset({
          x: (Math.random() - 0.5) * intensityValues[intensity].offset * 2,
          y: (Math.random() - 0.5) * intensityValues[intensity].offset * 2,
        });
        setTimeout(() => setOffset({ x: 0, y: 0 }), 50);
      }
    }, 100);

    return () => clearInterval(randomGlitch);
  }, [continuous, intensity]);

  return (
    <span
      className={`relative inline-block ${className}`}
      onMouseEnter={() => glitchOnHover && setIsGlitching(true)}
      onMouseLeave={() => glitchOnHover && !continuous && setIsGlitching(false)}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: isGlitching ? "none" : "transform 0.1s ease",
      }}
    >
      {/* Main text */}
      <span 
        className="relative z-10"
        style={{
          textShadow: isGlitching 
            ? `2px 0 ${colors.primary}, -2px 0 ${colors.secondary}, 0 0 10px rgba(252, 122, 0, 0.5)`
            : "none",
        }}
      >
        {displayText}
      </span>
      
      {/* Glitch layers */}
      {isGlitching && (
        <>
          {/* Red/Primary layer */}
          <span
            className="absolute top-0 left-0 z-0"
            style={{
              color: colors.primary,
              opacity: 0.8,
              clipPath: `inset(${clipPaths.top} 0 ${100 - parseFloat(clipPaths.bottom)}% 0)`,
              transform: `translate(${-2 - Math.random() * 3}px, ${-1 + Math.random() * 2}px)`,
              animation: "glitch-anim-1 0.2s infinite linear alternate-reverse",
              mixBlendMode: "screen",
            }}
          >
            {displayText}
          </span>
          
          {/* Cyan/Secondary layer */}
          <span
            className="absolute top-0 left-0 z-0"
            style={{
              color: colors.secondary,
              opacity: 0.8,
              clipPath: `inset(${100 - parseFloat(clipPaths.bottom)}% 0 ${clipPaths.top} 0)`,
              transform: `translate(${2 + Math.random() * 3}px, ${1 - Math.random() * 2}px)`,
              animation: "glitch-anim-2 0.3s infinite linear alternate-reverse",
              mixBlendMode: "screen",
            }}
          >
            {displayText}
          </span>

          {/* Scanline effect */}
          <span
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              background: `repeating-linear-gradient(
                0deg,
                transparent 0px,
                transparent 1px,
                rgba(0,0,0,0.1) 1px,
                rgba(0,0,0,0.1) 2px
              )`,
              opacity: 0.3,
            }}
          />
        </>
      )}

      <style>{`
        @keyframes glitch-anim-1 {
          0% { clip-path: inset(20% 0 60% 0); transform: translate(-3px, -1px); }
          20% { clip-path: inset(10% 0 70% 0); transform: translate(2px, 2px); }
          40% { clip-path: inset(40% 0 40% 0); transform: translate(-2px, -2px); }
          60% { clip-path: inset(60% 0 20% 0); transform: translate(3px, 1px); }
          80% { clip-path: inset(30% 0 50% 0); transform: translate(-3px, 2px); }
          100% { clip-path: inset(10% 0 60% 0); transform: translate(2px, -1px); }
        }
        @keyframes glitch-anim-2 {
          0% { clip-path: inset(60% 0 20% 0); transform: translate(3px, 1px); }
          20% { clip-path: inset(30% 0 50% 0); transform: translate(-2px, -2px); }
          40% { clip-path: inset(70% 0 10% 0); transform: translate(2px, 2px); }
          60% { clip-path: inset(20% 0 60% 0); transform: translate(-3px, -1px); }
          80% { clip-path: inset(50% 0 30% 0); transform: translate(3px, -2px); }
          100% { clip-path: inset(40% 0 40% 0); transform: translate(-2px, 1px); }
        }
      `}</style>
    </span>
  );
};

// Cyberpunk-style glitch text variant
export const CyberGlitchText = (props: Omit<GlitchTextProps, "intensity" | "colors">) => (
  <GlitchText 
    {...props} 
    intensity="extreme" 
    colors={{ primary: "#ff00ff", secondary: "#00ffff" }}
  />
);

// Fire-themed glitch text
export const FireGlitchText = (props: Omit<GlitchTextProps, "colors">) => (
  <GlitchText 
    {...props} 
    colors={{ primary: "#ff4500", secondary: "#ffd700" }}
  />
);

export default GlitchText;
