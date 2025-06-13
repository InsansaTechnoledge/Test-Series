import React from 'react';
import { Award, Users } from 'lucide-react';

const DecorativeElements = ({ certificateType, borderColor, accentColor }) => {
  return (
    <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
      <div className="flex items-center space-x-4">
        <div className="w-32 h-px" style={{ backgroundColor: borderColor }}></div>
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: accentColor }}>
          {certificateType === 'merit' ? (
            <Award className="w-4 h-4 text-white" />
          ) : (
            <Users className="w-4 h-4 text-white" />
          )}
        </div>
        <div className="w-32 h-px" style={{ backgroundColor: borderColor }}></div>
      </div>
    </div>
  );
};

export default DecorativeElements;