import BatchInfoCard from "../components/StudentSide/Landing/BatchInfoCard";
import Certificates from "../components/StudentSide/Landing/Certificates";
import ExamComponent from "../components/StudentSide/Landing/ExamComponent";
import LeaderBoardCard from "../components/StudentSide/Landing/OverviewAnalysisCard";
import StudentDetails from "../components/StudentSide/Landing/StudentDetails";
import StudentHero from "../components/StudentSide/Landing/StudentHero";

import React from "react";

const StudentLanding = () => {
  return (
    <>
      <div>
        {/* /student and profiles */}
        <div className="m-4 md:m-10 rounded-4xl overflow-hidden  flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/3 flex-shrink-0">
            <StudentDetails />
          </div>

          <div className="w-full lg:w-2/3 flex-grow">
            <StudentHero />
          </div>
        </div>

        <div className="m-4 md:m-10 rounded-4xl overflow-hidden  flex flex-col lg:flex-row min-h-[600px]">
          <div className="w-full lg:w-1/2 flex-shrink-0">
            <BatchInfoCard />
          </div>

          <div className="w-full lg:w-1/2 flex-shrink-0">
            <ExamComponent />
          </div>
        </div>
        <div className="m-4 md:m-10 rounded-4xl overflow-hidden flex flex-col lg:flex-row justify-between ">
          <div className="w-full lg:w-[45%] flex-shrink-0 h-full">
            <Certificates />
          </div>

          <div className="w-full lg:w-[50%] flex-shrink-0">
            <LeaderBoardCard />
          </div>
        </div>
 
      </div>
    
    </>
  );
};

export default StudentLanding;
