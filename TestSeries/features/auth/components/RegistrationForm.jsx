import React from 'react';
import RegistrationFormLeft from './RegistrationFormLeft';
import RegistrationFormRight from './RegistrationFormRight';

const RegistrationForm = () => {
  return (
    <div id="registration-form" className="py-12 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start mb-10">
          <RegistrationFormLeft />
          <RegistrationFormRight />
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;