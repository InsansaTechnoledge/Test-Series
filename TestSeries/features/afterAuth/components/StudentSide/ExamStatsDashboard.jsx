import React from 'react'
import ExamLinksComponent from './ExamLinksComponent'
import { Rank } from '../../data/DisplayComponentData'
import ExamRankLineChart from './StatsComponent/ExamRankLineChart'
import MarksVsExamsChart from './StatsComponent/MarksVsExamsChart'
import ExamBreakdown from './StatsComponent/ExamBreakdown'

const ExamStatsDashboard = () => {
  return (
    <div className='px-40'>

      <ExamLinksComponent Data={Rank}/>
      <ExamRankLineChart />
      <MarksVsExamsChart />
      <ExamBreakdown />
    </div>
  )
}

export default ExamStatsDashboard
