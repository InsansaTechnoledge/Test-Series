import QuestionCategoriesBento from "./Bento/QuestionCategoriesBento";

import React from 'react'
import QBMSstats from "./QBMSstats";
import AllCategoriesBody from "./AllCategoriesBody";

const BodySkeleton = ({categories, QuestionLength , organizationId , setSelectedQuestionType}) => {
  return (
    <>
        <div className="min-h-screen">
            <QBMSstats categories={categories} QuestionLength={QuestionLength}/>
            <AllCategoriesBody categories={categories} organizationId={organizationId} setSelectedQuestionType={setSelectedQuestionType}/>
        </div>
    </>
  )
}

export default BodySkeleton
