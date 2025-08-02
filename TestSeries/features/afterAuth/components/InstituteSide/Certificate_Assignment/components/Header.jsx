import React from 'react'
import LogoLight from '../../../../../../assests/Logo/Frame 8.svg'
const Header = () => {
  return (
    <div className='max-w-7xl mx-auto text-center py-6 px-4'>
        <img src={LogoLight} alt="" className="mx-auto block h-auto mb-6" />
        <span className='text-gray-500 font-medium'>Choose <span className='text-indigo-600'>certificate</span> templates and assign them to your exams and contests</span>
    </div>
  )
}

export default Header
