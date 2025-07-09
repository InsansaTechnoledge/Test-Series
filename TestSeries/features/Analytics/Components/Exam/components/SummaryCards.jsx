import React from 'react';
import { BarChart3, Target, Award, TrendingUp } from 'lucide-react';
import { useTheme } from '../../../../../hooks/useTheme';

export const SummaryCards = ({ analytics }) => {
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
  const {theme} = useTheme()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
  {cards.map((card, index) => {
    const Icon = card.icon;
    return (
      <div key={index} className={`p-4 rounded-lg shadow-sm transition-all duration-300 ${
        theme === 'light' ? 'bg-white' : 'bg-gray-900'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              {card.title}
            </p>
            <p className={`text-2xl font-bold text-${card.color}-600`}>
              {card.value}
            </p>
          </div>
          <Icon className={`w-8 h-8 text-${card.color}-600`} />
        </div>
      </div>
    );
  })}
</div>
  );
};
