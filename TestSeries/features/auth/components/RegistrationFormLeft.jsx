import React, { useState, useEffect } from 'react';
import { Building2, Check, Sparkles, TrendingUp, Users, Shield, Zap, BookOpen, BarChart3, Clock, Database } from 'lucide-react';

const RegistrationFormLeft = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Streamlined Assessment Creation",
      description: "Build comprehensive tests in minutes with our AI-powered tools"
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Comprehensive Analytics Platform",
      description: "Deep insights into student performance and learning patterns"
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Real-time Testing Capabilities",
      description: "Conduct live assessments with instant feedback and monitoring"
    },
    {
      icon: <Database className="w-5 h-5" />,
      title: "Student Data Management Tools",
      description: "Secure, organized student records and progress tracking"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Institutes" },
    { number: "500K+", label: "Students" },
    { number: "98%", label: "Satisfaction" }
  ];

  return (
    <div className="min-h-screen p-8 flex items-center relative overflow-hidden">
     

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
                      className="absolute w-1 h-1 bg-gray-600 rounded-full opacity-30 animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}
        ></div>
      ))}

      <div className={`max-w-2xl mx-auto relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
          
         
        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center transform hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold text-indigo-600 mb-1">{stat.number}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border border-gray-200 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-600">Why Register?</h2>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 p-4 rounded-2xl transition-all duration-500 transform hover:scale-105 ${
                  activeFeature === index 
                    ? 'bg-indigo-50 border border-indigo-200 shadow-lg' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  activeFeature === index 
                    ? 'bg-indigo-600 shadow-lg text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-600">{feature.title}</h3>
                    <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      activeFeature === index ? 'bg-indigo-600 animate-pulse' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
                <div className={`flex-shrink-0 transition-all duration-300 ${
                  activeFeature === index ? 'text-indigo-600 scale-110' : 'text-gray-400'
                }`}>
                  <Check className="w-6 h-6" />
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-8 p-6 bg-indigo-50 rounded-2xl border border-indigo-200">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-6 h-6 text-indigo-600" />
              <span className="text-gray-600 font-semibold">Trusted by Educational Leaders</span>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Join thousands of institutes already using our platform to revolutionize their assessment processes and improve student outcomes.
            </p>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2 text-gray-600">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm">Powered by Insansa Techknowledge</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationFormLeft;