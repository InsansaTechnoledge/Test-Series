import { use, useEffect, useState } from "react";
import HeadingUtil from "../../../utility/HeadingUtil";
import NeedHelpComponent from "../../InstituteSide/components/NeedHelpComponent";
import { enrollContest } from "../../../../../utils/services/contestService";
import ContestCard from "./ContestCardStudent";
import useCachedContests from "../../../../../hooks/useCachedContests";


const ContestListPage = () => {
    const {contestList,isLoading} = useCachedContests();
    const [contests, setContests] = useState([]);
    const [enrolledContests, setEnrolledContests] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (!contestList || contestList.length === 0) {
            console.log("No contests available or contestList is empty.");
            setLoading(true);
            return;
        }
        setContests(contestList.filter(contest => contest.isEnrolled === false));
        setEnrolledContests(contestList.filter(contest => contest.isEnrolled === true));
        setLoading(false);

    }, [contestList]);


    const handleParticipate = async (contestId) => {
        try {
            console.log("Participating in contest with ID:", contestId);



            const response=await enrollContest(contestId);
            if (response.status === 200) {
                console.log("Successfully enrolled in contest:", response.data);
            }
            else {
                console.error("Failed to enroll in contest:", response.data);
            }
            console.log("Enrolled Contest Response:", response.data);

            setEnrolledContests(prev => [...prev, contests.find(contest => contest.id === contestId)]);
            console.log("Enrolled Contests:", enrolledContests);
            setContests(prev => prev.filter(contest => contest.id !== contestId));

            console.log("Updated Contest List:", contests);


        } catch (error) {
            console.error("Error participating in contest:", error);
        }

    };

    useEffect(() => {
        try {
            console.log("Enrolled Contests:", enrolledContests);
        } catch (error) {
            console.error("Error in enrolled contests:", error);
        }
    }, [contests, enrolledContests]);

    {loading && <div className="text-center text-gray-500">Loading contests...</div>}


    return (
        <>
            <HeadingUtil heading="Coding Contests" description="View and participate in coding contests organized by your institute." />
            <NeedHelpComponent
                heading="Want to Participate in a Contest?"
                about="Learn how contests work"
                question="How do I participate in coding contests?"
                answer="You can view the list of available contests and join them directly from this page."
            />

            {/* participated contests */}


            <div className="max-w-6xl mx-auto">
                <div className="contest-list">
                    <label className="text-lg font-semibold mb-4">Participated Contests</label>
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

            <div className="max-w-6xl mx-auto">
                <div className="contest-list">
                    <label className="text-lg font-semibold mb-4">Available Contests</label>
                    {contests && contests.length > 0 ? (
                        contests.map((contest, index) => (
                            <ContestCard key={index}
                                contest={contest}
                                handleParticipate={handleParticipate}
                                notParticipated={true}
                            />
                        ))
                    ) : (
                        <div className="no-contests">
                            No contests available at the moment.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default ContestListPage;