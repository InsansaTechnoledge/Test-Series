import React from 'react';
import RenderSoftwareCapability from '../components/RenderSoftwareCapability';

const SoftwareCapabilities = ({ leftCapabilities, rightCapabilities, benefits }) => {
  return (
    <div className="relative overflow-hidden py-6 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Software Capabilities Section */}
      <div className=" rounded-2xl p-4 sm:p-8 mb-10 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-950 text-center mb-8 sm:mb-12 max-w-3xl mx-auto leading-tight">
          What are the smart capabilities of the software?
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {leftCapabilities.map((capability, idx) => (
              <RenderSoftwareCapability 
                capability={capability} 
                idx={idx} 
                key={`left-capability-${idx}`} 
              />
            ))}
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            {rightCapabilities.map((capability, idx) => (
              <RenderSoftwareCapability 
                capability={capability} 
                idx={idx} 
                key={`right-capability-${idx}`} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="mb-10 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-indigo-900 text-center mb-8 sm:mb-12 max-w-3xl mx-auto leading-tight">
          With ExamOnline you can enjoy a range of benefits
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, idx) => (
            <div 
              key={`benefit-${idx}`}
              className="group h-full transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="h-full flex flex-col bg-indigo-50 border-2 border-indigo-900 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                {/* Benefit Header */}
                <div className="p-4 sm:p-6 border-b-2 border-indigo-900/20">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="p-2 sm:p-3 bg-indigo-100 border-2 border-indigo-900 rounded-lg flex-shrink-0 flex items-center justify-center transition-all duration-300 group-hover:bg-indigo-200">
                      <benefit.icon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-900" />
                    </div>
                    <h3 className="font-bold text-base sm:text-lg text-indigo-900">
                      {benefit.title}
                    </h3>
                  </div>
                </div>
                
                {/* Benefit Description */}
                <div className="p-4 sm:p-6 flex-grow">
                  <p className="text-sm sm:text-base text-indigo-900/80">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default SoftwareCapabilities;