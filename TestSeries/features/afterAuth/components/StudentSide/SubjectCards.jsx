import { Atom, Codepen, GraduationCap } from 'lucide-react';
import React from 'react'
import HeadingUtil from '../../utility/HeadingUtil';

const subjects = ["Physics", "Chemistry", "Maths", "English", "Computer Science"];

const SubjectCards = () => {
  return (
    <div className='bg-white py-16 px-6 md:px-20"'>
        
        <HeadingUtil heading="Subject Details" description="Below is list of all included subjects in your course"/>
        
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-40 mt-10'>
            {
                subjects.map((subject,idx) => (
                    <div 
                    className='
                    hover:cursor-pointer
                    hover:scale-105 transition-all duration-200 
                    relative overflow-hidden
                    bg-blue-200/50
                    shadow-sm shadow-blue-500/50 rounded-md text-blue-600 font-semibold text-2xl pt-8 pb-14 px-12'
                    key={idx}>
                        <span>
                            {subject}
                        </span>
                        <div className='absolute -bottom-8 -right-6'>
                            {
                                idx%2==0
                                ?
                                <Atom className='w-26 h-26 opacity-15'/>
                                :
                                <Codepen className='w-26 h-26 opacity-15'/>
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