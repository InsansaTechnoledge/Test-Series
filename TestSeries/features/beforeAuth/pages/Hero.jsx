import React from 'react';
import { ArrowRight, Check, Shield, Clock, BookOpen } from 'lucide-react';

const HeroSection = () => {
  const features = [
    { text: "Secure exam environment", icon: Shield },
    { text: "Real-time monitoring", icon: Clock },
    { text: "Comprehensive assessment tools", icon: BookOpen }
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-indigo-50 overflow-hidden">
      <div className="container mx-auto py-16 md:py-24 px-4 md:px-8 lg:px-12 relative">

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content - Text area */}
          <div className="z-10">
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-indigo-900 leading-tight mb-6">
              Transform your <span className="text-indigo-600 relative">
                examination
                <svg className="absolute bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0,3 C50,0 150,6 200,3" stroke="#818cf8" strokeWidth="4" fill="none" />
                </svg>
              </span> process
            </h1>
            
            <p className="text-lg text-indigo-700 mb-8 max-w-lg">
              Our comprehensive platform helps educational institutions create, administer, and analyze assessments with powerful tools and actionable insights.
            </p>
            
            {/* Feature points */}
            <div className="mb-8 space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <div className="bg-indigo-100 p-1 rounded-full mr-3">
                    <feature.icon className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="text-indigo-800">{feature.text}</span>
                </div>
              ))}
            </div>
            
            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-6 py-3 font-medium text-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center">
                Get Registered
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
             
            </div>
            
            <div className="mt-10">
              <p className="text-sm text-gray-500 mb-4">Trusted by leading institutions</p>
              <div className="flex flex-wrap gap-8 items-center opacity-70">
                <UniversityLogo name="Stanford" />
                <UniversityLogo name="Harvard" />
                <UniversityLogo name="MIT" />
                <UniversityLogo name="Oxford" />
              </div>
            </div>
          </div>

          {/* Right content - Image area */}
          <div className="relative">
           
           
          </div>
        </div>
      </div>
      
      {/* Wavy divider */}
      <div className="relative h-16 mt-8">
        <svg className="absolute bottom-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 74" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,37 C240,74 480,0 720,37 C960,74 1200,0 1440,37 L1440 74 L0 74 Z" fill="#E4E5FF"/>
        </svg>
      </div>
    </div>
  );
};


const UniversityLogo = ({ name }) => (
  <div className="font-bold text-gray-400 text-lg">{name}</div>
);

export default HeroSection;

