import { CalendarDays, Clock, Info, ListChecks } from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import CryptoJS from 'crypto-js';

const ContestCard = ({ contest , handleParticipate ,notParticipated}) => {
  const navigate=useNavigate();
  const SECRET_KEY='THIS IS SECRET KEY FOR ENCRYPTION';
  return (
    <div className="hover:scale-[102%] transition-all duration-200 flex flex-col gap-3 shadow-md p-6 m-3 rounded-xl bg-white border">
      {/* Title + Status */}
      <div className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <Info className="w-8 h-8 text-blue-800" />
          <h2 className="text-xl font-bold text-blue-900">{contest.name}</h2>
        </div>
        <div className="text-green-700 bg-green-100 px-3 py-1.5 rounded-lg text-sm font-semibold flex gap-2 items-center">
          <ListChecks className="w-5 h-5" />
          <span>Available</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm">
        {contest.description?.length > 100
          ? contest.description.slice(0, 100) + '...'
          : contest.description}
      </p>

      {/* Info Row */}
      <div className="flex justify-between text-gray-600 text-sm mt-2">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5" />
          <span>
          Start: {contest?.validity?.start}
          </span>

           <CalendarDays className="w-5 h-5" />
          <span>
          End: {contest?.validity?.end}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          <span>Duration: {contest.duration || 'N/A'} min</span>
        </div>
      </div>

      {contest.type && contest.type ==='participation_based' &&  notParticipated &&(
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => handleParticipate(contest.id)}
          className="bg-blue-950 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-800"
        >
            Enroll Now in the Contest
        </button>
      </div>
      )}

        {contest.type && contest.type ==='participation_based' && !notParticipated && (
            <div className="mt-4 text-green-600 font-semibold">
            You have already enrolled in this contest.
            </div>
        )}

        {contest.go_live && (
          <button 
          onClick={()=>{
            console.log("clicked");
            //encrypt the contest id

            const contestId = CryptoJS.AES.encrypt(contest.id,SECRET_KEY).toString();
            const safeId=encodeURIComponent(contestId);
            navigate(`/student/contest/${safeId}`);
          }}
          className="mt-4 bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-green-700">
            Go Live
          </button>
        )}
    </div>
  );
};

export default ContestCard;
