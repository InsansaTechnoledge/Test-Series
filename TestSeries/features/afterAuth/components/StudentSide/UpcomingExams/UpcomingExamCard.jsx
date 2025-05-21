import { BookOpen, CalendarDays, Clock, Goal, ReceiptText } from 'lucide-react'
import React from 'react'
import dottedLine from '../../../../../assests/StudentLanding/UpcomingExams/line.svg';
import dateFormatter from '../../../../../utils/dateFormatter';

const UpcomingExamCard = ({ data }) => {
    return (
        <div className='hover:scale-105 duration-200 transition-all flex flex-col gap-2 shadow-md p-6 rounded-xl'>
            <div className='flex gap-4'>
                <div>
                    <BookOpen className='w-12 h-12 text-indigo-950' />
                </div>
                <span className='my-auto text-indigo-950 text-2xl font-bold'>
                    {data.name}
                </span>
            </div>
            <div className='text-gray-700 text-sm'>
                Description: {data.description}
            </div>
            <div>
                <img src={dottedLine} className='w-full my-3' />
            </div>
            <div className='flex gap-4 justify-between text-gray-500'>
                {/* <div className='flex gap-2'>
                <div>
                    <ReceiptText />
                </div>
                <span>
                    {data.questions} Questions
                </span>
            </div> */}
                <div className='flex gap-2'>
                    <div>
                        <Goal />
                    </div>
                    <span>
                        {data.total_marks} Marks
                    </span>
                </div>
                <div className='flex gap-2'>
                    <div>
                        <Clock />
                    </div>
                    <span>
                        {data.duration} Hours
                    </span>
                </div>
            </div>
            <div>
                <div className='mt-5 flex gap-2 text-gray-500'>
                    <div>
                        <CalendarDays />
                    </div>
                    <span>
                        {dateFormatter(data.date)}
                    </span>
                </div>
            </div>
            <div className='mt-4 grid grid-cols-2 gap-2 md:gap-8 lg:gap-12'>
                <button className='hover:cursor-pointer bg-blue-100 px-3 py-2 rounded-lg border-blue-900 border'>
                    View syllabus
                </button>
                <button className='hover:cursor-pointer bg-blue-950 text-white px-3 py-2 rounded-lg'>
                    View Guidelines
                </button>
            </div>
        </div>
    )
}

export default UpcomingExamCard