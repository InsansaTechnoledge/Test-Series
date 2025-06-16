import { use, useEffect, useState } from "react";
import HeadingUtil from "../../../utility/HeadingUtil";
import NeedHelpComponent from "../../InstituteSide/components/NeedHelpComponent";
import { enrollContest, FetchContest } from "../../../../../utils/services/contestService";
import { useUser } from "../../../../../contexts/currentUserContext";
import ContestCard from "./ContestCardStudent";

const ContestListPage = () => {

    const [contestList, setContestList] = useState([]);
    const [enrolledContests, setEnrolledContests] = useState([]);
    const { user } = useUser();

    useEffect(() => {
        const fetchContestList = async () => {
            const response = await FetchContest(user.batch.currentBatch, user._id);
            if (response.status === 200) {
                setContestList(response.data.filter(contest => contest.isEnrolled === false));
                setEnrolledContests(response.data.filter(contest => contest.isEnrolled === true));
                console.log("Contest List:", response.data);
            }
        };

        fetchContestList();
    }, []);

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

            setEnrolledContests(prev => [...prev, contestList.find(contest => contest.id === contestId)]);
            console.log("Enrolled Contests:", enrolledContests);
            setContestList(prev => prev.filter(contest => contest.id !== contestId));

            console.log("Updated Contest List:", contestList);


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
    }, [contestList, enrolledContests]);



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
                    {contestList && contestList.length > 0 ? (
                        contestList.map((contest, index) => (
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