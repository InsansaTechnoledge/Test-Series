import React, { useState } from 'react';

const TestTypes = () => {
  const [carouselState, setCarouselState] = useState('');
  const [disableButtons, setDisableButtons] = useState(false);

  const questionTypes = [
    {
      id: 1,
      type: "MCQs",
      title: "Multiple Choice Questions",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop&auto=format",
      color: 'from-blue-500 to-indigo-600',
      description: "Single correct answer from multiple options",
      features: ["4-6 answer choices", "Auto-grading", "Randomizable options", "Partial scoring"],
      details: "Perfect for testing factual knowledge and concept understanding. Students select one correct answer from multiple options. Supports media attachments and detailed explanations.",
      difficulty: "Easy to Create",
      timeToCreate: "2-3 minutes",
      bestFor: "Knowledge recall, concept testing"
    },
    {
      id: 2,
      type: "MSQ",
      title: "Multiple Select Questions",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop&auto=format",
      color: 'from-purple-500 to-pink-600',
      description: "Multiple correct answers from options",
      features: ["Multiple selections", "Partial scoring", "Flexible grading", "Advanced analytics"],
      details: "Test comprehensive understanding by allowing multiple correct answers. Students can select one or more options. Supports weighted scoring and detailed feedback.",
      difficulty: "Medium to Create",
      timeToCreate: "3-4 minutes",
      bestFor: "Complex reasoning, multi-concept testing"
    },
    {
      id: 3,
      type: "Fill In The Blanks",
      title: "Fill in the Blanks",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop&auto=format",
      color: 'from-green-500 to-teal-600',
      description: "Complete sentences with missing words",
      features: ["Multiple blanks", "Case sensitivity", "Synonym matching", "Auto-completion"],
      details: "Test precise knowledge and vocabulary. Students fill missing words in sentences or paragraphs. Supports multiple acceptable answers and smart matching algorithms.",
      difficulty: "Easy to Create",
      timeToCreate: "2-4 minutes",
      bestFor: "Vocabulary, definitions, factual recall"
    },
    {
      id: 4,
      type: "Matching Type",
      title: "Matching Questions",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop&auto=format",
      color: 'from-orange-500 to-red-600',
      description: "Match items from two columns",
      features: ["Drag & drop interface", "Visual matching", "Flexible pairing", "Randomized order"],
      details: "Connect related concepts, terms, or definitions. Interactive drag-and-drop interface makes it engaging. Perfect for testing relationships and associations.",
      difficulty: "Medium to Create",
      timeToCreate: "4-5 minutes",
      bestFor: "Relationships, associations, definitions"
    },
    {
      id: 5,
      type: "True/False",
      title: "True or False",
      image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop&auto=format",
      color: 'from-cyan-500 to-blue-600',
      description: "Binary choice questions",
      features: ["Quick assessment", "High completion rate", "Simple interface", "Instant feedback"],
      details: "Simple yet effective for testing factual knowledge and basic concepts. Binary choice makes it quick to answer and grade. Perfect for rapid assessments.",
      difficulty: "Very Easy",
      timeToCreate: "1-2 minutes",
      bestFor: "Quick checks, basic facts, concept validation"
    },
    {
      id: 6,
      type: "Comprehension",
      title: "Reading Comprehension",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&auto=format",
      color: 'from-indigo-500 to-purple-600',
      description: "Questions based on provided text",
      features: ["Rich text support", "Multiple questions", "Context-based", "Analytical thinking"],
      details: "Present a passage followed by multiple questions testing understanding, analysis, and interpretation. Supports rich media and complex question sequences.",
      difficulty: "Complex to Create",
      timeToCreate: "10-15 minutes",
      bestFor: "Reading skills, analytical thinking, interpretation"
    },
    {
      id: 7,
      type: "Number Type",
      title: "Numerical Answer",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop&auto=format",
      color: 'from-emerald-500 to-green-600',
      description: "Mathematical and numerical responses",
      features: ["Range validation", "Unit support", "Decimal precision", "Formula input"],
      details: "Perfect for mathematics, physics, and engineering problems. Supports range answers, units, and various number formats. Advanced validation ensures accurate grading.",
      difficulty: "Medium to Create",
      timeToCreate: "3-5 minutes",
      bestFor: "Math problems, calculations, quantitative analysis"
    },
    {
      id: 8,
      type: "Code Compiler",
      title: "Programming Questions",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop&auto=format",
      color: 'from-gray-700 to-gray-900',
      description: "Live coding and compilation",
      features: ["Multi-language support", "Auto-testing", "Syntax highlighting", "Real-time execution"],
      details: "Full-featured coding environment with support for multiple programming languages. Automatic test case validation and real-time code execution with detailed feedback.",
      difficulty: "Complex to Create",
      timeToCreate: "15-20 minutes",
      bestFor: "Programming skills, algorithm testing, code quality"
    }
  ];

  const [items, setItems] = useState(questionTypes);

  const showSlider = (type) => {
    if (disableButtons) return;
    
    setDisableButtons(true);
    setCarouselState(type);
    
    if (type === 'next') {
      setItems(prev => [...prev.slice(1), prev[0]]);
    } else {
      setItems(prev => [prev[prev.length - 1], ...prev.slice(0, -1)]);
    }

    setTimeout(() => {
      setDisableButtons(false);
      setCarouselState('');
    }, 2000);
  };

  const showDetail = () => {
    setCarouselState('showDetail');
  };

  const hideDetail = () => {
    setCarouselState('');
  };

  return (
    <div className=" font-sans">
      {/* Main Title */}
      <div className='flex item-center justify-center'>
        <div className="max-w-5xl py-4 sm:py-8 px-4">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-center font-bold text-gray-800 mb-4">
            Types of <span className='text-blue-600'>Questions</span> we support for Creating an Exam
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-center text-gray-500 max-w-3xl mx-auto">
            Choose from our comprehensive collection of question formats to create engaging and effective assessments
          </p>
        </div>
      </div>

      {/* Mobile Row Layout (visible on sm and below) */}
      <div className="block sm:hidden px-4 py-8">
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
          {items.map((item, index) => (
            <div 
              key={item.id}
              className="flex-none w-80 bg-white rounded-2xl shadow-lg overflow-hidden snap-center"
            >
              {/* Image Section */}
              <div className="relative h-48">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.classList.add('bg-gradient-to-br', ...item.color.split(' '));
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white p-4">
                  <h3 className="text-xl font-bold text-center mb-2">{item.type}</h3>
                  <p className="text-center text-sm opacity-90">{item.description}</p>
                </div>
              </div>
              
              {/* Content Section */}
              <div className="p-4">
                <h4 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h4>
                <p className="text-sm text-slate-600 mb-3 line-clamp-2">{item.details}</p>
                
                {/* Features */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.features.slice(0, 2).map((feature, idx) => (
                    <span key={idx} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                      {feature}
                    </span>
                  ))}
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="font-semibold text-gray-600">Difficulty</p>
                    <p className="text-gray-800">{item.difficulty}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="font-semibold text-gray-600">Setup Time</p>
                    <p className="text-gray-800">{item.timeToCreate}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Mobile Navigation Dots */}
        <div className="flex justify-center mt-4 gap-2">
          {items.slice(0, 5).map((_, index) => (
            <div key={index} className="w-2 h-2 bg-gray-300 rounded-full"></div>
          ))}
        </div>
      </div>

      {/* Desktop/Tablet Carousel (hidden on mobile) */}
      <div className={`hidden sm:block carousel relative h-96 md:h-[500px] lg:h-[700px] overflow-hidden ${carouselState}`}>
        {/* Background Gradient */}
        <div className={`absolute w-96 h-64 md:w-[500px] md:h-[300px] bg-gradient-to-br ${items[1]?.color || 'from-blue-500 to-indigo-600'} rounded-[20%_30%_80%_10%] blur-[100px] md:blur-[150px] top-1/2 left-1/2 transform -translate-x-2 -translate-y-1/2 z-[-1] transition-all duration-1000 ${carouselState === 'showDetail' ? 'transform -translate-x-full -translate-y-1/2 rotate-90 blur-[130px]' : ''}`}></div>

        {/* Items Container */}
        <div className="absolute w-full max-w-7xl h-4/5 left-1/2 transform -translate-x-1/2 px-6">
          {items.map((item, index) => {
            return (
              <div
                key={item.id}
                className={`item absolute left-0 w-full md:w-3/5 lg:w-4/5 h-full text-sm transition-all duration-500 ${
                  index >= 5 ? 'opacity-0' : ''
                } ${getItemClasses(index, carouselState)}`}
                style={getItemStyles(index)}
              >
                {/* Question Type Visual with Large Image */}
                <div className={`w-2/5 md:w-1/2 absolute right-0 top-1/2 transform -translate-y-1/2 transition-all duration-1000 ${
                  carouselState === 'showDetail' && index === 1 ? 'right-1/2' : ''
                } flex items-center justify-center`}>
                  <div className={`w-80 h-80 md:w-96 md:h-96 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform relative group`}>
                    {/* Large Image */}
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.classList.add('bg-gradient-to-br', ...item.color.split(' '));
                      }}
                    />
                    
                    {/* Overlay with text */}
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white p-8">
                      <h3 className="text-2xl md:text-3xl font-bold text-center mb-3">{item.type}</h3>
                      <p className="text-center text-sm md:text-base opacity-90 leading-relaxed">{item.description}</p>
                    </div>
                    
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>

                {/* Introduce Section */}
                <div className={`introduce absolute top-1/2 transform -translate-y-1/2 w-full md:w-96 transition-opacity duration-500 ${
                  index === 1 && carouselState !== 'showDetail' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}>
                  <div className={`title text-lg md:text-xl font-medium leading-none text-indigo-600 ${
                    index === 1 ? 'animate-slideUp' : ''
                  }`} style={{animationDelay: '1s'}}>
                    QUESTION TYPE
                  </div>
                  <div className={`topic text-3xl md:text-5xl font-bold mt-2 text-slate-800 ${
                    index === 1 ? 'animate-slideUp' : ''
                  }`} style={{animationDelay: '1.2s'}}>
                    {item.title}
                  </div>
                  <div className={`des text-sm md:text-base text-slate-600 mt-4 leading-relaxed ${
                    index === 1 ? 'animate-slideUp' : ''
                  }`} style={{animationDelay: '1.4s'}}>
                    {item.details}
                  </div>
                  <div className={`features mt-4 ${index === 1 ? 'animate-slideUp' : ''}`} style={{animationDelay: '1.5s'}}>
                    <div className="flex flex-wrap gap-2">
                      {item.features.slice(0, 2).map((feature, idx) => (
                        <span key={idx} className="px-3 py-1 bg-indigo-200 text-slate-700 rounded-full text-xs font-medium">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={showDetail}
                    className={`seeMore font-bold mt-6 py-2 px-6 border-2 border-slate-800 bg-indigo-600 text-white rounded-lg tracking-wider transition-all hover:bg-indigo-700 hover:text-slate-100 ${
                      index === 1 ? 'animate-slideUp' : ''
                    }`}
                    style={{animationDelay: '1.6s'}}
                  >
                    EXPLORE FEATURES ↗
                  </button>
                </div>

                {/* Detail Section */}
                <div className={`detail absolute right-0 top-1/2 transform -translate-y-1/2 w-1/2 text-right transition-all duration-500 ${
                  carouselState === 'showDetail' && index === 1 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}>
                  <div className={`title text-2xl md:text-4xl font-bold text-slate-800 ${
                    carouselState === 'showDetail' && index === 1 ? 'animate-slideUp' : ''
                  }`} style={{animationDelay: '1s'}}>
                    {item.title}
                  </div>
                  <div className={`des text-sm md:text-base text-slate-600 mt-4 max-h-24 overflow-auto leading-relaxed ${
                    carouselState === 'showDetail' && index === 1 ? 'animate-slideUp' : ''
                  }`} style={{animationDelay: '1.2s'}}>
                    {item.details}
                  </div>

                  {/* Features Grid */}
                  <div className={`specifications grid grid-cols-2 gap-3 w-full border-t border-slate-300 mt-6 pt-4 ${
                    carouselState === 'showDetail' && index === 1 ? 'animate-slideUp' : ''
                  }`} style={{animationDelay: '1.4s'}}>
                    {item.features.map((feature, idx) => (
                      <div key={idx} className="text-center p-3 bg-slate-50 rounded-lg">
                        <p className="text-xs font-semibold text-slate-800">{feature}</p>
                      </div>
                    ))}
                  </div>

                  {/* Quick Stats */}
                  <div className={`stats mt-4 grid grid-cols-1 gap-2 ${
                    carouselState === 'showDetail' && index === 1 ? 'animate-slideUp' : ''
                  }`} style={{animationDelay: '1.5s'}}>
                    <div className="bg-slate-100 p-3 rounded-lg">
                      <p className="text-xs font-bold text-slate-600">Difficulty</p>
                      <p className="text-sm text-slate-800">{item.difficulty}</p>
                    </div>
                    <div className="bg-slate-100 p-3 rounded-lg">
                      <p className="text-xs font-bold text-slate-600">Setup Time</p>
                      <p className="text-sm text-slate-800">{item.timeToCreate}</p>
                    </div>
                    <div className="bg-slate-100 p-3 rounded-lg">
                      <p className="text-xs font-bold text-slate-600">Best For</p>
                      <p className="text-sm text-slate-800">{item.bestFor}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Navigation Arrows */}
        <div className="arrows absolute bottom-8 w-full max-w-7xl flex justify-between left-1/2 transform -translate-x-1/2 px-6">
          <button
            id="prev"
            onClick={() => showSlider('prev')}
            className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-slate-400 text-xl font-mono bg-white hover:bg-slate-100 hover:border-slate-600 transition-all shadow-lg ${
              carouselState === 'showDetail' ? 'opacity-0 pointer-events-none' : ''
            }`}
            disabled={disableButtons}
          >
            ←
          </button>
          <button
            id="next"
            onClick={() => showSlider('next')}
            className={`w-16 h-16 md:w-14 md:h-14 rounded-full border-2 border-slate-400 text-xl font-mono bg-white hover:bg-slate-100 hover:border-slate-600 transition-all shadow-lg ${
              carouselState === 'showDetail' ? 'opacity-0 pointer-events-none' : ''
            }`}
            disabled={disableButtons}
          >
            →
          </button>
          <button
            id="back"
            onClick={hideDetail}
            className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 border-none border-b-2 border-slate-600 bg-transparent py-3 px-6 font-bold tracking-wider text-sm hover:bg-slate-100 transition-all rounded-t-lg ${
              carouselState === 'showDetail' ? 'opacity-100' : 'opacity-0'
            }`}
          >
            ← BACK TO OVERVIEW
          </button>
        </div>
      </div>

      <style jsx>{`
        /* Desktop Carousel Styles */
        .item:nth-child(1) {
          transform: translateX(-100%) translateY(-5%) scale(1.5);
          filter: blur(30px);
          z-index: 11;
          opacity: 0;
          pointer-events: none;
        }
        .item:nth-child(2) {
          transform: translateX(0);
          filter: blur(0px);
          z-index: 10;
          opacity: 1;
        }
        .item:nth-child(3) {
          transform: translate(50%, 10%) scale(0.8);
          filter: blur(10px);
          z-index: 9;
          opacity: 1;
        }
        .item:nth-child(4) {
          transform: translate(90%, 20%) scale(0.5);
          filter: blur(30px);
          z-index: 8;
          opacity: 1;
        }
        .item:nth-child(5) {
          transform: translate(120%, 30%) scale(0.3);
          filter: blur(40px);
          z-index: 7;
          opacity: 0;
          pointer-events: none;
        }
        
        .carousel.showDetail .item:nth-child(3),
        .carousel.showDetail .item:nth-child(4) {
          left: 100%;
          opacity: 0;
          pointer-events: none;
        }
        .carousel.showDetail .item:nth-child(2) {
          width: 100%;
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(-30px);
            filter: blur(10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
            filter: blur(0px);
          }
        }
        
        .animate-slideUp {
          animation: slideUp 0.5s ease-in-out forwards;
        }

        /* Mobile specific styles */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Custom scrollbar for mobile horizontal scroll */
        @media (max-width: 640px) {
          .overflow-x-auto::-webkit-scrollbar {
            height: 4px;
          }
          .overflow-x-auto::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 4px;
          }
          .overflow-x-auto::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
          }
          .overflow-x-auto::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        }
      `}</style>
    </div>
  );
};

// Helper functions (unchanged)
const getItemClasses = (index, carouselState) => {
  let classes = '';
  
  if (carouselState === 'next') {
    if (index === 0) classes += ' animate-transformFromPosition2';
    if (index === 1) classes += ' animate-transformFromPosition3';
    if (index === 2) classes += ' animate-transformFromPosition4';
    if (index === 3) classes += ' animate-transformFromPosition5';
  }
  
  if (carouselState === 'prev') {
    if (index === 4) classes += ' animate-transformFromPosition4';
    if (index === 3) classes += ' animate-transformFromPosition3';
    if (index === 2) classes += ' animate-transformFromPosition2';
    if (index === 1) classes += ' animate-transformFromPosition1';
  }
  
  return classes;
};

const getItemStyles = (index) => {
  const styles = {};
  
  if (index === 0) {
    styles.transform = 'translateX(-100%) translateY(-5%) scale(1.5)';
    styles.filter = 'blur(30px)';
    styles.zIndex = 11;
    styles.opacity = 0;
    styles.pointerEvents = 'none';
  } else if (index === 1) {
    styles.transform = 'translateX(0)';
    styles.filter = 'blur(0px)';
    styles.zIndex = 10;
    styles.opacity = 1;
  } else if (index === 2) {
    styles.transform = 'translate(50%, 10%) scale(0.8)';
    styles.filter = 'blur(10px)';
    styles.zIndex = 9;
    styles.opacity = 1;
  } else if (index === 3) {
    styles.transform = 'translate(90%, 20%) scale(0.5)';
    styles.filter = 'blur(30px)';
    styles.zIndex = 8;
    styles.opacity = 1;
  } else if (index === 4) {
    styles.transform = 'translate(120%, 30%) scale(0.3)';
    styles.filter = 'blur(40px)';
    styles.zIndex = 7;
    styles.opacity = 0;
    styles.pointerEvents = 'none';
  }
  
  return styles;
};

export default TestTypes;