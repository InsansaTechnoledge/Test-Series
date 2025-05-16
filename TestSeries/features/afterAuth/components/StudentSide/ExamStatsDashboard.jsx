import React from 'react'
import ExamLinksComponent from './ExamLinksComponent'
import { Rank } from '../../data/DisplayComponentData'
import HeadingUtil from '../../utility/HeadingUtil'

const ExamStatsDashboard = () => {
  return (
    <div>
      <HeadingUtil heading="Overall Analytics" description="for more detailed view visit dedicated page"/>
      <ExamLinksComponent Data={Rank}/>
    </div>
  )
}

export default ExamStatsDashboard
