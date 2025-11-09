
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useLocalization } from '../hooks/useLocalization';

interface ImageComparatorProps {
  original: string;
  rendered: string;
}

const ImageComparator: React.FC<ImageComparatorProps> = ({ original, rendered }) => {
  const { t, language } = useLocalization();
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPos(percent);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    e.preventDefault();
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
  }
  
  const handleTouchMove = (e: TouchEvent) => {
    if(!isDragging.current) return;
    handleMove(e.touches[0].clientX);
  }

  useEffect(() => {
    const currentContainer = containerRef.current;
    
    const handleMouseUpGlobal = () => { isDragging.current = false; };
    const handleTouchEndGlobal = () => { isDragging.current = false; };
    
    currentContainer?.addEventListener('mousemove', handleMouseMove);
    currentContainer?.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('mouseup', handleMouseUpGlobal);
    window.addEventListener('touchend', handleTouchEndGlobal);

    return () => {
      currentContainer?.removeEventListener('mousemove', handleMouseMove);
      currentContainer?.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleMouseUpGlobal);
      window.removeEventListener('touchend', handleTouchEndGlobal);
    };
  }, [handleMove]);

  return (
    <div 
        ref={containerRef} 
        className="relative w-full aspect-video select-none rounded-lg overflow-hidden shadow-2xl border-4 border-gold"
    >
      <img src={original} alt={t('original')} className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
        style={{ clipPath: language === 'ar' ? `inset(0 0 0 ${100 - sliderPos}%)` : `inset(0 ${100 - sliderPos}% 0 0)`}}
      >
        <img src={rendered} alt={t('rendered')} className="absolute inset-0 w-full h-full object-contain" />
      </div>

      <div 
        className="absolute top-0 bottom-0 w-1 bg-white/80 cursor-ew-resize"
        style={{ [language === 'ar' ? 'right' : 'left']: `${sliderPos}%`, transform: 'translateX(-50%)' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm">
          <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ImageComparator;
