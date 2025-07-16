import React from "react";

const BioBreakTimerUI = ({ formatTime, bioBreakTimeLeft }) => {
  return (
    <>
      <div className="fixed inset-0 z-[1000] bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center">
        <div className="text-center flex flex-col items-center gap-4 px-6">
          <div className="text-white text-4xl md:text-5xl font-bold flex items-center gap-2">
            🚻 Bio Break in Progress
          </div>
          <div className="text-yellow-300 text-3xl md:text-4xl font-semibold tracking-wide animate-pulse">
            Resuming in {formatTime(bioBreakTimeLeft)}
          </div>
          <p className="text-white text-base md:text-lg opacity-75">
            Please wait... You cannot interact with the test during this time.
          </p>
        </div>
      </div>
    </>
  );
};

export default BioBreakTimerUI;
