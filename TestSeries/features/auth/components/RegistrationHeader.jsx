import React from 'react';
import { Check } from 'lucide-react';

const RegistrationHeader = () => {
  return (
    <div className="bg-gradient-to-r from-blue-800 to-blue-600 py-12 md:py-20 px-4">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-6">
            Register Your Institute <span className="text-green-400">Now</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-purple-100 text-center mb-8">
            Join our network of educational excellence and unlock powerful assessment tools 
            <span className="font-bold text-white"> pricing that fits your budget</span>
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 mb-10">
            <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center flex flex-col items-center">
              <div className="bg-green-500 rounded-full p-2 mb-3">
                <Check className="text-white w-5 h-5" />
              </div>
              <h3 className="text-gray-700 font-semibold">Quick Setup</h3>
              <p className="text-gray-500 text-sm">Get started in less than 5 minutes</p>
            </div>
            
            <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center flex flex-col items-center">
              <div className="bg-green-500 rounded-full p-2 mb-3">
                <Check className="text-white w-5 h-5" />
              </div>
              <h3 className="text-gray-700 font-semibold">No Credit Card</h3>
              <p className="text-gray-500 text-sm">Free tier with no payment required</p>
            </div>
            
            <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center flex flex-col items-center">
              <div className="bg-green-500 rounded-full p-2 mb-3">
                <Check className="text-white w-5 h-5" />
              </div>
              <h3 className="text-gray-700 font-semibold">Premium Features</h3>
              <p className="text-gray-500 text-sm">Access core tools immediately</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationHeader;