import React from 'react';
import heroBanner from '../../../../assests/StudentLanding/heroBanner.jpg';

const StudentHero = () => {
  return (
    <section className="relative w-full h-[40vh] md:h-[60vh] mt-16 rounded-4xl overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <img
        src={heroBanner}
        alt="Hero Banner"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Centered Content */}
      <div className="relative z-20 text-center px-4 md:px-20">
        <h1 className="text-white text-4xl md:text-6xl font-bold leading-tight">
          Organization Name
        </h1>
      </div>
    </section>
  );
};

export default StudentHero;
