import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Users, Award, ChevronRight, Star,  } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ContestRegistrationPage = ({contest , handleParticipate , theme}) => {

   const navigate = useNavigate();

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
        <div className={`min-h-screen transition-colors duration-300 `}>
          {/* Header */}
        
          {/* Main Content */}
          <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {contest.length === 0 ? (
              <div className="text-center py-16">
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${
                  theme === 'dark' 
                    ? 'bg-gray-800 text-gray-400' 
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  <Award className="w-12 h-12 animate-bounce" />
                </div>
                <h3 className={`text-2xl font-semibold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  No Contests Available
                </h3>
                <p className={`text-lg ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Check back later for exciting new competitions!
                </p>

                <button onClick={() => navigate('/student/registered-contest')} className={`${theme === 'light' ? 'bg-indigo-600 text-indigo-100' : 'bg-indigo-400 text-gray-100'} mt-4 py-2 px-3 rounded-2xl`}>Check registered contest</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {contest.map(contest => (
                  <div
                    key={contest.id}
                    className={`group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                      theme === 'dark' 
                        ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-xl' 
                        : 'bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl'
                    }`}
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
                          {contest.difficulty && (
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(contest.difficulty)}`}>
                              {contest.difficulty}
                            </span>
                          )}
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
                        {/* Duration */}
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
    
                        {/* Validity Period */}
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
    
                      {/* Enrollment Status & Action */}
                      <div className="flex items-center justify-between">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          contest.isEnrolled 
                            ? theme === 'dark' 
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                              : 'bg-green-100 text-green-700 border border-green-200'
                            : theme === 'dark' 
                              ? 'bg-gray-700/50 text-gray-400 border border-gray-600/30' 
                              : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}>
                          {contest.isEnrolled ? 'Enrolled' : 'Not Enrolled'}
                        </div>
                        
                        <button
                          onClick={() => handleParticipate && handleParticipate(contest.id)}
                          disabled={contest.isEnrolled}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                            contest.isEnrolled
                              ? theme === 'dark'
                                ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : theme === 'dark'
                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
                                : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
                          }`}
                        >
                          {contest.isEnrolled ? 'Enrolled' : 'Enroll Now'}
                          {!contest.isEnrolled && <ChevronRight className="w-4 h-4" />}
                        </button>
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

export default ContestRegistrationPage;
