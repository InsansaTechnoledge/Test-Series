import { CheckCircle } from 'lucide-react';
import React from 'react'

const CertificateCard = ({selectedCard , setSelectedCard , certificateTemplates}) => {
    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 py-4'>
        {certificateTemplates.map(c => (
          <button
              onClick={() => setSelectedCard(c._id)}
              key={c._id}
              className={`relative bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 ${
                  selectedCard === c._id ? 'border-4 border-indigo-600' : ''
              }`}
              >
             
              {selectedCard === c._id && (
                  <div className="absolute top-2 right-2 bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                  <CheckCircle size={16}/>
                  </div>
              )}
              
              <img src={c.image} alt={c.name} className="w-full h-40 object-cover" />
              <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{c.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{c.description}</p>
                  <span className="inline-block mt-2 text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                  {c.style}
                  </span>
              </div>
          </button>
        ))}
      </div>
    );
  };
  
export default CertificateCard
