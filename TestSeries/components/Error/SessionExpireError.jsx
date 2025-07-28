import React from 'react'
import { Clock, RefreshCw, ArrowRight } from 'lucide-react'
import Logo from '../../assests/Logo/Frame 8.svg'
import {useNavigate} from 'react-router-dom';
  
const SessionExpireError = () => {
  const navigate = useNavigate();
   
  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex items-center justify-center p-4'>
      <div className='max-w-md w-full'>
        
        {/* Main content card */}
        <div className='relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-indigo-100 p-8 text-center transform hover:scale-105 transition-all duration-300'>
          {/* Your Logo */}
          <div className='mx-auto mb-8 flex justify-center'>
            <img src={Logo} className='h-16 w-auto' alt="Logo" />
          </div>
          
          {/* Clock icon with animation */}
          <div className='mx-auto mb-6 w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center border-2 border-indigo-100'>
            <Clock className='w-8 h-8 text-indigo-600 animate-pulse' />
          </div>
          
          {/* Main heading */}
          <h1 className='text-3xl font-bold text-indigo-600 mb-3'>
            Session Expired
          </h1>
          
          {/* Subheading */}
          <p className='text-indigo-800 text-lg mb-2 font-medium'>
            Your session has timed out
          </p>
          
          {/* Description */}
          <p className='text-indigo-700 mb-8 leading-relaxed'>
            For your security, we've signed you out. Please log in again to continue using the application.
          </p>
          
          {/* Action buttons */}
          <div className='space-y-3'>
            <button
              onClick={() => navigate("/login")}
              className='group w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2'
            >
              <RefreshCw className='w-5 h-5 group-hover:rotate-180 transition-transform duration-300' />
              Sign In Again
              <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform duration-200' />
            </button>
            
            <button
              onClick={() => navigate("/")}
              className='w-full text-indigo-600 hover:text-indigo-700 font-medium py-3 px-6 rounded-2xl hover:bg-indigo-50 transition-all duration-200 border border-indigo-200 hover:border-indigo-300'
            >
              Return to Home
            </button>
          </div>
          
          {/* Additional help text */}
          <div className='mt-8 pt-6 border-t border-indigo-200'>
            <p className='text-sm text-indigo-600'>
              Need help? Contact our{' '}
              <button className='text-indigo-600 hover:text-indigo-700 font-medium hover:underline'>
                support team
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SessionExpireError