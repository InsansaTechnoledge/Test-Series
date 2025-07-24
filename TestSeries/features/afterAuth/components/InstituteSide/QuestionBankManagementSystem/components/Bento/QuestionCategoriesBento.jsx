import React, { useState } from 'react';
import { ArrowUpRight, Trash2 } from 'lucide-react';

const QuestionCategoriesBento = ({ categories , setSelectedQuestionType}) => {
  console.log("Categories:", categories);

  const [hoveredCard, setHoveredCard] = useState(null);

  const getGridClass = (size) => {
    switch (size) {
      case 'large':
        return 'col-span-2 row-span-2';
      case 'medium':
        return 'col-span-2 row-span-1';
      case 'small':
        return 'col-span-1 row-span-1';
      default:
        return 'col-span-1 row-span-1';
    }
  };

  return (
    <div className="p-6">
      <div className="mx-auto">
        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-6 mx-auto">
          {categories.map((category, index) => {
            const isHovered = hoveredCard === category;
            
            return (
              <div
                
                key={index}
                className={`${getGridClass('medium')} group relative overflow-hidden rounded-2xl transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 border border-indigo-100 bg-white/80 backdrop-blur-sm hover:bg-white hover:border-indigo-200`}
                onMouseEnter={() => setHoveredCard(category)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative h-full p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between space-x-3 mb-3">
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                    {category?.type?.toUpperCase()}
                  </h3>
                  <button className='text-red-400 cursor-pointer hover:text-red-500'><Trash2 /></button>
                </div>

                                  

                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2">
                      {
                        isHovered ?  
                        <span>
                          Click on <ArrowUpRight className="inline w-4 h-4" /> to see detailed page
                        </span>
                      : 
                        <span className="text-sm text-gray-500 font-medium">No. of questions for {category.type}</span>
                      }
                    </div>
                    <button onClick={() => setSelectedQuestionType(category.type)} className={`w-10 cursor-pointer h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md transition-all duration-300 group-hover:shadow-lg ${isHovered ? 'scale-110 rotate-12' : ''}`}>
                      {isHovered ?  <ArrowUpRight className="w-5 h-5 text-white" /> :  <span className="text-lg font-bold text-indigo-50">{category?.count}</span>}
                    </button>
                  </div>
                </div>

                {/* Subtle shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuestionCategoriesBento;
