import { CheckCircle } from 'lucide-react';
import React, { useEffect, useRef, useState, useCallback } from 'react';

const CertificateCard = ({ selectedCard, setSelectedCard, certificateTemplates, slidesToShow, gap = 24 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef(null);
  const containerRef = useRef(null);

  // Calculate slide width
  const getSlideWidth = useCallback(() => {
    if (!containerRef.current) return 300;
    const containerWidth = containerRef.current.offsetWidth;
    return (containerWidth - (gap * (slidesToShow - 1))) / slidesToShow;
  }, [gap, slidesToShow]);

  // Handle mouse/touch start
  const handleStart = useCallback((clientX) => {
    setIsDragging(true);
    setStartX(clientX);
    setScrollLeft(carouselRef.current.scrollLeft);
  }, []);

  // Handle mouse/touch move 
  const handleMove = useCallback((clientX) => {
    if (!isDragging) return;
    const x = clientX;
    const walk = (x - startX) * 2; // scroll speed
    carouselRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  // Handle mouse/touch end 
  const handleEnd = useCallback(() => {
    setIsDragging(false);
    snapToNearestSlide();
  }, []);

  // Snap to nearest slide
  const snapToNearestSlide = useCallback(() => {
    if (!carouselRef.current) return;

    const slideWidth = getSlideWidth() + gap;
    const scrollLeft = carouselRef.current.scrollLeft;
    const newIndex = Math.round(scrollLeft / slideWidth);

    const maxIndex = Math.max(0, certificateTemplates.length - slidesToShow);
    const clampedIndex = Math.max(0, Math.min(newIndex, maxIndex));
    
    setCurrentIndex(clampedIndex);
    
    carouselRef.current.scrollTo({
      left: clampedIndex * slideWidth,
      behavior: 'smooth'
    });
  }, [getSlideWidth, gap, certificateTemplates.length, slidesToShow]);

  // Mouse events
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    handleStart(e.clientX);
  }, [handleStart]);

  const handleMouseMove = useCallback((e) => {
    handleMove(e.clientX);
  }, [handleMove]);

  const handleMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      handleEnd();
    }
  }, [isDragging, handleEnd]);

  // Touch events
  const handleTouchStart = useCallback((e) => {
    handleStart(e.touches[0].clientX);
  }, [handleStart]);

  const handleTouchMove = useCallback((e) => {
    e.preventDefault(); // Prevent scrolling
    handleMove(e.touches[0].clientX);
  }, [handleMove]);

  const handleTouchEnd = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // Add global mouse events when dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Navigate to specific slide
  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
    const slideWidth = getSlideWidth() + gap;
    carouselRef.current?.scrollTo({
      left: index * slideWidth,
      behavior: 'smooth'
    });
  }, [getSlideWidth, gap]);

  const slideWidth = getSlideWidth();

  return (
    <div className="w-full max-w-7xl mx-auto py-4">
      {/* Carousel Container */}
      <div 
        ref={containerRef}
        className="relative overflow-hidden"
      >
        <div
          ref={carouselRef}
          className="flex overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            gap: `${gap}px`
          }}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {certificateTemplates.map((certificate, index) => (
            <div
              key={certificate._id}
              className="flex-shrink-0 select-none"
              style={{ width: `${slideWidth}px` }}
            >
              <button
                onClick={() => !isDragging && setSelectedCard(certificate._id)}
                className={`relative bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full ${
                  selectedCard === certificate._id ? 'border-4 border-indigo-600' : 'border border-gray-200'
                }`}
              >
                {/* Selection Indicator */}
                {selectedCard === certificate._id && (
                  <div className="absolute top-2 right-2 bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center z-10">
                    <CheckCircle size={16} />
                  </div>
                )}
                
                {/* Certificate Image */}
                <img 
                  src={certificate.image} 
                  alt={certificate.name} 
                  className="w-full object-cover pointer-events-none" 
                  draggable={false}
                />
                
                {/* Certificate Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{certificate.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{certificate.description}</p>
                  <span className="inline-block mt-2 text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                    {certificate.style}
                  </span>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: Math.ceil(certificateTemplates.length / slidesToShow) }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-indigo-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Configuration Display */}
      <div className="mt-4 text-center text-sm text-gray-500">
        Showing {slidesToShow} Certificate{slidesToShow > 1 ? 's' : ''} at a time • Swipe to navigate
      </div>
    </div>
  );
};

export default CertificateCard;