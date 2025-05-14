import React from 'react'
import laptop from '../../../assests/Landing/TestTypes/laptop.svg';
import line from '../../../assests/Landing/TestTypes/line.svg';
import {CheckCircle} from 'lucide-react';

const types = [
    "Mcq's",
    "MsQ",
    "Fill In The Blanks",
    "Matching",
    "Compehension",
    "Number Type",
    "Code Compiler"
]

const TestTypes = () => {
    return (
        <div className='relative py-20'>
            <img src={line} alt='line_here'
            className='w-full absolute z-0 py-24'
            />
            <div className='relative grid grid-cols-2 px-50 z-10'>
                <div className=''>
                    <h1 className='text-indigo-900 text-[42px] font-bold leading-snug'>
                        Our Platform offers Different Types of Test
                    </h1>
                    <h2 className='text-indigo-900 font-semibold text-xl leading-snug mt-8'>
                        Boost your exam preparation with Test Series for Banking, SSC, RRB &
                        All other Govt. Exams.
                    </h2>
                    <div className='
                    px-12 py-6 mt-10
                    rounded-xl bg-[#E4E5FF]'>
                        <ul className='text-indigo-900 font-semibold text-lg space-y-2'>
                            {types.map((type, idx) => (
                                <li key={idx}
                                className='flex space-x-4'>
                                    <CheckCircle className='my-auto'/>
                                    <span className='my-auto text-xl'>
                                        {type}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className=''>
                    <img
                        className='ml-34 w-lg'
                        src={laptop} alt='img_here' />
                </div>
            </div>
        </div>
    )
}

export default TestTypes