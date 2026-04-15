import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

interface SpaceBackgroundProps {
  particleCount?: number;
  particleColor?: string;
}

const SpaceBackground = ({
  particleCount = 300,
  particleColor = 'rgba(212, 168, 67, 0.35)',
}: SpaceBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const init = () => {
      resize();
      particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 0.3,
        opacity: Math.random() * 0.6 + 0.1,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = particleColor.replace(')', `, ${p.opacity})`).replace('rgba(', 'rgba(').replace(/rgba\((.+),\s*[\d.]+,\s*[\d.]+\)$/, (_, rgb) => `rgba(${rgb}, ${p.opacity})`);
        // simpler approach:
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = particleColor;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      animFrame = requestAnimationFrame(draw);
    };

    init();
    draw();

    window.addEventListener('resize', resize, { passive: true });

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resize);
    };
  }, [particleCount, particleColor]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
};

export default SpaceBackground;
