import React, { useState, useEffect } from 'react'
import logo from '../../assests/Footer/evalvo logo white 4.svg'

const Loader = () => {
  const [messageIndex, setMessageIndex] = useState(0)
  const [showDelayMessages, setShowDelayMessages] = useState(false)

  const messages = [
    "Loading...",
    "Please wait, setting things up...",
    "Server may take some time...",
    "Almost there, thanks for your patience...",
    "Still loading, please hold on...",
    "Processing your request..."
  ]

  useEffect(() => {
    // Show delay messages after 3 seconds
    const delayTimer = setTimeout(() => {
      setShowDelayMessages(true)
    }, 3000)

    // Rotate messages every 2.5 seconds after delay messages start
    let messageTimer
    if (showDelayMessages) {
      messageTimer = setInterval(() => {
        setMessageIndex((prevIndex) => {
          const nextIndex = prevIndex + 1
          // Stop at the last message (Processing your request...)
          if (nextIndex >= messages.length - 1) {
            clearInterval(messageTimer)
            return messages.length - 1
          }
          return nextIndex
        })
      }, 2500)
    }

    return () => {
      clearTimeout(delayTimer)
      if (messageTimer) clearInterval(messageTimer)
    }
  }, [showDelayMessages, messages.length])

  return (
    <div className='min-h-screen w-full bg-indigo-600 flex justify-center items-center backdrop-blur-2xl overflow-hidden'>
      <div className='flex flex-col items-center justify-center p-4'>
        <img 
          src={logo} 
          alt="evalvo_loader" 
          className='animate-ping w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 object-contain' 
        />
       
        <p className='text-white text-sm sm:text-base md:text-lg font-medium mt-4 animate-pulse text-center min-h-[1.5rem] sm:min-h-[2rem]'>
          {showDelayMessages ? messages[messageIndex] : messages[0]}
        </p>
        
        {showDelayMessages && (
          <div className='flex space-x-1 mt-2'>
            <div className='w-2 h-2 bg-white rounded-full animate-bounce' style={{ animationDelay: '0ms' }}></div>
            <div className='w-2 h-2 bg-white rounded-full animate-bounce' style={{ animationDelay: '1500ms' }}></div>
            <div className='w-2 h-2 bg-white rounded-full animate-bounce' style={{ animationDelay: '3000ms' }}></div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Loader