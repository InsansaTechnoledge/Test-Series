import React from 'react'
import { Outlet } from 'react-router-dom';
import Navbar from '../features/afterAuth/components/Navbar/Navbar';

const StudentLayout = () => {
  return (
    <>
      <div className='relative w-screen h-screen'>
        <div>
          <Navbar />
        </div>
        <div className='p-6 md:p-10 max-w-7xl mx-auto'>
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default StudentLayout;