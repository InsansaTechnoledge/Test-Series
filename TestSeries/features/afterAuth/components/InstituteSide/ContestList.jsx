import axios from "axios";
import { useEffect, useState } from "react";
import { FetchContest } from "../../../../utils/services/contestService";
import ContestCard from "./components/ContestCard";
import HeadingUtil from "../../utility/HeadingUtil";
import NeedHelpComponent from "./components/NeedHelpComponent";

const ContestList = () => {
    const [contest , setContest] = useState([])

    useEffect(  () => {
        const fetchData = async () => {
            const getData = await FetchContest();
            if(!getData || getData.length === 0) return console.log('no data found');
            console.log(getData);           
            const Data = getData.data;
            setContest(Data);
            console.log("d",contest);  
        }
        fetchData();
    },[])

    
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