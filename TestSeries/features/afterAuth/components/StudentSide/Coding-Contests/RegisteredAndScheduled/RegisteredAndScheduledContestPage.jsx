import React, { useEffect, useState } from 'react';
import useCachedContests from '../../../../../../hooks/useCachedContests';
import RegisteredAndScheduledCard from './components/RegisteredAndScheduledCard';

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

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Your Contests</h2>

      <RegisteredAndScheduledCard registeredContest={registeredContest}/>
    </div>
  );
};

export default RegisteredAndScheduledContestPage;
