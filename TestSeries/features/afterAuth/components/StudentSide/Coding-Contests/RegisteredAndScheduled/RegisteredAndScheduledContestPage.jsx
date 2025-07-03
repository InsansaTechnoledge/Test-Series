import React, { useEffect, useState } from 'react';
import useCachedContests from '../../../../../../hooks/useCachedContests';
import RegisteredAndScheduledCard from './components/RegisteredAndScheduledCard';
import { useTheme } from '../../../../../../hooks/useTheme';

const RegisteredAndScheduledContestPage = () => {
  const { contestList } = useCachedContests();
  const [registeredContest, setRegisteredContest] = useState([]);

  console.log(contestList)
  useEffect(() => {
    if (Array.isArray(contestList)) {
      const filteredContests = contestList.filter(f =>
        f.type === 'scheduled' || (f.type === 'participation_based' && f.isEnrolled === true)
      );
      setRegisteredContest(filteredContests);
    }
  }, [contestList]);

  console.log('Registered or Scheduled Contests:', registeredContest);

  const {theme } = useTheme();

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="relative overflow-hidden">
            <div className={`absolute inset-0 ${
              theme === 'dark' 
                ? 'bg-indigo-400' 
                : 'bg-indigo-600'
            }`}></div>
            <div className="relative px-4 py-12 sm:px-6 lg:px-8">
              <div className="text-center">
              
                <h1 className={`text-4xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-100'
                }`}>
                  Your Registered Contest
                </h1>
                <p className={`text-xl max-w-3xl mx-auto ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-100'
                }`}>
                  Join exciting coding competitions and showcase your skills to your peers
                </p>
              </div>
            </div>
          </div>

      <RegisteredAndScheduledCard registeredContest={registeredContest} theme={theme}/>
    </div>
  );
};

export default RegisteredAndScheduledContestPage;
