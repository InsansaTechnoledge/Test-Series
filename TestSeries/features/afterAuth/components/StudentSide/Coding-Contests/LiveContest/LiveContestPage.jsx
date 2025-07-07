import React, { useEffect, useState } from 'react';
import useCachedContests from '../../../../../../hooks/useCachedContests';
import LiveContestCard from './components/LiveContestCard';

const LiveContestPage = () => {
  const { contestList } = useCachedContests();
  const [liveContest, setLiveContest] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); 
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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

  // Don't render on mobile
  if (isMobile) {
    return (
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-indigo-800 mb-4">
            Desktop Only
          </h1>
          <p className="text-gray-600">
            Live contests are only available on desktop devices.
          </p>
        </div>
      </div>
    );
  }

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