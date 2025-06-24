import { ArrowLeft, Check } from 'lucide-react';
import React from 'react'
import { useNavigate } from 'react-router-dom';

const LoginHeader = (props) => {
    const navigate = useNavigate();

    return (
   
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 pt-6 px-4 relative overflow-hidden">

    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10"></div>
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
    <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
    
    <div className="relative z-10">
        <button
            className='group flex justify-center items-center bg-white/10 backdrop-blur-sm border border-white/20 text-indigo-50 px-6 py-3 rounded-2xl hover:bg-white/20 transition-all duration-300 ease-out hover:shadow-lg hover:shadow-indigo-500/25'
            onClick={() => navigate('/')}
        >
            <ArrowLeft className='my-1 mr-3 h-5 w-6 group-hover:-translate-x-2 text-indigo-100 transition-transform duration-300 ease-out' />
            <span className="font-medium">Back</span>
        </button>
        
        <div className="pt-8 pb-16 md:pb-24 container mx-auto">
            <div className="max-w-5xl mx-auto">
            
                
                <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-purple-200 text-center mb-8 leading-tight">
                    Login Your <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent font-extrabold">{props.loginFor}</span> Profile Now
                </h1>
                
                {/* Modern accent line */}
                <div className="flex justify-center mb-6">
                    <div className="w-24 h-1 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full"></div>
                </div>
            </div>
        </div>
    </div>
</div>
    );
}

export default LoginHeader