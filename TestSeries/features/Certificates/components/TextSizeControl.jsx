// Option 1: Individual controls for each text element
import React from 'react';

const TextSizeControls = ({ 
  titleSize, 
  recipientSize, 
  courseSize, 
  dateSize,
  onTitleSizeChange,
  onRecipientSizeChange,
  onCourseSizeChange,
  onDateSizeChange
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Text Size Controls</h3>
      
      {/* Title Size */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Title Size:</label>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onTitleSizeChange(Math.max(16, titleSize - 2))}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            -
          </button>
          <span className="w-8 text-center text-sm">{titleSize}</span>
          <button 
            onClick={() => onTitleSizeChange(Math.min(48, titleSize + 2))}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            +
          </button>
        </div>
      </div>

      {/* Recipient Size */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Recipient Size:</label>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onRecipientSizeChange(Math.max(12, recipientSize - 2))}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            -
          </button>
          <span className="w-8 text-center text-sm">{recipientSize}</span>
          <button 
            onClick={() => onRecipientSizeChange(Math.min(36, recipientSize + 2))}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            +
          </button>
        </div>
      </div>

      {/* Course Size */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Course Size:</label>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onCourseSizeChange(Math.max(10, courseSize - 2))}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            -
          </button>
          <span className="w-8 text-center text-sm">{courseSize}</span>
          <button 
            onClick={() => onCourseSizeChange(Math.min(32, courseSize + 2))}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            +
          </button>
        </div>
      </div>

      {/* Date Size */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Date Size:</label>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onDateSizeChange(Math.max(10, dateSize - 2))}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            -
          </button>
          <span className="w-8 text-center text-sm">{dateSize}</span>
          <button 
            onClick={() => onDateSizeChange(Math.min(28, dateSize + 2))}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

// Option 2: Slider-based controls
const TextSizeSliders = ({ 
  titleSize, 
  recipientSize, 
  courseSize, 
  dateSize,
  onTitleSizeChange,
  onRecipientSizeChange,
  onCourseSizeChange,
  onDateSizeChange
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Text Size Controls</h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">
            Title Size: {titleSize}px
          </label>
          <input
            type="range"
            min="16"
            max="48"
            value={titleSize}
            onChange={(e) => onTitleSizeChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Recipient Size: {recipientSize}px
          </label>
          <input
            type="range"
            min="12"
            max="36"
            value={recipientSize}
            onChange={(e) => onRecipientSizeChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Course Size: {courseSize}px
          </label>
          <input
            type="range"
            min="10"
            max="32"
            value={courseSize}
            onChange={(e) => onCourseSizeChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Date Size: {dateSize}px
          </label>
          <input
            type="range"
            min="10"
            max="28"
            value={dateSize}
            onChange={(e) => onDateSizeChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

// Option 3: Global size control with multiplier
const GlobalTextSizeControl = ({ 
  globalScale, 
  onGlobalScaleChange 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Text Size</h3>
      
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Overall Text Size:</label>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onGlobalScaleChange(Math.max(0.5, globalScale - 0.1))}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Smaller
          </button>
          <span className="w-12 text-center text-sm">
            {Math.round(globalScale * 100)}%
          </span>
          <button 
            onClick={() => onGlobalScaleChange(Math.min(2, globalScale + 0.1))}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Larger
          </button>
        </div>
      </div>

      <div>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={globalScale}
          onChange={(e) => onGlobalScaleChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
};

export { TextSizeControls, TextSizeSliders, GlobalTextSizeControl };