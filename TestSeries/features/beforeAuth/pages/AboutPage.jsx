import React, { useState, useEffect } from 'react';
import { ArrowRight, Users, Target,  Award, TrendingUp, Globe, Shield, Zap, MessageCircle} from 'lucide-react';
import { ChevronDown } from 'lucide-react';

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState('about');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);


  

  const locations = [
    { city: 'New York', state: 'NY', address: '1501 Broadway, Floor 12' },
    { city: 'New Jersey', state: 'NJ', address: 'Serving Metro Area' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden  mb-5">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-indigo-50"></div>
        <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-8">
              <MessageCircle className="w-4 h-4 mr-2" />
              Your premier IT partner since 2025
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
              About
              <span className="text-indigo-600 block">Evalvo Tech</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mt-10">
            Evalvo is a complete online exam system designed for schools, colleges, coaching institutes, and companies. It helps teachers create tests, manage students and batches, and track student performance—all in one place.
            </p>

     <div className="flex flex-col items-center mt-15">
            <span className="text-indigo-600 text-sm mb-2 font-medium">Scroll Down</span>
            <div className="animate-bounce">
              <ChevronDown className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
            
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center mb-12">
            <div className="bg-gray-50 rounded-2xl p-2 border border-gray-100 shadow-sm">
              {['about', 'mission', 'values'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm">
            {activeTab === 'about' && (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-indigo-100 rounded-2xl flex items-center justify-center">
                  <Globe className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Who We Are</h3>
                <div className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed space-y-6">
                  <p>
                    Evalvo, known as EvalvoTech, is a trusted and experienced managed IT services provider established to help businesses thrive in the digital age. Since our founding, we have been THE choice for companies seeking comprehensive IT solutions.
                  </p>
                  <p>
                    We specialize in providing cutting-edge technologies and services to small to medium-sized businesses across New York and New Jersey. Our team of certified IT experts builds extensive partnerships with clients, delivering service above and beyond expectations.
                  </p>
                  <p>
                    With an obsession for providing exceptional service, we ensure smooth and uninterrupted operations for businesses while solving their IT and computer challenges. We don't just fix problems – we prevent them.
                  </p>
                </div>
              </div>
            )}
            {activeTab === 'mission' && (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-indigo-100 rounded-2xl flex items-center justify-center">
                  <Target className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h3>
                <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  To be the premier partner for business IT needs by providing cutting-edge technologies and exceptional services that enable small to medium-sized businesses to thrive in the digital age. We build lasting relationships while delivering comprehensive IT solutions that exceed expectations and drive business success.
                </p>
              </div>
            )}
            {activeTab === 'values' && (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-indigo-100 rounded-2xl flex items-center justify-center">
                  <Zap className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Core Values</h3>
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                    <div className="w-12 h-12 mx-auto mb-4 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Reliability</h4>
                    <p className="text-gray-600">Providing consistent, dependable IT solutions with 24/7 support and proactive maintenance.</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                    <div className="w-12 h-12 mx-auto mb-4 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Partnership</h4>
                    <p className="text-gray-600">Building extensive partnerships with clients, understanding their unique needs and challenges.</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                    <div className="w-12 h-12 mx-auto mb-4 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <Award className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Excellence</h4>
                    <p className="text-gray-600">Delivering service above and beyond expectations with certified expertise and cutting-edge solutions.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Why Choose Us Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why Choose Evalvo Tech?
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="group flex items-start space-x-4 p-6 rounded-2xl hover:bg-white hover:shadow-sm transition-all duration-300">
                  <div className="w-12 h-12 bg-indigo-100 group-hover:bg-indigo-200 rounded-xl flex items-center justify-center transition-colors duration-200 flex-shrink-0">
                    <Award className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Certified IT Experts</h3>
                    <p className="text-gray-600">Our team consists of certified professionals with extensive experience in IT solutions and support.</p>
                  </div>
                </div>
                <div className="group flex items-start space-x-4 p-6 rounded-2xl hover:bg-white hover:shadow-sm transition-all duration-300">
                  <div className="w-12 h-12 bg-indigo-100 group-hover:bg-indigo-200 rounded-xl flex items-center justify-center transition-colors duration-200 flex-shrink-0">
                    <Shield className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Proactive Approach</h3>
                    <p className="text-gray-600">We don't just fix problems – we prevent them with proactive monitoring and maintenance.</p>
                  </div>
                </div>
                <div className="group flex items-start space-x-4 p-6 rounded-2xl hover:bg-white hover:shadow-sm transition-all duration-300">
                  <div className="w-12 h-12 bg-indigo-100 group-hover:bg-indigo-200 rounded-xl flex items-center justify-center transition-colors duration-200 flex-shrink-0">
                    <Users className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Local Partnership</h3>
                    <p className="text-gray-600">We build relationships with businesses in our local NY and NJ area, providing personalized service.</p>
                  </div>
                </div>
              </div>
              <div className="bg-indigo-600 rounded-2xl p-8 text-white">
                <blockquote className="text-lg italic mb-6">
                  "At E-Valve Technologies, we build extensive partnerships with our clients. We provide service above and beyond expectations with an obsession for delivering exceptional results."
                </blockquote>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-indigo-100 font-semibold">E-Valve Technologies Team</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-12 border border-gray-100">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Ready to Partner with Us?</h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Let E-Valve Technologies be your trusted IT partner. Contact us today to discuss how we can help your business thrive in the digital age.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
                  <span>Get Started Today</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300">
                  Schedule Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;