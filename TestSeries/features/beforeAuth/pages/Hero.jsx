import React, { useRef, useState } from 'react';
import video from '../../../assests/animation/animation 4.mp4';
import shadow from '../../../assests/animation/Shadow.svg'

const ImageComponent = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
      setIsMuted(video.muted);
    }
  };

  return (
    <div className="mt-12 md:mt-16 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-32">
      <div 
        className="bg-white rounded-2xl md:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden min-h-[60vh] md:min-h-[70vh] border-8 border-gray-300 relative group cursor-pointer"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >

        {/* 🔹 Fullscreen Video */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover shadow-2xl z-0"
          src={video}
          autoPlay
          loop
          muted
          playsInline
        />

        {/* Dark Overlay for Better Control Visibility */}
        <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 z-10 ${showControls ? 'opacity-100' : 'opacity-0'}`} />

        {/* Center Play/Pause Overlay */}
        <div 
          className={`absolute inset-0 flex items-center justify-center z-20 transition-all duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
          onClick={togglePlay}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-6 shadow-2xl hover:bg-white hover:scale-110 transition-all duration-200">
            {isPlaying ? (
              // Pause Icon
              <svg className="w-12 h-12 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            ) : (
              // Play Icon
              <svg className="w-12 h-12 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </div>
        </div>

        {/* Bottom Controls Overlay */}
        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 z-20 transition-all duration-300 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-center justify-between">
            
            {/* Left Side - Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-200 flex items-center space-x-2"
            >
              {isPlaying ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <span>Play</span>
                </>
              )}
            </button>

            {/* Right Side - Mute Button */}
            <button
              onClick={toggleMute}
              className="bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-200 flex items-center space-x-2"
            >
              {isMuted ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                  </svg>
                  <span>Unmute</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                  <span>Mute</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Gradient Hover Overlay (Optional - keeping from original) */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-indigo-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-5" />
      </div>
    </div>
  );
};

const Hero = () => {
  return (
    <div className="min-h-screen mb-24">
      <main className="pt-16 md:pt-20 lg:pt-24">
        
        <div className="px-4 sm:px-6 md:px-8">
        <h1 className="text-center text-2xl  sm:text-3xl md:text-4xl lg:text-5xl xl:text-8xl font-bold text-gray-800 leading-tight max-w-6xl mx-auto">
            Unlock the Future with{' '}
            <span className="relative mt-4 inline-block text-gray-800 px-4 py-2 z-10">
            <img
                    src={shadow}
                    alt="highlight"
                    className="absolute left-0 top-1/2 w-full h-auto pointer-events-none transform -translate-y-1/2"
                    style={{ 
                      zIndex: -10,
                      opacity: 1.7,
                      filter: 'blur(1px)'
                    }}
                  />
              Evalvo Tech
            </span>
          </h1>

          
          <div className="mt-12 md:px-22 md:mt-12 space-y-2 md:space-y-3">
            <p className="text-center text-xl sm:text-2xl md:text-3xl lg:text-3xl text-gray-600 font-light">
              A comprehensive platform for analytics, testing, coding, and seamless learning.
            </p>
            <p className="text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-600 font-light">
              Empower your students, staff, and teams with{' '}
              <span className="text-blue-600 font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text ">
                instant results, hands-on coding events, and actionable insights.
              </span>
            </p>
          </div>
          

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 md:mt-12 mb-8">
            <button disabled className="w-full cursor-not-allowed sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
              Start Free Trial
            </button>
            <button disabled className="w-full cursor-not-allowed sm:w-auto px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200">
              Request a Demo
            </button>
          </div>

          <ImageComponent/>
        </div>
      </main>
    </div>
  );
};

export default Hero;