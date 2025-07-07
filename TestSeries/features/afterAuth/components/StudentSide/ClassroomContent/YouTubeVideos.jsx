import React, { useState } from 'react';
import { Play, FileText } from 'lucide-react';
import { useTheme } from '../../../../../hooks/useTheme';
import { useNavigate } from 'react-router-dom';

const YouTubeVideos = () => {

    const {theme} = useTheme();
    const navigate = useNavigate();

  return (
    <div className={`rounded-4xl overflow-hidden relative transition-colors duration-500 ${theme === 'light' ? 'bg-indigo-600' : 'bg-indigo-400'} text-white`}>
      <div className="relative z-10 container mx-auto px-6 py-16">
        
        {/* Heading Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 drop-shadow-md">
            Your Batch Content Hub
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Access all your batch videos in one place. Learn at your own pace with our comprehensive video library designed for your success.
          </p>  
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center mb-10">
          <div className={`flex space-x-4 p-2 rounded-2xl border border-white/20 backdrop-blur-md ${theme === 'light' ? 'bg-indigo-400' : 'bg-indigo-600'}`}>
            <button 
              className="flex items-center gap-3 px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-medium transition-all duration-300 ease-in-out text-gray-200 hover:text-white hover:bg-white/10"
              onClick={() => {
                // Replace with your actual navigation logic
                navigate('/student/classroom')
                console.log("Navigate to videos");
              }}
            >
              <Play className="w-5 h-5" />
              <span>Videos</span>
            </button>
            <button 
              className="flex items-center gap-3 px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-medium transition-all duration-300 ease-in-out text-gray-200 hover:text-white hover:bg-white/10"
              onClick={() => {
                // Replace with your actual navigation logic
                console.log("Navigate to notes");
              }}
            >
              <FileText className="w-5 h-5" />
              <span>Notes</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default YouTubeVideos;
