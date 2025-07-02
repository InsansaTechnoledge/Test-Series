import { CalendarDays, Clock, Info, ListChecks } from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { useTheme } from '../../../../../hooks/useTheme';

const ContestCard = ({ contest , handleParticipate ,notParticipated}) => {

  console.log("dsvas", contest)
  const navigate=useNavigate();
  const {theme} = useTheme()
  const SECRET_KEY='THIS IS SECRET KEY FOR ENCRYPTION';
  return (
    <div className={`transition-all duration-300 transform hover:scale-102 flex flex-col gap-4 shadow-lg hover:shadow-xl p-6 m-3 rounded-2xl border ${
      theme === 'light' 
        ? 'bg-white border-gray-200 hover:border-indigo-300' 
        : 'bg-gray-800 border-gray-600 hover:border-indigo-400'
    }`}>
      
      {/* Title + Status */}
      <div className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <div className={`${theme === 'light' ? 'bg-blue-100' : 'bg-blue-600'} p-2 rounded-xl`}>
            <Info className={`w-6 h-6 ${theme === 'light' ? 'text-blue-600' : 'text-blue-200'}`} />
          </div>
          <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
            {contest.name}
          </h2>
        </div>
        <div className={`px-4 py-2 rounded-xl text-sm font-semibold flex gap-2 items-center border ${
          theme === 'light' 
            ? 'text-green-700 bg-green-100 border-green-200' 
            : 'text-green-200 bg-green-800 border-green-600'
        }`}>
          <ListChecks className="w-4 h-4" />
          <span>Available</span>
        </div>
      </div>

      {/* Description */}
      <div className={`${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700'} rounded-xl p-4`}>
        <p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} text-sm leading-relaxed`}>
          {contest.description?.length > 100
            ? contest.description.slice(0, 100) + '...'
            : contest.description}
        </p>
      </div>

      {/* Info Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700'} rounded-xl p-4`}>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CalendarDays className={`w-4 h-4 ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'}`} />
              <span className={`text-xs font-semibold ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} uppercase tracking-wide`}>
                Start Date
              </span>
            </div>
            <p className={`text-sm font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
              {contest?.validity?.start}
            </p>
          </div>
        </div>

        <div className={`${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700'} rounded-xl p-4`}>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CalendarDays className={`w-4 h-4 ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'}`} />
              <span className={`text-xs font-semibold ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} uppercase tracking-wide`}>
                End Date
              </span>
            </div>
            <p className={`text-sm font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
              {contest?.validity?.end}
            </p>
          </div>
        </div>

        <div className={`${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700'} rounded-xl p-4 md:col-span-2`}>
          <div className="flex items-center gap-2 mb-2">
            <Clock className={`w-4 h-4 ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'}`} />
            <span className={`text-xs font-semibold ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} uppercase tracking-wide`}>
              Duration
            </span>
          </div>
          <p className={`text-sm font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
            {contest.duration || 'N/A'} minutes
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mt-2">
        {contest.type && contest.type === 'participation_based' && notParticipated &&  (
          <div className="flex justify-center">
            <button
              onClick={() => handleParticipate(contest.id)}
              disabled={contest.go_live === true}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                theme === 'light'
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-lg'
                  : 'bg-indigo-500 hover:bg-indigo-600 text-white hover:shadow-lg'
              }`}
            >
              <ListChecks className="w-4 h-4" />
              {!contest.go_live ? 'Enroll Now in the Contest' : 'Contest has Already Started'}
            </button>
          </div>
        )}

        {contest.type && contest.type === 'participation_based' && !notParticipated && !contest.go_live && (
          <div className={`text-center py-3 px-4 rounded-xl border ${
            theme === 'light'
              ? 'text-green-700 bg-green-50 border-green-200'
              : 'text-green-200 bg-green-800 border-green-600'
          }`}>
            <div className="flex items-center justify-center gap-2">
              <ListChecks className="w-4 h-4" />
              <span className="font-semibold">You have already enrolled in this contest.</span>
            </div>
          </div>
        )}

        {contest.go_live && contest.isEnrolled && (
          <div className="flex justify-center">
            <button
              onClick={() => {
                const contestId = CryptoJS.AES.encrypt(contest.id, SECRET_KEY).toString();
                const safeId = encodeURIComponent(contestId);
                navigate(`/student/contest/${safeId}`);
              }}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                theme === 'light'
                  ? 'bg-green-600 hover:bg-green-700 text-white hover:shadow-lg'
                  : 'bg-green-500 hover:bg-green-600 text-white hover:shadow-lg'
              }`}
            >
              <Clock className="w-4 h-4" />
              Start Contest
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestCard;
