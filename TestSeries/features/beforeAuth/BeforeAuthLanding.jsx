// BeforeAuthLanding.jsx
import React from 'react';
import Hero from './pages/Hero';
import WhyYourInstitute from './pages/WhyYourInstitute';
import TestTypes from './pages/TestTypes';
import WhyTakeExam from './pages/WhyTakeExam';
import SoftwareCapabilities from './pages/SoftwareCapabilities';
import AiBranding from './pages/AiBranding';
import ProctoringWorking from './pages/ProctoringWorking';
import RegisterCTA from './pages/RegisterCTA';
import Testimonials from './pages/Testimonials';
import FAQSection from './pages/FAQSection';
import { studentFAQs , teacherFAQs } from './data/FAQ';
import { leftCapabilities , rightCapabilities , benefits } from './data/Capabilities';
import ExamAnalyticsFeatures from './pages/AnalyticsCard';
import FeaturesPage from './pages/FeatureManagement';

const BeforeAuthLanding = () => {
  return (
    <>
      <Hero />
      <TestTypes />
      <WhyTakeExam />
      <ExamAnalyticsFeatures/>
      <FeaturesPage/>
      {/* <WhyYourInstitute />   */}
      <AiBranding/>
      {/* <ProctoringWorking/> */}
      {/* <SoftwareCapabilities leftCapabilities={leftCapabilities} rightCapabilities={rightCapabilities} benefits={benefits} /> */}
      {/* <RegisterCTA/> */}
      <FAQSection studentFAQs={studentFAQs} teacherFAQs={teacherFAQs} />
      <Testimonials />        
    </>
    
  );
};

export default BeforeAuthLanding;
