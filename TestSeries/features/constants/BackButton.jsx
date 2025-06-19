import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const tton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); 
  };

  return (
<button
  onClick={handleBack}
  className="group inline-flex items-center space-x-3 px-5 py-2.5 rounded-2xl font-semibold text-white transition-all duration-300
             bg-gradient-to-r from-indigo-500/60 to-indigo-600/60 backdrop-blur-md
             shadow-md border border-white/20 hover:border-white/40
             hover:scale-[1.04] hover:shadow-lg"
>
  <ArrowLeft size={18} className="text-white group-hover:-translate-x-1 transition-all duration-300" />
  <span>Back</span>
</button>

  
  );
};

export default tton;
