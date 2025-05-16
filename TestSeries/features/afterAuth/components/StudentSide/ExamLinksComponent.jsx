import React from 'react';



export default function ExamLinksComponent({Data}) {
  return (
    <div className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header with gradient */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold bg-blue-900 bg-clip-text text-transparent">
            Quick Link's to Exams 
          </h1>
          <p className="text-gray-600 mt-3">View and access all your examination resources</p>
        </div>
        
        {/* Data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {Data.map((card, index) => {
            const Icon = card?.icon;
            const Rank = card?.rank;
            return (
              <div
                key={index}
                className={`${card.color} rounded-xl border p-6 flex flex-col items-center ${card.shadow} shadow-lg hover:scale-105 transition-all cursor-pointer`}
              >
                <div className="p-3 rounded-full mb-4">
                    {     
                       Icon ?  <Icon size={32} /> : <div>{Rank}</div>
                    }
                </div>
                <h3 className="text-xl font-semibold">{card.name}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}