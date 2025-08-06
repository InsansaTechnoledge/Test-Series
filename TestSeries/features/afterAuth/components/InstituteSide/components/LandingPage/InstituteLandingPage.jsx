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
import LogoLight from '../../../../../../assests/Logo/Frame 8.svg'
import LogoDark from '../../../../../../assests/Logo/Frame 15.svg'
import { Construction } from 'lucide-react';


const InstituteLandingPage = () => {
  const {user} = useUser();
  console.log("user.roleFeatures =", user.roleFeatures, typeof user.roleFeatures);
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
    <>
      <img className='mx-auto mb-12 pt-12' src={theme === 'light' ? LogoLight : LogoDark} alt="" />
    <div className={`grid grid-cols-2 ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-950'}`}>

      <div className={` items-center justify-center ${theme === 'light' ? '' : 'bg-gray-950'}`}>
        <div className={`bg-white ${theme === 'light' ? '' : 'bg-gray-900'} border-2 border-gray-100 ${theme === 'light' ? '' : 'border-gray-800'} rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden max-w-2xl mx-6`}>
          {/* Header Section */}
          <div className={`bg-gradient-to-r ${theme === 'light' ? 'from-blue-50 to-indigo-50' : 'bg-gray-800'} px-8 py-6 border-b ${theme === 'light' ? 'border-gray-100' : 'border-gray-700'} text-center`}>
            <div className={`w-12 h-12 ${theme === 'light' ? 'bg-blue-600' : 'bg-blue-500'} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md`}>
              <Construction className="w-6 h-6 text-white" />
            </div>
            <h1 className={`text-3xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'} mb-2`}>
              Development in Progress
            </h1>
          </div>

          {/* Content Section */}
          <div className={`px-8 py-8 text-center ${theme === 'light' ? '' : 'bg-gray-900'}`}>
            <h2 className={`text-xl font-semibold ${theme === 'light' ? 'text-gray-800' : ' text-gray-200'} mb-4`}>
              User Landing Page is Currently under Development
            </h2>
            <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} text-lg mb-6`}>
              Please navigate to the next page to continue.
            </p>
            
            <div className={`${theme === 'light' ? 'bg-amber-50 border-amber-200' : 'bg-amber-900/20 border-amber-800'} border rounded-xl p-4`}>
              <p className={`${theme === 'light' ? 'text-amber-700' : 'text-amber-300'} text-sm font-medium`}>
                This page is only accessible to faculty member of organizations.
              </p>
            </div>

            <div className={` mt-8 relative overflow-hidden ${theme === 'light' ? 'bg-green-600' : 'bg-green-700'} rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300`}>
              <div className="relative flex items-center gap-3">
               
                <div>
                  <p className="text-white font-bold text-lg leading-tight">
                    Good News!
                  </p>
                  <p className="text-green-100 text-sm font-medium">
                    You can still access and use other pages that are assigned to you or are under your role.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <h1 className={`${theme === 'light' ? 'bg-gray-100 text-gray-800' : 'bg-gray-700 text-gray-100'} text-xl font-bold text-center py-3 rounded-2xl `}>Roles Assigned to {user?.name || 'undefined'}</h1>
        {Object.entries(user.roleFeatures).map(([featureGroup, actions], idx) => (
          <div
            key={idx}
            className={`rounded-lg p-3 border ${
              theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'
            }`}
          >
            {/* Group Title */}
            <div
              className={`text-sm font-semibold mb-2 capitalize ${
                theme === 'light' ? 'text-gray-800' : 'text-gray-100'
              }`}
            >
              {featureGroup.replace('_', ' ')}
            </div>

            {/* Actions List */}
            <div className="flex flex-wrap gap-2 text-xs">
              {Object.entries(actions).map(([action, status], i) => (
                <span
                  key={i}
                  className={`px-2 py-0.5 rounded-full font-medium ${
                    status === 'active'
                      ? theme === 'light'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-green-900 text-green-300'
                      : theme === 'light'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-red-900 text-red-300'
                  }`}
                >
                  {action.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
    </>
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

