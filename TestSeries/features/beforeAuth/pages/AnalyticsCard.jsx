import React, { useState, useEffect, useRef } from 'react';
import { BarChart3, TrendingUp, Trophy, AlertCircle, Users, Target, BookOpen, Award } from 'lucide-react';

// Sample cards data
const cards = [
  {
    id: 1,
    title: "Performance Analytics",
    subtitle: "Track Progress",
    description: "Get detailed insights into your exam performance with comprehensive analytics and progress tracking.",
    color: "bg-indigo-600",
    icon: BarChart3,
    stats: {
      "accuracy": "85%",
      "improvement": "+12%",
      "streak": "7 days"
    }
  },
  {
    id: 2,
    title: "Trend Analysis",
    subtitle: "Growth Insights",
    description: "Visualize your learning trends and identify areas for improvement with advanced trend analysis.",
    color: "bg-indigo-600",
    icon: TrendingUp,
    stats: {
      "growth": "+24%",
      "consistency": "92%",
      "topics": "15"
    }
  },
  {
    id: 3,
    title: "Achievement System",
    subtitle: "Earn Rewards",
    description: "Unlock achievements and earn rewards as you progress through your learning journey.",
    color: "bg-indigo-600",
    icon: Trophy,
    stats: {
      "badges": "12",
      "points": "2,450",
      "rank": "#3"
    }
  },
  {
    id: 4,
    title: "Smart Alerts",
    subtitle: "Stay Informed",
    description: "Receive intelligent notifications about study reminders, deadlines, and important updates.",
    color: "bg-indigo-600",
    icon: AlertCircle,
    stats: {
      "reminders": "5",
      "urgent": "2",
      "completed": "18"
    }
  },
  {
    id: 5,
    title: "Study Groups",
    subtitle: "Collaborate",
    description: "Join study groups, collaborate with peers, and learn together in a supportive environment.",
    color: "bg-indigo-600",
    icon: Users,
    stats: {
      "groups": "3",
      "members": "24",
      "active": "12"
    }
  },
  {
    id: 6,
    title: "Goal Setting",
    subtitle: "Target Success",
    description: "Set personalized learning goals and track your progress towards achieving them.",
    color: "bg-indigo-600",
    icon: Target,
    stats: {
      "goals": "8",
      "achieved": "5",
      "progress": "75%"
    }
  }
];

