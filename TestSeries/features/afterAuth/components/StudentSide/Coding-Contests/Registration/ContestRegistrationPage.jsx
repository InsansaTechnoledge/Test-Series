import React, { useEffect, useState } from 'react';
import useCachedContests from '../../../../../../hooks/useCachedContests';
import ContestRegistrationCard from './components/ContestRegistrationCard';
import { enrollContest } from '../../../../../../utils/services/contestService';
import { useTheme } from '../../../../../../hooks/useTheme';

const ContestRegistrationPage = () => {
  const { contestList } = useCachedContests();
  
  const [registerTypeContest, setRegisterTypeContest] = useState([]);

  useEffect(() => {
    if (Array.isArray(contestList)) {
      const filtered = contestList.filter(f => (f.type === 'participation_based' && f.isEnrolled === false));
      setRegisterTypeContest(filtered);
    }
  }, [contestList]); 

  const {theme} = useTheme();

   const handleParticipate = async (contestId) => {
          try {
              const response=await enrollContest(contestId);
              if (response.status !== 200) {
            
                  console.error("Failed to enroll in contest:", response.data);
              }
              setRegisterTypeContest(prev => prev.filter(contest => contest.id !== contestId));
  
          } catch (error) {
              console.error("Error participating in contest:", error);
          }
      };

  console.log(registerTypeContest);

  return (
    <div className="min-h-screen mt-12">
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
                  Contest Registration
                </h1>
                <p className={`text-xl max-w-3xl mx-auto ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-100'
                }`}>
                  Join exciting coding competitions and showcase your skills to your peers
                </p>
              </div>
            </div>
          </div>
    
      
      <ContestRegistrationCard contest={registerTypeContest} handleParticipate={handleParticipate} theme={theme}/>
    </div>
  );
};

export default ContestRegistrationPage;
