import React from 'react';
import { ArrowRight, Check, Shield, Clock, BookOpen } from 'lucide-react';
import plane from '../../../assests/Landing/Hero/planeButton.svg';
import rings from '../../../assests/Landing/Hero/rings.svg';
import mirrorBg from '../../../assests/Landing/Hero/mirrorBg.svg';

const HeroSection = () => {
  const features = [
    { text: "Secure exam environment", icon: Shield },
    { text: "Real-time monitoring", icon: Clock },
    { text: "Comprehensive assessment tools", icon: BookOpen }
  ];

  return (
    <div className="relative 
    bg-[linear-gradient(to_right,_#0c0077,_#2C2AB7,_#1F26F9,_#4B64F1,_#6C87DE,_#CCDDFF)] 
    overflow-hidden">
      <img
        src={rings}
        alt='rings'
        className='h-full absolute top-14 left-0' />
      <div className="container mx-30 py-18 md:py-24 px-4 md:px-8 lg:px-12 relative">

        <div className="grid lg:grid-cols-2 items-center">
          {/* Left content - Text area */}
          <div className="z-10 ">

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Transform your <span className="text-indigo-300 relative">
                examination
                <svg className="absolute bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0,3 C50,0 150,6 200,3" stroke="white" strokeWidth="4" fill="none" />
                </svg>
              </span> process
            </h1>

            <p className="text-lg text-indigo-100 mb-8 max-w-lg">
              Our comprehensive platform helps educational institutions create, administer, and analyze assessments with powerful tools and actionable insights.
            </p>

            {/* Feature points */}
            {/* <div className="mb-8 space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  
                  <span className="text-indigo-100">{feature.text}</span>
                </div>
              ))}
            </div> */}

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-4xl font-medium text-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center">
                Get Registered
                {/* <ArrowRight className="ml-2 w-5 h-5" /> */}
                <img src={plane} alt="" className='ml-2 w-5 h-5' />
              </button>

            </div>


          </div>

          {/* Right content - Image area */}
          <div className="relative">
            <div>
              <img
                src={mirrorBg}
                alt='mirror bg'
                className='' />
            </div>
            <div className="mt-5 ml-14">
              <p className="text-md text-gray-200 mb-4">Trusted by leading institutions</p>
              <div className="flex flex-wrap gap-8 items-center">
                <UniversityLogo name="Stanford" />
                <UniversityLogo name="Harvard" />
                <UniversityLogo name="MIT" />
                <UniversityLogo name="Oxford" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wavy divider */}
      <div className="relative h-16 mt-8">
        <svg className="absolute bottom-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 74" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,37 C240,74 480,0 720,37 C960,74 1200,0 1440,37 L1440 74 L0 74 Z" fill="#dbeafe" />
        </svg>
      </div>
    </div>
  );
};


const UniversityLogo = ({ name }) => (
  <div className="font-bold text-white text-lg">{name}</div>
);

export default HeroSection;

