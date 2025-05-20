import React from 'react';
import line from '../../../assests/Landing/Demo/line.svg';
import thinking from '../../../assests/Landing/Demo/thinking2.png';

const WhyYourInstitute = () => {
  return (
    <div className='relative'>


      <div className="group relative py-20 px-5 sm:px-10 md:px-20 lg:px-20 xl:px-20 bg-white">
         {/* Main Content */}
        <div className="relative z-10 flex justify-center px-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 items-center">
            
            <div className="flex justify-center transition-transform duration-500 ">
                <img
                src={thinking}
                alt="thinking man image"
                className="max-h-[500px]"
                />
            </div>
            
            <div className="lg:col-span-2 my-auto">
                <h1 className="text-gray-950 font-bold text-5xl leading-snug">
                Why your institute should register?
                </h1>
                <p className="mt-4 text-xl text-gray-950 text-left">
                Partnering with us provides your institution with cutting-edge tools
                designed to enhance educational outcomes and streamline administrative processes.
                </p>

        
                <div className="group/button inline-block mt-6">
                <button className="hover:cursor-pointer hover:text-white hover:bg-blue-950 hover:scale-105 transition duration-300 bg-blue-700/10 text-xl text-blue-950 border-blue-950 border-2 rounded-lg py-2 px-8">
                    Schedule demo
                </button>
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
  );
};

export default WhyYourInstitute;
