import React, { useState, useEffect } from 'react';
import { Play, Trophy, ArrowRight, Clock, Calendar } from 'lucide-react';
import { useTheme } from '../../../../../../../hooks/useTheme';
import { useNavigate } from 'react-router-dom';

const LiveContestCard = ({ contests,status }) => {
  console.log("contests in LiveContestCard:", contests);

  if(status === "submitted")
  contests = contests.filter(contest => contest.go_live === true && contest.isEnrolled === true && contest.status === "submitted");
  else
  contests = contests.filter(contest => contest.go_live === true && contest.isEnrolled === true && contest.status !== "submitted");
  
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [timers, setTimers] = useState({});

  // Setup countdown for each contest
  useEffect(() => {
    if (!contests || !Array.isArray(contests) || contests.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      const updatedTimers = {};
      contests.forEach((contest) => {
        if (contest?.validity?.end) {
          const now = new Date().getTime();
          const endTime = new Date(contest.validity.end + 'T23:59:59').getTime();
          const diff = endTime - now;
          
          if (diff > 0) {
            updatedTimers[contest.id] = {
              hours: Math.floor(diff / (1000 * 60 * 60)),
              minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
              seconds: Math.floor((diff % (1000 * 60)) / 1000),
            };
          } else {
            updatedTimers[contest.id] = { hours: 0, minutes: 0, seconds: 0 };
          }
        }
      });
      setTimers(updatedTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [contests]);

  // Handle loading state
  if (!contests || !Array.isArray(contests)) {
    return (
      <div className="text-center text-gray-500 mt-8">
        <p>Loading contests...</p>
      </div>
    );
  }

  // Handle empty state
  if (contests.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">
        <p>No contests available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
      {contests.map((contest) => {
        const time = timers[contest.id] || { hours: 0, minutes: 0, seconds: 0 };
        
        return (
          <div key={contest.id} className="w-full max-w-md">
            <div
              className={`
                relative overflow-hidden rounded-xl ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}
                shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl
                border-l-4 ${theme === 'light' ? 'border-red-500' : 'border-red-400'}
              `}
            >
              {/* Live/Scheduled Indicator */}
              <div className="absolute top-3 right-3">
                {contest.go_live ? (
                  <div className={`flex items-center space-x-1 ${theme === 'light' ? 'bg-red-500' : 'bg-red-600'} text-white px-2 py-1 rounded-full animate-pulse`}>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                    <span className="text-xs font-bold">LIVE</span>
                  </div>
                ) : (
                  <div className={`flex items-center space-x-1 ${theme === 'light' ? 'bg-blue-500' : 'bg-blue-600'} text-white px-2 py-1 rounded-full`}>
                    <Calendar className="w-3 h-3" />
                    <span className="text-xs font-bold">SCHEDULED</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="relative z-10 p-6">
                <div className="mb-4">
                  <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-indigo-900' : 'text-white'} mb-1`}>
                    {contest.name || 'Unnamed Contest'}
                  </h3>
                  <p className={`text-sm ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-300'}`}>
                    {contest.description || 'No description available'}
                  </p>
                  {contest.isEnrolled && (
                    <div className={`inline-flex items-center mt-2 px-2 py-1 rounded-full text-xs font-medium ${theme === 'light' ? 'bg-green-100 text-green-800' : 'bg-green-800 text-green-100'}`}>
                      ✓ Enrolled
                    </div>
                  )}
                </div>

                {/* Timer */}
                <div className="mb-4">
                  <div className={`flex items-center space-x-1 ${contest.go_live ? 'text-orange-500' : 'text-blue-500'} mb-1`}>
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-medium">
                      {contest.go_live ? 'Time Remaining' : 'Duration'}
                    </span>
                  </div>
                  <div className={`${theme === 'light' ? 'text-gray-800' : 'text-white'} font-mono text-base font-bold`}>
                    {contest.go_live ? (
                      <>
                        {String(time.hours).padStart(2, '0')}:
                        {String(time.minutes).padStart(2, '0')}:
                        {String(time.seconds).padStart(2, '0')}
                      </>
                    ) : (
                      `${contest.duration || 0} minutes`
                    )}
                  </div>
                  {contest.validity && (
                    <div className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      {contest.validity.start} to {contest.validity.end}
                    </div>
                  )}
                </div>

                {/* Type & Status */}
                <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                  <div>
                    <div className="text-xs mb-1 text-blue-600">Type</div>
                    <p className={`${theme === 'light' ? 'text-gray-800' : 'text-white'} font-semibold text-sm`}>
                      {contest.type ? contest.type.replace('_', ' ') : 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <div className="text-xs mb-1 text-blue-600">Status</div>
                    <p className={`${theme === 'light' ? 'text-gray-800' : 'text-white'} font-semibold text-sm`}>
                      {contest.go_live ? 'Live' : 'Scheduled'}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-2">
                  {contest.go_live ? (
                    <>
                     {status !=="submitted" && ( <button
                        onClick={() => navigate(`/student/contest/${contest.id}`)}
                        className="group relative px-6 py-3 bg-red-600 text-white font-bold rounded-lg transform transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                      >
                        <Play className="w-4 h-4" />
                        <span>{contest.isEnrolled ? 'Enter Contest' : 'Join Contest'}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>)}
                      <button
                        onClick={() => navigate(`/student/leaderboard/${contest.id}`)}
                        className="group relative px-6 py-3 bg-orange-600 text-white font-bold rounded-lg transform transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                      >
                        <Trophy className="w-4 h-4" />
                        <span>View Leaderboard</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => navigate(`/student/contest/${contest.id}`)}
                      className="group relative px-6 py-3 bg-blue-600 text-white font-bold rounded-lg transform transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>{contest.isEnrolled ? 'View Contest' : 'Enroll Now'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LiveContestCard;
