import React from 'react'
import ExamLinksComponent from './ExamLinksComponent'
import { Rank } from '../../data/DisplayComponentData'

const ExamStatsDashboard = () => {
  return (
    <div>
      <ExamLinksComponent Data={Rank}/>
    </div>
  )
}

export default ExamStatsDashboard
