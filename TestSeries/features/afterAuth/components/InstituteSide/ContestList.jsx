import axios from "axios";
import { useEffect, useState } from "react";
import { FetchContest } from "../../../../utils/services/contestService";
import ContestCard from "./components/ContestCard";


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
        <div className="contest-list">
            <ContestCard contest={contest}/>
        </div>
    );
};
export default ContestList;