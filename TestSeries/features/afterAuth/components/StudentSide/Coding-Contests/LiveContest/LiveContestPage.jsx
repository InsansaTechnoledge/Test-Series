import React, { useEffect, useState } from 'react';
import useCachedContests from '../../../../../../hooks/useCachedContests';
import LiveContestCard from './components/LiveContestCard';

const LiveContestPage = () => {
  const { contestList } = useCachedContests();
  const [liveContest, setLiveContest] = useState([]);

  useEffect(() => {
    if (contestList && Array.isArray(contestList)) {
      const filteredContest = contestList.filter(
        (contest) => contest.go_live === true && contest.isEnrolled === true
      );
      setLiveContest(filteredContest);
    }
  }, [contestList]);

  console.log("contestList:", contestList);
  console.log("liveContest:", liveContest);

  return (
    <div className="min-h-screen px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-indigo-800 mb-6">Live Contests</h1>
      {liveContest.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          <p>No live contests available at the moment.</p>
        </div>
      ) : (
        <LiveContestCard contests={liveContest} />
      )}
    </div>
  );
};

export default LiveContestPage;

