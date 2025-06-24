import { ArrowRight, Building, CheckCircle } from 'lucide-react';
import React from 'react';
import LoginForm from './LoginForm';
import { useNavigate } from 'react-router-dom';
import  logo from "../../../../assests/Landing/Navbar/evalvo logo blue 2.svg"

const InstituteLoginPage = (props) => {
    const navigate = useNavigate();
    return (
        <div>
         


            
<div className='bg-gradient-to-b from-blue-50 to-white grid lg:grid-cols-12 gap-20 px-20 pt-20 min-h-screen'>

   
        <div className='lg:col-span-5 max-w-lg text-center lg:text-left w-ful'>
            <img src={logo} width={200} className='mx-auto lg:mx-0 mb-8'></img>
            
            <h1 className='mt-5 text-indigo-600 font-bold text-5xl'>
                Institute Login
            </h1>
            
            <div className='flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-12'>
                <h2 className='text-indigo-950 font-semibold text-lg whitespace-nowrap'>Are you a Student?</h2>
                <button
                    onClick={() => navigate('/login?role=Student')}
                    className='group flex items-center space-x-3 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105'>
                    <span className='font-medium'>Student Login</span>
                    <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform duration-200' />
                </button>
            </div>
        </div>
    
    

   
        <div className='lg:col-span-7'>
            <LoginForm/>
        </div>
   
</div>
        </div>

    )
}

export default InstituteLoginPage;