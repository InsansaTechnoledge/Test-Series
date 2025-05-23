import { BookOpen, CalendarDays, Clock, Goal, Radio } from 'lucide-react'
import React from 'react'
import dateFormatter from '../../../../../utils/dateFormatter'
import dottedLine from '../../../../../assests/StudentLanding/UpcomingExams/line.svg'

const LiveExamCard = ({ data, onStartTest }) => {

   
    return (
        <div className='hover:scale-[103%] duration-200 transition-all flex flex-col gap-2 shadow-md p-6 rounded-xl'>
            <div className='flex justify-between'>
                <div className='flex gap-4'>
                    <div>
                        <BookOpen className='w-12 h-12 text-indigo-950' />
                    </div>
                    <span className='my-auto text-indigo-950 text-2xl font-bold'>
                        {data.name}
                    </span>
                </div>
                <div className='text-red-700 bg-gray-100 px-4 py-2 rounded-lg flex gap-2 font-semibold text-lg'>
                    <div className='flex'>
                        <Radio className='w-6 h-6 my-auto'/>
                    </div>
                    <span className='my-auto'>
                        Live now
                    </span>
                </div>
            </div>
            <div className='text-gray-700 text-sm'>
                Description: {data.description}
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
                
            </div>
            <div className='flex gap-4 justify-between text-gray-500'>
                <div className='flex gap-2 text-gray-500'>
                    <div>
                        <Clock />
                    </div>
                    <span>
                        {data.duration} Mins
                    </span>
                </div>
                
            </div>
            <div className='mt-4 flex justify-between'>
                <div className='flex gap-4'>
                    <button className='w-fit hover:cursor-pointer bg-blue-100 px-4 py-2 rounded-lg border-blue-900 border'>
                        View syllabus
                    </button>
                    <button className='w-fit hover:cursor-pointer bg-blue-100 px-4 py-2 rounded-lg border-blue-900 border'>
                        View Guidelines
                    </button>
                </div>

                <button
                onClick={() => onStartTest(data.id)} 
                className='bg-blue-950 text-white px-4 py-2 rounded-lg'
                >
          Start Test
        </button>
            </div>
        </div>
    )
}

export default LiveExamCard