import { BarChart3, TrendingUp, Trophy, AlertCircle, Users, Target, BookOpen, Award } from 'lucide-react';


export const cards = [
    {
      id: 1,
      title: "Single Exam Analysis",
      subtitle: "Detailed Insights",
      icon: BarChart3,
      color: "bg-gray-700",
      description: "Deep dive analysis of individual exam performance with subject-wise breakdown",
      stats: { score: "87/100", accuracy: "92%" },
      gradient: "bg-gray-700"
    },
    {
      id: 2,
      title: "Cumulative Results",
      subtitle: "Overall Performance",
      icon: TrendingUp,
      color: "bg-indigo-600",
      description: "Comprehensive view of all exam results with overall performance metrics",
      stats: { exams: "15", average: "84%" },
      gradient: "bg-indigo-600"
    },
    {
      id: 3,
      title: "Performance Timeline",
      subtitle: "Progress Graph",
      icon: TrendingUp,
      color: "bg-gray-700",
      description: "Visual timeline showing your performance trend across all exams",
      stats: { improvement: "+12%", streak: "5 exams" },
      gradient: "bg-gray-700"
    },
    {
      id: 4,
      title: "Exam-wise Leaderboard",
      subtitle: "Individual Rankings",
      icon: Trophy,
      color: "bg-indigo-600",
      description: "Your position in each exam compared to batch peers",
      stats: { rank: "#7", outOf: "124 students" },
      gradient: "bg-indigo-600"
    },
    {
      id: 5,
      title: "Cumulative Leaderboard",
      subtitle: "Overall Batch Ranking",
      icon: Trophy,
      color: "bg-gray-700",
      description: "Your overall standing in the organization batch across all exams",
      stats: { position: "#12", percentile: "89%" },
      gradient: "bg-gray-700"
    },
    {
      id: 6,
      title: "Wrong Answer Analysis",
      subtitle: "Error Insights",
      icon: AlertCircle,
      color: "bg-indigo-600",
      description: "Detailed analysis of incorrect answers with question-wise breakdown",
      stats: { errors: "8 questions", patterns: "3 topics" },
      gradient: "bg-indigo-600"
    },
    {
      id: 7,
      title: "Question Difficulty Stats",
      subtitle: "Batch Performance",
      icon: Users,
      color: "bg-gray-700",
      description: "Percentage of students who answered each question incorrectly in your batch",
      stats: { hardest: "Q15: 78%", easiest: "Q3: 12%" },
      gradient: "bg-gray-700"
    },
    {
      id: 8,
      title: "Organizational Insights",
      subtitle: "Batch Analytics",
      icon: BarChart3,
      color: "bg-indigo-600",
      description: "Compare your batch performance with other batches in the organization",
      stats: { batchRank: "#3/8", avgScore: "82%" },
      gradient: "bg-indigo-600"
    }
  ];