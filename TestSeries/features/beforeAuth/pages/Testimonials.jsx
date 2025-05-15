import React from 'react'
import openQuotes from '../../../assests/Landing/Testimonials/openQuotes.svg';
import CloseQuotes from '../../../assests/Landing/Testimonials/closeQuotes.svg';
import profile from '../../../assests/Landing/Testimonials/profile.png';

const testimonialCards = [
    {
        icon: profile,
        name: "Muain Haseeb",
        organization: "Executive Director at AI Arab Medical laboratories, Saudi Arabia",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum laboriosam velit vitae natus, iure doloribus delectus quia quod accusamus ea Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius dolor iure magnam?."
    },
    {
        icon: profile,
        name: "Muain Haseeb",
        organization: "Executive Director at AI Arab Medical laboratories, Saudi Arabia",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum laboriosam velit vitae natus, iure doloribus delectus quia quod accusamus ea Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius dolor iure magnam?."
    }
]

const Testimonials = () => {
  return (
    <div className='px-50 mt-20 bg-[#f1f2ff] py-20'>
        <h1 className='text-indigo-900 font-bold text-5xl mx-20 text-center'>
            Here's what our satisfied customers have to say about Online Exam
        </h1>
        <div className='grid grid-cols-2 mt-20 gap-20 mx-30'>
            {
                testimonialCards.map((testimonialCard, idx) => (
                    <div 
                    className='bg-[#E4E5FF] rounded-xl p-6'
                    key={idx}>
                        <div className='flex space-x-4'>
                            <div className='mr-5'>
                            <img 
                            className='w-20 h-20  rounded-full object-contain'
                            alt='profile'
                            src={testimonialCard.icon} />
                            </div>
                            <div>
                                <h1 className='text-indigo-900 font-semibold text-2xl'>
                                    {testimonialCard.name}
                                </h1>
                                <h2 className='text-indigo-900 text-sm font-semibold'>
                                    {testimonialCard.organization}
                                </h2>
                            </div>
                        </div>
                        <div className='mt-4'>
                            <img
                            src={openQuotes}
                            alt='openquotes'/>
                        </div>
                        <div className='my-1'>
                            "{testimonialCard.text}"
                        </div>
                        <div className='flex justify-end'>
                             <img
                            src={CloseQuotes}
                            alt='CloseQuotes'/>
                        </div>
                    </div>
                ))
            }
        </div>
    </div>
  )
}

export default Testimonials