const Rotating3DCards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const intervalRef = useRef();

  const totalCards = cards.length;

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isAutoRotating) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % totalCards);
      }, 3000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isAutoRotating, totalCards]);

  const getCardStyle = (index) => {
    if (isMobile) {
      // Mobile: Simple horizontal sliding
      const offset = (index - currentIndex) * 100;
      return {
        transform: `translateX(${offset}%)`,
        opacity: index === currentIndex ? 1 : 0.3,
        zIndex: index === currentIndex ? 20 : 10
      };
    }
    
    // Desktop: 3D rotation
    const angle = (360 / totalCards) * index;
    const currentAngle = angle - (currentIndex * (360 / totalCards));
    const radius = 300;
    
    const x = Math.sin((currentAngle * Math.PI) / 180) * radius;
    const z = Math.cos((currentAngle * Math.PI) / 180) * radius;
    
    return {
      transform: `translateX(${x}px) translateZ(${z}px) rotateY(${-currentAngle}deg)`,
      opacity: z > -200 ? 1 : 0.3,
    };
  };

  const handleCardClick = (index) => {
    setCurrentIndex(index);
    setIsAutoRotating(false);
    setTimeout(() => setIsAutoRotating(true), 5000);
  };

  const nextCard = () => {
    setCurrentIndex(prev => (prev + 1) % totalCards);
    setIsAutoRotating(false);
    setTimeout(() => setIsAutoRotating(true), 5000);
  };

  const prevCard = () => {
    setCurrentIndex(prev => (prev - 1 + totalCards) % totalCards);
    setIsAutoRotating(false);
    setTimeout(() => setIsAutoRotating(true), 5000);
  };

  return (
    <div className=" flex flex-col items-center justify-center overflow-hidden px-4 py-8">
      {/* Title */}
      <div className="text-center mb-8 md:mb-16 z-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-gray-800 mb-2 md:mb-4">
          Exam <span className="text-indigo-600 bg-clip-text">Analytics</span>
        </h1>
        <p className="text-base md:text-xl text-gray-500 max-w-2xl mx-auto px-4">
          Discover powerful features that transform your learning experience
        </p>
      </div>

      {/* Cards Container */}
      <div 
        className={`relative w-full ${isMobile ? 'h-[400px]' : 'h-96 mt-20'} flex items-center justify-center`}
        style={isMobile ? {} : { perspective: '1300px' }}
      >
        <div
          className={`relative w-full h-full flex items-center justify-center transition-transform duration-700 ease-in-out ${
            isMobile ? 'overflow-hidden' : ''
          }`}
          style={isMobile ? {} : { transformStyle: 'preserve-3d' }}
        >
          {cards.map((card, index) => {
            const IconComponent = card.icon;
            const isActive = index === currentIndex;

            return (
              <div
                key={card.id}
                className={`absolute ${
                  isMobile 
                    ? 'w-[280px] sm:w-[320px] h-[380px] left-1/2 transform -translate-x-1/2' 
                    : 'w-80 h-96'
                } cursor-pointer transition-all duration-700 ${isActive ? 'z-20' : 'z-10'}`}
                style={getCardStyle(index)}
                onClick={() => handleCardClick(index)}
              >
                {/* Card */}
                <div
                  className={`w-full h-full rounded-2xl shadow-2xl transform transition-all duration-500
                    ${isActive ? (isMobile ? 'scale-100' : 'scale-110') : 'scale-95 hover:scale-100'}
                    bg-white/10 backdrop-blur-lg border border-white/20`}
                >
                  {/* Card Header */}
                  <div className={`p-4 md:p-6 rounded-t-2xl ${card.color}`}>
                    <div className="flex items-center justify-between text-white">
                      <div>
                        <p className="text-xs md:text-sm font-medium opacity-90">{card.subtitle}</p>
                        <h3 className="text-lg md:text-xl font-bold">{card.title}</h3>
                      </div>
                      <div className="p-2 md:p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <IconComponent className="w-6 h-6 md:w-8 md:h-8" />
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 md:p-6 flex-1 flex flex-col justify-between bg-white/90 backdrop-blur-sm">
                    <p className="text-gray-700 text-xs md:text-sm leading-relaxed mb-4 md:mb-6">
                      {card.description}
                    </p>

                    {/* Stats */}
                    <div className="space-y-2 md:space-y-3">
                      {Object.entries(card.stats).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center">
                          <span className="text-gray-600 capitalize text-xs md:text-sm font-medium">{key}</span>
                          <span className="font-bold text-gray-800 text-sm md:text-base">{value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Active Indicator */}
                    {isActive && (
                      <div className="mt-3 md:mt-4 flex justify-center">
                        <div className={`w-2 h-2 rounded-full ${card.color} animate-pulse`}></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Glow Effect for Active Card */}
                {isActive && (
                  <div className={`absolute inset-0 rounded-2xl ${card.color} opacity-20 blur-xl -z-10 animate-pulse`}></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className={`flex ${isMobile ? 'mt-8' : 'mt-28'} items-center space-x-4 md:space-x-8 z-10`}>
        <button
          onClick={prevCard}
          className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-gray-600 transition-all group"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Dots Indicator */}
        <div className="flex space-x-1 md:space-x-2">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => handleCardClick(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
                index === currentIndex ? 'bg-indigo-600 scale-125' : 'bg-gray-400 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextCard}
          className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-gray-600 transition-all group"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Auto-rotation toggle */}
      <div className="mt-6 md:mt-8 z-10 px-4">
        <button
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          className={`px-4 py-2 md:px-8 md:py-4 rounded-full text-sm md:text-lg cursor-pointer font-medium transition-all ${
            isAutoRotating
              ? 'bg-green-500/20 text-gray-600 border border-green-500/30'
              : 'bg-red-500/20 text-gray-600 border border-red-500/30'
          }`}
        >
          {isAutoRotating ? '⏸ Pause Auto-Rotation' : '▶ Resume Auto-Rotation'}
        </button>
      </div>

      {/* Mobile swipe hint */}
      {isMobile && (
        <div className="mt-4 text-center text-gray-500 text-sm">
          <p>← Swipe or tap arrows to navigate →</p>
        </div>
      )}
    </div>
  );
};

export default Rotating3DCards;