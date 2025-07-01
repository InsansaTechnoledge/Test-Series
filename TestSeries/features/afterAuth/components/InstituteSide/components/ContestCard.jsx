
import React, { useState } from 'react';
import { Calendar, Clock, Users, Play, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { deleteContest, ToggleContest } from '../../../../../utils/services/contestService';

const ContestCard = ({ contest, setContest , theme}) => {
  // const [theme, setTheme] = useState('light');
  const [loadingDelete, setLoadingDelete] = useState({});
  const [loadingGoLive, setLoadingGoLive] = useState({});

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

  const canGoLive = (contestItem) => {
    const now = new Date();
    
    if (contestItem.type === 'participation_based') {
      return isValidityActive(contestItem.validity);
    } else if (contestItem.type === 'scheduled') {
      const scheduled = new Date(contestItem.schedule);
      const timeDiff = Math.abs(now - scheduled);
      const minutesDiff = Math.ceil(timeDiff / (1000 * 60));
      // Allow going live 15 minutes before or after scheduled time
      return minutesDiff <= 15;
    }
    return true; // For other types, allow going live
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contest? This action cannot be undone.')) {
      return;
    }

    setLoadingDelete(prev => ({ ...prev, [id]: true }));
    
    try {
      
      await deleteContest(id)
      
      setContest((prevContests) => prevContests.filter((item) => item.id !== id));
      alert('Contest deleted successfully');
    } catch (error) {
      alert('Failed to delete contest. Please try again.');
    } finally {
      setLoadingDelete(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleGoLive = async (contestItem) => {
    if (!canGoLive(contestItem)) {
      alert('Contest cannot go live at this time. Please check the validity period or schedule.');
      return;
    }

    setLoadingGoLive(prev => ({ ...prev, [contestItem.id]: true }));
    
    try {
      await ToggleContest(contestItem.id)
  
      setContest(prevContests => 
        prevContests.map(item => 
          item.id === contestItem.id ? { ...item, go_live: true } : item
        )
      );
      alert('Contest is now live!');
    } catch (error) {
      alert('Failed to make contest live. Please try again.');
    } finally {
      setLoadingGoLive(prev => ({ ...prev, [contestItem.id]: false }));
    }
  };

  const getContestStatus = (contestItem) => {
    if (contestItem.go_live) return { text: 'LIVE', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle };
    
    if (contestItem.type === 'participation_based') {
      const active = isValidityActive(contestItem.validity);
      return active 
        ? { text: 'ACTIVE', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: Play }
        : { text: 'INACTIVE', color: 'text-gray-500 bg-gray-50 border-gray-200', icon: AlertCircle };
    } else {
      const now = new Date();
      const scheduled = new Date(contestItem.schedule);
      return now < scheduled 
        ? { text: 'UPCOMING', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: Clock }
        : { text: 'ENDED', color: 'text-red-600 bg-red-50 border-red-200', icon: AlertCircle };
    }
  };

  const contestData = contest || [];

  return (
    <div className="p-6">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {contestData?.map((contestItem) => {
          const status = getContestStatus(contestItem);
          const isParticipationBased = contestItem.type === 'participation_based';
          const StatusIcon = status.icon;
          const canMakeGoLive = canGoLive(contestItem) && !contestItem.go_live;
          
          return (
            <div
              key={contestItem.id}
              className={`group relative backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden border transform hover:-translate-y-2 ${
                theme === 'dark'
                  ? isParticipationBased
                    ? 'bg-gradient-to-br from-gray-800/95 to-gray-900/95 border-indigo-500/30 hover:border-indigo-400/50'
                    : 'bg-gradient-to-br from-gray-800/95 to-gray-900/95 border-purple-500/30 hover:border-purple-400/50'
                  : isParticipationBased
                    ? 'bg-gradient-to-br from-white/80 to-gray-50/80 border-indigo-200/50 hover:border-indigo-400/50'
                    : 'bg-gradient-to-br from-white/80 to-gray-50/80 border-purple-200/50 hover:border-purple-400/50'
              }`}
            >
              {/* Animated background gradient */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                isParticipationBased
                  ? 'bg-gradient-to-br from-indigo-500/5 to-blue-500/5'
                  : 'bg-gradient-to-br from-purple-500/5 to-pink-500/5'
              }`} />

              {/* Header */}
              <div
                className={`relative px-6 py-4 ${
                  theme === 'dark'
                    ? isParticipationBased
                      ? 'bg-gradient-to-r from-indigo-900/60 to-indigo-800/40'
                      : 'bg-gradient-to-r from-purple-900/60 to-purple-800/40'
                    : isParticipationBased
                      ? 'bg-gradient-to-r from-indigo-100/60 to-indigo-200/40'
                      : 'bg-gradient-to-r from-purple-100/60 to-purple-200/40'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${
                      theme === 'dark'
                        ? isParticipationBased ? 'bg-indigo-600/20' : 'bg-purple-600/20'
                        : isParticipationBased ? 'bg-indigo-600/10' : 'bg-purple-600/10'
                    }`}>
                      {isParticipationBased ? (
                        <Users className={`w-5 h-5 ${
                          theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                        }`} />
                      ) : (
                        <Calendar className={`w-5 h-5 ${
                          theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                        }`} />
                      )}
                    </div>
                    <div>
                      <span
                        className={`text-xs font-bold tracking-wider uppercase ${
                          theme === 'dark'
                            ? isParticipationBased ? 'text-indigo-300' : 'text-purple-300'
                            : isParticipationBased ? 'text-indigo-700' : 'text-purple-700'
                        }`}
                      >
                        {isParticipationBased ? 'Participation' : 'Scheduled'}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(contestItem.id)}
                    disabled={loadingDelete[contestItem.id]}
                    className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                      theme === 'dark'
                        ? 'text-red-400 hover:bg-red-500/20 hover:text-red-300'
                        : 'text-red-500 hover:bg-red-500/10 hover:text-red-600'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {loadingDelete[contestItem.id] ? (
                      <div className="w-5 h-5 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Status Badge */}
                <div className="flex justify-center">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border ${status.color} shadow-sm`}>
                    <StatusIcon className="w-3 h-3" />
                    {status.text}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className={`relative p-6 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              }`}>
                <h3 className={`text-xl font-bold mb-3 line-clamp-2 leading-tight ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {contestItem.name}
                </h3>
                
                {contestItem.description && (
                  <p className={`text-sm mb-5 line-clamp-3 leading-relaxed ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {contestItem.description}
                  </p>
                )}

                <div className="space-y-4">
                  <div className={`flex items-center gap-3 p-3 rounded-xl ${
                    theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-100/50'
                  }`}>
                    <div className={`p-2 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-600' : 'bg-white'
                    }`}>
                      <Clock className={`w-4 h-4 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <span className={`text-xs font-semibold ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        DURATION
                      </span>
                      <div className={`font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {contestItem.duration} mins
                      </div>
                    </div>
                  </div>

                  {isParticipationBased ? (
                    contestItem.validity.start && contestItem.validity.end && (
                      <div className={`p-4 rounded-xl border-2 ${
                        theme === 'dark'
                          ? 'bg-indigo-900/20 border-indigo-700/30'
                          : 'bg-indigo-50/50 border-indigo-200/50'
                      }`}>
                        <div className={`text-xs font-bold mb-2 flex items-center gap-2 ${
                          theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700'
                        }`}>
                          <Calendar className="w-3 h-3" />
                          VALID PERIOD
                        </div>
                        <div className={`text-sm font-semibold ${
                          theme === 'dark' ? 'text-indigo-200' : 'text-indigo-800'
                        }`}>
                          {formatDate(contestItem.validity.start)} - {formatDate(contestItem.validity.end)}
                        </div>
                        {!isValidityActive(contestItem.validity) && (
                          <div className={`text-xs mt-2 flex items-center gap-1 ${
                            theme === 'dark' ? 'text-amber-300' : 'text-amber-600'
                          }`}>
                            <AlertCircle className="w-3 h-3" />
                            Not in valid period
                          </div>
                        )}
                      </div>
                    )
                  ) : (
                    contestItem.schedule && (
                      <div className={`p-4 rounded-xl border-2 ${
                        theme === 'dark'
                          ? 'bg-purple-900/20 border-purple-700/30'
                          : 'bg-purple-50/50 border-purple-200/50'
                      }`}>
                        <div className={`text-xs font-bold mb-2 flex items-center gap-2 ${
                          theme === 'dark' ? 'text-purple-300' : 'text-purple-700'
                        }`}>
                          <Clock className="w-3 h-3" />
                          SCHEDULED FOR
                        </div>
                        <div className={`text-sm font-semibold ${
                          theme === 'dark' ? 'text-purple-200' : 'text-purple-800'
                        }`}>
                          {formatDateTime(contestItem.schedule)}
                        </div>
                        {!canGoLive(contestItem) && !contestItem.go_live && (
                          <div className={`text-xs mt-2 flex items-center gap-1 ${
                            theme === 'dark' ? 'text-amber-300' : 'text-amber-600'
                          }`}>
                            <AlertCircle className="w-3 h-3" />
                            Not ready to go live
                          </div>
                        )}
                      </div>
                    )
                  )}

                  {/* Go Live Button */}
                  {!contestItem.go_live && (
                    <div className="pt-2">
                      <button
                        onClick={() => handleGoLive(contestItem)}
                        disabled={!canMakeGoLive || loadingGoLive[contestItem.id]}
                        className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                          canMakeGoLive
                            ? theme === 'dark'
                              ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                              : 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                            : theme === 'dark'
                              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        } disabled:transform-none disabled:shadow-none`}
                      >
                        {loadingGoLive[contestItem.id] ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Going Live...
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            {canMakeGoLive ? 'Go Live' : 'Cannot Go Live'}
                          </>
                        )}
                      </button>
                      {!canMakeGoLive && (
                        <p className={`text-xs mt-2 text-center ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          Contest must be within valid period or scheduled time to go live
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {contestData.length === 0 && (
        <div className={`text-center py-12 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No contests available</h3>
          <p className="text-sm">Create your first contest to get started.</p>
        </div>
      )}
    </div>
  );
};

export default ContestCard;