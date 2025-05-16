import React from 'react';
import { MailIcon, LinkedinIcon, TwitterIcon } from 'lucide-react';
import Profile from '../../../../assests/Landing/Testimonials/profile.png';

const facultyData = [
  {
    name: 'XYZ',
    subject: 'Math',
    bio: 'lorem ipsum',
    image: Profile,
    social: {
      linkedin: '#',
      twitter: '#',
    },
  },
  {
    name: 'XYZ',
    subject: 'Physics',
    bio: 'lorem ipsum',
    image: Profile,
    social: {
      linkedin: '#',
      twitter: '#',
    },
  },
  
];

const FacultySection = () => {
  return (
    <section className="bg-white py-16 px-6 md:px-20">
      <div className="text-center">
        <span className="text-sm font-semibold text-blue-700 bg-blue-300 px-2 py-3 rounded-4xl">Driven by excellence</span>
        <h2 className="text-4xl font-bold text-blue-900 mt-6">Batch's Faculty</h2>
        <p className="max-w-2xl mx-auto mt-4 text-gray-600">
          Our amazing team is the driving force behind our success. Comprised of passionate individuals who are experts in their respective fields, we work collaboratively to achieve our goals and exceed expectations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-14 max-w-5xl mx-auto px-4">
      {facultyData.map((faculty, index) => (
          <div key={index} className="flex items-start gap-6">
            <img
              src={faculty.image}
              alt={faculty.name}
              className="w-32 h-32 rounded-xl object-cover"
            />
            <div>
              <h3 className="text-xl font-bold text-blue-900">{faculty.name}</h3>
              <p className="text-sm text-red-600 font-semibold mt-1">{faculty.subject}</p>
              <p className="text-sm text-gray-700 mt-2">{faculty.bio}</p>
              <div className="flex items-center gap-4 mt-4">
                <a href={faculty.social.linkedin} target="_blank" rel="noopener noreferrer">
                  <LinkedinIcon className="w-5 h-5 text-gray-500 hover:text-blue-700 transition" />
                </a>
                <a href={faculty.social.twitter} target="_blank" rel="noopener noreferrer">
                  <TwitterIcon className="w-5 h-5 text-gray-500 hover:text-blue-500 transition" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FacultySection;
