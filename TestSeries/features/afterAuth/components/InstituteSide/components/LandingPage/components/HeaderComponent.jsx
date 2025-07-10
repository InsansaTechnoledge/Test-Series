import React from 'react'
import { MapPin, Mail, Users, BookOpen, FileText } from 'lucide-react'

const Header = ({user , theme}) => (
    <div className={`relative ${theme === 'light' ? "bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 " : "bg-indigo-600"} rounded-2xl p-8 text-white overflow-hidden`}>
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8 ">
          {user.logoUrl && (
            <img src={user.logoUrl} alt="Logo" className={`w-20 h-20 rounded-full border-4 ${theme === 'light' ? ' border-white/30' : 'border-indigo-200'} shadow-xl object-contain`}/>
          )}
          <div className="text-center md:text-left">
            <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${theme === 'light' ? '' : 'text-gray-100'}`}>{user.name}</h1>
            <div className={`flex flex-wrap justify-center md:justify-start gap-4 ${theme === 'light' ? 'text-indigo-100' : 'text-gray-200'} `}>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{user.address.city}, {user.address.state}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{user.email}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Users, label: "Total Students", value: user.metaData.totalStudents, color: `${theme === 'light' ? 'bg-white/20' : 'bg-white/20'}` },
            { icon: BookOpen, label: "Active Batches", value: user.metaData.totalBatches, color:  `${theme === 'light' ? 'bg-white/20' : 'bg-white/20'}` },
            { icon: FileText, label: "Exams Conducted", value: user.metaData.totalExams, color:  `${theme === 'light' ? 'bg-white/20' : 'bg-white/20'}` }
          ].map((stat, idx) => (
            <div key={idx} className={`${stat.color} backdrop-blur-sm rounded-xl p-4 text-center`}>
              <stat.icon className={`w-8 h-8 mx-auto mb-2 ${theme === 'light' ? 'text-white/80' : 'text-white/80'} `} />
              <div className={`text-2xl font-bold ${theme === 'light' ? "text-indigo-100" : "text-indigo-100"} `}>{stat.value}</div>
              <div className={`text-sm ${theme === 'light' ? "text-indigo-100" : "text-indigo-100"} `}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
export default Header
