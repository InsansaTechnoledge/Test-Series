import React from 'react';
import { Calendar, Clock, Users, Play } from 'lucide-react';
import { deleteContest } from '../../../../../utils/services/contestService';
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from '../../../../../contexts/currentUserContext';

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
    console.log('deleting contest of id:' , id);

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
        : { text: 'INACTIVE', color: 'text-gray-600 bg-gray-50' };
    } else {
      const now = new Date();
      const scheduled = new Date(contestItem.schedule);
      return now < scheduled 
        ? { text: 'UPCOMING', color: 'text-orange-600 bg-orange-50' }
        : { text: 'ENDED', color: 'text-red-600 bg-red-50' };
    }
  };


  const contestData = contest ;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {contestData?.map((contestItem) => {
        const status = getContestStatus(contestItem);
        const isParticipationBased = contestItem.type === 'participation_based';
        
        return (
          <div
            key={contestItem.id}
            className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 overflow-hidden ${
              isParticipationBased 
                ? 'border-blue-200 hover:border-blue-300' 
                : 'border-purple-200 hover:border-purple-300'
            }`}
          >
            {/* Header with contest type indicator */}
            <div className={`px-5 py-3 ${
              isParticipationBased 
                ? 'bg-gradient-to-r from-blue-50 to-blue-100' 
                : 'bg-gradient-to-r from-purple-50 to-purple-100'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isParticipationBased ? (
                    <Users className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Calendar className="w-4 h-4 text-purple-600" />
                  )}
                  <span className={`text-xs font-medium uppercase tracking-wide ${
                    isParticipationBased ? 'text-blue-600' : 'text-purple-600'
                  }`}>
                    {isParticipationBased ? 'Participation' : 'Scheduled'}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                  {status.text}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                {contestItem.name}
              </h3>
              
              {contestItem.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {contestItem.description}
                </p>
              )}

              <div className="space-y-3">
                {/* Duration */}
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Duration:</span>
                  <span>{contestItem.duration} mins</span>
                </div>

                {/* Type-specific information */}
                {isParticipationBased ? (
                  // Participation-based contest
                  contestItem.validity.start && contestItem.validity.end && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-xs font-medium text-blue-700 mb-1">
                        VALID PERIOD
                      </div>
                      <div className="text-sm text-blue-800">
                        {formatDate(contestItem.validity.start)} - {formatDate(contestItem.validity.end)}
                      </div>
                    </div>
                  )
                ) : (
                  // Scheduled contest
                  contestItem.schedule && (
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="text-xs font-medium text-purple-700 mb-1">
                        SCHEDULED FOR
                      </div>
                      <div className="text-sm text-purple-800">
                        {formatDateTime(contestItem.schedule)}
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Action button */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${
                  contestItem.go_live 
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : isParticipationBased
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}>
                  {contestItem.go_live ? (
                    <>
                      <Play className="w-4 h-4" />
                      Join Live
                    </>
                  ) : (
                    'View Details'
                  )}
                </button>
                <button onClick={() => handleDelete(contestItem.id)} className='bg-red-400 text-gray-100 w-full py-2 px-2 rounded-lg mt-4 '>
                    Delete
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ContestCard;