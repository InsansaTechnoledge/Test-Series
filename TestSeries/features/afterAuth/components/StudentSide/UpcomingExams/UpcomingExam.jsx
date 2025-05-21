import React from 'react'
import HeadingUtil from '../../../utility/HeadingUtil'
import NeedHelpComponent from '../../InstituteSide/components/NeedHelpComponent'
import UpcomingExamCard from './UpcomingExamCard'
import LiveExamCard from './LiveExamCard'

const UpcomingExam = () => {

    const upcomingExams = [
        {
            name: "Test Name",
            date: new Date,
            total_marks: 50,
            duration: 2,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet."
        },
        {
            name: "Test Name",
            date: new Date,
            total_marks: 50,
            duration: 2,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet."
        },
    ]

    const liveExams = [
        {
            name: "Test Name",
            date: new Date,
            total_marks: 50,
            duration: 2,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet."
        }
    ]
    
    const question = "How To assign role groups to users ?"
    const answer = "Use the created role groups to assign permissions to users in your add user section."

    return (
        <div>
            <HeadingUtil heading="Upcoming Exams" description="You can appear for the upcoming exams from here" />
            <div className="max-w-6xl mx-auto">
                <NeedHelpComponent heading="Want to take exam ?" about="Take AI-Proctored exams " question={question} answer={answer} />
            </div>
            <h1 className='mt-20 text-3xl text-indigo-900 font-bold mb-2'>Live Exam:</h1>
            <div className='flex flex-col'>
                {
                    liveExams.map((exam, idx) => (
                        <LiveExamCard key={idx} data={exam}/>
                    ))
                }
            </div>
            <h1 className='mt-20 text-3xl text-indigo-900 font-bold mb-2'>Upcoming Exams:</h1>
            <div className='mt-12 grid lg:grid-cols-2 gap-10 xl:grid-cols-3'>
                {
                    upcomingExams.map((exam, idx) => (
                        <UpcomingExamCard key={idx} data={exam} />
                    ))
                }
            </div>
        </div>
    )
}

export default UpcomingExam