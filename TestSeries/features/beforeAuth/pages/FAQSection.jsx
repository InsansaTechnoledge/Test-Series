import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const studentFAQs = [
  {
    question: 'What is AI proctoring?',
    answer: 'AI proctoring uses artificial intelligence to monitor test-takers remotely during exams using webcam, mic, and screen activity.',
  },
  {
    question: 'Do I need to install any software?',
    answer: 'No additional software is needed. You just need a webcam, microphone, and stable internet connection.',
  },
  {
    question: 'What is AI proctoring?',
    answer: 'AI proctoring uses artificial intelligence to monitor test-takers remotely during exams using webcam, mic, and screen activity.',
  },
  {
    question: 'Do I need to install any software?',
    answer: 'No additional software is needed. You just need a webcam, microphone, and stable internet connection.',
  },
];

const teacherFAQs = [
  {
    question: 'How do I manage student assessments?',
    answer: 'You can create, schedule, and monitor assessments through the teacher dashboard with full analytics.',
  },
  {
    question: 'Can I see student behavior in real time?',
    answer: 'Yes, real-time alerts and reports will be available for any suspicious activity.',
  },
  {
    question: 'How do I manage student assessments?',
    answer: 'You can create, schedule, and monitor assessments through the teacher dashboard with full analytics.',
  },
  {
    question: 'Can I see student behavior in real time?',
    answer: 'Yes, real-time alerts and reports will be available for any suspicious activity.',
  },
];

const FAQSection = () => {
  const [selectedRole, setSelectedRole] = useState('teacher');
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = selectedRole === 'student' ? studentFAQs : teacherFAQs;

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className='mt-16 px-4 mb-16'>
      <div className='flex flex-col items-center justify-center gap-6'>
        <h1 className='text-4xl text-blue-950 text-center'>Frequently Asked Questions</h1>

        {/* Toggle */}
        <div className='flex items-center border border-blue-900 rounded-full overflow-hidden'>
          <button
            onClick={() => { setSelectedRole('student'); setOpenIndex(null); }}
            className={`px-6 py-2 text-sm md:text-base font-medium transition ${
              selectedRole === 'student'
                ? 'bg-blue-600 text-white'
                : 'bg-transparent text-blue-950 hover:bg-blue-100'
            }`}
          >
            For Students
          </button>
          <button
            onClick={() => { setSelectedRole('teacher'); setOpenIndex(null); }}
            className={`px-6 py-2 text-sm md:text-base font-medium transition ${
              selectedRole === 'teacher'
                ? 'bg-blue-950 text-white'
                : 'bg-transparent text-blue-950 hover:bg-blue-100'
            }`}
          >
            For Teachers
          </button>
        </div>

        {/* FAQ Content */}
        <div className='mt-6 w-full max-w-3xl mx-auto text-blue-900 '>
          <p className='mb-6 text-xl font-semibold text-center'>
            Showing FAQs for {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
          </p>

          {faqs.map((faq, index) => (
            <div key={index} className='mb-4 bg-[#E4E5FF] rounded-lg shadow-md hover:cursor-pointer'>
              <button
                className='w-full flex justify-between items-center px-6 py-4 text-left text-xl font-medium focus:outline-none'
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                {openIndex === index ? <Minus size={24} /> : <Plus size={24} />}
              </button>
              {openIndex === index && (
                <div className='px-6 pb-4 text-lg leading-relaxed text-blue-900'>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
