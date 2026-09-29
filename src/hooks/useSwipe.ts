import { useRef } from 'react';

// Horizontal swipe for photo carousels. Spread the returned handlers on the
// element; `swiped` is true right after a swipe so a parent click (e.g. a card
// that opens the property) can be ignored.
export const useSwipe = (onPrev: () => void, onNext: () => void, threshold = 40) => {
  const start = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);

  return {
    swiped,
    handlers: {
      onTouchStart: (e: React.TouchEvent) => {
        const t = e.touches[0];
        start.current = { x: t.clientX, y: t.clientY };
        swiped.current = false;
      },
      onTouchEnd: (e: React.TouchEvent) => {
        if (!start.current) return;
        const t = e.changedTouches[0];
        const dx = t.clientX - start.current.x;
        const dy = t.clientY - start.current.y;
        start.current = null;
        if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy)) return;
        swiped.current = true;
        if (dx > 0) onPrev();
        else onNext();
      },
    },
  };
};
