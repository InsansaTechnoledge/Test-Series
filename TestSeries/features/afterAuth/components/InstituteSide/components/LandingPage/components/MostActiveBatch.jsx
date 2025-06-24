import { Award, Calendar } from 'lucide-react'
import React from 'react'

const MostActiveBatch = () => (
    <div className="bg-gradient-to-r from-indigo-50 to-white rounded-2xl p-6 border border-indigo-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-indigo-600 flex items-center gap-2">
          <Award className="w-5 h-5" />
          Most Active Batch
        </h3>
        <Calendar className="w-5 h-5 text-indigo-400" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-indigo-600">Engineering Batch A</div>
          <div className="text-sm text-gray-600 mt-1">Most Active This Month</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-green-600">94%</div>
          <div className="text-sm text-gray-600 mt-1">Attendance Rate</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-blue-600">28</div>
          <div className="text-sm text-gray-600 mt-1">Exams Completed</div>
        </div>
      </div>
    </div>
  )

export default MostActiveBatch
