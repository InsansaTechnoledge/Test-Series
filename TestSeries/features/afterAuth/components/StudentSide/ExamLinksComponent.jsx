import React from 'react';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

const cards = [
  { 
    name: 'Upcoming Exam',
    icon: Calendar,
    color: 'bg-blue-100 text-blue-600 border-blue-200',
    shadow: 'shadow-blue-200/50'
  },
  { 
    name: 'Live Exam', 
    icon: Clock,
    color: 'bg-green-100 text-green-600 border-green-200',
    shadow: 'shadow-green-200/50'
  },
  { 
    name: 'Results', 
    icon: CheckCircle,
    color: 'bg-blue-100 text-blue-600 border-blue-200',
    shadow: 'shadow-blue-200/50'
  }
];

export default function ExamLinksComponent() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header with gradient */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold bg-blue-900 bg-clip-text text-transparent">
            Quick Link's to Exams 
          </h1>
          <p className="text-gray-600 mt-3">View and access all your examination resources</p>
        </div>
        
        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className={`${card.color} rounded-xl border p-6 flex flex-col items-center ${card.shadow} shadow-lg hover:scale-105 transition-all cursor-pointer`}
              >
                <div className="p-3 rounded-full mb-4">
                  <Icon size={32} />
                </div>
                <h3 className="text-xl font-semibold">{card.name}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}