import confetti from "canvas-confetti";
import { useCallback } from "react";

type ConfettiType = "basic" | "fireworks" | "snow" | "stars" | "emoji" | "cannon" | "pride" | "realistic";

export const useConfetti = () => {
  const triggerConfetti = useCallback((type: ConfettiType = "basic") => {
    switch (type) {
      case "fireworks":
        fireFireworks();
        break;
      case "snow":
        fireSnow();
        break;
      case "stars":
        fireStars();
        break;
      case "emoji":
        fireEmoji();
        break;
      case "cannon":
        fireCannon();
        break;
      case "pride":
        firePride();
        break;
      case "realistic":
        fireRealistic();
        break;
      default:
        fireBasic();
    }
  }, []);

  return { triggerConfetti };
};

export const fireBasic = () => {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
    colors: ["#fc7a00", "#ff6b35", "#ffd93d", "#ff3366", "#00ff88"],
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
};

export const fireFireworks = () => {
  const duration = 5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  const colors = [
    ["#fc7a00", "#ffd93d"],
    ["#ff3366", "#ff6b35"],
    ["#00ff88", "#00ccff"],
    ["#ff00ff", "#ffff00"],
  ];

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval: ReturnType<typeof setInterval> = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    const colorSet = colors[Math.floor(Math.random() * colors.length)];

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: colorSet,
      shapes: ["star", "circle"],
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: colorSet,
      shapes: ["star", "circle"],
    });
  }, 250);

  return () => clearInterval(interval);
};

export const fireSnow = () => {
  const duration = 8 * 1000;
  const animationEnd = Date.now() + duration;
  const skew = 1;

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  (function frame() {
    const timeLeft = animationEnd - Date.now();
    const ticks = Math.max(200, 500 * (timeLeft / duration));

    confetti({
      particleCount: 1,
      startVelocity: 0,
      ticks: ticks,
      origin: {
        x: Math.random(),
        y: Math.random() * skew - 0.2,
      },
      colors: ["#ffffff", "#e0e0e0", "#c0c0c0"],
      shapes: ["circle"],
      gravity: randomInRange(0.4, 0.6),
      scalar: randomInRange(0.4, 1),
      drift: randomInRange(-0.4, 0.4),
      zIndex: 9999,
    });

    if (timeLeft > 0) {
      requestAnimationFrame(frame);
    }
  })();
};

export const fireStars = () => {
  const defaults = {
    spread: 360,
    ticks: 100,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    shapes: ["star"] as confetti.Shape[],
    colors: ["#fc7a00", "#ffd93d", "#ff3366"],
    zIndex: 9999,
  };

  function shoot() {
    confetti({ ...defaults, particleCount: 40, scalar: 1.2, });
    confetti({ ...defaults, particleCount: 25, scalar: 0.75, });
  }

  setTimeout(shoot, 0);
  setTimeout(shoot, 100);
  setTimeout(shoot, 200);
  setTimeout(shoot, 300);
};

export const fireEmoji = () => {
  const emojis = ["🦊", "🔥", "⭐", "✨", "🎮", "🏆", "💎", "🚀"];
  const scalar = 2;
  
  emojis.forEach((emoji, index) => {
    const emojiShape = confetti.shapeFromText({ text: emoji, scalar });
    
    setTimeout(() => {
      confetti({
        shapes: [emojiShape],
        scalar,
        particleCount: 30,
        spread: 100,
        origin: { y: 0.6, x: 0.2 + (index * 0.08) },
        startVelocity: 40,
        gravity: 1.2,
        ticks: 300,
        zIndex: 9999,
      });
    }, index * 100);
  });
};

export const fireCannon = () => {
  const end = Date.now() + 3 * 1000;
  const colors = ["#fc7a00", "#ffd93d", "#ff3366", "#00ff88"];

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 },
      colors: colors,
      zIndex: 9999,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 },
      colors: colors,
      zIndex: 9999,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
};

export const firePride = () => {
  const colors = [
    "#ff0000", "#ff7f00", "#ffff00", 
    "#00ff00", "#0000ff", "#8b00ff"
  ];
  
  colors.forEach((color, i) => {
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 90 - (i - 2.5) * 15,
        spread: 30,
        origin: { y: 0.9 },
        colors: [color],
        startVelocity: 60,
        gravity: 1.2,
        ticks: 200,
        zIndex: 9999,
      });
    }, i * 100);
  });
};

export const fireRealistic = () => {
  const count = 200;
  const defaults = { origin: { y: 0.7 }, zIndex: 9999 };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ["#fc7a00"],
  });

  fire(0.2, {
    spread: 60,
    colors: ["#ffd93d"],
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ["#ff3366"],
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    colors: ["#00ff88"],
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ["#ffffff"],
  });
};

export const fireSuccessConfetti = () => {
  // Initial burst
  fireBasic();

  // Followed by side cannons
  setTimeout(() => {
    fireCannon();
  }, 500);

  // Then some stars
  setTimeout(() => {
    fireStars();
  }, 1500);
};

export const fireEpicCelebration = () => {
  // Start with fireworks
  fireFireworks();

  // Add emoji rain
  setTimeout(() => {
    fireEmoji();
  }, 1000);

  // Finish with stars
  setTimeout(() => {
    fireStars();
  }, 3000);
};

export default fireBasic;
