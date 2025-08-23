import { Pen, PenBoxIcon } from 'lucide-react';
import React from 'react';

const HeadingUtil = ({ heading, description }) => {
  return (
    <div className="text-center mb-12">
      <h1 className={` ${heading === 'Exam Security' ? 'text-3xl md:text-4xl' : 'text-6xl md:text-5xl'} py-3 font-bold bg-gray-600 bg-clip-text text-transparent`}>
        {heading}
      </h1>
      {description && (
        <p className="text-gray-600 mt-3">{description}</p>
      )}
      {
        heading !== 'Exam Security' && 
          <div className="border-b-6 border-indigo-400 max-w-3xs mt-4 mx-auto"></div>
      }
</div>
  );
};

export default HeadingUtil;
