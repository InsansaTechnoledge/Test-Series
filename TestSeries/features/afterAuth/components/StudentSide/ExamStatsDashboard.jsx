import React from 'react'
import ExamLinksComponent from './ExamLinksComponent'
import { Rank } from '../../data/DisplayComponentData'
import ExamRankLineChart from './StatsComponent/ExamRankLineChart'
import MarksVsExamsChart from './StatsComponent/MarksVsExamsChart'
import ExamBreakdown from './StatsComponent/ExamBreakdown'
import HeadingUtil from '../../utility/HeadingUtil'
import ViewAllButton from './StatsComponent/ViewAllButton'

const ExamStatsDashboard = () => {
    return (
        <div>
            <HeadingUtil heading="Overall Analytics" description="for more detailed view visit dedicated page" />
            <ExamLinksComponent Data={Rank} />
            <ExamRankLineChart />
            <MarksVsExamsChart />
            <ExamBreakdown />
            <ViewAllButton/>
        </div>

    )
}

export default ExamStatsDashboard
