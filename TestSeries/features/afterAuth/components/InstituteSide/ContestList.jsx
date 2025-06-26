import { useEffect, useState } from "react";
import ContestCard from "./components/ContestCard";
import HeadingUtil from "../../utility/HeadingUtil";
import NeedHelpComponent from "./components/NeedHelpComponent";
import useCachedContests from "../../../../hooks/useCachedContests";
import { usePageAccess } from "../../../../contexts/PageAccessContext";
import Banner from "../../../../assests/Institute/contest list.svg"
import { useTheme } from "../../../../hooks/useTheme";

const ContestList = () => {
    const { contestList, isLoading } = useCachedContests();
    const [contest, setContest] = useState([]);

     const canAccessPage  = usePageAccess();
     const  {theme} = useTheme()
  
           
             if (!canAccessPage) {
               return (
                 <div className="flex items-center justify-center ">
                   <div className="text-center bg-red-100 px-4 py-3 my-auto">
                     <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
                     <p className="text-gray-600">You do not have permission to view this page.</p>
                   </div>
                 </div>
               );
             }
    useEffect(() => {
        if (contestList && JSON.stringify(contest) !== JSON.stringify(contestList)) {
            setContest(contestList);
        }
    }, [contestList]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if(contest.length === 0){
        return (
            <div className="flex items-center justify-center h-screen">
                <h1 className="text-2xl font-bold text-gray-800">No Contests Created Yet!!</h1>
            </div>
        );
    }


    return (
        <div className="space-y-6">



<div className="relative overflow-hidden rounded-xl h-80 mt-3">
        {/* // Background Image */}
        <img
          src={Banner}
          alt="Upload Banner"
          className="absolute  w-full h-full object-cover"
        />
        
        <div className={`absolute inset-0 ${theme === 'dark'
            ? 'bg-gray-900/60'
            : 'bg-black/20'
            }`}></div>

        <div className="relative z-10 flex items-center justify-center h-full px-6 text-center w-full">
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-lg">
              Contest List
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
            this shows list of all the contests organization created 
            </p>
          </div>
        </div>
      </div>
      <div className=' mx-auto  -mt-10 relative z-20 w-[90%]'>
        
            <NeedHelpComponent 
                heading="What is a contest ?" 
                about="Contest is a place where participant can enroll and compete for ranking" 
                question="can i revert live exam ?" 
                answer="yes, you can click on pause button to pause the exams (unless any user started it)" 
            />
            </div>
            <div className="w-[93%] mx-auto">
            <ContestCard contest={contest} setContest={setContest} />

            </div>
            </div>
    
    );
};

export default ContestList;
