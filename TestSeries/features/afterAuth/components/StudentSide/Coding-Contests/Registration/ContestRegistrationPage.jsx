import React, { useEffect, useState } from 'react';
import useCachedContests from '../../../../../../hooks/useCachedContests';
import ContestRegistrationCard from './components/ContestRegistrationCard';
import { enrollContest } from '../../../../../../utils/services/contestService';

const ContestRegistrationPage = () => {
  const { contestList } = useCachedContests();
  const [contests, setContests] = useState([]);
  const [enrolledContests, setEnrolledContests] = useState()
  
  const [registerTypeContest, setRegisterTypeContest] = useState([]);

  useEffect(() => {
    if (Array.isArray(contestList)) {
      const filtered = contestList.filter(f => (f.type === 'participation_based' && f.isEnrolled === false));
      setRegisterTypeContest(filtered);
    }
  }, [contestList]); 

   const handleParticipate = async (contestId) => {
          try {
              const response=await enrollContest(contestId);
              if (response.status !== 200) {
            
                  console.error("Failed to enroll in contest:", response.data);
              }
  
              setEnrolledContests(prev => [...prev, contests.find(contest => contest.id === contestId)]);
              setContests(prev => prev.filter(contest => contest.id !== contestId));
  
          } catch (error) {
              console.error("Error participating in contest:", error);
          }
      };

  console.log(registerTypeContest);

  return (
    <div className="min-h-screen mt-12">
       <h1 className="text-3xl font-bold text-indigo-700 mb-8 text-center">
        Register for Participation-Based Contests
      </h1>
      
      <ContestRegistrationCard contest={registerTypeContest} handleParticipate={handleParticipate} notParticipated={false} />
    </div>
  );
};

export default ContestRegistrationPage;
