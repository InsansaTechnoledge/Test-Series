import React, { useEffect, useState } from 'react'

import useCachedContests from '../../../../../../hooks/useCachedContests'
import LiveContestCard from './components/LiveContestCard';

const LiveContestPage = () => {

    const {contestList} = useCachedContests();

    const [liveContest , setLiveContest] = useState();

    useEffect(() => {
        const filteredContest = contestList.filter(f => (f.go_live === true && f.isEnrolled === true));
        setLiveContest(filteredContest)
    },[contestList])

    console.log(liveContest)
  return (
    <div className='min-h-screen'>
      <LiveContestCard liveContest={liveContest}/>
    </div>
  )
}

export default LiveContestPage
