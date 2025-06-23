import React from 'react';
import { 

  Twitter, 

  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
 
} from 'lucide-react';
import logo from "../../assests/Footer/evalvo logo white 4.svg"
import nameLogo from "../../assests/Footer/Evalvo.svg"


const Footer = () => {
  return (
    <>
   
{/*  */}
<footer className="relative bg-gradient-to-t from-indigo-700 to-indigo-900 text-white overflow-hidden">

  <div className="max-w-7xl mx-auto py-16 px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
    

    <div className="space-y-6">
      <img src={logo} alt="Evalvo Logo" className="w-32 hover:animate-bounce  " />
      <p className="text-sm text-gray-300 max-w-xs">
        Evalvo is an all-in-one platform for managing online exams, student records, and performance analytics.
        Designed for educators and institutions to simplify assessments with smart, AI-powered tools.
      </p>
    </div>

    
    <div>
      <h3 className="text-base font-semibold mb-4">Quick Links</h3>
      <ul className="space-y-3 text-sm text-gray-300">
        <li>
          <button disabled className="hover:text-white disabled:cursor-not-allowed disabled:opacity-60">
            About
          </button>
        </li>
        <li>
          <button disabled className="hover:text-white disabled:cursor-not-allowed disabled:opacity-60">
            Pricing
          </button>
        </li>
        <li>
          <button disabled className="hover:text-white disabled:cursor-not-allowed disabled:opacity-60">
            Register Institute
          </button>
        </li>
      </ul>
    </div>


    <div>
      <h3 className="text-base font-semibold mb-4">Our Features</h3>
      <ul className="space-y-3 text-sm text-gray-300">
        <li>
          <button disabled className="hover:text-white disabled:cursor-not-allowed disabled:opacity-60">
            Multi-Batch Management
          </button>
        </li>
        <li>
          <button disabled className="hover:text-white disabled:cursor-not-allowed disabled:opacity-60">
            Multi-Organization Support
          </button>
        </li>
        <li>
          <button disabled className="hover:text-white disabled:cursor-not-allowed disabled:opacity-60">
            AI-Powered Proctoring
          </button>
        </li>
        <li>
          <button disabled className="hover:text-white disabled:cursor-not-allowed disabled:opacity-60">
            Certificate Generation
          </button>
        </li>
        <li>
          <button disabled className="hover:text-white disabled:cursor-not-allowed disabled:opacity-60">
            Detailed Exam Analysis
          </button>
        </li>
      </ul>
    </div>


    <div>
      <h3 className="text-base font-semibold mb-4">Contact us</h3>
      <ul className="space-y-3 text-sm text-gray-300">
        <li>Support - +91 12345 12345</li>
        <li>Email - support@evalvo.com</li>
        <li className="flex gap-4 pt-2 text-white text-lg">
          <button disabled className="hover:text-indigo-400 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60">
            <LinkedinIcon />
          </button>
          <button disabled className="hover:text-indigo-400 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60">
            <FacebookIcon />
          </button>
          <button disabled className="hover:text-indigo-400 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60">
            <InstagramIcon />
          </button>
          <button disabled className="hover:text-indigo-400 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60">
            <Twitter />
          </button>
        </li>
      </ul>
    </div>
  </div>

  <div className='my-16 flex justify-center'>

  <img
  src={nameLogo}
  alt="Evalvo Background"
  className="animate-pulse"
  />

</div>

  {/* Bottom Bar */}
  <div className="border-t border-white/30">
    <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-300">
      <p className="mb-2 md:mb-0">
        copyright © {new Date().getFullYear()} Insansa Technknowledge, All rights reserved.
      </p>
      <button disabled className="hover:text-white disabled:cursor-not-allowed disabled:opacity-60">
        Privacy Policy
      </button>
    </div>
  </div>
</footer>


    </>
  

  );
};

export default Footer;