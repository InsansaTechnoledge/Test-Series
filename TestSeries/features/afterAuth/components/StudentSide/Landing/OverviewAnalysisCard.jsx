import { Award, BarChart3, Target, TrendingUp } from 'lucide-react';
import React from 'react';
import { useTheme } from '../../../../../hooks/useTheme';
import { useExamAnalytics } from '../../../../Analytics/hooks/useExamAnalytics';
import ViewAllButton from '../StatsComponent/ViewAllButton';

import { useUser } from '../../../../../contexts/currentUserContext';
import { useExamFilters } from '../../../../Analytics/hooks/useExamFilters';
import useStudentExamResults from '../CompletedExams/useExamResults';

const LeaderBoardCard = () => {
    const {user} = useUser()
    const {results} = useStudentExamResults(user._id);

    const {
      
        processedData,
 
      } = useExamFilters(results);
      

    const analytics = useExamAnalytics(processedData);

    const {theme} = useTheme()
    const cards = [
      {
        title: 'Total Exams',
        value: analytics.totalExams,
        icon: BarChart3,
        color: 'green'
      },
      {
        title: 'Average Score',
        value: analytics.avgMarks,
        icon: Target,
        color: 'blue'
      },
      {
        title: 'Best Score',
        value: analytics.maxMarks,
        icon: Award,
        color: 'green'
      },
      {
        title: 'Total Points',
        value: analytics.totalMarks,
        icon: TrendingUp,
        color: 'purple'
      }
    ];
  
   
  return (
    <div>



      <div>
   

      {/* Main Analytics Card */}
      <div className={`transition-all duration-500 rounded-2xl ${
        theme === 'light' ? 'bg-white' : 'bg-gray-800'
      } border ${
        theme === 'light' ? 'border-gray-200' : 'border-gray-700'
      } shadow-xl hover:shadow-2xl p-8 max-w-6xl mx-auto`}>
        
        {/* Header */}
        <div className="  mb-8">
          <div>
            <h2 className={`text-3xl font-bold ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              Overall Analytics
            </h2>
            <p className={`text-lg mt-2 ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              for more detailed view visit dedicated page
            </p>
          </div>
     
      
       

        </div>

 
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
  {cards.map((card, index) => {
    const Icon = card.icon;
    return (
      <div 
        key={index} 
        className={`group relative overflow-hidden ${
          theme === 'light' 
            ? 'bg-gradient-to-br from-white to-gray-50 border border-gray-200/60' 
            : 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/60'
        } p-4 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer 
        transform hover:-translate-y-1`}
      >
        {/* Animated background shimmer */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${
          card.color === 'green' ? 'bg-gradient-to-r from-green-400/10 via-emerald-400/5 to-green-400/10' :
          card.color === 'blue' ? 'bg-gradient-to-r from-blue-400/10 via-indigo-400/5 to-blue-400/10' :
          card.color === 'emerald' ? 'bg-gradient-to-r from-emerald-400/10 via-teal-400/5 to-emerald-400/10' :
          'bg-gradient-to-r from-purple-400/10 via-violet-400/5 to-purple-400/10'
        }`}></div>
        

        <div className="flex items-center gap-5 relative">
 
          <div className={`${card.iconBg} p-2 rounded-2xl flex-shrink-0
            group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 
            border-2 border-solid } 
            group-hover:border-dashed shadow-sm`}>
            <Icon className={`w-6 h-6 ${card.textColor} drop-shadow-sm`} />
          </div>
          
          {/* Content with enhanced typography */}
          <div className="flex-1">
            <p className={`text-sm font-bold mb-2 uppercase tracking-widest ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-300'
            } group-hover:text-opacity-80 transition-all duration-300`}>
              {card.title}
            </p>
            <p className={`text-2xl font-black ${card.textColor} 
              group-hover:scale-105 transition-all duration-500 drop-shadow-sm
              bg-gradient-to-r ${
                card.color === 'green' ? 'from-green-600 to-emerald-600' :
                card.color === 'blue' ? 'from-blue-600 to-indigo-600' :
                card.color === 'emerald' ? 'from-emerald-600 to-teal-600' :
                'from-purple-600 to-violet-600'
              } bg-clip-text text-transparent`}>
              {card.value}
            </p>
          </div>
        </div>
        
        {/* Multiple decorative elements */}
        <div className={`absolute -top-3 -right-3 w-20 h-20 rounded-full opacity-10 
          ${card.color === 'green' ? 'bg-green-400' :
            card.color === 'blue' ? 'bg-blue-400' :
            card.color === 'emerald' ? 'bg-emerald-400' :
            'bg-purple-400'
          } group-hover:opacity-20 group-hover:scale-125 transition-all duration-700`}></div>
        
        <div className={`absolute -bottom-2 -left-2 w-12 h-12 rounded-full opacity-5 
          ${card.color === 'green' ? 'bg-green-400' :
            card.color === 'blue' ? 'bg-blue-400' :
            card.color === 'emerald' ? 'bg-emerald-400' :
            'bg-purple-400'
          } group-hover:opacity-15 group-hover:scale-150 transition-all duration-700 delay-100`}></div>
        
        {/* Glowing border effect */}
        <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
          ${card.color === 'green' ? 'shadow-green-400/20' :
            card.color === 'blue' ? 'shadow-blue-400/20' :
            card.color === 'emerald' ? 'shadow-emerald-400/20' :
            'shadow-purple-400/20'
          } shadow-2xl`}></div>
      </div>
    );
  })}
</div>
        
    <ViewAllButton/>
      </div>
    </div>
    </div>
  )
}

export default LeaderBoardCard
