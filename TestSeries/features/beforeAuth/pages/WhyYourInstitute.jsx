import React from 'react';
import line from '../../../assests/Landing/Demo/line.svg';
import thinking from '../../../assests/Landing/Demo/thinking.svg';

const WhyYourInstitute = () => {
  return (
    <>
    
    
    <div className="relative w-full h-screen overflow-hidden">
      {/* Full-screen Line Image */}
      <img src={line} alt="line img" className='absolute z-10 h-fit w-full' />


      <div className="relative z-10  flex flex-row items-center justify-between w-full h-fit py-38 px-12">

        {/* Left side */}
        <div className="w-1/2 flex justify-center">
          <img src={thinking} alt="thinking man image" className="max-h-screen" />
        </div>

        {/* Right side */}
        <div className="w-1/2">
          <h1 className="text-violet-950 font-bold text-4xl leading-snug">
            Why your institute should register?
          </h1>
          <p className="mt-4 text-violet-900 text-left max-w-md">
            Partnering with us provides your institution with cutting-edge tools designed to enhance
            educational outcomes and streamline administrative processes.
          </p>
          <button className="hover:cursor-pointer bg-violet-800/10 text-xl text-violet-950 border-violet-950 border-2 rounded-lg py-2 px-8 mt-6">
            Schedule demo
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default WhyYourInstitute;
