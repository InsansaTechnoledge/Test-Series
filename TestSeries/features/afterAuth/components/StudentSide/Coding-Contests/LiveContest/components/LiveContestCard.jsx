import React, { useState, useEffect } from 'react'
import { Play, Trophy, Users, ArrowRight, Clock, Zap, Calendar } from 'lucide-react'
import { useTheme } from '../../../../../../../hooks/useTheme'
import { useNavigate } from 'react-router-dom'

const LiveContestCard = ({liveContest}) => {

    console.log("hiih", liveContest)

  const [isHovered, setIsHovered] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const {theme} = useTheme();
  
  const navigate = useNavigate();
  
  // Calculate time remaining
  useEffect(() => {
    if (liveContest?.validity?.end) {
      const updateTimer = () => {
        const now = new Date().getTime()
        const endTime = new Date(liveContest.validity.end + 'T23:59:59').getTime()
        const difference = endTime - now
        
        if (difference > 0) {
          const hours = Math.floor(difference / (1000 * 60 * 60))
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((difference % (1000 * 60)) / 1000)
          
          setTimeLeft({ hours, minutes, seconds })
        } else {
          setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
        }
      }
      
      updateTimer()
      const timer = setInterval(updateTimer, 1000)
      return () => clearInterval(timer)
    } else if (liveContest?.duration) {
      // If no end date but has duration, show duration in minutes
      const durationHours = Math.floor(liveContest.duration / 60)
      const durationMinutes = liveContest.duration % 60
      setTimeLeft({ hours: durationHours, minutes: durationMinutes, seconds: 0 })
    }
  }, [liveContest?.validity?.end, liveContest?.duration])
  
  if (!liveContest) {
    return null
  }
  
  return (
    <div className="w-full max-w-md">
      <div 
        className={`
          relative overflow-hidden rounded-xl ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}
          shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl
          border-l-4 ${theme === 'light' ? 'border-red-500' : 'border-red-400'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        
        {/* Live indicator */}
        <div className="absolute top-3 right-3">
          {liveContest.go_live ? (
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
        
        {/* Main content */}
        <div className="relative z-10 p-6">
          <div className="mb-4">
            <h3 className={`text-lg font-bold ${liveContest.go_live ? (theme === 'light' ? 'text-red-800' : ' text-white') : (theme === 'light' ? 'text-blue-800' : ' text-white')} mb-1`}>
              {liveContest.name || 'Contest'}
            </h3>
            <p className={` ${liveContest.go_live ? (theme === 'light' ? 'text-red-600' : 'text-red-100') : (theme === 'light' ? 'text-blue-600' : 'text-blue-100')}  text-sm`}>
              {liveContest.description || 'Contest description'}
            </p>
            {liveContest.isEnrolled && (
              <div className={`inline-flex items-center mt-2 px-2 py-1 rounded-full text-xs font-medium ${theme === 'light' ? 'bg-green-100 text-green-800' : 'bg-green-800 text-green-100'}`}>
                ✓ Enrolled
              </div>
            )}
          </div>
          
          {/* Timer or Duration */}
          <div className="mb-4">
            <div className={`flex items-center space-x-1 ${liveContest.go_live ? (theme === 'light' ? 'text-orange-500' : 'text-orange-400') : (theme === 'light' ? 'text-blue-500' : 'text-blue-400')} mb-1`}>
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium">
                {liveContest.go_live ? 'Time Remaining' : 'Duration'}
              </span>
            </div>
            <div className={`${theme === 'light' ? 'text-gray-800' : 'text-white'} font-mono text-base font-bold`}>
              {liveContest.go_live ? (
                <>
                  {String(timeLeft.hours).padStart(2, '0')}:
                  {String(timeLeft.minutes).padStart(2, '0')}:
                  {String(timeLeft.seconds).padStart(2, '0')}
                </>
              ) : (
                `${liveContest.duration || 0} minutes`
              )}
            </div>
            {liveContest.validity && (
              <div className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                {liveContest.validity.start} to {liveContest.validity.end}
              </div>
            )}
          </div>
          
          {/* Contest stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <span className={` ${liveContest.go_live ? (theme === 'light' ? 'text-red-600 ' : 'text-red-100 ') : (theme === 'light' ? 'text-blue-600 ' : 'text-blue-100 ')} text-xs`}>Type</span>
              </div>
              <p className={`${theme === 'light' ? 'text-gray-800' : 'text-white'}  font-semibold text-sm`}>
                {liveContest.type?.replace('_', ' ') || 'Contest'}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <span className={` ${liveContest.go_live ? (theme === 'light' ? 'text-red-600 ' : 'text-red-100 ') : (theme === 'light' ? 'text-blue-600 ' : 'text-blue-100 ')} text-xs`}>Status</span>
              </div>
              <p className={`${theme === 'light' ? 'text-gray-800' : 'text-white'}  font-semibold text-sm`}>
                {liveContest.go_live ? 'Live' : 'Scheduled'}
              </p>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-col space-y-2">
            {liveContest.go_live ? (
              <>
                <button
                  onClick={() => navigate(`/student/contest/${liveContest.id}`)}
                  className={`
                    group relative px-6 py-3 bg-red-600 text-white font-bold rounded-lg
                    transform transition-all duration-300 hover:scale-105 
                    shadow-md hover:shadow-lg flex items-center justify-center space-x-2
                    ${isHovered ? 'animate-pulse' : ''}
                  `}>
                  
                  <Play className="w-4 h-4" />
                  <span>{liveContest.isEnrolled ? 'Enter Contest' : 'Join Contest'}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                
                <button
                  onClick={() => navigate(`/student/leaderboard/${liveContest.id}`)}
                  className={`
                    group relative px-6 py-3 ${theme === 'light' ? 'bg-orange-600 text-white' : 'bg-orange-500 text-gray-900'} font-bold rounded-lg
                    transform transition-all duration-300 hover:scale-105 
                    shadow-md hover:shadow-lg flex items-center justify-center space-x-2
                  `}>
                  
                  <Trophy className="w-4 h-4" />
                  <span>View Leaderboard</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate(`/student/contest/${liveContest.id}`)}
                className={`
                  group relative px-6 py-3 ${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-gray-900'} font-bold rounded-lg
                  transform transition-all duration-300 hover:scale-105 
                  shadow-md hover:shadow-lg flex items-center justify-center space-x-2
                `}>
                
                <Calendar className="w-4 h-4" />
                <span>{liveContest.isEnrolled ? 'View Contest' : 'Enroll Now'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveContestCard