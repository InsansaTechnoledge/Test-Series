import React from 'react';
import line from '../../../assests/Landing/Demo/line.svg';
import thinking from '../../../assests/Landing/Demo/thinking.svg';

const WhyYourInstitute = () => {
  return (
    <div className='relative'>


      <div className="group relative py-20 px-5 sm:px-10 md:px-20 lg:px-20 xl:px-20 bg-[#E4E5FF]">
  {/* Main Content */}
  <div className="relative z-10 flex justify-center px-12">
    <div className="grid grid-cols-1 lg:grid-cols-3 items-center">
      
      {/* Image that rotates on button hover */}
      <div className="flex justify-center transition-transform duration-500 group-hover:rotate-12">
        <img
          src={thinking}
          alt="thinking man image"
          className="max-h-[500px]"
        />
      </div>
      
      {/* Text and button */}
      <div className="lg:col-span-2 my-auto">
        <h1 className="text-violet-950 font-bold text-5xl leading-snug">
          Why your institute should register?
        </h1>
        <p className="mt-4 text-xl text-violet-900 text-left">
          Partnering with us provides your institution with cutting-edge tools
          designed to enhance educational outcomes and streamline administrative processes.
        </p>

        {/* Group hover for button */}
        <div className="group/button inline-block mt-6">
          <button className="hover:cursor-pointer hover:text-white hover:bg-violet-950 hover:scale-105 transition duration-300 bg-violet-800/10 text-xl text-violet-950 border-violet-950 border-2 rounded-lg py-2 px-8">
            Schedule demo
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

      <svg className="absolute w-full h-fit scale-y-[-1]" preserveAspectRatio="none" viewBox="0 0 1440 74" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,37 C240,74 480,0 720,37 C960,74 1200,0 1440,37 L1440 74 L0 74 Z" fill="#E4E5FF" />
      </svg>
    </div>
  );
};

export default WhyYourInstitute;
