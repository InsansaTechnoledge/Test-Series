import React from 'react'
import { TrendingUp} from 'lucide-react'
import { stepsToFollow } from './Data/Data'


const QuickSteps = ({theme}) => (
    <div className={` ${theme === 'light' ? '' : 'bg-gray-800'} rounded-2xl p-6 shadow-sm border ${theme === 'light' ? ' border-gray-100' : ''}`}>
      <h2 className={`text-xl font-bold ${theme === 'light' ? ' text-indigo-600' : 'text-indigo-100'} mb-6 flex items-center gap-2`}>
        <TrendingUp className="w-5 h-5" />
        Quick Steps to Get Started
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stepsToFollow.map((step, idx) => (
          <div key={idx} className="text-center group">
            <div className="bg-indigo-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 font-bold group-hover:bg-indigo-700 transition-colors">
              {idx + 1}
            </div>
            <p className={`text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-100'}`}>{step}</p>
          </div>
        ))}
      </div>
    </div>
  )

export default QuickSteps
