import { Award, BookOpen, BookOpenCheck, Hexagon, Mail, Medal, NotepadText, Phone, UsersRound } from 'lucide-react'
import React from 'react'
import dashedLine from '../../../../assests/StudentLanding/dashedLine.svg';

const student = {
    name: "Jay Fanse",
    email: "jayf29112003@gmail.com",
    phone: "+91 9726535193",
    profilePhoto: `https://ui-avatars.com/api/?name=Jay%20Fanse&background=random`,
    certifications: ['Table-Topper', 'Early-Bird', 'All-Nighter', 'Finisher', 'Early-Bird', 'All-Nighter', 'Finisher']
}

const subjects = ["Physics", "Chemistry", "Maths", "English", "Computer science"];

const StudentDetails = () => {
    return (
        <div className='
    grid grid-cols-2 relative gap-10
    rounded-xl shadow-sm shadow-gray-700/50 py-6 px-8 border-blue-600'>
            {/* Student Side */}
            <div className='flex space-x-4'>
                <div>
                    <img src={student.profilePhoto}
                        alt='profilePhoto'
                        className='rounded-full'
                    />
                </div>
                <div className='w-full'>
                    <h1 className='text-4xl mt-1 font-bold text-indigo-900'>{student.name}</h1>
                    <div className='text-indigo-900 mt-10 space-y-3'>
                        <div className='flex space-x-4'>
                            <div>
                                <Mail />
                            </div>
                            <span>
                                {student.email}
                            </span>
                        </div>
                        <div className='flex space-x-4 '>
                            <div>
                                <Phone />
                            </div>
                            <span>
                                {student.phone}
                            </span>
                        </div>
                        <div className='flex space-x-4 '>
                            <div>
                                <Medal />
                            </div>
                            <div className='flex flex-wrap gap-1'>
                                {
                                    student.certifications.map((certificate, idx) => (
                                        <div
                                            key={idx}
                                            className='text-nowrap text-sm bg-blue-600/30 rounded-md py-2 px-4'>
                                            {certificate}
                                        </div>
                                    ))
                                }
                            </div>

                        </div>
                        <div className='flex space-x-4'>
                            <div>
                                <Award />
                            </div>
                            <div className='flex flex-wrap gap-1'>

                                <Hexagon className='text-red-500' />
                                <Hexagon className='text-red-500' />
                                <Hexagon className='text-red-500' />
                                <Hexagon className='text-red-500' />

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <img src={dashedLine}
                className='absolute w-70 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 h-10 rotate-90'
            />
            {/* Batch Side */}
            <div className=''>
                <div className='w-full'>
                    <h1 className='text-4xl mt-1 font-bold text-indigo-900'>BE-4</h1>
                    <h2 className='text-lg font-semibold text-indigo-900'>2025</h2>
                    <div className='text-indigo-900 mt-3 space-y-3'>
                        <div className='flex space-x-4'>
                            <div>
                                <UsersRound />
                            </div>
                            <span>
                                30 Students
                            </span>
                        </div>
                        <div className='flex space-x-4 '>
                            <div>
                                <BookOpenCheck />
                            </div>
                            <span>
                                5 Tests taken
                            </span>
                        </div>
                        <div className='flex space-x-4 '>
                            <div>
                                <BookOpen />
                            </div>
                            <div className='flex flex-wrap gap-1'>
                                {
                                    subjects.map((subject, idx) => (
                                        <div
                                            key={idx}
                                            className='text-nowrap text-sm bg-blue-600/30 rounded-md py-2 px-4'>
                                            {subject}
                                        </div>
                                    ))
                                }
                            </div>

                        </div>
                        <div className='flex space-x-4'>
                            <div>
                                <NotepadText />
                            </div>
                            <button className='hover:text-white hover:bg-indigo-900 hover:cursor-pointer border-indigo-900 rounded-lg px-4 py-1 text-sm border'>
                                View syllabus
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentDetails