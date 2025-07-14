import React from 'react'
import { AlertTriangle } from 'lucide-react';


const ExamPageIntroHeader = ({Banner , Available_Limit , NeedHelpComponent , canCreateMoreExams}) => {
  return (
    <div>
      <div className="relative overflow-hidden rounded-xl h-80 mt-3">
        {/* // Background Image */}
        <img
          src={Banner}
          alt="Upload Banner"
          className="absolute  w-full h-full object-cover"
        />
        <div className="absolute "></div>

        <div className="relative z-10 flex items-center justify-center h-full px-6 text-center w-full">
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-lg">
              Create Exam
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              Easily manage and publish your exams
            </p>



            <div className="flex items-center justify-center">
              <p className="mt-8 text-indigo-700 bg-indigo-50 border border-indigo-100 px-5 py-4 rounded-2xl text-base flex items-center gap-3 shadow-sm backdrop-blur-sm">
                <AlertTriangle className="w-5 h-5 text-indigo-400" />
                <span>
                  <span className="font-semibold">Note:</span> For your current plan, you have an available limit of
                  <span className={`${Available_Limit > 0 ? "text-green-500" : "text-red-500"} mx-2`}>{Available_Limit}</span>Exams

                </span>
              </p>
            </div>

          </div>
        </div>
      </div>



      {/* Need help */}
      <div className=' mx-auto  -mt-10 relative z-20 w-[90%]'>
        <NeedHelpComponent heading="want to create new exam ?" about="first download sample excel template to bulk upload" question="can i use both meathods to create exam ?" answer="users can use both meathods and all types of questions to create new exam" />

        {!canCreateMoreExams && (
          <p className="mt-4 text-center text-sm text-red-600 bg-red-100 border border-red-200 px-4 py-2 rounded-xl shadow-sm backdrop-blur-sm">
            You've reached your Exam creation limit. <br className="sm:hidden" />
            <span className="font-medium">Upgrade your plan</span> to continue.
          </p>

        )}
      </div>
    </div>
  )
}

export default ExamPageIntroHeader
