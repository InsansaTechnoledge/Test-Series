import React from 'react';
import { Building, Check } from 'lucide-react';

const RegistrationFormLeft = () => {
  return (
    <div className="md:w-1/3 mb-6 md:mb-0 md:pr-12">
      <div className="sticky top-8">
        <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <Building size={32} />
        </div>
        <h2 className="text-3xl font-bold text-blue-900 mb-4">Register Your Institute</h2>
        <p className="text-gray-600 mb-6">Complete the form to join our network of educational excellence and unlock powerful assessment tools.</p>

        <div className="bg-blue-100 rounded-lg p-5 border-l-4 border-blue-600">
          <h4 className="font-bold text-blue-800 mb-2">Why Register?</h4>
          <ul className="space-y-2">
            <li className="flex items-center text-sm text-gray-700">
              <Check size={16} className="text-blue-600 mr-2 flex-shrink-0" />
              <span>Streamlined assessment creation</span>
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <Check size={16} className="text-blue-600 mr-2 flex-shrink-0" />
              <span>Comprehensive analytics platform</span>
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <Check size={16} className="text-blue-600 mr-2 flex-shrink-0" />
              <span>Real-time testing capabilities</span>
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <Check size={16} className="text-blue-600 mr-2 flex-shrink-0" />
              <span>Student data management tools</span>
            </li>
          </ul>

         
        </div>
      </div>
    </div>
  );
};

export default RegistrationFormLeft;