import React from 'react'
import LogoLight from '../../../../../../assests/Logo/Frame 15.svg'
import certificate from '../../../../../../assests/Certificate/certificate.svg'

const Header = () => {
  return (
    <div className='bg-gradient-to-br from-indigo-600 to-indigo-900 mt-12 grid grid-cols-2 mx-auto text-center py-6 px-4'>
     
      <div className="flex items-center justify-center">
      <div className="text-left">
        <img src={LogoLight} alt="" className="block h-14 mb-6" />
        <h1 className="text-5xl text-gray-100 font-bold mb-8">Certificate Distribution</h1>
        <span className="m text-gray-100 font-medium">
          Choose <span className="text-gray-100">certificate</span> templates and assign them to your exams and contests
        </span>
      </div>
      </div>

      <div>
        <img src={certificate} alt="" />
      </div>
      
    </div>
  )
}

export default Header
