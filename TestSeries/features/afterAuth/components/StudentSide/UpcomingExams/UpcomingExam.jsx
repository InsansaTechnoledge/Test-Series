import { useEffect, useState } from 'react';
import HeadingUtil from '../../../utility/HeadingUtil';
import NeedHelpComponent from '../../InstituteSide/components/NeedHelpComponent';
import UpcomingExamCard from './UpcomingExamCard';
import LiveExamCard from './LiveExamCard';
import { useUser } from '../../../../../contexts/currentUserContext'
import { useNavigate } from 'react-router-dom'
import { useExamManagement } from '../../../../../hooks/UseExam';


const UpcomingExam = () => {
  const [liveExams, setLiveExams] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const user = useUser();
  const navigate = useNavigate();
  const { exams } = useExamManagement();

  const question = "How To assign role groups to users ?";
  const answer = "Use the created role groups to assign permissions to users in your add user section.";

  useEffect(() => {
    if (!exams) return;
  
    const upcoming = exams.filter(exam => exam.go_live === false || exam.go_live === "FALSE");
    const live = exams.filter(exam => exam.go_live === true || exam.go_live === "TRUE");
  
    setUpcomingExams(upcoming);
    setLiveExams(live);
  }, [JSON.stringify(exams)]);
  

  const handleStartTest = (examId) => {
    // Replace with real userId or eventId if available
    const UserId = user?._id;

    navigate(`/student/test?examId=${examId}`);
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
