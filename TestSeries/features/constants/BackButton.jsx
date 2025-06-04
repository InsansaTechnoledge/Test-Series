import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); 
  };

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 font-medium px-4 py-2.5 rounded-lg transition"
    >
      <ArrowLeft size={18} />
      Back
    </button>
  );
};

export default BackButton;
