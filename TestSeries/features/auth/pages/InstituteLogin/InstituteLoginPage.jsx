import { ArrowRight, CheckCircle } from 'lucide-react';
import React from 'react';

const InstituteLoginPage = (props) => {
  return (
    <div>
        <div className='grid grid-cols-12 gap-20 mx-20 pt-20 min-h-screen'>
            <div className='col-span-5'>
                <h1 className='text-indigo-950 font-bold text-5xl'>
                    Institute Login
                </h1>
                <div className=''>
                    <div className='px-8 py-4 rounded-lg bg-blue-500/30 w-fit my-10'>
                        <div className='space-y-2'>
                            <div className='flex space-x-2'>
                                <CheckCircle /> 
                                <span>
                                    Lorem ipsum dolor sit amet.
                                </span>
                            </div>
                            <div className='flex space-x-2'>
                                <CheckCircle /> 
                                <span>
                                    Lorem ipsum dolor sit amet.
                                </span>
                            </div>
                            <div className='flex space-x-2'>
                                <CheckCircle /> 
                                <span>
                                    Lorem ipsum dolor sit amet.
                                </span>
                            </div>
                        </div>
                    </div>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi dolorem earum officia excepturi et omnis corrupti sapiente. Voluptatum, quaerat animi.
                </div>

                <div className='flex space-x-2 mt-10 w-fit'>
                    <h2 className='my-auto text-indigo-950 font-semibold text-lg'>Are you a Student?</h2>
                    <button 
                    onClick={()=>props.setLoginFor('student')}
                    className='my-auto group py-2 px-6 bg-indigo-950 text-white rounded-lg'>
                        <div className='flex space-x-2'>
                            <span>
                                Student Login
                            </span>
                            <ArrowRight className='group-hover:translate-x-2 transition-all duration-200'/>
                        </div>
                    </button>
                </div>
            </div>
            <div className='col-span-7'>
                <form className='shadow-sm p-5'>
                    
                </form>
            </div>
        </div>
    </div>
  )
}

export default InstituteLoginPage;