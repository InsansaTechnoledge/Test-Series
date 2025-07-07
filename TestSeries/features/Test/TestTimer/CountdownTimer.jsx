import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { VITE_SECRET_KEY_FOR_COUNTDOWN_TIMER } from "../../constants/env";
import { useTheme } from "../../../hooks/useTheme"; // Assuming you have this hook

const ENCRYPTION_KEY = import.meta.env.VITE_SECRET_KEY_FOR_COUNTDOWN_TIMER || VITE_SECRET_KEY_FOR_COUNTDOWN_TIMER;

function CountdownTimer({ initialTime, handleSubmitTest, submitted ,examId}) {
  const { theme } = useTheme(); 
  
  const getInitialSeconds = (id) => {
    if (submitted) return 0;
    const encrypted = localStorage.getItem(`encryptedTimeLeft_${id}`);
    if (encrypted) {
      try {
        const decrypted = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
        return parseInt(decrypted, 10) || 0;
      } catch {
        return 0;
      }
    }
    return initialTime * 60;
  };
  

  const [time, setTime] = useState(() => getInitialSeconds(examId));
  useEffect(() => {
    setTime(getInitialSeconds(examId));
  }, [examId]);
  


  useEffect(() => {
    if (submitted || time <= 0) {
      if (time <= 0) handleSubmitTest();
      return;
    }
  
    const interval = setInterval(() => {
      setTime((prev) => {
        const updated = prev - 1;
        const encrypted = CryptoJS.AES.encrypt(updated.toString(), ENCRYPTION_KEY).toString();
        localStorage.setItem(`encryptedTimeLeft_${examId}`, encrypted);
        return updated;
      });
    }, 1000);
  
    return () => clearInterval(interval);
  }, [submitted, examId]);
  
  useEffect(() => {
    if (submitted) {
      localStorage.removeItem(`encryptedTimeLeft_${examId}`);
    }
  }, [submitted, examId]);
  
  const formatTime = (secs) => {
    const h = String(Math.floor(secs / 3600)).padStart(2, "0");
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return { hours: h, minutes: m, seconds: s };
  };

  const { hours, minutes, seconds } = formatTime(time);

  return (
    <div className={`w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl text-center shadow-2xl ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}>
    <h2 className="text-xs sm:text-sm md:text-base font-medium mb-2 sm:mb-3 md:mb-4 tracking-wide">Time Left</h2>
    
    <div className="flex justify-center items-center gap-1 sm:gap-2 md:gap-3">
      {/* Hours */}
      <div className={`flex-1 max-w-[70px] sm:max-w-[80px] md:max-w-[90px] lg:max-w-[100px] text-center p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl ${theme === 'light' ? 'bg-gray-200 text-gray-900' : 'bg-gray-600 text-white'}`}>
        <div className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold">{hours}</div>
        <div className="text-[10px] sm:text-xs md:text-sm opacity-70">Hours</div>
      </div>
      
      <span className="text-sm sm:text-lg md:text-xl lg:text-2xl font-semibold opacity-50 px-1">:</span>
      
      {/* Minutes */}
      <div className={`flex-1 max-w-[70px] sm:max-w-[80px] md:max-w-[90px] lg:max-w-[100px] text-center p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl ${theme === 'light' ? 'bg-gray-200 text-gray-900' : 'bg-gray-600 text-white'}`}>
        <div className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold">{minutes}</div>
        <div className="text-[10px] sm:text-xs md:text-sm opacity-70">Minutes</div>
      </div>
      
      <span className="text-sm sm:text-lg md:text-xl lg:text-2xl font-semibold opacity-50 px-1">:</span>
      
      {/* Seconds */}
      <div className={`flex-1 max-w-[70px] sm:max-w-[80px] md:max-w-[90px] lg:max-w-[100px] text-center p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl ${theme === 'light' ? 'bg-gray-200 text-gray-900' : 'bg-gray-600 text-white'}`}>
        <div className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold">{seconds}</div>
        <div className="text-[10px] sm:text-xs md:text-sm opacity-70">Seconds</div>
      </div>
    </div>
  </div>

  );
}

export default CountdownTimer;