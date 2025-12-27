import { useState, useEffect, useCallback, useRef } from "react";
import confetti from "canvas-confetti";
import { triggerScreenShake } from "./useScreenShake";

const KONAMI_CODE = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

const KEY_SYMBOLS: Record<string, string> = {
  ArrowUp: "↑",
  ArrowDown: "↓",
  ArrowLeft: "←",
  ArrowRight: "→",
  b: "B",
  a: "A",
};

export function useKonamiCode() {
  const [isActivated, setIsActivated] = useState(false);
  const [inputSequence, setInputSequence] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const key = e.key;
      const newSequence = [...inputSequence, key].slice(-KONAMI_CODE.length);
      setInputSequence(newSequence);

      // Calculate progress
      let matchCount = 0;
      for (let i = 0; i < newSequence.length; i++) {
        if (newSequence[i] === KONAMI_CODE[i]) {
          matchCount++;
        } else {
          break;
        }
      }
      setProgress(matchCount / KONAMI_CODE.length);

      // Check for full match
      if (newSequence.join(",") === KONAMI_CODE.join(",")) {
        setIsActivated(true);
        setInputSequence([]);
        setProgress(0);
      }
    },
    [inputSequence]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return { isActivated, setIsActivated, progress };
}

// Progress indicator - shows when user starts typing the code
export function KonamiProgressIndicator({ progress }: { progress: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (progress > 0) {
      setVisible(true);
    } else {
      const timeout = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [progress]);

  if (!visible && progress === 0) return null;

  return (
    <div 
      className={`fixed bottom-4 right-4 z-[9998] transition-all duration-300 ${
        progress > 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <div className="nes-container is-dark is-rounded" style={{ padding: "8px 12px" }}>
        <div className="flex items-center gap-3">
          <span className="text-lg">🎮</span>
          <div className="flex gap-0.5">
            {KONAMI_CODE.map((key, i) => (
              <span
                key={i}
                className={`w-5 h-5 flex items-center justify-center text-[10px] rounded transition-all duration-150 ${
                  i < progress * 10
                    ? "bg-prime text-black scale-110"
                    : "bg-gray-700 text-gray-500"
                }`}
                style={{ fontFamily: "'Press Start 2P'" }}
              >
                {KEY_SYMBOLS[key]}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface KonamiEffectProps {
  isActive: boolean;
  onClose: () => void;
}

export function KonamiEffect({ isActive, onClose }: KonamiEffectProps) {
  const [phase, setPhase] = useState<"enter" | "show" | "exit">("enter");
  const [keyIndex, setKeyIndex] = useState(-1);
  const confettiIntervalRef = useRef<number>();

  useEffect(() => {
    if (!isActive) {
      setPhase("enter");
      setKeyIndex(-1);
      return;
    }

    // Initial screen shake
    triggerScreenShake(10, 500);

    // Phase 1: Enter animation
    setPhase("enter");
    
    // Fire initial confetti burst
    const colors = ["#fc7a00", "#ff6b35", "#ffd93d", "#ff3366", "#92cc41"];
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5, x: 0.5 },
      colors,
      shapes: ["star", "circle"],
      gravity: 0.8,
    });

    // Phase 2: Show content
    setTimeout(() => {
      setPhase("show");
      
      // Animate keys one by one
      KONAMI_CODE.forEach((_, i) => {
        setTimeout(() => setKeyIndex(i), i * 80);
      });
    }, 300);

    // Side confetti bursts
    setTimeout(() => {
      confetti({ particleCount: 40, angle: 60, spread: 50, origin: { x: 0 }, colors });
      confetti({ particleCount: 40, angle: 120, spread: 50, origin: { x: 1 }, colors });
    }, 500);

    // Continuous sparkle effect
    confettiIntervalRef.current = window.setInterval(() => {
      confetti({
        particleCount: 3,
        spread: 360,
        startVelocity: 15,
        origin: { x: Math.random(), y: Math.random() * 0.5 },
        colors: ["#fc7a00", "#ffd93d"],
        shapes: ["star"],
        gravity: 0.5,
        scalar: 0.8,
      });
    }, 200);

    // Auto close
    const closeTimeout = setTimeout(() => {
      setPhase("exit");
      if (confettiIntervalRef.current) clearInterval(confettiIntervalRef.current);
      setTimeout(onClose, 400);
    }, 5000);

    return () => {
      clearTimeout(closeTimeout);
      if (confettiIntervalRef.current) clearInterval(confettiIntervalRef.current);
    };
  }, [isActive, onClose]);

  const handleClose = () => {
    setPhase("exit");
    if (confettiIntervalRef.current) clearInterval(confettiIntervalRef.current);
    setTimeout(onClose, 400);
  };

  if (!isActive) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-400 ${
        phase === "exit" ? "opacity-0" : "opacity-100"
      }`}
      onClick={handleClose}
    >
      {/* Background with blur */}
      <div 
        className={`absolute inset-0 transition-all duration-500 ${
          phase === "enter" ? "backdrop-blur-0" : "backdrop-blur-sm"
        }`}
        style={{ background: "rgba(0, 0, 0, 0.85)" }}
      />

      {/* Scanlines overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)",
        }}
      />

      {/* Animated particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-prime rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
              opacity: 0.3 + Math.random() * 0.4,
            }}
          />
        ))}
      </div>

      {/* Main card */}
      <div 
        className={`relative nes-container is-dark is-rounded transition-all duration-500 ${
          phase === "show" 
            ? "scale-100 translate-y-0 opacity-100" 
            : phase === "enter"
            ? "scale-95 translate-y-4 opacity-0"
            : "scale-95 -translate-y-4 opacity-0"
        }`}
        style={{ 
          padding: "24px 32px",
          maxWidth: "440px",
          background: "linear-gradient(180deg, #2d2d3d 0%, #1a1a2e 100%)",
          borderColor: "#fc7a00",
          boxShadow: "0 0 40px rgba(252, 122, 0, 0.3), 0 20px 60px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Glow effect */}
        <div 
          className="absolute -inset-1 rounded-lg opacity-20 blur-xl"
          style={{ background: "#fc7a00" }}
        />

        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Fox with animation */}
          <div 
            className={`text-5xl mb-3 transition-all duration-500 ${
              phase === "show" ? "animate-bounce" : ""
            }`}
          >
            🦊
          </div>

          {/* Title */}
          <h2 
            className={`text-prime mb-4 transition-all duration-300 ${
              phase === "show" ? "opacity-100" : "opacity-0"
            }`}
            style={{ 
              fontFamily: "'Press Start 2P'",
              fontSize: "14px",
              textShadow: "0 0 20px rgba(252, 122, 0, 0.8)",
              letterSpacing: "2px",
            }}
          >
            SECRET UNLOCKED!
          </h2>

          {/* Konami code keys */}
          <div className="flex flex-wrap justify-center gap-1.5 mb-4">
            {KONAMI_CODE.map((key, i) => (
              <div
                key={i}
                className={`transition-all duration-200 ${
                  i <= keyIndex 
                    ? "scale-100 opacity-100" 
                    : "scale-75 opacity-30"
                }`}
                style={{ transitionDelay: `${i * 30}ms` }}
              >
                <span 
                  className={`inline-block px-2 py-1 rounded text-xs ${
                    i <= keyIndex ? "bg-prime text-black" : "bg-gray-700 text-gray-400"
                  }`}
                  style={{ 
                    fontFamily: "'Press Start 2P'",
                    boxShadow: i <= keyIndex ? "0 0 10px rgba(252, 122, 0, 0.5)" : "none",
                  }}
                >
                  {KEY_SYMBOLS[key]}
                </span>
              </div>
            ))}
          </div>

          {/* Message */}
          <p 
            className={`text-gray-300 mb-4 transition-all duration-500 delay-300 ${
              phase === "show" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
            style={{ fontFamily: "'Press Start 2P'", fontSize: "8px", lineHeight: "2" }}
          >
            You discovered the legendary code!<br />
            <span className="text-prime">Welcome to MFC, retro gamer!</span>
          </p>

          {/* Achievement badge */}
          <div 
            className={`inline-flex items-center gap-2 px-3 py-2 rounded transition-all duration-500 delay-500 ${
              phase === "show" ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
            style={{ background: "rgba(252, 122, 0, 0.15)", border: "1px solid rgba(252, 122, 0, 0.3)" }}
          >
            <span className="text-lg">🎮</span>
            <div className="text-left">
              <div className="text-[8px] text-gray-400" style={{ fontFamily: "'Press Start 2P'" }}>
                +1000 XP
              </div>
              <div className="text-[10px] text-prime" style={{ fontFamily: "'Press Start 2P'" }}>
                Retro Gamer
              </div>
            </div>
          </div>

          {/* Dismiss hint */}
          <p 
            className={`mt-4 text-gray-500 animate-pulse transition-all duration-500 delay-700 ${
              phase === "show" ? "opacity-100" : "opacity-0"
            }`}
            style={{ fontFamily: "'Press Start 2P'", fontSize: "7px" }}
          >
            [ Click anywhere to close ]
          </p>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-prime opacity-50" />
        <div className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 border-prime opacity-50" />
        <div className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 border-prime opacity-50" />
        <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-prime opacity-50" />
      </div>
    </div>
  );
}

export default useKonamiCode;
