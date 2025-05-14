// BeforeAuthLanding.jsx
import React from 'react';
import Hero from './pages/Hero';
import WhyYourInstitute from './pages/WhyYourInstitute';
import TestTypes from './pages/TestTypes';
import WhyTakeExam from './pages/WhyTakeExam';
import AiBranding from './pages/AiBranding';
import ProctoringWorking from './pages/ProctoringWorking';
import RegisterCTA from './pages/RegisterCTA';

const BeforeAuthLanding = () => {
  return (
    <>
      <Hero />
      <WhyYourInstitute />
      <WhyTakeExam />
      <TestTypes />
      <AiBranding/>
      <ProctoringWorking/>
      <RegisterCTA/>
    </>
  );
};

export default BeforeAuthLanding;
