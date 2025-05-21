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
        <Outlet />
      </div>
    </>
  )
}

export default StudentLayout;