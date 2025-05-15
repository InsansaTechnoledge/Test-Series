import React from 'react';
import { 
  GraduationCap, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube, 
  ArrowRight, 
  Globe, 
  Shield, 
  Award
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-blue-900 to-blue-950 text-white">

      
      {/* Main Footer Content */}
      <div className="max-w-screen-xl mx-auto py-12 px-6">
        <div className="grid grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-6">
            
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-200 to-violet-200 bg-clip-text text-transparent">
                myApp
              </div>
            </div>
            
            <p className="text-blue-200 mb-6 pr-8">
              The leading AI-powered proctoring solution trusted by educational institutions and certification providers worldwide. Ensuring integrity in online examinations with advanced technology and exceptional service.
            </p>
            
            <div className="flex space-x-4">
              <a href="#" className="bg-blue-800 hover:bg-blue-700 h-10 w-10 rounded-full flex items-center justify-center transition-colors duration-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-blue-800 hover:bg-blue-700 h-10 w-10 rounded-full flex items-center justify-center transition-colors duration-300">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-blue-800 hover:bg-blue-700 h-10 w-10 rounded-full flex items-center justify-center transition-colors duration-300">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-blue-800 hover:bg-blue-700 h-10 w-10 rounded-full flex items-center justify-center transition-colors duration-300">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="bg-blue-800 hover:bg-blue-700 h-10 w-10 rounded-full flex items-center justify-center transition-colors duration-300">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-blue-700 pb-2">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-blue-200 hover:text-white flex items-center"><ArrowRight className="h-4 w-4 mr-2" /> Home</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white flex items-center"><ArrowRight className="h-4 w-4 mr-2" /> About Us</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white flex items-center"><ArrowRight className="h-4 w-4 mr-2" /> Features</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white flex items-center"><ArrowRight className="h-4 w-4 mr-2" /> Pricing</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white flex items-center"><ArrowRight className="h-4 w-4 mr-2" /> Contact</a></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-blue-700 pb-2">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-blue-200 hover:text-white flex items-center"><ArrowRight className="h-4 w-4 mr-2" /> Help Center</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white flex items-center"><ArrowRight className="h-4 w-4 mr-2" /> Blog</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white flex items-center"><ArrowRight className="h-4 w-4 mr-2" /> Webinars</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white flex items-center"><ArrowRight className="h-4 w-4 mr-2" /> Case Studies</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white flex items-center"><ArrowRight className="h-4 w-4 mr-2" /> API Documentation</a></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-blue-700 pb-2">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-300 mr-3 mt-1 flex-shrink-0" />
                <span className="text-blue-200">123 Education Lane, Learning City, ED 12345</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-blue-300 mr-3 flex-shrink-0" />
                <span className="text-blue-200">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-blue-300 mr-3 flex-shrink-0" />
                <span className="text-blue-200">support@proctoraiexample.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
    
      {/* Copyright */}
      <div className="bg-blue-950 py-6">
        <div className="max-w-screen-xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-300 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} myapp. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-blue-300 hover:text-white text-sm transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="text-blue-300 hover:text-white text-sm transition-colors duration-200">Terms of Service</a>
            <a href="#" className="text-blue-300 hover:text-white text-sm transition-colors duration-200">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;