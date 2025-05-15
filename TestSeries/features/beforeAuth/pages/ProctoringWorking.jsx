import React from 'react';
import thinking from '../../../assests/Landing/ProctorWorking/thinking.svg';
import line from '../../../assests/Landing/ProctorWorking/line.svg';

const ProctoringWorking = () => {
  return (
    <div className="relative flex justify-center w-full py-10 md:py-16 lg:py-20 px-4 sm:px-6">
      {/* Decorative line - responsive positioning */}
      {/* <img
        src={line}
        alt="decorative line"
        className="absolute top-0 right-0 w-200 "
      /> */}

      {/* Main content box */}
      <div className="relative w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center rounded-xl p-4 sm:p-6 md:p-8">
        {/* Left: Image - responsive size and order */}
        <div className="flex justify-center order-2 lg:order-1">
          <img 
            src={thinking} 
            alt="AI Thinking" 
            className="w-full max-w-xs sm:max-w-sm md:max-w-md" 
          />
        </div>

        {/* Right: Text - responsive text and padding */}
        <div className="z-10 order-1 lg:order-2">
          <h1 className="text-violet-950 text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            How does AI proctoring work?
          </h1>

          <p className="py-2 mt-4 text-violet-800 text-lg sm:text-xl md:text-2xl">
            Our AI-based proctoring will serve you as a trained proctor during a
            virtual exam without invading the personal space of the test-takers.
          </p>

          <p className="py-2 text-violet-800 text-lg sm:text-xl md:text-2xl">
            Throughout the assessment, the adaptive software will automatically
            analyze the video stream from the student's webcam, screen and
            microphone to determine whether there was cheating or not.
          </p>

          <p className="py-2 text-violet-800 text-lg sm:text-xl md:text-2xl">
            The response time to cheating is normally several seconds, in order to
            exclude the chance of accidental movements or voices.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProctoringWorking;