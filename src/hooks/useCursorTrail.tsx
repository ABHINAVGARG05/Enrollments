import { useEffect, useRef } from "react";

interface TrailParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
  type: "dot" | "spark";
}

export function useCursorTrail(enabled: boolean = true) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<TrailParticle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 });
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!enabled) return;

    // Skip on mobile/touch devices
    const isMobile = window.matchMedia("(max-width: 768px)").matches || 
                     window.matchMedia("(pointer: coarse)").matches;
    if (isMobile) return;

    // Create canvas
    const canvas = document.createElement("canvas");
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9997;
    `;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    canvasRef.current = canvas;

    const ctx = canvas.getContext("2d")!;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.prevX = mouseRef.current.x;
      mouseRef.current.prevY = mouseRef.current.y;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      const dx = e.clientX - mouseRef.current.prevX;
      const dy = e.clientY - mouseRef.current.prevY;
      const speed = Math.sqrt(dx * dx + dy * dy);

      // Only spawn particles when moving
      if (speed < 1) return;

      // Spawn rate based on speed (subtle)
      const spawnCount = Math.min(Math.floor(speed / 8), 2);
      
      for (let i = 0; i < spawnCount; i++) {
        const isSpark = Math.random() > 0.85;
        particlesRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 4,
          y: e.clientY + (Math.random() - 0.5) * 4,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5 + 0.3,
          life: 1,
          maxLife: 0.4 + Math.random() * 0.3,
          size: isSpark ? 2 + Math.random() * 2 : 3 + Math.random() * 3,
          hue: 25 + Math.random() * 15, // Orange-ish
          type: isSpark ? "spark" : "dot",
        });
      }

      // Limit particles for performance
      if (particlesRef.current.length > 50) {
        particlesRef.current = particlesRef.current.slice(-50);
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(p => {
        p.life -= 0.025 / p.maxLife;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02; // Gentle gravity
        p.size *= 0.98;

        if (p.life <= 0 || p.size < 0.5) return false;

        const alpha = p.life * 0.7;

        if (p.type === "spark") {
          // Simple spark - small bright dot
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 100%, 80%, ${alpha})`;
          ctx.fill();
        } else {
          // Gradient dot
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          gradient.addColorStop(0, `hsla(${p.hue}, 100%, 65%, ${alpha})`);
          gradient.addColorStop(0.5, `hsla(${p.hue}, 100%, 55%, ${alpha * 0.5})`);
          gradient.addColorStop(1, `hsla(${p.hue}, 100%, 50%, 0)`);
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        return true;
      });

      // Subtle glow at cursor
      const { x, y } = mouseRef.current;
      if (x > 0 && y > 0) {
        const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, 20);
        glowGradient.addColorStop(0, "rgba(252, 122, 0, 0.12)");
        glowGradient.addColorStop(0.5, "rgba(252, 122, 0, 0.04)");
        glowGradient.addColorStop(1, "rgba(252, 122, 0, 0)");
        
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("resize", handleResize);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      canvas.remove();
    };
  }, [enabled]);
}

// Click burst effect hook
export function useClickEffect(enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) return;

    const handleClick = (e: MouseEvent) => {
      // Create small burst of particles
      const burst = document.createElement("div");
      burst.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        pointer-events: none;
        z-index: 9998;
      `;

      // Create 6 small particles
      for (let i = 0; i < 6; i++) {
        const particle = document.createElement("div");
        const angle = (i / 6) * Math.PI * 2;
        const distance = 20 + Math.random() * 15;
        
        particle.style.cssText = `
          position: absolute;
          width: 4px;
          height: 4px;
          background: #fc7a00;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: clickBurst 0.4s ease-out forwards;
          --tx: ${Math.cos(angle) * distance}px;
          --ty: ${Math.sin(angle) * distance}px;
        `;
        burst.appendChild(particle);
      }

      document.body.appendChild(burst);
      setTimeout(() => burst.remove(), 500);
    };

    // Add keyframes if not exists
    if (!document.getElementById("click-burst-styles")) {
      const style = document.createElement("style");
      style.id = "click-burst-styles";
      style.textContent = `
        @keyframes clickBurst {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [enabled]);
}

export default useCursorTrail;
