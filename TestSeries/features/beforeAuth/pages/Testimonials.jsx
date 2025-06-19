import React from 'react';
import profile from '../../../assests/Landing/Testimonials/profile.png';

const testimonialCards = [
    {
        icon: profile,
        name: "Muain Haseeb",
        organization: "Executive Director at AI Arab Medical laboratories, Saudi Arabia",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum laboriosam velit vitae natus, iure doloribus delectus quia quod accusamus ea Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius dolor iure magnam?."
    },
    {
        icon: profile,
        name: "Muain Haseeb",
        organization: "Executive Director at AI Arab Medical laboratories, Saudi Arabia",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum laboriosam velit vitae natus, iure doloribus delectus quia quod accusamus ea Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius dolor iure magnam?."
    }
];

const Testimonials = () => {
    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-5xl sm:text-7xl font-bold text-gray-700 mb-4">
                        What Our <span className='text-blue-600'>Customers</span> Say
                    </h2>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        Here's what our satisfied customers have to say about Online lms software
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {testimonialCards.map((testimonialCard, idx) => (
                        <div 
                            key={idx}
                            className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            {/* Quote */}
                            <div className="mb-6">
                                <div className="text-4xl text-indigo-600 font-bold mb-4">"</div>
                                <p className="text-gray-700 text-lg leading-relaxed italic">
                                    {testimonialCard.text}
                                </p>
                                <div className="text-4xl text-indigo-600 font-bold text-right">"</div>
                            </div>

                            {/* Author Info */}
                            <div className="flex items-center space-x-4 pt-6 border-t border-gray-200">
                                <div className="flex-shrink-0">
                                    <img 
                                        src={testimonialCard.icon} 
                                        alt={testimonialCard.name}
                                        className="w-14 h-14 rounded-full object-cover border-2 border-indigo-600"
                                    />
                                </div>
                                <div className="flex-grow">
                                    <h4 className="font-semibold text-gray-900 text-lg">
                                        {testimonialCard.name}
                                    </h4>
                                    <p className="text-indigo-600 text-sm font-medium">
                                        {testimonialCard.organization}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="text-center mt-12">
                    <div className="inline-flex items-center justify-center px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors duration-200 cursor-pointer">
                        See More Reviews
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;