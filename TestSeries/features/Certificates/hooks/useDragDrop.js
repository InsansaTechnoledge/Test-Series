import { useState } from 'react';

export const useDragDrop = (elements, setElements) => {
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = (e, elementType) => {
    setDraggedItem(elementType);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, certificateRef) => {
    e.preventDefault();
    if (!draggedItem || !certificateRef.current) return;

    const rect = certificateRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setElements(prev => ({
      ...prev,
      [draggedItem]: {
        ...prev[draggedItem],
        x: Math.max(0, Math.min(x - (prev[draggedItem].width || 0) / 2, rect.width - (prev[draggedItem].width || 200))),
        y: Math.max(0, Math.min(y - (prev[draggedItem].height || 20) / 2, rect.height - (prev[draggedItem].height || 20)))
      }
    }));

    setDraggedItem(null);
  };

  return {
    draggedItem,
    handleDragStart,
    handleDragOver,
    handleDrop
  };
};