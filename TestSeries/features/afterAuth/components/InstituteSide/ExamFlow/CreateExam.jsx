import { AlertTriangle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Banner from "../../../../../assests/Institute/create exam.svg";
import { useUser } from '../../../../../contexts/currentUserContext';
import { useCachedOrganization } from '../../../../../hooks/useCachedOrganization';
import useLimitAccess from '../../../../../hooks/useLimitAccess';
import { fetchExamById } from '../../../../../utils/services/examService';
import { uploadExamQuestions } from '../../../../../utils/services/questionUploadService';
import NeedHelpComponent from '../components/NeedHelpComponent';
import BulkUpload from './BulkUpload';
import DeleteExamModal from './DeleteExamModal';
import ExamForm from './ExamForm';
import ManualQuestionForm from './ManualQuestionsForm';
import QuestionPreview from './QuestionPreview';
import { useTheme } from '../../../../../hooks/useTheme';

const CreateExam = () => {
  const [examDetails, setExamDetails] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { examId } = useParams();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingExam, setEditingExam] = useState(false);
  const { user, getFeatureKeyFromLocation, hasRoleAccess } = useUser();
  const location = useLocation();
  const { theme } = useTheme()
  const canCreateMoreExams = useLimitAccess(getFeatureKeyFromLocation(location.pathname), "totalExams");
  const canEditExams = hasRoleAccess({
    keyFromPageOrAction: 'actions.editExam',
    location: location.pathname
  });
  const canDeleteExams = hasRoleAccess({
    keyFromPageOrAction: 'actions.deleteExam',
    location: location.pathname
  });

  const organization =
    user.role !== 'organization'
      ? useCachedOrganization({ userId: user._id, orgId: user.organizationId._id })?.organization
      : null;

  const Total_Exams = user?.role === 'organization'
    ? user.metaData?.totalExams
    : (
      organization?.metaData?.totalExams
    );

  const Creation_Limit = user?.planFeatures?.exam_feature?.value

  const Available_Limit = Creation_Limit - Total_Exams;

  const handleNewExam = (newExam) => {
    setExamDetails(newExam);
    navigate(`/institute/create-exam/${newExam.id}`, { replace: true });
  };

  useEffect(() => {
    const loadExamIfNeeded = async () => {

      if (examId) {
        try {
          const res = await fetchExamById(examId);

          const matchedExam = res.data.find(e => e.id === examId);

          if (!matchedExam) {
            console.warn('⚠️ No matching exam found!');
          } else {
            // console.log('✅ organization_id:', matchedExam.organization_id);
          }

          setExamDetails(matchedExam);
        } catch (error) {
          console.error("❌ Failed to load exam:", error);
        }
      }
    };

    // Always run when examId changes
    loadExamIfNeeded();
  }, [examId]); // ✅ remove examDetails dependency



  const handleSubmitExam = async () => {
    if (!examDetails || questions.length === 0) {
      alert('Please complete exam details and add at least one question.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Ensure every question has organization_id
      const enrichedQuestions = questions.map((q) => ({
        ...q,
        organization_id: examDetails.organization_id
      }));

      const res = await uploadExamQuestions({
        exam_id: examDetails.id,
        organization_id: examDetails.organization_id,
        questions: enrichedQuestions
      });

      alert('✅ Questions submitted successfully!');
      navigate('/institute/exam-list');
    } catch (err) {
      console.error('❌ Error uploading exam:', err);
      alert(err?.response?.data?.message || '❌ Upload failed');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="p-6  mx-auto ">

      <div className="relative overflow-hidden rounded-xl h-80 mt-3">
        {/* // Background Image */}
        <img
          src={Banner}
          alt="Upload Banner"
          className="absolute  w-full h-full object-cover"
        />
        <div className="absolute "></div>

        <div className="relative z-10 flex items-center justify-center h-full px-6 text-center w-full">
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-lg">
              Create Exam
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              Easily manage and publish your exams
            </p>



            <div className="flex items-center justify-center">
              <p className="mt-8 text-indigo-700 bg-indigo-50 border border-indigo-100 px-5 py-4 rounded-2xl text-base flex items-center gap-3 shadow-sm backdrop-blur-sm">
                <AlertTriangle className="w-5 h-5 text-indigo-400" />
                <span>
                  <span className="font-semibold">Note:</span> For your current plan, you have an available limit of
                  <span className={`${Available_Limit > 0 ? "text-green-500" : "text-red-500"} mx-2`}>{Available_Limit}</span>Exams

                </span>
              </p>
            </div>

          </div>
        </div>
      </div>



      {/* Need help */}
      <div className=' mx-auto  -mt-10 relative z-20 w-[90%]'>
        <NeedHelpComponent heading="want to create new exam ?" about="first download sample excel template to bulk upload" question="can i use both meathods to create exam ?" answer="users can use both meathods and all types of questions to create new exam" />

        {!canCreateMoreExams && (
          <p className="mt-4 text-center text-sm text-red-600 bg-red-100 border border-red-200 px-4 py-2 rounded-xl shadow-sm backdrop-blur-sm">
            You've reached your Exam creation limit. <br className="sm:hidden" />
            <span className="font-medium">Upgrade your plan</span> to continue.
          </p>

        )}
      </div>



      {/* {!examDetails ? (
          <ExamForm onSubmit={handleNewExam} />
        ) : (
          <div className="bg-blue-50 p-4 rounded mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{examDetails.name}</h2>
                <p className="text-gray-600">
                  Date: {examDetails.date} | 
                  Duration: {examDetails.duration} mins | 
                  Total Marks: {examDetails.total_marks}
                </p>
              </div>
              <button 
                onClick={() => setExamDetails(null)}
                className="text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
            </div>
          </div>
        )} */}

      {!examDetails || editingExam ? (
        <ExamForm
          canCreateMoreExams={canCreateMoreExams}
          onSubmit={(updatedExam) => {

            setExamDetails(updatedExam);
            setEditingExam(false);
            // If it's a new exam, redirect to its page
            if (!examId) {
              handleNewExam(updatedExam);
            }
          }}
          initialData={examDetails || {
            name: '',
            date: '',
            total_marks: '',
            duration: '',
            batch_id: '',
          }} // for edit form
        />
      ) : (
        // <div className="bg-blue-50 p-6 rounded-3xl mb-6 shadow-lg ">
        //   <div className="flex justify-between items-center ">
        //     <div className=''>
        //       <h2 className="text-xl font-semibold">{examDetails.name}</h2>
        //       <p className="text-gray-600">
        //         Date: {examDetails.date} |
        //         Duration: {examDetails.duration} mins |
        //         Total Marks: {examDetails.total_marks}
        //       </p>
        //     </div>
        //     <button
        //       onClick={() => setEditingExam(true)}
        //       className="text-blue-600 hover:text-blue-800"
        //     >
        //       Edit
        //     </button>
        //   </div>
        // </div>
        <div className={`p-6 rounded-3xl mb-6 shadow-lg ${theme === 'light'
            ? 'bg-blue-50'
            : 'bg-gray-800'
          }`}>
          <div className="flex justify-between items-center">
            <div className=''>
              <h2 className={`text-xl font-semibold ${theme === 'light'
                  ? 'text-gray-800'
                  : 'text-white'
                }`}>
                {examDetails.name}
              </h2>
              <p className={`${theme === 'light'
                  ? 'text-gray-600'
                  : 'text-gray-300'
                }`}>
                Date: {examDetails.date} |
                Duration: {examDetails.duration} mins |
                Total Marks: {examDetails.total_marks}
              </p>
            </div>
            {canEditExams && (<button
              disabled={!canEditExams}
              onClick={() => setEditingExam(true)}
              className={`transition-colors duration-300 ${theme === 'light'
                  ? 'text-blue-600 hover:text-blue-800'
                  : 'text-blue-400 hover:text-blue-300'
                }`}
            >
              Edit
            </button>)}
          </div>
        </div>
      )}


      {examDetails && !editingExam && (
        <>
          <div className={`mt-6 border-t pt-6 c`}>
            <h2 className={`text-xl font-semibold mb-4 ${theme == 'light' ? "text-black" : "text-gray-100"} `}>Add Questions</h2>

            <div className={` p-6 rounded-lg mb-6 ${theme == 'light' ? "bg-gray-50" : "bg-gray-800"}`}>
              <div className={`flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4  ${theme == 'light' ? "bg-gray-50" : "bg-gray-800"}`}>
                <div className={`flex-1  rounded-xl p-6 shadow-2xl transition ${theme == 'light' ? "bg-gray-50" : "bg-gray-800"}`}>
                  <h3 className={`text-lg font-medium mb-2  ${theme == 'light' ? "text-black" : "text-gray-100"}`}>Option 1: Manual Entry</h3>
                  <p className={`mb-4 ${theme == 'light' ? "text-gray-500" : "text-gray-500"}`} >Create questions one by one with full control over each question's details.</p>
                  <ManualQuestionForm
                    setQuestions={setQuestions}
                    organizationId={examDetails.organization_id} // ✅ pass this down!
                  />

                </div>

                <div className={`flex-1 shadow-2xl  rounded-lg p-6 transition    ${theme == 'light' ? "bg-gray-50" : "bg-gray-800 border-gray-800 border"}`}>
                  <h3 className={`text-lg font-medium mb-2  ${theme == 'light' ? "text-black" : "text-gray-100"}`}>Option 2: Bulk Upload</h3>
                  <p className={`mb-4 ${theme == 'light' ? "text-gray-500" : "text-gray-500"}`}>Upload multiple questions at once using an Excel spreadsheet.</p>
                  <BulkUpload setQuestions={setQuestions} organizationId={examDetails.organization_id} />
                </div>
              </div>
            </div>
          </div>

          <QuestionPreview questions={questions} setQuestions={setQuestions} examDetails={examDetails} />
          <div className='flex justify-center flex-col gap-2 max-w-2l items-center'>




            <button
              onClick={handleSubmitExam}
              disabled={isSubmitting}
              className={`mt-6 font-semibold ${isSubmitting ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:scale-105 hover:shadow-2x p-2'} text-white px-6 py-3 rounded transition w-full md:w-auto flex items-center justify-center`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit Exam'
              )}
            </button>

            {canDeleteExams && (<button
              disabled={!canDeleteExams}
              onClick={() => {
                setShowDeleteModal(true);
              }}
              className="text-red-600 border-red-600 border px-4 py-2 mt-4 rounded hover:bg-red-700 transition hover:text-white font-semibold"
            >
              Delete exam
            </button>)}
          </div>
        </>

      )}
      {
        showDeleteModal && (
          <DeleteExamModal
            examId={examDetails?.id}
            setShowDeleteModal={setShowDeleteModal}
          />
        )
      }
    </div>

  );
};

export default CreateExam;