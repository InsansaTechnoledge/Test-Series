import React from 'react';
import { Calendar, Clock, Users, Play ,Trash2} from 'lucide-react';
import { deleteContest } from '../../../../../utils/services/contestService';
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from '../../../../../contexts/currentUserContext';
import { useTheme } from '../../../../../hooks/useTheme';

const ContestCard = ({ contest , setContest }) => {
  const { user } = useUser();
  const queryClient=useQueryClient();
    
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isValidityActive = (validity) => {
    if (!validity.start || !validity.end) return false;
    const now = new Date();
    const start = new Date(validity.start);
    const end = new Date(validity.end);
    return now >= start && now <= end;
  };

  const handleDelete = async (id) => {

    const deleteData = await deleteContest(id);

    setContest((prevContests) => prevContests.filter((item) => item.id !== id));
    queryClient.invalidateQueries(['contests',user._id]);
    

    alert('Contest deleted successfully',);

    
  }

  const getContestStatus = (contestItem) => {
    if (contestItem.go_live) return { text: 'LIVE', color: 'text-green-600 bg-green-50' };
    
    if (contestItem.type === 'participation_based') {
      const active = isValidityActive(contestItem.validity);
      return active 
        ? { text: 'ACTIVE', color: 'text-blue-600 bg-blue-50' }
        : { text: 'INACTIVE', color: 'text-red-500 bg-gray-50' };
    } else {
      const now = new Date();
      const scheduled = new Date(contestItem.schedule);
      return now < scheduled 
        ? { text: 'UPCOMING', color: 'text-orange-600 bg-orange-50' }
        : { text: 'ENDED', color: 'text-red-600 bg-red-50' };
    }
  };
const {theme} = useTheme()

  const contestData = contest ;

  return (



<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
  {contestData?.map((contestItem) => {
    const status = getContestStatus(contestItem);
    const isParticipationBased = contestItem.type === 'participation_based';
    
    return (
      <div
        key={contestItem.id}
        className={`backdrop-blur-md shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden border-2 ${
          theme === 'dark'
            ? isParticipationBased
              ? 'bg-gray-800/90 border-indigo-500 hover:border-indigo-400'
              : 'bg-gray-800/90 border-purple-500 hover:border-purple-400'
            : isParticipationBased
              ? 'bg-white/30 border-indigo-200 hover:border-indigo-400'
              : 'bg-white/30 border-purple-200 hover:border-purple-400'
        }`}
      >
        {/* Header */}
        <div
          className={`px-5 py-3 ${
            theme === 'dark'
              ? isParticipationBased
                ? 'bg-gradient-to-r from-indigo-900/40 to-indigo-800/30'
                : 'bg-gradient-to-r from-purple-900/40 to-purple-800/30'
              : isParticipationBased
                ? 'bg-gradient-to-r from-indigo-100/40 to-indigo-200/30'
                : 'bg-gradient-to-r from-purple-100/40 to-purple-200/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isParticipationBased ? (
                <Users className={`w-4 h-4 ${
                  theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                }`} />
              ) : (
                <Calendar className={`w-4 h-4 ${
                  theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                }`} />
              )}
              <span
                className={`text-xs font-semibold tracking-wide uppercase ${
                  theme === 'dark'
                    ? isParticipationBased ? 'text-indigo-300' : 'text-purple-300'
                    : isParticipationBased ? 'text-indigo-700' : 'text-purple-700'
                }`}
              >
                {isParticipationBased ? 'Participation' : 'Scheduled'}
              </span>
            </div>
            <div className='flex gap-3 items-center justify-center'>
              <span className={`px-2 py-2 rounded-full text-xs font-semibold ${status.color}`}>
                {status.text}
              </span>
              <div className={`border-t ${
                theme === 'dark' ? 'border-gray-600' : 'border-gray-100'
              }`}>
                <button
                  onClick={() => handleDelete(contestItem.id)}
                  className={`border w-full py-2 px-2 rounded-lg mt-3 transition-colors duration-200 ${
                    theme === 'dark'
                      ? 'text-red-400 border-red-500 hover:bg-red-500 hover:text-white'
                      : 'text-red-500 border-red-500 hover:bg-red-500 hover:text-white'
                  }`}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={`p-5 ${
          theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
        }`}>
          <h3 className={`text-xl font-bold mb-2 line-clamp-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {contestItem.name}
          </h3>
          {contestItem.description && (
            <p className={`text-sm mb-4 line-clamp-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {contestItem.description}
            </p>
          )}

          <div className="space-y-3">
            <div className={`flex items-center gap-2 text-sm ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <Clock className={`w-4 h-4 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <span className="font-medium">Duration:</span>
              <span>{contestItem.duration} mins</span>
            </div>

            {isParticipationBased ? (
              contestItem.validity.start && contestItem.validity.end && (
                <div className={`p-3 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-indigo-900/30 border border-indigo-700/50'
                    : 'bg-indigo-100/30'
                }`}>
                  <div className={`text-xs font-semibold mb-1 ${
                    theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700'
                  }`}>
                    VALID PERIOD
                  </div>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-indigo-200' : 'text-indigo-800'
                  }`}>
                    {formatDate(contestItem.validity.start)} - {formatDate(contestItem.validity.end)}
                  </div>
                </div>
              )
            ) : (
              contestItem.schedule && (
                <div className={`p-3 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-purple-900/30 border border-purple-700/50'
                    : 'bg-purple-100/30'
                }`}>
                  <div className={`text-xs font-semibold mb-1 ${
                    theme === 'dark' ? 'text-purple-300' : 'text-purple-700'
                  }`}>
                    SCHEDULED FOR
                  </div>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-purple-200' : 'text-purple-800'
                  }`}>
                    {formatDateTime(contestItem.schedule)}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    );
  })}
</div>
  );
};

export default ContestCard;