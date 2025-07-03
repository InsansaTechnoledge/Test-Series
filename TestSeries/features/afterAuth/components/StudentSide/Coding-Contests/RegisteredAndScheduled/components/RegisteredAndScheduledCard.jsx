import React from 'react';
import { Calendar, Clock, Users, Award, Star, CheckCircle, XCircle } from 'lucide-react';

const RegisteredAndScheduledCard = ({ registeredContest , theme }) => {

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const isContestActive = (validity) => {
    if (!validity?.start || !validity?.end) return false;
    const now = new Date();
    const start = new Date(validity.start);
    const end = new Date(validity.end);
    return now >= start && now <= end;
  };

 
  return (
    <div className={`min-h-screen transition-colors duration-300`}>
      {/* Main Content */}
      <div className="px-4 py-8 sm:px-6 lg:px-8  mx-auto">
        {registeredContest.length === 0 ? (
          <div className="text-center py-16">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${
              theme === 'dark' 
                ? 'bg-gray-900 text-gray-400' 
                : 'bg-gray-100 text-gray-400'
            }`}>
              <Award className="w-12 h-12" />
            </div>
            <h3 className={`text-2xl font-semibold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              No Registered or Scheduled Contests
            </h3>
            <p className={`text-lg ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Register for contests to see them here!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {registeredContest.map(contest => (
              <div
                key={contest.id}
                className={`group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl `}
              >
                {/* Contest Status Indicator */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
                  isContestActive(contest.validity)
                    ? theme === 'dark' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-green-100 text-green-700 border border-green-200'
                    : theme === 'dark' 
                      ? 'bg-gray-700/50 text-gray-400 border border-gray-600/30' 
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}>
                  {isContestActive(contest.validity) ? 'Active' : 'Upcoming'}
                </div>

                {/* Card Content */}
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {contest.name}
                      </h3>
                    
                    </div>
                  </div>

                  {/* Description */}
                  <p className={`text-sm mb-6 line-clamp-3 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {contest.description || 'No description available'}
                  </p>

                  {/* Contest Details */}
                  <div className="space-y-3 mb-6">
                    {/* Type */}
                    <div className="flex items-center gap-3">
                      <Award className={`w-4 h-4 ${
                        theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                      }`} />
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Type: <span className="font-medium">{contest.type}</span>
                      </span>
                    </div>

                    {/* Duration */}
                    {contest.duration && (
                      <div className="flex items-center gap-3">
                        <Clock className={`w-4 h-4 ${
                          theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                        }`} />
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Duration: <span className="font-medium">{contest.duration} mins</span>
                        </span>
                      </div>
                    )}

                    {/* Validity Period */}
                    {contest.validity && (
                      <div className="flex items-center gap-3">
                        <Calendar className={`w-4 h-4 ${
                          theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                        }`} />
                        <div className={`text-sm ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          <div>From: <span className="font-medium">{formatDate(contest.validity?.start)}</span></div>
                          <div>Until: <span className="font-medium">{formatDate(contest.validity?.end)}</span></div>
                        </div>
                      </div>
                    )}

                    {/* Participants & Prize */}
                    <div className="flex items-center justify-between">
                      {contest.participants && (
                        <div className="flex items-center gap-2">
                          <Users className={`w-4 h-4 ${
                            theme === 'dark' ? 'text-green-400' : 'text-green-600'
                          }`} />
                          <span className={`text-sm ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {contest.participants.toLocaleString()} enrolled
                          </span>
                        </div>
                      )}
                      {contest.prize && (
                        <div className="flex items-center gap-2">
                          <Star className={`w-4 h-4 ${
                            theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                          }`} />
                          <span className={`text-sm font-medium ${
                            theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                          }`}>
                            {contest.prize}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Enrollment Status */}
                  <div className="flex items-center justify-center">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm ${
                      contest.isEnrolled || contest.type === 'scheduled'
                        ? theme === 'dark' 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : 'bg-green-100 text-green-700 border border-green-200'
                        : theme === 'dark' 
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                          : 'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {contest.isEnrolled || contest.type === 'scheduled' ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Enrolled
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          Not Enrolled
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-r from-purple-600/10 to-blue-600/10' 
                    : 'bg-gradient-to-r from-purple-600/5 to-blue-600/5'
                }`}></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisteredAndScheduledCard;