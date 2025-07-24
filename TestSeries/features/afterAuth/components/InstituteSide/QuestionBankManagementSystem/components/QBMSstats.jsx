import React from 'react'
import { BookOpen, FolderOpen, List } from 'lucide-react'
import tq from '../../../../../../assests/QBMS/Vector.svg';
import ec from '../../../../../../assests/QBMS/Vector-1.svg';

const QBMSstats = ({ categories = [], QuestionLength = 0 }) => {
  const stats = [
    {
      label: 'Total Questions',
      value: QuestionLength,
      icon: tq,
      color: 'text-gray-800',
      bgColor: 'bg-indigo-200',
      borderColor: 'border-blue-200'
    },
    {
      label: 'Existing Categories',
      value: `${categories.length}/8`,
      icon: ec,
      color: 'text-gray-800',
      bgColor: 'bg-indigo-200',
      borderColor: 'border-green-200'
    },
    
  ]

  return (
    <div className='bg-white mt-8 px-6 mx-6 rounded-2xl border border-gray-200 py-6 shadow-sm'>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold mb-2 ">
          Question Bank Management System{" "}
          <span className="text-2xl font-medium text-gray-600">
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
                <p className='text-gray-600 text-sm font-medium'>{stat.label}</p>
                <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>

              <div className='flex items-center justify-between mb-4'>
                <div className={`${stat.color} p-2 rounded-lg bg-white`}>
                 <img src={stat.icon} className='w-12 h-12' alt="" />
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