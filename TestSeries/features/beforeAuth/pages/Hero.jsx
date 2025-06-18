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
    <div className="mt-16 px-6 md:px-20 lg:px-32">
      <div className="bg-[#ffffff] rounded-3xl shadow-2xl overflow-hidden min-h-screen border-2">
        
      </div>
    </div>
  );
};


const Hero = () => {
  return (
    <div className=' min-h-screen'>
        <main className='mt-20'>
          <h1 className='flex items-center justify-center pt-16 text-7xl text-gray-800 '>Scale your analytics without hiring</h1>
        
          <p className='text-center mt-8 text-4xl text-gray-600 '>The first data tool that you'll love.</p>
          <p className='text-center mt-2 text-4xl text-gray-600 '> And a team of experts to <span className='text-blue-600'>get you started.</span> </p>

         <ImageComponent/>
        </main>
    </div>
  )
}

export default Hero

