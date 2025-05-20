import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQSection = ({ studentFAQs, teacherFAQs }) => {
  const [selectedRole, setSelectedRole] = useState('teacher');
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = selectedRole === 'student' ? studentFAQs : teacherFAQs;

  const toggleFAQ = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className='mt-16 px-4 mb-16'>
      <div className='flex flex-col items-center justify-center gap-6'>
        <h1 className='text-4xl text-blue-950 text-center'>Frequently Asked Questions</h1>

        {/* Toggle Role Buttons */}
        <div className='flex items-center border border-blue-900 rounded-full overflow-hidden'>
          {['student', 'teacher'].map((role) => (
            <button
              key={role}
              onClick={() => {
                setSelectedRole(role);
                setOpenIndex(null);
              }}
              className={`px-6 py-2 text-sm md:text-base font-medium transition ${
                selectedRole === role
                  ? role === 'student'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-950 text-white'
                  : 'bg-transparent text-blue-950 hover:bg-blue-100'
              }`}
            >
              For {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className='mt-6 w-full max-w-3xl mx-auto text-blue-900'>
          <p className='mb-6 text-xl font-semibold text-center'>
            Showing FAQs for {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
          </p>

          {faqs.map((faq, index) => (
            <div
              key={index}
              className='mb-4 bg-[#E4E5FF] rounded-lg shadow-md transition hover:shadow-lg'
            >
              <button
                onClick={() => toggleFAQ(index)}
                className='w-full flex justify-between items-center px-6 py-4 text-left text-xl font-medium focus:outline-none'
                aria-expanded={openIndex === index}
              >
                {faq.question}
                {openIndex === index ? <Minus size={24} /> : <Plus size={24} />}
              </button>
              {openIndex === index && (
                <div className='px-6 pb-4 text-lg leading-relaxed'>
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
