// import React from 'react';
// import landingIllustration from '../../../assests/Landing/Hero/herobg2.png';

// const LandingCover = () => {
//   return (
//     <div className="flex flex-col bg-white">
//       {/* Hero Section */}
//       <main className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-16 lg:px-24 py-12 h-full">
//         {/* Left: Text Content */}
//         <div className="w-full md:w-3/4 md:ml-10 space-y-8 text-center md:text-left pt-8 md:pt-0">
//           <div className="space-y-4">
//             <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
//             Create.<br className=" md:block" />
//             <span className='text-blue-700 text-bold'>Attempt.<br className=" md:block" /></span>
//               Get Results and <span className='text-blue-700 text-bold'>Analytics</span>.
//             </h1>
//             <p className="text-gray-600 text-lg md:text-xl max-w-md mx-auto md:mx-0">
//              <span className='border-b-2 border-blue-800'>Organizations</span> create tests effortlessly.  <span className='border-b-2 border-blue-800'>Students/Users</span>  take them seamlessly. Get instant results with powerful analytics to measure performance.
//             </p>
//           </div>         
//         </div>

//         {/* Right: Image Container */}
//         <div className="w-full md:w-1/2 flex justify-center md:justify-end items-center">
//           <div className="relative">
           
//             {/* Main illustration */}
//             <img
//               src={landingIllustration}
//               alt="Creative thinking illustration"
//               className="w-full max-w-xl md:mr-50 relative z-10"
//             />
//           </div>
//         </div>
//       </main>
      
     
//       <div className="bg-white py-6 px-6 md:px-16">
//         <div className="max-w-7xl mx-auto">
//           <p className="text-gray-500 text-sm text-center mb-4">Trusted by innovative teams worldwide</p>
//           <div className="flex justify-center space-x-12 opacity-60">
//             <div className="h-8 w-24 bg-gray-300 rounded"></div>
//             <div className="h-8 w-24 bg-gray-300 rounded"></div>
//             <div className="h-8 w-24 bg-gray-300 rounded"></div>
//             <div className="h-8 w-24 bg-gray-300 rounded"></div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LandingCover;

import React from 'react'

const ImageComponent = () => {
  return (
    <div className="mt-12 md:mt-16 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-32">
      <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden min-h-[60vh] md:min-h-[70vh] border border-gray-100 relative group">
        
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
       
        <div className="flex items-center justify-center h-full min-h-[60vh] md:min-h-[70vh] relative z-10">
          <div className="text-center space-y-4 p-8">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mx-auto flex items-center justify-center mb-6">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg"></div>
            </div>
            <p className="text-gray-400 text-lg md:text-xl font-light">Your analytics dashboard preview</p>
            <div className="flex justify-center space-x-2 mt-6">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Hero = () => {
  return (
    <div className="min-h-screen mb-24">
      <main className="pt-16 md:pt-20 lg:pt-24">
        
        <div className="px-4 sm:px-6 md:px-8">
          <h1 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-8xl font-bold text-gray-800 leading-tight max-w-6xl mx-auto">
            Unlock the Future of Learning with Evalvo{' '}
          </h1>
          
          <div className="mt-6 md:px-22 md:mt-8 space-y-2 md:space-y-3">
            <p className="text-center text-xl sm:text-2xl md:text-3xl lg:text-3xl text-gray-600 font-light">
              A comprehensive platform for analytics, testing, coding, and seamless learning.
            </p>
            <p className="text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-600 font-light">
              Empower your students, staff, and teams with{' '}
              <span className="text-blue-600 font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text ">
                instant results, hands-on coding events, and actionable insights.
              </span>
            </p>
          </div>
          

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 md:mt-12 mb-8">
            <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
              Start Free Trial
            </button>
            <button className="w-full sm:w-auto px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200">
              Request a Demo
            </button>
          </div>

          <ImageComponent/>
        </div>
      </main>
    </div>
  );
};

export default Hero;



