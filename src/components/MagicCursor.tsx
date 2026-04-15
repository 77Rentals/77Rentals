import { useEffect, useRef } from 'react';
import { Sparkle } from 'lucide-react';
import { createRoot } from 'react-dom/client';

interface MagicCursorProps {
  colors?: string[];
  sizes?: string[];
  starAnimationDuration?: number;
  minimumTimeBetweenStars?: number;
  minimumDistanceBetweenStars?: number;
}

const MagicCursor = ({
  colors = ['212 168 67', '255 255 255'],
  sizes = ['1.2rem', '0.8rem', '0.5rem'],
  starAnimationDuration = 1200,
  minimumTimeBetweenStars = 200,
  minimumDistanceBetweenStars = 60,
}: MagicCursorProps) => {
  const lastStarRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });

  useEffect(() => {
    const spawnStar = (x: number, y: number) => {
      const now = Date.now();
      const last = lastStarRef.current;
      const dx = x - last.x;
      const dy = y - last.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const elapsed = now - last.time;

      if (elapsed < minimumTimeBetweenStars || dist < minimumDistanceBetweenStars) return;

      lastStarRef.current = { x, y, time: now };

      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      const animIndex = (Math.floor(Math.random() * 3) + 1) as 1 | 2 | 3;

      // Glow point
      const glow = document.createElement('div');
      glow.className = 'mouse-sparkles-glow-point';
      glow.style.left = `${x - 2}px`;
      glow.style.top = `${y - 2}px`;
      glow.style.background = `rgba(${color}, 0.5)`;
      glow.style.animation = `fall-${animIndex} ${starAnimationDuration}ms ease-out forwards`;
      document.body.appendChild(glow);

      // Sparkle star
      const star = document.createElement('div');
      star.className = 'mouse-sparkles-star';
      star.style.left = `${x - 8}px`;
      star.style.top = `${y - 8}px`;
      star.style.width = size;
      star.style.height = size;
      star.style.color = `rgb(${color})`;
      star.style.animation = `fall-${animIndex} ${starAnimationDuration}ms ease-out forwards`;
      document.body.appendChild(star);

      // Render Sparkle icon into the div
      const root = createRoot(star);
      root.render(
        <Sparkle
          style={{ width: '100%', height: '100%', fill: `rgb(${color})`, color: `rgb(${color})` }}
        />
      );

      setTimeout(() => {
        star.remove();
        glow.remove();
      }, starAnimationDuration + 100);
    };

    const handleMouseMove = (e: MouseEvent) => spawnStar(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) spawnStar(t.clientX, t.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [colors, sizes, starAnimationDuration, minimumTimeBetweenStars, minimumDistanceBetweenStars]);

  return null;
};

export default MagicCursor;
