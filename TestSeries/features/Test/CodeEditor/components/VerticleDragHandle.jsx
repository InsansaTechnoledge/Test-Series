import React from 'react';
import { GripVertical } from 'lucide-react';

const VerticalDragHandle = ({ onMouseDown, isResizing }) => (
  <div
    role="separator"
    aria-orientation="vertical"
    aria-valuenow={isResizing ? 1 : 0}
    onMouseDown={onMouseDown || undefined}
    tabIndex={0}
    onKeyDown={(e) => {
      if ((e.key === 'Enter' || e.key === ' ') && onMouseDown) onMouseDown(e);
    }}
    className={`w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize relative group ${isResizing ? 'bg-blue-500' : ''}`}
  >
    <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
      <GripVertical className="w-4 h-4 text-gray-600" />
    </div>
  </div>
);

export default VerticalDragHandle;
