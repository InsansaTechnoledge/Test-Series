import React from 'react';
import { GripHorizontal } from 'lucide-react';

const HorizontalDragHandle = ({ onMouseDown, isResizing }) => (
  <div
    role="separator"
    aria-orientation="horizontal"
    aria-valuenow={isResizing ? 1 : 0}
    onMouseDown={onMouseDown || undefined}
    tabIndex={0}
    onKeyDown={(e) => {
      if ((e.key === 'Enter' || e.key === ' ') && onMouseDown) onMouseDown(e);
    }}
    className={`h-1 bg-gray-300  mb-4hover:bg-blue-500 cursor-row-resize relative group ${isResizing ? 'bg-blue-500' : ''}`}
  >
    <div className="absolute inset-x-0 -top-1 -bottom-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
      <GripHorizontal className="w-4 h-4 text-gray-600" />
    </div>
  </div>
);

export default HorizontalDragHandle;
