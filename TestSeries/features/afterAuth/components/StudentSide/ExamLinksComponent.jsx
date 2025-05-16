import React from 'react';


export default function ExamLinksComponent({Data}) {
  return (
    <div className=" px-4">
      <div className="max-w-5xl mx-auto">
               
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
                       Icon ?  <Icon size={32} /> : <div className="text-blue-900 font-bold text-4xl ">{Rank}</div>
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