import React from "react";
import { useLocation } from "react-router-dom";
import { useUser } from "../../../contexts/currentUserContext";

const BioBreakTimerUI = ({ formatTime, bioBreakTimeLeft , setBioBreakTimeLeft ,   setIsPaused}) => {
  const {user}=useUser();
  const location=useLocation();
  const searchParams = new URLSearchParams(location.search);
    const examId = searchParams.get("examId");

  const handleContinueTest = async () => {
    try{
    setBioBreakTimeLeft(0);
    setIsPaused(false);
      if (window?.electronAPI?.startProctorEngineAsync) {
          const params={
            userId: user._id,
            examId,
            eventId:examId,
          }
          await window.electronAPI.startProctorEngineAsync(params);
        }
      }catch(error) {
        console.error("Error resuming test:", error);
      }
  }
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
          <button className="bg-green-600 text-gray-100 px-3 py-2 rounded-2xl text-3xl cursor-pointer" onClick={() => handleContinueTest()}>
            continue test
          </button>
        </div>
      </div>
    </>
  );
};

export default BioBreakTimerUI;
