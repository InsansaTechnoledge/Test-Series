import React, { use } from 'react'
import bg from '../../../../../assests/Landing/Hero/herobg2.png'
import { useUser } from '../../../../../contexts/currentUserContext'
import { MapPin, Mail, Phone, Globe } from 'lucide-react'
import { features, stepsToFollow } from "../../../data/InstituteLandingPageData"
import FAQSection from '../../../../beforeAuth/pages/FAQSection'
import { studentFAQs, teacherFAQs } from '../../../../beforeAuth/data/FAQ'
const InstituteLandingPage = () => {
  const { user } = useUser();
  


  if (!user) {
    return (
      <div>
        Loading...
      </div>
    )
  }


  if(!user.planPurchased  && !user.planFeatures){
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Plan Not Purchased</h1>
          <p className="text-gray-600">Please purchase a plan to access this page.</p>
        </div>
      </div>
    )

  }


  return (

    user && user.role === 'organization' ?
      (
        <>
          <div className="h-[400px] flex flex-col ">
            <div className="relative flex items-center justify-center h-full bg-gradient-to-r from-blue-900 to-indigo-900 overflow-hidden rounded-lg  ">
              <div className="absolute inset-0 z-0 ">

                <div className="absolute inset-0 bg-black opacity-50"></div>
              </div>


              <div className="relative z-10 text-center px-6 md:px-12 max-w-5xl mx-auto">
                {/* Organization Logo */}
                {user.logoUrl && (
                  <div className="flex justify-center mb-6">
                    <img
                      src={user.logoUrl}
                      alt={`${user.name} Logo`}
                      className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                    />
                  </div>
                )}

                <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
                  {user.name || 'Welcome'}
                </h1>

                {/* Contact Information */}
                <div className="flex flex-wrap justify-center gap-4 mb-8 text-gray-200">
                  {user.address.city && user.address.state && (
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>{user.address.city}, {user.address.state}</span>
                    </div>
                  )}
                  {user.email && (
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 mr-2" />
                      <span>{user.email}</span>
                    </div>
                  )}
                  {user.phone && (
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 mr-2" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user.website && (
                    <div className="flex items-center">
                      <Globe className="w-5 h-5 mr-2" />
                      <span>{user.website}</span>
                    </div>
                  )}
                </div>


                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="flex flex-col items-center p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                    <span className="text-3xl md:text-4xl font-bold text-white">98</span>
                    <span className="text-gray-200 mt-2">Number of Batches</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                    <span className="text-3xl md:text-4xl font-bold text-white">200+</span>
                    <span className="text-gray-200 mt-2">Number of Students</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                    <span className="text-3xl md:text-4xl font-bold text-white">25</span>
                    <span className="text-gray-200 mt-2">Exams Conducted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="min-h-screen bg-white text-center  py-8">


            <section className="bg-gray-200 p-2 rounded-lg mb-8">
              <h2 className="text-indigo-700 font-bold text-lg mb-4">Steps To Follow</h2>


              <div className="bg-white px-1 py-4 rounded-lg">

                <div className="hidden md:flex flex-wrap justify-center gap-2">
                  {stepsToFollow.map((step, i) => (
                    <div key={i} className="flex items-center space-x-2">

                      <div className="bg-indigo-800 text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold">
                        {i + 1}
                      </div>

                      <div className="text-left">
                        <p className="text-xs">Step {i + 1}</p>
                        <p className="font-medium text-sm">{step}</p>
                      </div>


                      {i < stepsToFollow.length - 1 && (
                        <svg
                          className="w-24 h-4 text-indigo-500"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 100 24"
                        >
                          <line x1="0" y1="12" x2="90" y2="12" stroke="currentColor" />
                          <polyline points="90,6 100,12 90,18" stroke="currentColor" fill="none" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>


                <div className="flex md:hidden flex-col gap-4">
                  {stepsToFollow.map((step, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <div className="bg-indigo-800 text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold mt-1">
                        {i + 1}
                      </div>
                      <div className="text-left">
                        <p className="text-xs">Step {i + 1}</p>
                        <p className="font-medium text-sm">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>


            <section className="bg-gray-200 p-6 rounded-lg mb-8">
              <h2 className="text-indigo-700 font-bold text-lg mb-4">Different Features</h2>
              <div className="space-y-4">
                {features.map((text, idx) => (
                  <div key={idx} className="flex bg-white p-4 rounded-lg shadow-md items-start space-x-3 text-left">
                    <div className="bg-indigo-300 text-blue-700 w-8 h-8 flex items-center justify-center rounded-full font-bold px-1 py-1 sm:w-6 sm:h-6 ">{idx + 1}</div>
                    <p className="text-sm text-indigo-700 font-medium leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>

          
            </section>

            <FAQSection studentFAQs={studentFAQs} teacherFAQs={teacherFAQs} />
          </div>
        </>

      ) :
      (
        <div>this is user of organization</div>
      )
  )
}

export default InstituteLandingPage