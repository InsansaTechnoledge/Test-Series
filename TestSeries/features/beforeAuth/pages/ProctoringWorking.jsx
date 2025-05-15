import React from 'react';
import thinking from '../../../assests/Landing/ProctorWorking/thinking.svg';
import line from '../../../assests/Landing/ProctorWorking/line.svg';

const ProctoringWorking = () => {
  return (
    <div className="relative flex justify-center  py-20 px-6">

        {/* <img
          src={line}
          alt="decorative line"
          className="absolute top-0 right-0 w-200 "
          /> */}

      {/* Main content box */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 items-center w-10/12 rounded-xl p-8 ">
      {/* line */}
        

        {/* Left: Image */}
        <div className="flex justify-center">
          <img src={thinking} alt="AI Thinking" className="w-80" />
        </div>

        {/* Right: Text */}
        <div className='z-10'>
          <h1 className="text-violet-950 text-5xl md:text-5xl font-bold leading-snug w-10/12">
            How does AI proctoring work?
          </h1>

          <p className='py-2 text-violet-800 text-2xl '>
            Our AI-based proctoring will serve you as a trained proct or during a
            virtual exam without invading the personal space of the test-takers.
          </p>

          <p className='py-2 text-violet-800 text-2xl'>
            Throughout the assessment , the adaptive software will automatically
            analyze the video stream from the student's web cam, screen and
            microphone to determine whether there was cheating or not.
          </p>

          <p className='py-2 text-violet-800 text-2xl'>
            The response time to cheating is normally several seconds, in order to
            exclude the chance of accidental movements or voices.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProctoringWorking;
