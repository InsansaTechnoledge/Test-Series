import React from 'react';

export default function ExamLinksComponent({ Data }) {
  return (
    <div className="px-4 py-8">
      <div className="max-w-6xl mx-auto">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {Data.map((card, index) => {
            const Icon = card?.icon;
            const Rank = card?.rank;

            return (
              <div
                key={index}
                className={`rounded-xl border p-6 flex flex-col items-center text-center transition-all duration-300 transform hover:scale-105 cursor-pointer ${card.color} ${card.shadow}`}
              >
                <div className="p-3 rounded-full mb-4 bg-white shadow-inner w-14 h-14 flex items-center justify-center">
                  {Icon ? (
                    <Icon size={28} className="text-blue-900" />
                  ) : (
                    <div className="text-blue-900 font-bold text-xl">{Rank}</div>
                  )}
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-800">{card.name}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
