import { ArrowLeft, Check } from 'lucide-react';
import React from 'react'
import { useNavigate } from 'react-router-dom';

const LoginHeader = (props) => {
    const navigate = useNavigate();

    return (
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 pt-6 px-4">
            <button
                className='group flex justify-center items-center bg-amber-50 text-blue-950 border-2 border-white px-8 rounded-4xl'
                onClick={() => navigate('/')}
            >
                <ArrowLeft className=' my-4 mr-3 h-5 w-6 group-hover:-translate-x-3  text-blue-400 duration-400' />
                Back
            </button>
            <div className="pt-6 pb-12 md:pb-20 container mx-auto">

                <div className="max-w-4xl mx-auto">

                    <div className="flex items-center justify-center mb-6">
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-6">
                        Login Your {props.loginFor} <span className="text-green-400">Now</span>
                    </h1>

                    {/* <p className="text-xl md:text-2xl text-indigo-100 text-center mb-8">
            Join our network of educational excellence and unlock powerful assessment tools 
            <span className="font-bold text-white"> pricing that fits your budget</span>
          </p>
           */}





                </div>
            </div>
        </div>
    );
}

export default LoginHeader