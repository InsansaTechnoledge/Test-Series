import { useEffect, useState } from "react";
import ContestCard from "./components/ContestCard";
import HeadingUtil from "../../utility/HeadingUtil";
import NeedHelpComponent from "./components/NeedHelpComponent";
import useCachedContests from "../../../../hooks/useCachedContests";

const ContestList = () => {
    const { contestList,isLoading}=useCachedContests();
    const [contest , setContest] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if(!contestList){
            setLoading(true);
            return;
        }
        setContest(contestList);
        setLoading(false);
        
    }, [contestList]);

    
    if (loading) {
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

            <HeadingUtil 
                heading="List of Created contests" 
                description="this shows list of all the contests organization created " 
            />

            <NeedHelpComponent 
                heading="What is a contest ?" 
                about="Contest is a place where participant can enroll and compete for ranking" 
                question="can i revert live exam ?" 
                answer="yes, you can click on pause button to pause the exams (unless any user started it)" 
            />
            
            <ContestCard contest={contest} setContest={setContest}/>
        </div>
    );
};
export default ContestList;