import QuestionCategoriesBento from "./Bento/QuestionCategoriesBento";

import React from 'react'
import QBMSstats from "./QBMSstats";
import AllCategoriesBody from "./AllCategoriesBody";

const BodySkeleton = ({categories, QuestionLength , organizationId , setSelectedQuestionType , setShowAnalysis}) => {
  return (
    <>
        <div className="min-h-screen">
            <QBMSstats categories={categories} QuestionLength={QuestionLength}/>
            <AllCategoriesBody categories={categories} organizationId={organizationId} setSelectedQuestionType={setSelectedQuestionType} setShowAnalysis={setShowAnalysis}/>
        </div>
    </>
  )
}

export default BodySkeleton
