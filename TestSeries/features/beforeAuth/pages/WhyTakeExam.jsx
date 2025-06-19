import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Trophy, AlertCircle, Users, Target, BookOpen, Award, ArrowRight, Sparkles } from 'lucide-react';
import { features } from '../data/WhyExamData';
const WhyTakeExam = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeFeature, setActiveFeature] = useState(0);

  //   {
  //     id: 1,
  //     title: "Different Exam Patterns",
  //     description: "Prepare for the level expected in the upcoming exams with varied question formats and difficulty levels.",
  //     icon: BarChart3,
  //     color: "bg-indigo-600",
  //     hoverColor: "hover:bg-indigo-700",
  //     stats: "8 types of questions",
  //     detail: "Access multiple exam formats including MCQs, descriptive tests, and timed assessments"
  //   },
  //   {
  //     id: 2,
  //     title: "Save Tests & Questions",
  //     description: "Save important Tests & Questions to revise or reattempt them later for better preparation.",
  //     icon: BookOpen,
  //     color: "bg-gray-700",
  //     hoverColor: "hover:bg-gray-800",
  //     stats: "Unlimited Saves",
  //     detail: "Bookmark unlimited questions and create custom practice sets for focused revision"
  //   },
  //   {
  //     id: 3,
  //     title: "In-depth Performance Analysis",
  //     description: "Get comprehensive insights into your performance with detailed analytics and improvement suggestions.",
  //     icon: TrendingUp,
  //     color: "bg-indigo-600",
  //     hoverColor: "hover:bg-indigo-700",
  //     stats: "360° Analysis",
  //     detail: "Track progress, identify weak areas, and get personalized recommendations for improvement"
  //   }
  // ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen px-4 sm:px-6 lg:px-8 py-16 overflow-hidden">
      

      <div className="relative max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-20"> 
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-6 leading-tight">
            Why take Exam/Test on our{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Platform?
            </span>
          </h1>
          
 <p className="text-xl text-gray-500 max-w-4xl mx-auto leading-relaxed">
            Take any type of exam - Internal college exams, Knowledge testing, Technical knowledge rounds for placements, 
            Coding rounds for placements, Tech fest competitions, and more. Experience advanced analytics and personalized learning paths.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            const isActive = index === activeFeature;
            const isHovered = hoveredCard === index;
            
            return (
              <div
                key={feature.id}
                className={`group relative p-8 rounded-3xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-700 cursor-pointer transform hover:-translate-y-2 ${
                  isActive ? 'scale-105 shadow-2xl' : ''
                }`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => setActiveFeature(index)}
              >
                {/* Background Glow */}
                <div className={`absolute inset-0 rounded-3xl ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-4 rounded-2xl ${feature.color} transform group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${feature.color.replace('bg-', 'text-')}`}>
                      {feature.stats}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-violet-900 mb-4 group-hover:text-indigo-700 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* Expandable Detail */}
                <div className={`overflow-hidden transition-all duration-500 ${
                  isHovered || isActive ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-600">
                      {feature.detail}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <div className={`flex items-center justify-between mt-6 transition-all duration-300 ${
                  isHovered || isActive ? 'transform translate-x-0 opacity-100' : 'transform translate-x-4 opacity-0'
                }`}>
                  <span className="text-sm font-medium text-indigo-600">Learn More</span>
                  <ArrowRight className="w-4 h-4 text-indigo-600" />
                </div>

                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute top-4 right-4">
                    <div className={`w-3 h-3 rounded-full ${feature.color} animate-pulse`}></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WhyTakeExam;