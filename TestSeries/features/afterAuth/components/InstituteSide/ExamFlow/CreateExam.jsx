import React, { useState, useEffect } from 'react';
import ExamForm from './ExamForm';
import ManualQuestionForm from './ManualQuestionsForm';
import BulkUpload from './BulkUpload';
import QuestionPreview from './QuestionPreview';
import HeadingUtil from '../../../utility/HeadingUtil';
import NeedHelpComponent from '../components/NeedHelpComponent';
import { uploadExamQuestions } from '../../../../../utils/services/questionUploadService';
import { fetchExamById } from '../../../../../utils/services/examService';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../../../../constants/BackButton';
import DeleteExamModal from './DeleteExamModal';


const CreateExam = () => {
    const [examDetails, setExamDetails] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { examId } = useParams();
    const navigate = useNavigate(); 
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingExam, setEditingExam] = useState(false);


    // console.log(examDetails)
    const handleNewExam = (newExam) => {
      setExamDetails(newExam);
      navigate(`/institute/create-exam/${newExam.id}`, { replace: true }); 
    };

    useEffect(() => {
      const loadExamIfNeeded = async () => {
        console.log('🔥 Checking if we need to load exam...');
        if (examId) {
          try {
            const res = await fetchExamById(examId);
            console.log('✅ Raw API response:', res.data);
    
            const matchedExam = res.data.find(e => e.id === examId);
            console.log('✅ Matched exam:', matchedExam);
    
            if (!matchedExam) {
              console.warn('⚠️ No matching exam found!');
            } else {
              console.log('✅ organization_id:', matchedExam.organization_id);
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
    
        console.log("✅ Uploaded Successfully:", res);
        alert('✅ Questions submitted successfully!');
        navigate('/institute/exam-list');
      } catch (err) {
        console.error('❌ Error uploading exam:', err);
        alert(err?.response?.data?.message || '❌ Upload failed');
      } finally {
        setIsSubmitting(false);
      }
    };
    
    // const handleDeleteExam = async () => {
    //   console.log(`deleting exam : ${examDetails.id}`)
    //   const id = examDetails.id
    //   try{
    //     const res = await deleteExam(id)
    //     console.log(`deleted` , res)
    //     navigate('/institute/institute-landing')

    //   } catch(e) {
    //     console.log('error creating exam ', e)
    //   }
    // }
      
   
    return (
      <div className="p-6 max-w-6xl mx-auto ">
        <BackButton />
        {/* <h1 className="text-3xl font-bold mb-6">Create New Exam</h1> */}
        <HeadingUtil heading="Create New Exam" description="there are 2 ways to create an exam , manually or bulk upload"/>
        <NeedHelpComponent heading="want to create new exam ?" about="first download sample excel template to bulk upload" question="can i use both meathods to create exam ?" answer="users can use both meathods and all types of questions to create new exam"/>
        
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
    onSubmit={(updatedExam) => {

      setExamDetails(updatedExam);
      setEditingExam(false);
      // If it's a new exam, redirect to its page
      if (!examId) {
       handleNewExam(updatedExam);
      }
    }}
    initialData={examDetails || { name: '',
    date: '',
    total_marks: '',
    duration: '',
    batch_id: '',
  }} // for edit form
  />
) : (
  <div className="bg-blue-50 p-4 rounded mb-6 ">
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
        onClick={() => setEditingExam(true)}
        className="text-blue-600 hover:text-blue-800"
      >
        Edit
      </button>
    </div>
  </div>
)}

  
        {examDetails && !editingExam &&(
          <>
            <div className="mt-6 border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Add Questions</h2>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="flex-1 border rounded-lg p-6 bg-white hover:shadow-md transition">
                    <h3 className="text-lg font-medium mb-2">Option 1: Manual Entry</h3>
                    <p className="text-gray-600 mb-4">Create questions one by one with full control over each question's details.</p>
                    <ManualQuestionForm
                      setQuestions={setQuestions}
                      organizationId={examDetails.organization_id} // ✅ pass this down!
                    />

                  </div>
                  
                  <div className="flex-1 border rounded-lg p-6 bg-white hover:shadow-md transition">
                    <h3 className="text-lg font-medium mb-2">Option 2: Bulk Upload</h3>
                    <p className="text-gray-600 mb-4">Upload multiple questions at once using an Excel spreadsheet.</p>
                    <BulkUpload setQuestions={setQuestions} organizationId={examDetails.organization_id} />
                    </div>
                </div>
              </div>
            </div>
            
            <QuestionPreview questions={questions} setQuestions={setQuestions} examDetails={examDetails}/>
            
            <button
              onClick={handleSubmitExam}
              disabled={isSubmitting}
              className={`mt-6 ${isSubmitting ? 'bg-purple-500' : 'bg-purple-700 hover:bg-purple-800'} text-white px-6 py-3 rounded transition w-full md:w-auto flex items-center justify-center`}
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

            <button
                onClick={() =>{
                  setShowDeleteModal(true);
                  console.log(`deleting exam : ${examDetails.id}`)
                }}
                className="bg-red-600 text-white px-4 py-2 mt-4 rounded hover:bg-red-700 transition"
              >
                Delete exam 
            </button>
         
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