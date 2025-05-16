import { Atom, Codepen, GraduationCap } from 'lucide-react';
import React from 'react'

const subjects = ["Physics", "Chemistry", "Maths", "English", "Computer Science"];

const SubjectCards = () => {
  return (
    <div className='bg-white py-16 px-6 md:px-20"'>
        <h1 className='text-4xl text-center text-indigo-900 font-bold'>
            Subject Details
        </h1>
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-40 mt-10'>
            {
                subjects.map((subject,idx) => (
                    <div 
                    className='
                    hover:cursor-pointer
                    hover:scale-105 transition-all duration-200 
                    relative overflow-hidden
                    bg-gradient-to-br from-blue-200 to-white
                    shadow-sm shadow-indigo-900 rounded-md text-indigo-900 font-bold text-2xl pt-8 pb-14 px-12'
                    key={idx}>
                        <span>
                            {subject}
                        </span>
                        <div className='absolute -bottom-8 -right-6'>
                            {
                                idx%2==0
                                ?
                                <Atom className='w-26 h-26 opacity-40'/>
                                :
                                <Codepen className='w-26 h-26 opacity-40'/>
                            }
                        </div>
                    </div>
                ))
            }
        </div>
    </div>
  )
}

export default SubjectCards