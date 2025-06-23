

import React from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RegistrationHeader = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate('/')
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-gray-800 py-16 md:py-24 px-4 relative">
      <div className="container mx-auto">
        <div className="max-w-5xl mx-auto text-center">
          
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
            Register Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
              Institute
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-16 max-w-3xl mx-auto leading-relaxed">
            Join our network of educational excellence and unlock powerful assessment tools with 
            <span className="text-white font-semibold"> flexible pricing</span>
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-3">Quick Setup</h3>
              <p className="text-gray-300 text-lg">Get started in less than 5 minutes with our streamlined process</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-3">No Credit Card</h3>
              <p className="text-gray-300 text-lg">Free tier available with no payment required upfront</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-3">Premium Access</h3>
              <p className="text-gray-300 text-lg">Unlock core assessment tools immediately after signup</p>
            </div>
          </div>

          <button 
            className='inline-flex items-center text-white border-2 border-white/30 bg-white/5 backdrop-blur-sm px-8 py-4 rounded-xl hover:bg-white/10 hover:border-white/50 transition-all duration-300 text-lg font-medium' 
            onClick={handleBack}
          >
            <ArrowLeft className='mr-3 h-5 w-5'/>
            Back to Home
          </button>

          {/* Scroll Down Indicator */}
          <div className="flex flex-col items-center mt-8">
            <span className="text-white/60 text-sm mb-2 font-medium">Scroll Down</span>
            <div className="animate-bounce">
              <ChevronDown className="h-6 w-6 text-white/60" />
            </div>
          </div>
        </div>  
      </div>
    </div>
  );
};

export default RegistrationHeader;