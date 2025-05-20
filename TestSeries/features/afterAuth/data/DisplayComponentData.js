import { Calendar, Clock, CheckCircle } from 'lucide-react';


export const cards = [
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

export const Rank = [
  {
    name: "Overall Rank",
    rank: 12,
    color: 'bg-blue-100 text-blue-600 border-blue-200',
    shadow: 'shadow-blue-200/50'
  },
  {
    name: "Highest Rank",
    rank: 1,
    color: 'bg-blue-100 text-blue-600 border-blue-200',
    shadow: 'shadow-blue-200/50'
  },
  {
    name: "Lowest Rank",
    rank: 30,
    color: 'bg-blue-100 text-blue-600 border-blue-200',
    shadow: 'shadow-blue-200/50'
  }
]