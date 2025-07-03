import React, { useEffect, useState } from 'react';
import useCachedContests from '../../../../../../hooks/useCachedContests';
import ContestRegistrationCard from './components/ContestRegistrationCard';

const ContestRegistrationPage = () => {
  const { contestList } = useCachedContests();
  
  const [registerTypeContest, setRegisterTypeContest] = useState([]);

  useEffect(() => {
    if (Array.isArray(contestList)) {
      const filtered = contestList.filter(f => (f.type === 'participation_based' && f.isEnrolled === false));
      setRegisterTypeContest(filtered);
    }
  }, [contestList]); 

  console.log(registerTypeContest);

  return (
    <div className="min-h-screen mt-12">
       <h1 className="text-3xl font-bold text-indigo-700 mb-8 text-center">
        Register for Participation-Based Contests
      </h1>
      <ContestRegistrationCard contest={registerTypeContest}/>
    </div>
  );
};

export default ContestRegistrationPage;
