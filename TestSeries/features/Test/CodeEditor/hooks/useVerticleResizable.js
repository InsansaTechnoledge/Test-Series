import { useState, useCallback, useEffect } from 'react';

export const useVerticalResizable = (initialHeight, minHeight = 100, maxHeight = 600) => {
  const [height, setHeight] = useState(initialHeight);
  const [isResizing, setIsResizing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);

  const startResize = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    
    setIsResizing(true);
    setStartY(clientY);
    setStartHeight(height);
    
    // Add classes to body to prevent text selection during resize
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'row-resize';
  }, [height]);

  const handleMouseMove = useCallback((e) => {
    if (!isResizing) return;
    
    e.preventDefault();
    
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    const deltaY = startY - clientY; // Inverted because we want dragging up to increase height
    const newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight + deltaY));
    
    setHeight(newHeight);
  }, [isResizing, startY, startHeight, minHeight, maxHeight]);

  const handleMouseUp = useCallback(() => {
    if (!isResizing) return;
    
    setIsResizing(false);
    
    // Remove body styles
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  }, [isResizing]);

  // Effect to handle mouse events
  useEffect(() => {
    if (isResizing) {
      const handleMouseMoveWrapper = (e) => handleMouseMove(e);
      const handleMouseUpWrapper = () => handleMouseUp();
      const handleTouchMoveWrapper = (e) => handleMouseMove(e);
      const handleTouchEndWrapper = () => handleMouseUp();

      document.addEventListener('mousemove', handleMouseMoveWrapper);
      document.addEventListener('mouseup', handleMouseUpWrapper);
      document.addEventListener('touchmove', handleTouchMoveWrapper, { passive: false });
      document.addEventListener('touchend', handleTouchEndWrapper);

      return () => {
        document.removeEventListener('mousemove', handleMouseMoveWrapper);
        document.removeEventListener('mouseup', handleMouseUpWrapper);
        document.removeEventListener('touchmove', handleTouchMoveWrapper);
        document.removeEventListener('touchend', handleTouchEndWrapper);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return {
    height,
    isResizing,
    startResize,
    setHeight
  };
};