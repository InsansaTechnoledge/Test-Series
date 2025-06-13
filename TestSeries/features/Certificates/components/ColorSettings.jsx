import React from 'react';
import { Palette } from 'lucide-react';

const ColorSettings = ({ 
  backgroundColor, 
  borderColor, 
  textColor, 
  accentColor,
  setBackgroundColor,
  setBorderColor,
  setTextColor,
  setAccentColor
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <Palette className="w-4 h-4" />
        Colors
      </h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Background</label>
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="w-full h-10 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Border</label>
          <input
            type="color"
            value={borderColor}
            onChange={(e) => setBorderColor(e.target.value)}
            className="w-full h-10 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Text</label>
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="w-full h-10 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Accent</label>
          <input
            type="color"
            value={accentColor}
            onChange={(e) => setAccentColor(e.target.value)}
            className="w-full h-10 border rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default ColorSettings;