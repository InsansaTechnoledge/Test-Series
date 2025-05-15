import { Check } from 'lucide-react';
import React from 'react'

const LoginHeader = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-800 to-indigo-600 py-12 md:py-20 px-4">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-6">
            Login Your Institute <span className="text-yellow-300">Now</span>
          </h1>
          
          {/* <p className="text-xl md:text-2xl text-indigo-100 text-center mb-8">
            Join our network of educational excellence and unlock powerful assessment tools 
            <span className="font-bold text-white"> pricing that fits your budget</span>
          </p>
           */}
          
          
          
        </div>
      </div>
    </div>
  );
}

export default LoginHeader