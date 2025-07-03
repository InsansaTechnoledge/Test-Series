import React, { useState } from 'react'
import { Calendar, Trophy, Users, ArrowRight, Clock } from 'lucide-react'
import { useTheme } from '../../../../../../../hooks/useTheme'

const RegistrationComponent = () => {
  const [isHovered, setIsHovered] = useState(false)
  const {theme} = useTheme();

  return (
    <div className="max-w-4xl p-6">
      <div 
        className={`
          relative overflow-hidden rounded-2xl  ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}
          shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
       

        {/* Main content */}
        <div className="relative z-10 p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
            
              <div>
                <h2 className={`text-2xl mr-3 font-bold ${theme === 'light' ? 'text-indigo-800' : ' text-white'} mb-1`}>Contest Registration</h2>
                <p className={` ${theme === 'light' ? 'text-indigo-600' : 'text-blue-100'}  text-sm`}>Join the ultimate coding challenge</p>
              </div>
            </div>
            <div className="  text-right">
              <div className={`flex items-center space-x-1 ${theme === 'light' ? 'text-green-500' : 'text-green-600'} mb-1`}>
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Registration Open</span>
              </div>
              
            </div>
          </div>

          {/* Contest details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Calendar className={`w-5 h-5 ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'}  mr-2`} />
                <span className={` ${theme === 'light' ? 'text-indigo-600 ' : 'text-blue-100 '} text-sm`}>Event Date</span>
              </div>
              <p className={`${theme === 'light' ? 'text-gray-800' : 'text-white'}  font-semibold`}>July 15, 2025</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className={`w-5 h-5 ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'}  mr-2`}/>
                <span className={` ${theme === 'light' ? 'text-indigo-600 ' : 'text-blue-100 '} text-sm`}>Participants</span>
              </div>
              <p className={`${theme === 'light' ? 'text-gray-800' : 'text-white'}  font-semibold`}>1,247 Registered</p>
            </div>
           
          </div>

          {/* Registration button */}
          <div className="flex items-center justify-center">
            <button className={`
              group relative px-8 py-4 ${theme === 'light' ? 'bg-indigo-600 text-indigo-100' : 'bg-indigo-400'} text-gray-900 font-bold rounded-xl
              transform transition-all duration-300 hover:scale-105 
              shadow-lg hover:shadow-xl flex items-center space-x-2
              ${isHovered ? 'animate-pulse' : ''}
            `}>
              <span>Register Now</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegistrationComponent