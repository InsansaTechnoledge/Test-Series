import React from 'react';
import { 
  Eye, Shield, Brain, Zap, CheckCircle, ArrowRight, 
  Monitor, Camera, AlertTriangle, Lock, Clock, Award 
} from 'lucide-react';

const AiBranding = () => {
  const features = [
    { icon: Eye, text: "Face Recognition" },
    { icon: Monitor, text: "Screen Monitoring" },
    { icon: Camera, text: "Multiple Detection" },
    { icon: Shield, text: "Secure Platform" },
    { icon: Brain, text: "AI Intelligence" },
    { icon: Lock, text: "Data Protection" }
  ];

  const benefits = [
    "No human proctor required",
    "Reduces examination costs to minimum",
    "AI-powered real-time monitoring",
    "Comprehensive security features"
  ];

  return (
    <div className="hidden w-full bg-transparent md:flex flex-col items-center justify-center  px-4  mb-8 text-center relative overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Main Heading */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-7xl font-bold max-w-4xl mx-auto leading-tight mb-6">
            <span className="text-gray-800">We Provide</span>{' '}
            <span className="text-blue-600">
              AI Proctoring Software
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Keep Exams Secure with Our AI Powered Online Proctoring Software
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-12">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="flex flex-col items-center p-4 bg-gray-50 border border-gray-200 rounded-2xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 group shadow-sm">
                <div className="p-3 bg-blue-100 rounded-xl mb-2 group-hover:bg-blue-200 group-hover:scale-110 transition-all">
                  <IconComponent className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-center text-gray-700">{feature.text}</span>
              </div>
            );
          })}
        </div>

        {/* Main Description */}
        <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 mb-10 max-w-4xl mx-auto shadow-sm">
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            As a remote proctoring solution, it does not require an actual human
            proctor's presence. Thanks to the AI-based features, it's extremely simple to
            proctor online exams, reducing the costs of the examination to the bare
            minimum.
          </p>
        </div>

        {/* Benefits List */}
        <div className="grid md:grid-cols-2 gap-4 mb-10 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">{benefit}</span>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">More than 90%</div>
            <div className="text-gray-600 font-medium">Accuracy Rate</div>
          </div>
          <div className="text-center p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">24/7</div>
            <div className="text-gray-600 font-medium">Anytime Anywhere Monitoring</div>
          </div>
          <div className="text-center p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">Approx 80%</div>
            <div className="text-gray-600 font-medium">Cost Reduction</div>
          </div>
        </div>

        {/* Security Badge */}
        {/* <div className="mt-8 inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full text-green-700 font-medium border border-green-300">
          <Award className="w-4 h-4" />
          <span>Trusted by 1000+ Institutions</span>
        </div> */}
      </div>
    </div>
  );
};

export default AiBranding;