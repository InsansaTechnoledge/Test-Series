import React, { useState } from 'react';
import { Plus, Trash2, Save, Code } from 'lucide-react';
import { saveContestQuestion } from '../../../../utils/services/contestQuestionService';
import CodeCreatorForm from './codeCreatorForm';
import { useSearchParams } from 'react-router-dom';

export default function QuestionCreator() {

  const [searchParams]=useSearchParams();
  const contestId= searchParams.get("contestId");
  const [formData, setFormData] = useState({
    title: '',
    difficulty: 'easy',
    prompt: '',
    input_format: '',
    output_format: '',
    sample_input: '',
    sample_output: '',
    test_cases: [
      { input: '', expected_output: '', explanation: '' }
    ],
    description: '',
    examples: [
      { input: '', output: '', explanation: '' }
    ],
    constraints: [''],
    starter_code: {
      javascript: '',
      python: '',
      java: '',
      cpp: ''
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const questionData = formData;

    //have to add the contest id in the question data 

    questionData.contest_id = contestId;


    try {
      const response = await saveContestQuestion(questionData);

      if(response.status === 200) {
        alert("Question created successfully!");
        setFormData({
          title: '',
          difficulty: 'easy',
          prompt: '',
          input_format: '',
          output_format: '',
          sample_input: '',
          sample_output: '',
          test_cases: [{ input: '', expected_output: '', explanation: '' }],
          description: '',
          examples: [{ input: '', output: '', explanation: '' }],
          constraints: [''],
          starter_code: {
            javascript: '',
            python: '',
            java: '',
            cpp: ''
          }
        });
      }
    } catch (error) {
      console.log("something went wrong while creating the contest questions!!", error);
      alert("Something went wrong!!!, try again later");
    }

  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="container mx-auto px-4 py-8">
          <CodeCreatorForm
            setFormData={setFormData}
            formData={formData}
          />

          <div className="flex justify-center pt-6">
            <button
              type="submit"
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
              onClick={handleSubmit}
            >
              <Save className="w-5 h-5" />
              Create Question
            </button>
          </div>
        </div>
      </div >
    </>
  )


}