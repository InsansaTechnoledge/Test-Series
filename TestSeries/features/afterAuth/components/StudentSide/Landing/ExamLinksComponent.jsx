import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ExamLinksComponent({ Data , grid }) {
  const navigate = useNavigate();
  console.log(grid)
  return (
    <div className="px-4 py-8">
      <div className="max-w-6xl mx-auto">

      <div className={`grid grid-cols-1 sm:grid-cols-2 ${grid?.[0]?.grid ? `lg:${grid[0].grid}` : 'lg:grid-cols-2'} gap-6 md:gap-8`}>
      {Data.map((card, index) => {
            const Icon = card?.icon;
            const Rank = card?.rank;

            return (
              <button
                key={index}
                className={`rounded-xl border p-6 flex flex-col items-center text-center transition-all duration-300 transform hover:scale-105 cursor-pointer ${card.color} ${card.shadow}`}
                onClick={()=>navigate(card.path)}
              >
                <div className="p-3 rounded-full mb-4 bg-white shadow-inner w-14 h-14 flex items-center justify-center">
                  {Icon ? (
                    <Icon size={28} className="text-blue-900" />
                  ) : (
                    <div className="text-blue-900 font-bold text-xl">{Rank}</div>
                  )}
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-800">{card.name}</h3>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
