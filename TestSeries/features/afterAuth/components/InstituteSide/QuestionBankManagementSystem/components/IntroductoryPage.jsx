import React, { useEffect, useState } from 'react';
import LogoDark from '../../../../../../assests/Logo/Frame 15.svg';
import LogoLight from '../../../../../../assests/Logo/Frame 8.svg';
import BlurText from '../Utility/BlurText.jsx';


const IntroductoryPage = ({ show, theme }) => {
    const [animationPhase, setAnimationPhase] = useState('enter');

    const handleAnimationComplete = () => {
        console.log('Animation completed!');
      };


    useEffect(() => {
        if (show) {
          setAnimationPhase('enter');
          
          // Start exit animation after 800ms (leaving 200ms for exit)
          const exitTimer = setTimeout(() => {
            setAnimationPhase('exit');
          }, 2500);
    
          return () => clearTimeout(exitTimer);
        }
      }, [show]);
  
    if (!show) return null;
  
    return (
      <div 
        className={`fixed inset-0 ${
          theme === 'light' ? 'bg-white' : 'bg-gray-950'
        } flex items-center justify-center z-50 transition-all duration-300 ${
          animationPhase === 'exit' ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="text-center">
          {/* Logo with scale and fade animation */}
          <div 
            className={`mb-8 transform transition-all duration-700 ease-out ${
              animationPhase === 'enter' 
                ? 'scale-100 opacity-100 translate-y-0' 
                : 'scale-110 opacity-0 -translate-y-4'
            }`}
            style={{
              transitionDelay: animationPhase === 'enter' ? '100ms' : '0ms'
            }}
          >
            <img src={theme === 'light' ? LogoLight : LogoDark} alt="evalvo logo" />
          </div>
  
          {/* Welcome text with slide up animation */}
          <div 
            className={`transform transition-all duration-600 ease-out ${
              animationPhase === 'enter'
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-6'
            }`}
            style={{
              transitionDelay: animationPhase === 'enter' ? '300ms' : '0ms'
            }}
          >
           
            <BlurText
            text="Welcome to Evalvo's QBMS!"
            delay={250}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className={`text-[100px] ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}  mb-8`}
            />
          </div>
  
          {/* Loading indicator */}
          <div 
            className={`mt-8 transform transition-all duration-500 ease-out ${
              animationPhase === 'enter'
                ? 'opacity-60 scale-100'
                : 'opacity-0 scale-95'
            }`}
            style={{
              transitionDelay: animationPhase === 'enter' ? '500ms' : '0ms'
            }}
          >
            <div className="flex justify-center space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    theme === 'light' ? 'bg-gray-400' : 'bg-gray-600'
                  } animate-pulse`}
                  style={{
                    animationDelay: `${i * 200}ms`,
                    animationDuration: '1s'
                  }}
                />
              ))}
            </div>
          </div>
  
        
        </div>
      </div>
    );
  };
  
export default IntroductoryPage;