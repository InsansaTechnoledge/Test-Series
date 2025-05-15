import { ArrowRight } from 'lucide-react'
import React from 'react'

const RegisterCTA = () => {
  return (
    <div className='flex justify-center items-center px-4'>
      <div className='w-8/12  bg-[#E4E5FF] py-16 px-6 md:px-12  rounded-3xl shadow-md text-center'>

        <h1 className='text-3xl md:text-4xl font-bold text-blue-950 mb-12'>
          Register your institute now
        </h1>

        <p className='py-6 text-lg md:text-2xl text-blue-900'>
          Join our network of educational excellence and unlock powerful assessment tools with pricing that fits your budget.
        </p>

        <div className='flex flex-col md:flex-row justify-center items-center gap-4 mt-4'>
        <button className='group flex text-xl items-center gap-2 bg-blue-950 text-white px-8 py-3 hover:cursor-pointer rounded-full hover:bg-blue-900 transition'>
            Register now
            <ArrowRight
                size={20}
                className='transform transition-transform duration-200 group-hover:translate-x-1'
            />
        </button>

          <button className='px-8 py-3 text-xl rounded-full border border-blue-950 text-blue-950 hover:cursor-pointer transition'>
            Schedule Demo
          </button>
        </div>

      </div>
    </div>
  )
}

export default RegisterCTA
