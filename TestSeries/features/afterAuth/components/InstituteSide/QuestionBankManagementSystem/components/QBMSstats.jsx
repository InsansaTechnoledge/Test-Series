import React from 'react'
import { BookOpen, FolderOpen, List } from 'lucide-react'
import tq from '../../../../../../assests/QBMS/Vector.svg';
import ec from '../../../../../../assests/QBMS/Vector-1.svg';

const QBMSstats = ({ categories = [], QuestionLength = 0 , theme}) => {
  const stats = [
    {
      label: 'Total Questions',
      value: QuestionLength,
      icon: tq,
      color: theme === 'light' ? 'text-gray-800' : 'text-gray-100',
      bgColor: theme === 'light' ? 'bg-indigo-200' : 'bg-indigo-600/30',
      borderColor: 'border-indigo-200'
    },
    {
      label: 'Existing Categories',
      value: `${categories.length}/8`,
      icon: ec,
      color: theme === 'light' ? 'text-gray-800' : 'text-gray-100',
      bgColor: theme === 'light' ? 'bg-indigo-200' : 'bg-indigo-600/30',
      borderColor: 'border-indigo-200'
    },
    
  ]

  return (
    <div className={ `${theme === 'light' ? 'bg-white border border-gray-200 ' : 'bg-gray-800 border border-gray-700 '} mt-8 px-6 mx-6 rounded-2xl py-6 shadow-sm`}>
      <div className="mb-6">
        <h1 className={`${theme === 'light' ? '' : 'text-indigo-100'} text-3xl font-semibold mb-2 `}>
          Question Bank Management System{" "}
          <span className={`${theme === 'light' ? '' : 'text-indigo-300'} text-2xl font-medium text-gray-600`}>
            ~ by Evalvo
          </span>
        </h1>
      </div>


      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {stats.map((stat, index) => {
          
          return (
            <div 
              key={index}
              className={`${stat.bgColor} ${stat.borderColor} flex px-6 justify-between border rounded-xl p-6 transition-all duration-200 hover:shadow-md hover:scale-105`}
            >
              <div className='space-y-1'>
                <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-200'} text-sm font-medium`}>{stat.label}</p>
                <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>

              <div className='flex items-center justify-between mb-4'>
                <div className={`${stat.color} p-2 rounded-lg bg-transparent`}>
                 <img src={stat.icon} className='w-15 h-15' alt="" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

     
    </div>
  )
}

export default QBMSstats