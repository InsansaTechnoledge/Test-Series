import React, { useEffect, useState } from 'react';
import Hero from './pages/Hero';
import TestTypes from './pages/TestTypes';
import WhyTakeExam from './pages/WhyTakeExam';
import AiBranding from './pages/AiBranding';
import FAQSection from './pages/FAQSection';
import { studentFAQs , teacherFAQs } from './data/FAQ';
import ExamAnalyticsFeatures from './pages/AnalyticsCard';
import FeaturesPage from './pages/FeatureManagement';
import DownloadedLandingPage from './pages/DownloadedLandingPage';
import Loader from '../../components/Loader/Loader';

const BeforeAuthLanding = () => {
  const [isElectronEnv, setIsElectronEnv] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const checkElectronEnv = () => {
      const isElectron = window.electronAPI !== undefined;
      setIsElectronEnv(isElectron);
      console.log('🔍 Electron environment detected:', isElectron);
      setLoading(false);
    };

    checkElectronEnv();
  }, []);

  if (loading) {
    return (
      <Loader/>
    );
  }

  return (
    <>
      {!isElectronEnv ? (
        <>
          <Hero />
          <TestTypes />
          <WhyTakeExam />
          <ExamAnalyticsFeatures />
          <div className="hidden md:block">
            <FeaturesPage />
          </div>
          <AiBranding />
          <FAQSection studentFAQs={studentFAQs} teacherFAQs={teacherFAQs} />
        </>
      ) : (
        <DownloadedLandingPage />
      )}
    </>
  );
};

export default BeforeAuthLanding;
