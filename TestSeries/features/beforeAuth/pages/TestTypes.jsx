import React from 'react';
import { CheckCircle } from 'lucide-react';
import laptop from '../../../assests/Landing/TestTypes/laptop.svg'
const types = [
  "MCQs",
  "MSQ",
  "Fill In The Blanks",
  "Matching Type",
  "True/False",
  "Comprehension",
  "Number Type",
  "Code Compiler"
];

const TestTypes = () => {
  return (
    <div className="relative py-12 md:py-20 px-4 md:px-12 lg:px-24 overflow-hidden">
      
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-transparent z-0 transform -skew-y-3"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left content */}
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            <h1 className="text-indigo-900 text-3xl md:text-4xl font-bold leading-snug">
              Our Platform offers Different Types of Tests
            </h1>
            
            <h2 className="text-indigo-700 font-semibold text-lg md:text-xl leading-snug mt-4 md:mt-8">
              Boost your exam preparation with Test Series for Banking, SSC, RRB &
              All other Govt. Exams.
            </h2>
            
            <div className="mt-8 md:mt-10 rounded-xl bg-indigo-50 shadow-lg transform transition-all duration-300 hover:scale-105 border border-indigo-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-6">
                {types.map((type, idx) => (
                  <div key={idx}
                    className="flex items-center space-x-3 p-2 hover:bg-indigo-100 rounded-lg transition-colors duration-200">
                    <CheckCircle className="text-indigo-600 h-5 w-5" />
                    <span className="font-medium text-indigo-900">
                      {type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right content - Laptop image */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2 flex justify-center lg:justify-end">
            <img src={laptop} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestTypes;