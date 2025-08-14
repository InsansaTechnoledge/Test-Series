import { useEffect, useState } from "react";
import ContestCard from "../../components/ContestCard";
import HeadingUtil from "../../../../utility/HeadingUtil";
import { Clock, Users, CheckCircle, PlayCircle, Loader2, BookOpen, CirclePause, Trash } from 'lucide-react';
import NeedHelpComponent from "../../components/NeedHelpComponent";
import useCachedContests from "../../../../../../hooks/useCachedContests";
import { usePageAccess } from "../../../../../../contexts/PageAccessContext";
import Banner from "../../../../../../assests/Institute/contest list.svg"
import { useTheme } from "../../../../../../hooks/useTheme";
import {useUser} from "../../../../../../contexts/currentUserContext";
import ContestTable from "./EvalvoGridContestLook";
import { useEvalvoTheme } from "../../../../../../hooks/EvalvoThemeContext";

const ContestList = () => {
    const { contestList, isLoading } = useCachedContests();
    const [contest, setContest] = useState([]);

    const {hasRoleAccess}=useUser();
    
     const canAccessPage  = usePageAccess();
     const  {theme} = useTheme()

      const { evalvoTheme } = useEvalvoTheme();
     

     const canDeleteContest = hasRoleAccess({
      keyFromPageOrAction: "actions.deleteContest",
    location: null
  });
     const canPublishContest = hasRoleAccess({
      keyFromPageOrAction: "actions.publishContest",
      location: null,
  });

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
          <div className={`min-h-screen flex items-center justify-center ${theme === 'dark'
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
          }`}>
          <div className="text-center space-y-4">
            <div className="relative">
              <div className={`w-16 h-16 border-4 rounded-full animate-spin mx-auto ${theme === 'dark'
                ? 'border-gray-700 border-t-indigo-600'
                : 'border-blue-200 border-t-blue-600'
                }`}></div>
              <BookOpen className={`w-6 h-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-indigo-600' : 'text-blue-600'
                }`} />
            </div>
            <p className={`text-xl font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>Loading contests...</p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>Please wait while we fetch your contest data</p>
          </div>
        </div>
        );
    }

    if(contest.length === 0){
        return (
          <div className="flex flex-col items-center justify-center py-20">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-md ${theme === 'dark'
            ? 'bg-gray-800'
            : 'bg-indigo-100'
            }`}>
            <BookOpen className={`w-10 h-10 ${theme === 'dark' ? 'text-indigo-600' : 'text-indigo-500'
              }`} />
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
            }`}>No Contests Found</h3>
          <p className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
            Create your first contest to get started with managing assessments.
          </p>
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



      


            {Object.keys(contest).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-md ${theme === 'dark'
              ? 'bg-gray-800'
              : 'bg-indigo-100'
              }`}>
              <BookOpen className={`w-10 h-10 ${theme === 'dark' ? 'text-indigo-600' : 'text-indigo-500'
                }`} />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              }`}>No contest Found</h3>
            <p className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
              Create your first contest to get started with managing assessments.
            </p>
          </div>
        ) : (


          
            evalvoTheme === 'EvalvoPulse'
              ? (
                <ContestCard
                  contest={contest}
                  setContest={setContest}
                  theme={theme}
                  canDeleteContest={canDeleteContest}
                  canPublishContest={canPublishContest}
                />
              )
              : (
                <ContestTable
                  contest={contest}
                  setContest={setContest}
                  theme={theme}
                  canDeleteContest={canDeleteContest}
                  canPublishContest={canPublishContest}
                />
              )


        )}

  
            </div>
    
    );
};

export default ContestList;
