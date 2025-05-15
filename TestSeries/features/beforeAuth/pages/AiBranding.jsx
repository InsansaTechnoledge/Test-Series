import React from 'react';
import aiImage from '../../../assests/Landing/proctorBanner/ai.svg';

const AiBranding = () => {
  return (
    <div className="w-full bg-blue-900 flex flex-col items-center justify-center py-16 px-4 mt-8 mb-8 text-center text-white">
      {/* Logo */}
      <img src={aiImage} alt="AI logo" className="w-36 h-36 mb-6" />

      {/* Heading */}
      <h1 className="text-4xl md:text-4xl font-bold max-w-3xl leading-tight">
        We Provide AI Proctoring Software
      </h1>
      <span className='py-12 text-lg'> keep Exams Secure with Our AI Powered Online Proctoring Software</span>
      <p className='text-2xl w-5/12'>
        As a remote proctoring solution, it does not require an  actual human
        proctor's presence.Thanks to the AI-based features , it's extremely simple to
        proctor online exams, reducing the costs of the examination to the bare
        minimum .
     </p>
    </div>
  );
};

export default AiBranding;
