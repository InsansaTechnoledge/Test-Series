import React from 'react'
import ExamLinksComponent from './ExamLinksComponent'
import { Rank , RankGrid} from '../../../data/DisplayComponentData'
import ExamRankLineChart from '../StatsComponent/ExamRankLineChart'
import MarksVsExamsChart from '../StatsComponent/MarksVsExamsChart'
import ExamBreakdown from '../StatsComponent/ExamBreakdown'
import HeadingUtil from '../../../utility/HeadingUtil'
import ViewAllButton from '../StatsComponent/ViewAllButton'

const ExamStatsDashboard = () => {
    return (
        <div className=' mx-6 md:mx-40 py-10 px-20 bg-blue-50/50 rounded-3xl mb-10'>
            <HeadingUtil heading="Overall Analytics" description="for more detailed view visit dedicated page" />
            <ExamLinksComponent Data={Rank} grid={RankGrid} />
            <ExamRankLineChart />
            <MarksVsExamsChart />
            <ExamBreakdown />
            <ViewAllButton/>
        </div>

    )
}

export default ExamStatsDashboard
