import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { photoSrcSet, thumb } from '@/lib/image';
import { useSwipe } from '@/hooks/useSwipe';

interface PhotoLightboxProps {
  images: string[];
  index: number;
  name: string;
  onChange: (index: number) => void;
  onClose: () => void;
}

// Fullscreen photo viewer: arrow keys / swipe to move, Esc or tap outside to close.
const PhotoLightbox = ({ images, index, name, onChange, onClose }: PhotoLightboxProps) => {
  const count = images.length;
  const go = (i: number) => onChange((i + count) % count);
  const { handlers } = useSwipe(() => go(index - 1), () => go(index + 1));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') go(index - 1);
      if (e.key === 'ArrowRight') go(index + 1);
    };
    window.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/95 flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={`Fotos de ${name}`}
      onClick={onClose}
      {...handlers}
    >
      <div className="flex items-center justify-between px-4 py-3 text-white/80 text-sm">
        <span>{index + 1} / {count}</span>
        <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center" aria-label="Cerrar">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="relative flex-1 flex items-center justify-center px-2 md:px-16 min-h-0">
        <img
          key={images[index]}
          srcSet={photoSrcSet(images[index])}
          sizes="100vw"
          src={images[index]}
          alt={`${name} - foto ${index + 1}`}
          className="max-w-full max-h-full object-contain animate-in fade-in duration-300"
          onClick={e => e.stopPropagation()}
        />
        {count > 1 && (
          <>
            <button onClick={e => { e.stopPropagation(); go(index - 1); }} className="absolute left-2 md:left-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center" aria-label="Foto anterior">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={e => { e.stopPropagation(); go(index + 1); }} className="absolute right-2 md:right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center" aria-label="Foto siguiente">
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="flex gap-2 overflow-x-auto px-4 py-3 justify-start md:justify-center" onClick={e => e.stopPropagation()}>
          {images.map((src, i) => (
            <button key={src} onClick={() => onChange(i)} className={`shrink-0 w-16 h-12 rounded-md overflow-hidden border-2 transition-opacity ${i === index ? 'border-white' : 'border-transparent opacity-50 hover:opacity-100'}`}>
              <img src={thumb(src)} alt="" loading="lazy" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoLightbox;
