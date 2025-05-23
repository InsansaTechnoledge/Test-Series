import React from 'react'
import bg from '../../../../../assests/Landing/Hero/herobg2.png'
import { useUser } from '../../../../../contexts/currentUserContext'
import { MapPin, Mail, Phone, Globe } from 'lucide-react'

const InstituteLandingPage = () => {
  const { user } = useUser();
  console.log("YYYY",user);

  if(!user){
    return (
      <div>
        Loading...
      </div>
    )
  }
  return (
    <div className="h-[600px] flex flex-col">
      <div className="relative flex items-center justify-center h-full bg-gradient-to-r from-blue-900 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* <img src={bg} alt="Background" className="w-full h-full object-cover" /> */}
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>

        {/* Content Container */}
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
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
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

          {/* Stats/Highlights Section */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <span className="text-3xl md:text-4xl font-bold text-white">98</span>
              <span className="text-gray-200 mt-2">Number of Batches</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <span className="text-3xl md:text-4xl font-bold text-white">200+</span>
              <span className="text-gray-200 mt-2">Number of Students</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <span className="text-3xl md:text-4xl font-bold text-white">25</span>
              <span className="text-gray-200 mt-2">Exams Conducted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InstituteLandingPage