import React, { useState, useEffect } from 'react'
import { Play, Trophy, Users, ArrowRight, Clock, Zap, Target } from 'lucide-react'
import { useTheme } from '../../../../../../../hooks/useTheme'
import { useNavigate } from 'react-router-dom'

const LiveContestComponent = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 30 })
  const {theme} = useTheme();
  
  const navigate = useNavigate();
  
  // Timer effect for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])
  
  return (
    <div className="max-w-4xl p-6">
      <div 
        className={`
          relative overflow-hidden rounded-2xl ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}
          shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl
          border-l-4 ${theme === 'light' ? 'border-red-500' : 'border-red-400'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        
        {/* Live indicator */}
        <div className="absolute top-4 right-4">
          <div className={`flex items-center space-x-2 ${theme === 'light' ? 'bg-red-500' : 'bg-red-600'} text-white px-3 py-1 rounded-full animate-pulse`}>
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            <span className="text-xs font-bold">LIVE</span>
          </div>
        </div>
        
        {/* Main content */}
        <div className="relative z-10 p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
              
              <div>
                <h2 className={`text-2xl mr-3 font-bold ${theme === 'light' ? 'text-red-800' : ' text-white'} mb-1`}>Contest Live Now</h2>
                <p className={` ${theme === 'light' ? 'text-red-600' : 'text-red-100'}  text-sm`}>The coding challenge is in progress</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`flex items-center space-x-1 ${theme === 'light' ? 'text-orange-500' : 'text-orange-400'} mb-1`}>
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Time Remaining</span>
              </div>
              <div className={`${theme === 'light' ? 'text-gray-800' : 'text-white'} font-mono text-lg font-bold`}>
                {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
            </div>
          </div>
          
          {/* Contest details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className={`w-5 h-5 ${theme === 'light' ? 'text-red-600' : 'text-red-400'}  mr-2`} />
                <span className={` ${theme === 'light' ? 'text-red-600 ' : 'text-red-100 '} text-sm`}>Active Participants</span>
              </div>
              <p className={`${theme === 'light' ? 'text-gray-800' : 'text-white'}  font-semibold`}>1,156 Online</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className={`w-5 h-5 ${theme === 'light' ? 'text-red-600' : 'text-red-400'}  mr-2`}/>
                <span className={` ${theme === 'light' ? 'text-red-600 ' : 'text-red-100 '} text-sm`}>Your Rank</span>
              </div>
              <p className={`${theme === 'light' ? 'text-gray-800' : 'text-white'}  font-semibold`}>#234</p>
            </div>
            {/* <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Zap className={`w-5 h-5 ${theme === 'light' ? 'text-red-600' : 'text-red-400'}  mr-2`}/>
                <span className={` ${theme === 'light' ? 'text-red-600 ' : 'text-red-100 '} text-sm`}>Problems Solved</span>
              </div>
              <p className={`${theme === 'light' ? 'text-gray-800' : 'text-white'}  font-semibold`}>3 / 5</p>
            </div> */}
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center justify-center space-x-4">
            
            <button
              onClick={() => navigate('/student/live-contest')}
              className={`
                group relative px-8 py-4 ${theme === 'light' ? 'bg-red-600 text-white' : 'bg-red-500 text-gray-900'} font-bold rounded-xl
                transform transition-all duration-300 hover:scale-105 
                shadow-lg hover:shadow-xl flex items-center space-x-2
                ${isHovered ? 'animate-pulse' : ''}
              `}>
              
              <Play className="w-5 h-5" />
              <span>View Contest</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
            
            <button
              onClick={() => navigate('/student/leaderboard')}
              className={`
                group relative px-8 py-4 ${theme === 'light' ? 'bg-orange-600 text-white' : 'bg-orange-500 text-gray-900'} font-bold rounded-xl
                transform transition-all duration-300 hover:scale-105 
                shadow-lg hover:shadow-xl flex items-center space-x-2
              `}>
              
              <Trophy className="w-5 h-5" />
              <span>Leaderboard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveContestComponent