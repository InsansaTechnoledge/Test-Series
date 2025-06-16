import { Calendar, Clock, CheckCircle, SquareCode, School} from 'lucide-react';


export const cards = [
    { 
      name: 'Upcoming Exam',
      icon: Calendar,
      color: 'bg-blue-100 text-blue-600 border-blue-200',
      shadow: 'shadow-blue-200/50',
      path: '/student/upcoming-exams'
    },
    { 
      name: 'Results', 
      icon: CheckCircle,
      color: 'bg-green-100 text-blue-600 border-blue-200',
      shadow: 'shadow-blue-200/50',
      path: '/student/completed-exams'
    },
    {
      name:'Coding Contests',
      icon:SquareCode,
      color: 'bg-purple-100 text-blue-600 border-blue-200',
      shadow: 'shadow-blue-200/50',
      path: '/student/coding-contests'
    },
    {
      name:'Your Classroom',
      icon:School,
      color: 'bg-yellow-100 text-blue-600 border-blue-200',
      shadow: 'shadow-blue-200/50',
      path: '/student/classroom'
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

export const RankGrid = [
  {
    grid : 'grid-cols-3'
  }
]