import React from 'react';
import heroBanner from '../../../../assests/StudentLanding/heroBanner.jpg';
import { Building, Mail, Phone } from 'lucide-react';
const StudentHero = () => {
    return (
        <div className='relative bg-black/60 shadow-gray-600'>
            <img src={heroBanner}
                alt='heroBanner'
                className='-z-10 absolute w-full h-full'
            />
            {/* banner */}
            <div className='px-20 py-10'>
                <h1 className='text-center text-white text-4xl font-bold'>
                    Organization Name
                <Building className='mx-auto mt-6 w-20 h-20'/>    
                </h1>
                <div className='text-white max-w-2/5 text-wrap my-5 mb-20 mx-auto text-center'>
                    Lorem ipsum dolor sit amet Lorem, ipsum dolor sit amet consectetur adim autem officiis eum repudiandae adipisicing elit. Magni, dolor. Lorem ipsum dolor sit amet.
                </div>
                <div className='mx-auto w-fit flex flex-col justify-center'>
                    <div className='text-white text-xl'>Connect with us on:</div>
                    <div className='w-fit flex justify-center space-x-8 mx-auto mt-5'>
                        <Mail className='text-white' />
                        <Phone className='text-white' />
                    </div>
                </div>
            </div>
            
        </div>
    )
}


export default StudentHero;
