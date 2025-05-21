import React from 'react'
import { useNavigate } from 'react-router-dom'

const SessionExpireError = () => {
  const navigate = useNavigate();

  return (
    <div className='w-full h-screen flex flex-col justify-center gap-2'>
      <h1 className='text-center text-indigo-950 text-4xl font-bold'>Oops! Session Expired</h1>
      <h2 className='text-center text-lg font-bold'>Please Sign in again</h2>
      
        <button 
        onClick={()=>navigate("/login")}
        className='hover:cursor-pointer mt-10 bg-indigo-950 px-4 py-2 rounded-md text-white text-lg w-fit mx-auto'>
          Login Now
        </button>
    </div>
  )
}

export default SessionExpireError