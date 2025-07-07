import React, { useState, useEffect } from 'react';
import logo from '../../assests/Footer/evalvo logo white 4.svg';
import { useTheme } from '../../hooks/useTheme';

const LoadingTest = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [showDelayMessages, setShowDelayMessages] = useState(false);

  const messages = [
    "Initializing test environment...",
    "Loading your examination questions...",
    "Setting up secure proctor monitoring...",
    "Verifying test configuration...",
    "Preparing assessment interface...",
    "Test ready, launching in a moment..."
  ];
  const {theme} = useTheme()

  useEffect(() => {
    // Show delay messages after 3 seconds
    const delayTimer = setTimeout(() => {
      setShowDelayMessages(true);
    }, 3000);

    // Rotate messages every 2.5 seconds after delay messages start
    let messageTimer;
    if (showDelayMessages) {
      messageTimer = setInterval(() => {
        setMessageIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          // Stop at the last message
          if (nextIndex >= messages.length - 1) {
            clearInterval(messageTimer);
            return messages.length - 1;
          }
          return nextIndex;
        });
      }, 2500);
    }

    return () => {
      clearTimeout(delayTimer);
      if (messageTimer) clearInterval(messageTimer);
    };
  }, [showDelayMessages, messages.length]);

  return (
    <div className={`min-h-screen w-full flex justify-center items-center backdrop-blur-2xl overflow-hidden ${
      theme === 'light' 
        ? 'bg-gradient-to-br from-indigo-600 to-purple-700' 
        : 'bg-gradient-to-br from-gray-900 to-indigo-900'
    }`}>
      <div className='flex flex-col items-center justify-center p-4'>
        {/* Logo with test-specific animation */}
        <div className="relative">
          {/* Outer examination ring */}
          {/* <div className={`absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 rounded-full border-4 border-transparent ${
            theme === 'light' 
              ? 'border-t-white/60 border-r-white/40' 
              : 'border-t-indigo-400/60 border-r-purple-400/40'
          } animate-spin`} style={{ animationDuration: '2s' }}></div>
           */}
          {/* Inner pulse ring for test security */}
          {/* <div className={`absolute inset-2 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-full border-2 border-transparent ${
            theme === 'light' 
              ? 'border-white/30' 
              : 'border-indigo-300/30'
          } animate-pulse`}></div> */}
          
          {/* Logo */}
          <img 
            src={logo}
            alt="evalvo_test_loader"
            className='animate-ping w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 object-contain relative z-10'
          />
        </div>

        {/* Test Assessment Badge */}
        <div className={`mt-4 px-4 py-2 rounded-full flex items-center gap-2 ${
          theme === 'light' 
            ? 'bg-white/20 backdrop-blur-sm border border-white/30' 
            : 'bg-indigo-800/30 backdrop-blur-sm border border-indigo-400/30'
        } animate-pulse`}>
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
          </svg>
          <span className="text-white text-sm font-medium">SECURE TEST</span>
        </div>
        
        {/* Loading message */}
        <p className='text-white text-sm sm:text-base md:text-lg font-medium mt-6 animate-pulse text-center min-h-[1.5rem] sm:min-h-[2rem] max-w-sm'>
          {showDelayMessages ? messages[messageIndex] : messages[0]}
        </p>
        
        {/* Animated test dots */}
        {showDelayMessages && (
          <div className='flex space-x-1 mt-3'>
            <div className='w-2 h-2 bg-white rounded-full animate-bounce' style={{ animationDelay: '0ms' }}></div>
            <div className='w-2 h-2 bg-white rounded-full animate-bounce' style={{ animationDelay: '150ms' }}></div>
            <div className='w-2 h-2 bg-white rounded-full animate-bounce' style={{ animationDelay: '300ms' }}></div>
          </div>
        )}

        {/* Test preparation progress */}
        <div className={`mt-6 w-72 h-2 rounded-full overflow-hidden ${
          theme === 'light' 
            ? 'bg-white/20' 
            : 'bg-indigo-800/30'
        }`}>
          <div className="h-full bg-gradient-to-r from-white to-white/80 rounded-full animate-pulse" style={{width: '100%'}}></div>
        </div>

        {/* Test setup checklist */}
        <div className="mt-6 space-y-2">
          {[
            { text: '🔒 Secure environment activated', completed: true },
            { text: '📝 Test questions loaded', completed: true },
            { text: '👁️ Proctor monitoring enabled', completed: showDelayMessages },
            { text: '✅ Ready to begin assessment', completed: messageIndex >= messages.length - 1 }
          ].map((step, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full flex items-center justify-center transition-all duration-300 ${
                step.completed 
                  ? 'bg-green-400 scale-100' 
                  : 'bg-white/30 scale-75'
              }`}>
                {step.completed && (
                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                )}
              </div>
              <span className={`text-sm transition-all duration-300 ${
                step.completed ? 'text-white' : 'text-white/60'
              }`}>
                {step.text}
              </span>
            </div>
          ))}
        </div>

        {/* Security notice */}
        <div className={`mt-6 p-3 rounded-lg text-center max-w-md ${
          theme === 'light' 
            ? 'bg-white/10 border border-white/20' 
            : 'bg-indigo-800/20 border border-indigo-400/20'
        }`}>
          <p className="text-white/80 text-xs">
            🛡️ This is a monitored examination environment. 
            Please ensure you're in a quiet, well-lit space before proceeding.
          </p>
        </div>

        {/* Floating security particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/15 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${4 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Custom CSS for float animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
          50% { transform: translateY(-15px) rotate(180deg); opacity: 0.2; }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingTest;