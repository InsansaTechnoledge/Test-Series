import React from 'react'
import Header from './components/HeaderComponent';
import QuickSteps from './components/QuickStep';
import Analytics from './components/Analytics';
import MostActiveBatch from './components/MostActiveBatch';
import Features from './components/Features';
// import { mockUser } from './components/Data//';
import useExamBatchAnalytics from '../../../../../../hooks/UseCachedExamBatchAnalytics';
import { useUser } from '../../../../../../contexts/currentUserContext';
import { useTheme } from '../../../../../../hooks/useTheme';
import { useCachedBatches } from '../../../../../../hooks/useCachedBatches';

const InstituteLandingPage = () => {
  const {user} = useUser();
  console.log( "user" ,user)
  const {batches,batchMap} = useCachedBatches();

  const {examBatchAnalytics}=useExamBatchAnalytics(); 
  console.log("examBatchAnalytics", examBatchAnalytics);

  const {theme} = useTheme();

  // if (!user?.planPurchased) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-50">
  //       <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
  //         <h1 className="text-2xl font-bold text-gray-800 mb-4">Plan Not Purchased</h1>
  //         <p className="text-gray-600">Please purchase a plan to access this page.</p>
  //       </div>
  //     </div>
  //   );
  // }
if(user.role !== 'organization') {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">hello this is user landing page</h1>
        <p className="text-gray-600">This page is only accessible to organizations.</p>
      </div>
    </div>
  );
}
else
  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="mx-auto space-y-6">
        <Header user={user} theme={theme} />
        <QuickSteps theme={theme} />
        <Analytics examBatchAnalytics={examBatchAnalytics}  theme={theme} batches={batches} />
        <MostActiveBatch theme={theme} examBatchAnalytics={examBatchAnalytics} batchMap={batchMap}/>
        <Features theme={theme}/>
      
      </div>
    </div>
  );
}

export default InstituteLandingPage

