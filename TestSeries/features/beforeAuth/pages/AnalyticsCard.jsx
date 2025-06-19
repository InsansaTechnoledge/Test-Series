import React, { useState, useEffect, useRef } from 'react';
import { BarChart3, TrendingUp, Trophy, AlertCircle, Users, Target, BookOpen, Award } from 'lucide-react';
import { cards } from '../data/Analytics';

const Rotating3DCards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const intervalRef = useRef();

  
  const totalCards = cards.length;

  useEffect(() => {
    if (isAutoRotating) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % totalCards);
      }, 3000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isAutoRotating, totalCards]);

  const getCardStyle = (index) => {
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
    <div className="min-h-screen flex flex-col items-center justify-center overflow-hidden">
     
      {/* Title */}
      <div className="text-center mb-16 z-10">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-4">
          Exam <span className="bg-blue-600 bg-clip-text text-transparent">Analytics</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Discover powerful features that transform your learning experience
        </p>
      </div>

       
      
      <div className="relative  w-full mt-20 h-96 flex items-center justify-center" style={{ perspective: '1300px' }}>
        <div
          className="relative w-full h-full flex items-center justify-center transition-transform duration-700 ease-in-out"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {cards.map((card, index) => {
            const IconComponent = card.icon;
            const isActive = index === currentIndex;

            return (
              <div
                key={card.id}
                className={`absolute w-80 h-96 cursor-pointer transition-all duration-700 ${isActive ? 'z-20' : 'z-10'}`}
                style={getCardStyle(index)}
                onClick={() => handleCardClick(index)}
              >
                {/* Card */}
                <div
                  className={`w-full h-full rounded-2xl shadow-2xl transform transition-all duration-500
                    ${isActive ? 'scale-110' : 'scale-95 hover:scale-100'}
                    bg-white/10 backdrop-blur-lg border border-white/20`}
                >
                  {/* Card Header */}
                  <div className={`p-6 rounded-t-2xl ${card.color}`}>
                    <div className="flex items-center justify-between text-white">
                      <div>
                        <p className="text-sm font-medium opacity-90">{card.subtitle}</p>
                        <h3 className="text-xl font-bold">{card.title}</h3>
                      </div>
                      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <IconComponent className="w-8 h-8" />
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between bg-white/90 backdrop-blur-sm">
                    <p className="text-gray-700 text-sm leading-relaxed mb-6">
                      {card.description}
                    </p>

                    {/* Stats */}
                    <div className="space-y-3">
                      {Object.entries(card.stats).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center">
                          <span className="text-gray-600 capitalize text-sm font-medium">{key}</span>
                          <span className="font-bold text-gray-800">{value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Active Indicator */}
                    {isActive && (
                      <div className="mt-4 flex justify-center">
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
      <div className="flex mt-28 items-center space-x-8  z-10">
        <button
          onClick={prevCard}
          className="w-12 h-12 bg-indigo-600 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-gray-600  transition-all group"
        >
          <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Dots Indicator */}
        <div className="flex space-x-2">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => handleCardClick(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex ? 'bg-indigo-600 scale-125' : 'bg-gray-400 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextCard}
          className="w-12 h-12 bg-indigo-600 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-gray-600  transition-all group"
        >
          <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Auto-rotation toggle */}
      <div className="mt-8 z-10">
        <button
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          className={`px-8 py-4 rounded-full text-lg cursor-pointer font-medium transition-all ${
            isAutoRotating
              ? 'bg-green-500/20 text-gray-600 border border-green-500/30'
              : 'bg-red-500/20 text-gray-600 border border-red-500/30'
          }`}
        >
          {isAutoRotating ? '⏸ Pause Auto-Rotation' : '▶ Resume Auto-Rotation'}
        </button>
      </div>
    </div>
  );
};

export default Rotating3DCards;