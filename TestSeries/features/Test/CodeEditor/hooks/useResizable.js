import { useCallback, useEffect, useRef, useState } from 'react';

export const useResizable = (initialWidth = 50, minWidth = 20, maxWidth = 80) => {
  const [width, setWidth] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef(null);

  const startResize = useCallback((e) => {
    setIsResizing(true);
    e.preventDefault();
  }, []);

  const stopResize = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (e) => {
      if (!isResizing || !containerRef.current) return;

      const container = containerRef.current.parentElement;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

      if (!isNaN(newWidth) && newWidth >= minWidth && newWidth <= maxWidth) {
        setWidth(newWidth);
      }
    },
    [isResizing, minWidth, maxWidth]
  );

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', resize);
      document.addEventListener('mouseup', stopResize);
      document.addEventListener('mouseleave', stopResize);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResize);
      document.removeEventListener('mouseleave', stopResize);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, resize, stopResize]);

  return { width, containerRef, startResize, isResizing };
};
