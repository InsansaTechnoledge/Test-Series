import React from 'react'
import ExamLinksComponent from './ExamLinksComponent'
import { Rank } from '../../data/DisplayComponentData'
import ExamRankLineChart from './StatsComponent/ExamRankLineChart'
import MarksVsExamsChart from './StatsComponent/MarksVsExamsChart'
import ExamBreakdown from './StatsComponent/ExamBreakdown'
import HeadingUtil from '../../utility/HeadingUtil'

const ExamStatsDashboard = () => {
    return (
        <div>
            <HeadingUtil heading="Overall Analytics" description="for more detailed view visit dedicated page" />
            <ExamLinksComponent Data={Rank} />
            <ExamRankLineChart />
            <MarksVsExamsChart />
            <ExamBreakdown />
        </div>

    )
}

export default ExamStatsDashboard
