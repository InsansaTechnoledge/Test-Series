import React, { useEffect, useState } from 'react';
import HeadingUtil from '../../../utility/HeadingUtil';
import NeedHelpComponent from '../../InstituteSide/components/NeedHelpComponent';
import UpcomingExamCard from './UpcomingExamCard';
import LiveExamCard from './LiveExamCard';
import { fetchUpcomingExams } from '../../../../../utils/services/examService';
import { useUser } from '../../../../../contexts/currentUserContext'
import { useNavigate } from 'react-router-dom'

const UpcomingExam = () => {
  const [liveExams, setLiveExams] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const user = useUser();
  const navigate = useNavigate();

  const question = "How To assign role groups to users ?";
  const answer = "Use the created role groups to assign permissions to users in your add user section.";


  useEffect(() => {
    const getExams = async () => {
      try {
        const exams = await fetchUpcomingExams();

        const upcoming = exams.filter(exam => exam.go_live === false || exam.go_live === "FALSE");
        setUpcomingExams(upcoming);

        const live = exams.filter(exam => exam.go_live === true || exam.go_live === "TRUE")
        setLiveExams(live)
      } catch (error) {
        console.error("❌ Error fetching upcoming exams:", error);
      }
    };

    getExams();
  }, []);

  const handleStartTest = (examId) => {
    // Replace with real userId or eventId if available
    const UserId = user?._id;

    navigate(`/test?examId=${examId}`);
  };

  return (
    <div>
      <HeadingUtil heading="Upcoming Exams" description="You can appear for the upcoming exams from here" />
      <div className="max-w-6xl mx-auto">
        <NeedHelpComponent heading="Want to take exam ?" about="Take AI-Proctored exams " question={question} answer={answer} />
      </div>

      <h1 className='mt-20 text-3xl text-indigo-900 font-bold mb-2'>Live Exam:</h1>
      <div className='flex flex-col'>
        {
          liveExams && liveExams.length > 0
            ?
            liveExams.map((exam, idx) => (
              <LiveExamCard key={idx} data={exam} onStartTest={handleStartTest} />
            ))
            :
            <div>
              No live exams yet :)
            </div>
        }
      </div>

      <h1 className='mt-20 text-3xl text-indigo-900 font-bold mb-2'>Upcoming Exams:</h1>
      <div className='mt-12 grid lg:grid-cols-2 gap-10 xl:grid-cols-3'>
        {
          upcomingExams && upcomingExams.length > 0
            ?
            upcomingExams.map((exam, idx) => (
              <UpcomingExamCard key={idx} data={exam} />
            ))
            :
            <div>
              No upcoming exams yet :)
            </div>

        }
      </div>
    </div>
  );
};

export default UpcomingExam;
