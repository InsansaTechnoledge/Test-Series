import React, { useEffect, useState, useMemo } from "react";
import CryptoJS from "crypto-js";
import { VITE_SECRET_KEY_FOR_COUNTDOWN_TIMER } from "../../constants/env";
import { useTheme } from "../../../hooks/useTheme";

const ENCRYPTION_KEY = import.meta.env.VITE_SECRET_KEY_FOR_COUNTDOWN_TIMER || VITE_SECRET_KEY_FOR_COUNTDOWN_TIMER;

function CountdownTimer({ initialTime, handleSubmitTest, submitted }) {
  const { theme } = useTheme();
  
  const getInitialSeconds = () => {
    const encrypted = localStorage.getItem("encryptedTimeLeft");
    const storedTotal = localStorage.getItem("totalInitialTime");
    const currentTotal = initialTime * 60;
    
    if (encrypted && storedTotal) {
      try {
        const decrypted = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
        const timeLeft = parseInt(decrypted, 10);
        const storedTotalInt = parseInt(storedTotal, 10);
        
        // Only use stored time if it's valid and the total matches current initialTime
        if (timeLeft >= 0 && storedTotalInt === currentTotal && timeLeft <= currentTotal) {
          return timeLeft;
        }
      } catch {
        // If decryption fails, clear the stored data
        localStorage.removeItem("encryptedTimeLeft");
        localStorage.removeItem("totalInitialTime");
      }
    }
    
    // If no valid stored time or totals don't match, start fresh
    return currentTotal;
  };

  const getTotalInitialTime = () => {
    // Check if we have a stored total time that matches current initialTime
    const storedTotal = localStorage.getItem("totalInitialTime");
    const currentTotal = initialTime * 60;
    
    if (storedTotal && parseInt(storedTotal, 10) === currentTotal) {
      return parseInt(storedTotal, 10);
    }
    
    // If no stored total or it doesn't match, use current initialTime
    localStorage.setItem("totalInitialTime", currentTotal.toString());
    return currentTotal;
  };

  const [time, setTime] = useState(getInitialSeconds);
  const totalInitialTime = useMemo(() => getTotalInitialTime(), [initialTime]);
  
  // Debug logging - you can remove this after testing
  console.log("Current time:", time, "Total initial time:", totalInitialTime, "Percentage:", (time / totalInitialTime) * 100);
  
  // Calculate if we're in the critical time period (last 10%)
  const isInCriticalTime = useMemo(() => {
    const criticalThreshold = totalInitialTime * 0.1; // 10% of total time
    return time <= criticalThreshold && time > 0;
  }, [time, totalInitialTime]);

  // Calculate if we're in the final minute for extra urgency
  const isInFinalMinute = useMemo(() => time <= 60 && time > 0, [time]);

  useEffect(() => {
    if (submitted) {
      return;
    }

    if (time <= 0) {
      handleSubmitTest();
      return;
    }

    const interval = setInterval(() => {
      setTime((prev) => {
        const updated = prev - 1;
        const encrypted = CryptoJS.AES.encrypt(updated.toString(), ENCRYPTION_KEY).toString();
        localStorage.setItem("encryptedTimeLeft", encrypted);
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [time, submitted, handleSubmitTest]);

  const formatTime = (secs) => {
    const h = String(Math.floor(secs / 3600)).padStart(2, "0");
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return { hours: h, minutes: m, seconds: s };
  };

  const { hours, minutes, seconds } = formatTime(time);

  // Calculate percentage remaining
  const percentageRemaining = useMemo(() => {
    if (totalInitialTime === 0) return 0;
    const percentage = (time / totalInitialTime) * 100;
    return Math.min(100, Math.max(0, Math.round(percentage)));
  }, [time, totalInitialTime]);

  // Dynamic styles based on time remaining
  const getContainerStyles = () => {
    const baseStyles = "w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl text-center shadow-2xl transition-all duration-300";
    
    if (isInFinalMinute) {
      return `${baseStyles} ${theme === 'light' 
        ? 'bg-red-50 text-red-900 border-2 border-red-200 shadow-red-200' 
        : 'bg-red-900 text-red-100 border-2 border-red-700 shadow-red-800'} animate-pulse`;
    }
    
    if (isInCriticalTime) {
      return `${baseStyles} ${theme === 'light' 
        ? 'bg-orange-50 text-orange-900 border-2 border-orange-200 shadow-orange-200' 
        : 'bg-orange-900 text-orange-100 border-2 border-orange-700 shadow-orange-800'}`;
    }
    
    return `${baseStyles} ${theme === 'light' 
      ? 'bg-white text-gray-900 border border-gray-200' 
      : 'bg-gray-700 text-white border border-gray-600'}`;
  };

  const getTimeBoxStyles = () => {
    const baseStyles = "flex-1 max-w-[60px] xs:max-w-[70px] sm:max-w-[80px] md:max-w-[90px] lg:max-w-[100px] xl:max-w-[110px] text-center p-2 sm:p-3 md:p-4 rounded-md sm:rounded-lg md:rounded-xl transition-all duration-300";
    
    if (isInFinalMinute) {
      return `${baseStyles} ${theme === 'light' 
        ? 'bg-red-100 text-red-900 border border-red-300' 
        : 'bg-red-800 text-red-100 border border-red-600'}`;
    }
    
    if (isInCriticalTime) {
      return `${baseStyles} ${theme === 'light' 
        ? 'bg-orange-100 text-orange-900 border border-orange-300' 
        : 'bg-orange-800 text-orange-100 border border-orange-600'}`;
    }
    
    return `${baseStyles} ${theme === 'light' 
      ? 'bg-gray-100 text-gray-900 border border-gray-300' 
      : 'bg-gray-600 text-white border border-gray-500'}`;
  };

  const getTitleStyles = () => {
    const baseStyles = "text-xs sm:text-sm md:text-base lg:text-lg font-medium mb-2 sm:mb-3 md:mb-4 tracking-wide transition-all duration-300";
    
    if (isInFinalMinute) {
      return `${baseStyles} text-red-600 font-bold animate-pulse`;
    }
    
    if (isInCriticalTime) {
      return `${baseStyles} text-orange-600 font-semibold`;
    }
    
    return baseStyles;
  };

  const getNumberStyles = () => {
    const baseStyles = "text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold transition-all duration-300";
    
    if (isInFinalMinute) {
      return `${baseStyles} font-black`;
    }
    
    if (isInCriticalTime) {
      return `${baseStyles} font-extrabold`;
    }
    
    return baseStyles;
  };

  const getSeparatorStyles = () => {
    const baseStyles = "text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-semibold opacity-50 px-1 transition-all duration-300";
    
    if (isInCriticalTime) {
      return `${baseStyles} opacity-70`;
    }
    
    return baseStyles;
  };

  const getLabelStyles = () => {
    const baseStyles = "text-[9px] xs:text-[10px] sm:text-xs md:text-sm lg:text-base opacity-70 transition-all duration-300";
    
    if (isInCriticalTime) {
      return `${baseStyles} opacity-90 font-medium`;
    }
    
    return baseStyles;
  };

  return (
    <div className={getContainerStyles()}>
      <h2 className={getTitleStyles()}>
        {isInFinalMinute ? '⚠️ FINAL MINUTE!' : isInCriticalTime ? '⏰ Time Running Out!' : 'Time Left'}
      </h2>
      
      <div className="flex justify-center items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4">
        {/* Hours */}
        <div className={getTimeBoxStyles()}>
          <div className={getNumberStyles()}>{hours}</div>
          <div className={getLabelStyles()}>Hours</div>
        </div>
        
        <span className={getSeparatorStyles()}>:</span>
        
        {/* Minutes */}
        <div className={getTimeBoxStyles()}>
          <div className={getNumberStyles()}>{minutes}</div>
          <div className={getLabelStyles()}>Minutes</div>
        </div>
        
        <span className={getSeparatorStyles()}>:</span>
        
        {/* Seconds */}
        <div className={getTimeBoxStyles()}>
          <div className={getNumberStyles()}>{seconds}</div>
          <div className={getLabelStyles()}>Seconds</div>
        </div>
      </div>
      
      {/* Progress bar for visual indication */}
      <div className="mt-3 sm:mt-4 md:mt-5">
        <div className={`w-full h-1 sm:h-2 rounded-full overflow-hidden ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-600'}`}>
          <div 
            className={`h-full transition-all duration-1000 ease-linear ${
              isInFinalMinute ? 'bg-red-500 animate-pulse' : 
              isInCriticalTime ? 'bg-orange-500' : 
              'bg-green-500'
            }`}
            style={{ width: `${percentageRemaining}%` }}
          />
        </div>
        <div className={`mt-1 sm:mt-2 text-[10px] sm:text-xs opacity-60 ${
          isInCriticalTime ? 'font-medium' : ''
        }`}>
          {percentageRemaining}% remaining
        </div>
      </div>
    </div>
  );
}

export default CountdownTimer;