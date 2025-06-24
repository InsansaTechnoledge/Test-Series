import React from 'react'
import Header from './components/HeaderComponent';
import QuickSteps from './components/QuickStep';
import Analytics from './components/Analytics';
import MostActiveBatch from './components/MostActiveBatch';
import Features from './components/Features';
import { mockUser } from './components/Data/Data';

const InstituteLandingPage = () => {
  const user = mockUser; 

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

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Header user={user} />
        <QuickSteps />
        <Analytics />
        <MostActiveBatch />
        <Features />
      </div>
    </div>
  );
}

export default InstituteLandingPage

