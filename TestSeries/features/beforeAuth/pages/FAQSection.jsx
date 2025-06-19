import React, { useState } from 'react';
import { Plus, Minus, User, GraduationCap } from 'lucide-react';

const FAQSection = ({ studentFAQs, teacherFAQs }) => {
  const [selectedRole, setSelectedRole] = useState('teacher');
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = selectedRole === 'student' ? studentFAQs : teacherFAQs;

  const toggleFAQ = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className='mt-16 px-4 py-12'>
      <div className='flex flex-col items-center justify-center gap-8'>
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className='text-4xl md:text-5xl font-bold text-blue-950 mb-4'>
            Frequently Asked <span className='text-blue-600'>Questions</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our AI proctoring platform
          </p>
        </div>

        {/* Enhanced Toggle Role Buttons */}
        <div className='flex items-center bg-white border-2 border-blue-200 rounded-full p-1 shadow-lg'>
          {[
            { role: 'student', icon: GraduationCap, color: 'blue-600' },
            { role: 'teacher', icon: User, color: 'blue-950' }
          ].map(({ role, icon: IconComponent, color }) => (
            <button
              key={role}
              onClick={() => {
                setSelectedRole(role);
                setOpenIndex(null);
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm md:text-base font-semibold transition-all duration-200 ${
                selectedRole === role
                  ? `bg-${color} text-white shadow-md`
                  : 'bg-transparent text-gray-600 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              <IconComponent size={18} />
              For {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className='mt-8 w-full max-w-4xl mx-auto'>
          {/* Role Indicator */}
          <div className="mb-8 text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
              selectedRole === 'student' ? 'bg-blue-100 text-blue-700' : 'bg-blue-950 text-white'
            }`}>
              {selectedRole === 'student' ? <GraduationCap size={16} /> : <User size={16} />}
              <span className="font-medium">
                {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} FAQs
              </span>
            </div>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl border-2 transition-all duration-300 ${
                  openIndex === index 
                    ? 'border-blue-300 shadow-lg' 
                    : 'border-gray-200 shadow-sm hover:border-blue-200 hover:shadow-md'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className='w-full flex justify-between items-center px-6 py-5 text-left focus:outline-none group'
                  aria-expanded={openIndex === index}
                >
                  <span className="text-lg md:text-xl font-semibold text-blue-950 group-hover:text-blue-700 transition-colors pr-4">
                    {faq.question}
                  </span>
                  <div className={`flex-shrink-0 p-2 rounded-full transition-all duration-200 ${
                    openIndex === index 
                      ? 'bg-blue-100 text-blue-600 rotate-180' 
                      : 'bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600'
                  }`}>
                    <Plus size={20} className={openIndex === index ? 'rotate-45' : ''} />
                  </div>
                </button>
                
                {/* Animated Answer Section */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className='px-6 pb-6 pt-2 border-t border-gray-100'>
                    <p className='text-gray-700 text-base md:text-lg leading-relaxed'>
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Help Section */}
          <div className="mt-12 text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <h3 className="text-xl font-semibold text-blue-950 mb-2">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-4">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;