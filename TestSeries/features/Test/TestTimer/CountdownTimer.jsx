import React, { useEffect, useState, useMemo } from "react";
import CryptoJS from "crypto-js";
import { VITE_SECRET_KEY_FOR_COUNTDOWN_TIMER } from "../../constants/env";
import { useTheme } from "../../../hooks/useTheme";

const ENCRYPTION_KEY =
  import.meta.env.VITE_SECRET_KEY_FOR_COUNTDOWN_TIMER ||
  VITE_SECRET_KEY_FOR_COUNTDOWN_TIMER;

function CountdownTimer({
  initialTime,
  handleSubmitTest,
  submitted,
  examId,
  pause = false,
  variant = "header"
}) {
  const { theme } = useTheme();

  const getInitialSeconds = (id) => {
    if (submitted) return 0;
    const encrypted = localStorage.getItem(`encryptedTimeLeft_${id}`);
    if (encrypted) {
      try {
        const decrypted = CryptoJS.AES.decrypt(
          encrypted,
          ENCRYPTION_KEY
        ).toString(CryptoJS.enc.Utf8);
        return parseInt(decrypted, 10) || 0;
      } catch {
        return 0;
      }
    }
    return initialTime * 60;
  };

  const getTotalInitialTime = (id) => {
    const storedTotal = localStorage.getItem("totalInitialTime");
    const currentTotal = initialTime * 60;

    if (storedTotal && parseInt(storedTotal, 10) === currentTotal) {
      return parseInt(storedTotal, 10);
    }

    localStorage.setItem("totalInitialTime", currentTotal.toString());
    return currentTotal;
  };

  const [time, setTime] = useState(() => getInitialSeconds(examId));
  const totalInitialTime = useMemo(
    () => getTotalInitialTime(examId),
    [initialTime]
  );

  const isInCriticalTime = useMemo(() => {
    const criticalThreshold = totalInitialTime * 0.1;
    return time <= criticalThreshold && time > 0;
  }, [time, totalInitialTime]);

  const isInFinalMinute = useMemo(() => time <= 60 && time > 0, [time]);

  useEffect(() => {
    if (submitted || pause) return;

    if (time <= 0) {
      handleSubmitTest();
      return;
    }

    const interval = setInterval(() => {
      setTime((prev) => {
        const updated = prev - 1;
        const encrypted = CryptoJS.AES.encrypt(
          updated.toString(),
          ENCRYPTION_KEY
        ).toString();
        localStorage.setItem(`encryptedTimeLeft_${examId}`, encrypted);
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [pause, submitted, time, handleSubmitTest]);

  const formatTime = (secs) => {
    const h = String(Math.floor(secs / 3600)).padStart(2, "0");
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return { hours: h, minutes: m, seconds: s };
  };

  const { hours, minutes, seconds } = formatTime(time);

  const percentageRemaining = useMemo(() => {
    if (totalInitialTime === 0) return 0;
    const percentage = (time / totalInitialTime) * 100;
    return Math.min(100, Math.max(0, Math.round(percentage)));
  }, [time, totalInitialTime]);

  // Get status-based styles
  const getStatusStyles = () => {
    if (isInFinalMinute) {
      return {
        containerBg: theme === "light" ? "bg-red-50" : "bg-red-950",
        containerBorder: theme === "light" ? "border-red-300" : "border-red-700",
        text: theme === "light" ? "text-red-800" : "text-red-200",
        timeBg: theme === "light" ? "bg-red-100" : "bg-red-900",
        timeBorder: theme === "light" ? "border-red-300" : "border-red-600",
        timeText: theme === "light" ? "text-red-900" : "text-red-100",
        progressBg: "bg-red-500",
        title: "⚠️ FINAL MINUTE!",
        animate: "animate-pulse"
      };
    }
    
    if (isInCriticalTime) {
      return {
        containerBg: theme === "light" ? "bg-orange-50" : "bg-orange-950",
        containerBorder: theme === "light" ? "border-orange-300" : "border-orange-700",
        text: theme === "light" ? "text-orange-800" : "text-orange-200",
        timeBg: theme === "light" ? "bg-orange-100" : "bg-orange-900",
        timeBorder: theme === "light" ? "border-orange-300" : "border-orange-600",
        timeText: theme === "light" ? "text-orange-900" : "text-orange-100",
        progressBg: "bg-orange-500",
        title: "⏰ Time Running Out!",
        animate: ""
      };
    }

    return {
      containerBg: theme === "light" ? "bg-white" : "bg-gray-800",
      containerBorder: theme === "light" ? "border-gray-200" : "border-gray-600",
      text: theme === "light" ? "text-gray-700" : "text-gray-300",
      timeBg: theme === "light" ? "bg-gray-50" : "bg-gray-700",
      timeBorder: theme === "light" ? "border-gray-200" : "border-gray-500",
      timeText: theme === "light" ? "text-gray-900" : "text-white",
      progressBg: "bg-green-500",
      title: "Time Left",
      animate: ""
    };
  };

  const styles = getStatusStyles();

  if (variant === "header") {
    return (
      <div className={`
        w-full p-3 sm:p-4 rounded-lg border-2 shadow-lg
        ${styles.containerBg} ${styles.containerBorder} ${styles.text} ${styles.animate}
      `}>
        {/* Header Title */}
        <div className="text-center mb-3">
          <h2 className="text-sm sm:text-base font-semibold">
            {styles.title}
          </h2>
        </div>

        {/* Timer Display */}
        <div className="flex justify-center items-center gap-1 sm:gap-2 mb-3">
          {/* Hours */}
          <div className={`
            flex flex-col items-center justify-center rounded border
            ${styles.timeBg} ${styles.timeBorder} ${styles.timeText}
            w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
          `}>
            <div className="text-xs sm:text-sm md:text-base font-bold leading-none">
              {hours}
            </div>
            <div className="text-[8px] sm:text-[9px] md:text-[10px] opacity-70 leading-none mt-0.5">
              H
            </div>
          </div>

          <div className="text-sm sm:text-base font-bold opacity-50 mx-1">:</div>

          {/* Minutes */}
          <div className={`
            flex flex-col items-center justify-center rounded border
            ${styles.timeBg} ${styles.timeBorder} ${styles.timeText}
            w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
          `}>
            <div className="text-xs sm:text-sm md:text-base font-bold leading-none">
              {minutes}
            </div>
            <div className="text-[8px] sm:text-[9px] md:text-[10px] opacity-70 leading-none mt-0.5">
              M
            </div>
          </div>

          <div className="text-sm sm:text-base font-bold opacity-50 mx-1">:</div>

          {/* Seconds */}
          <div className={`
            flex flex-col items-center justify-center rounded border
            ${styles.timeBg} ${styles.timeBorder} ${styles.timeText}
            w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
          `}>
            <div className="text-xs sm:text-sm md:text-base font-bold leading-none">
              {seconds}
            </div>
            <div className="text-[8px] sm:text-[9px] md:text-[10px] opacity-70 leading-none mt-0.5">
              S
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full">
          <div className={`
            w-full h-1.5 sm:h-2 rounded-full overflow-hidden
            ${theme === "light" ? "bg-gray-200" : "bg-gray-600"}
          `}>
            <div
              className={`h-full transition-all duration-1000 ease-linear ${styles.progressBg}`}
              style={{ width: `${percentageRemaining}%` }}
            />
          </div>
          <div className="text-center text-[10px] sm:text-xs opacity-60 mt-1">
            {percentageRemaining}% remaining
          </div>
        </div>
      </div>
    );
  }

  // Default centered variant
  return (
    <div className={`
      w-full max-w-sm mx-auto p-4 sm:p-6 rounded-xl border-2 shadow-2xl text-center
      ${styles.containerBg} ${styles.containerBorder} ${styles.text} ${styles.animate}
    `}>
      {/* Title */}
      <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">
        {styles.title}
      </h2>

      {/* Timer Display */}
      <div className="flex justify-center items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        {/* Hours */}
        <div className={`
          flex flex-col items-center justify-center rounded border-2
          ${styles.timeBg} ${styles.timeBorder} ${styles.timeText}
          w-16 h-16 sm:w-20 sm:h-20
        `}>
          <div className="text-lg sm:text-xl font-bold leading-none">
            {hours}
          </div>
          <div className="text-[10px] sm:text-xs opacity-70 leading-none mt-1">
            Hours
          </div>
        </div>

        <div className="text-lg sm:text-xl font-bold opacity-50">:</div>

        {/* Minutes */}
        <div className={`
          flex flex-col items-center justify-center rounded border-2
          ${styles.timeBg} ${styles.timeBorder} ${styles.timeText}
          w-16 h-16 sm:w-20 sm:h-20
        `}>
          <div className="text-lg sm:text-xl font-bold leading-none">
            {minutes}
          </div>
          <div className="text-[10px] sm:text-xs opacity-70 leading-none mt-1">
            Minutes
          </div>
        </div>

        <div className="text-lg sm:text-xl font-bold opacity-50">:</div>

        {/* Seconds */}
        <div className={`
          flex flex-col items-center justify-center rounded border-2
          ${styles.timeBg} ${styles.timeBorder} ${styles.timeText}
          w-16 h-16 sm:w-20 sm:h-20
        `}>
          <div className="text-lg sm:text-xl font-bold leading-none">
            {seconds}
          </div>
          <div className="text-[10px] sm:text-xs opacity-70 leading-none mt-1">
            Seconds
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full">
        <div className={`
          w-full h-2 sm:h-3 rounded-full overflow-hidden
          ${theme === "light" ? "bg-gray-200" : "bg-gray-600"}
        `}>
          <div
            className={`h-full transition-all duration-1000 ease-linear ${styles.progressBg}`}
            style={{ width: `${percentageRemaining}%` }}
          />
        </div>
        <div className="text-xs opacity-60 mt-2">
          {percentageRemaining}% remaining
        </div>
      </div>
    </div>
  );
}

export default CountdownTimer;