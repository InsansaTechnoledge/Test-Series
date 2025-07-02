import { use, useEffect, useState } from "react";
import HeadingUtil from "../../../utility/HeadingUtil";
import NeedHelpComponent from "../../InstituteSide/components/NeedHelpComponent";
import { enrollContest } from "../../../../../utils/services/contestService";
import ContestCard from "./ContestCardStudent";
import useCachedContests from "../../../../../hooks/useCachedContests";
import { useTheme } from "../../../../../hooks/useTheme";


const ContestListPage = () => {
    const {contestList,isLoading} = useCachedContests();
    const [contests, setContests] = useState([]);
    const [enrolledContests, setEnrolledContests] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (!contestList || contestList.length === 0) {
            setLoading(true);
            return;
        }
        setContests(contestList.filter(contest => contest.isEnrolled === false));
        setEnrolledContests(contestList.filter(contest => contest.isEnrolled === true));
        setLoading(false);

    }, [contestList]);


    const handleParticipate = async (contestId) => {
        try {


            const response=await enrollContest(contestId);
            if (response.status !== 200) {
          
                console.error("Failed to enroll in contest:", response.data);
            }

            setEnrolledContests(prev => [...prev, contests.find(contest => contest.id === contestId)]);
            setContests(prev => prev.filter(contest => contest.id !== contestId));

        } catch (error) {
            console.error("Error participating in contest:", error);
        }

    };
    const {theme} = useTheme()

    {loading && <div className="text-center text-gray-500">Loading contests...</div>}


    return (
        <>
       
            <div className="my-4">
  <h2
    className={` text-center text-3xl md:text-4xl font-bold mt-10 mb-2 ${
      theme === 'light' ? 'text-indigo-600' : 'text-blue-800'
    }`}
  >
    Coding Contests
  </h2>
  <p
    className={`text-md mt-1 text-center ${
      theme === 'light' ? 'text-gray-700' : 'text-gray-100'
    }`}
  >
    View and participate in coding contests organized by your institute.
  </p>
</div>
<div className="flex  jusify-center flex-col">
<NeedHelpComponent
                heading="Want to Participate in a Contest?"
                about="Learn how contests work"
                question="How do I participate in coding contests?"
                answer="You can view the list of available contests and join them directly from this page."
            
            />
</div>
           

            {/* participated contests */}


            <div className=" my-10 py-10 px-28">
                <div className="contest-list">
                <label
  className={`text-lg font-semibold mb-4 ${
    theme === 'light' ? 'text-gray-900' : 'text-gray-200'
  }`}
>
  Participated Contests
</label>

                    {enrolledContests && enrolledContests.length > 0 ? (
                        enrolledContests.map((contest, index) => (
                            <ContestCard key={index}
                                contest={contest}
                                handleParticipate={handleParticipate}
                                notParticipated={false}
                            />
                        ))
                    ) : (
                        <div className="no-contests">

                        </div>
                    )}
                </div>
            </div>

            {/* contest lists */}

            <div className=" mx-auto">
            <div
    className={`contest-list p-4 rounded-xl shadow-md ${
      theme === 'light' ? 'bg-white' : 'bg-gray-800'
    }`}
  > <label
  className={`text-lg font-semibold mb-4 block ${
    theme === 'light' ? 'text-gray-900' : 'text-gray-200'
  }`}
>
  Available Contests
</label>
                    {contests && contests.length > 0 ? (
                        contests.map((contest, index) => (
                            <ContestCard key={index}
                                contest={contest}
                                handleParticipate={handleParticipate}
                                notParticipated={true}
                            />
                        ))
                    ) : (
                        <div
                        className={`no-contests text-sm italic mt-2 ${
                          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                        }`}
                      >
                        No contests available at the moment.
                      </div>
                    )}
                </div>
            </div>



 

        </>
    );
}

export default ContestListPage;