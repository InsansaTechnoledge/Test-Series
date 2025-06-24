import React from 'react'
import { features } from './Data/Data'

const Features = () => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-indigo-600 mb-6">Platform Features</h2>
      <div className="space-y-4">
        {features.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
              {idx + 1}
            </div>
            <p className="text-gray-600 leading-relaxed">{feature}</p>
          </div>
        ))}
      </div>
    </div>
  )

export default Features
