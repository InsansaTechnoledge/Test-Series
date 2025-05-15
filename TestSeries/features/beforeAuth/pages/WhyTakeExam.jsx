import React from 'react'
import Audit from '../../../assests/Landing/whyTakeExam/Audit.svg'
import Marketing from '../../../assests/Landing/whyTakeExam/Marketing.svg'
import Survey from '../../../assests/Landing/whyTakeExam/Survey.svg'
import line from '../../../assests/Landing/whyTakeExam/line.svg'




const WhyTakeExam = () => {
  return (
<div className="relative flex items-center flex-col px-50 mt-16 pb-20">

        {/* header part*/}
      <h1 className='text-violet-950 font-bold text-5xl z-10 leading-snug'>Why take Exam/Test on our Platform?</h1>
      <p className="mb-12 mt-4 text-violet-900 text-xl text-center text-wrap w-9/12">
            Boost your exam preparation with Test Series for Banking, SSC, RRB & All other Govt.
            Exams Boost your exam preparation with Test Series for Banking, SSC, RRB & All other
            Govt. Exams
      </p>


        {/* grid part*/}

      <div className="grid grid-cols-3 gap-6 mt-8 w-11/12">

      <div className="flex flex-col items-center text-center px-4">
        <img src={Marketing} alt="Different Exam Patterns" className="h-fit w-fit mb-4" />
        <span className="text-2xl font-semibold text-violet-900 mb-2">
            Different Exam Patterns
        </span>
        <p className="text-gray-700 text-xl max-w-sm">
            Prepare for the level expected in the upcoming exams.
        </p>
     </div>

        <div className="flex flex-col items-center text-center px-4 ">
            <img src={Survey} alt="Different Exam Patterns " className="h-fit w-fit mb-4" />
            <span className="text-2xl font-semibold text-violet-900 mb-2">
            Save Tests & Questions            
            </span>
            <p className="text-gray-700 text-xl max-w-sm">
                Save important Tests & Questions
                to revise or reattempt them later.            
            </p>
        </div>

        <div className="flex flex-col items-center z-10 text-center px-4 ">
            <img src={Audit} alt="Different Exam Patterns" className="h-fit w-fit mb-4"/>
            <span className="text-2xl font-semibold text-violet-900 mb-2">
                In-depth Performance Analysis            
            </span>
            <p className="text-gray-700 text-xl max-w-sm">
                Prepare for the level expected
                in the upcoming exams.            
            </p>
        </div>
     </div>

    {/* img part*/}
        {/* <img
        src={line}
        alt="line image"
        className="hidden absolute bottom-0 right-0"
    /> */}


    </div>
  )
}

export default WhyTakeExam
