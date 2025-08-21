import React, { useState, useEffect } from 'react';
import { Download, Check, Shield, Lock, Database, Zap, Monitor, Apple, Laptop } from 'lucide-react';
import Logo from '../../assests/Logo/Frame 8.svg'

export default function EvalvoDownloadPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleDownload = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || '';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-gray-50 min-h-screen overflow-hidden">
      {/* Main Container - Full Viewport */}
      <div className="h-screen flex flex-col">
        
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <img src={Logo} alt="" />
            </div>
            <div className="text-sm text-gray-500">v1.0.1</div>
          </div>
        </header>

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-12">
            
            {/* Hero Section */}
            <div className={`grid lg:grid-cols-2 gap-16 items-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              
              {/* Left Content */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                    <Zap className="w-4 h-4 mr-2" />
                    Latest Release
                  </div>
                  <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                    Download Evalvo
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Powerful examination and evaluation platform with advanced analytics and secure proctoring capabilities.
                  </p>
                </div>

                {/* Download Buttons */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      className="group flex-1 bg-gray-900 hover:bg-gray-800 text-white px-6 py-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-3 shadow-lg"
                      onClick={() => handleDownload(
                        'https://github.com/InsansaTechnoledge/Test-Series/releases/download/v1.0.1/Evalvo.Proctor.Setup.1.0.1.exe',
                        'Evalvo.Proctor.Setup.1.0.1.exe'
                      )}
                    >
                      <Laptop className="w-5 h-5" />
                      <span>Download for Windows</span>
                      <Download className="w-4 h-4 opacity-70 group-hover:translate-y-0.5 transition-transform" />
                    </button>

                    <button
                      className="flex-1 bg-white hover:bg-gray-50 text-gray-900 px-6 py-4 rounded-lg font-medium transition-all duration-200 border border-gray-300 hover:border-gray-400 flex items-center justify-center space-x-3"
                      onClick={() => handleDownload(
                        'https://github.com/InsansaTechnoledge/Test-Series/releases/download/evalvoTech/Evalvo.Proctor-1.0.0.dmg',
                        'Evalvo.Proctor-1.0.0.dmg'
                      )}
                    >
                      <Apple className="w-5 h-5" />
                      <span>Download for macOS</span>
                      <Download className="w-4 h-4 opacity-70" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Windows 10/11</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>macOS 12.0+</span>
                    </div>
                    {/* <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>~200MB</span>
                    </div> */}
                  </div>
                </div>
              </div>

              {/* Right Content - App Preview */}
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                  {/* Browser Chrome */}
                  <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex items-center space-x-3">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="flex-1 bg-white rounded px-3 py-1 text-sm text-gray-500">
                      evalvotech.com
                    </div>
                  </div>
                  
                  {/* App Interface */}
                  <div className="h-80 bg-gradient-to-br from-indigo-50 to-white p-8">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <Monitor className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">Exam Dashboard</div>
                            <div className="text-sm text-gray-500">Active Proctoring</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-sm text-gray-600">Secure</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">Mathematics Exam</span>
                            <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">Active</span>
                          </div>
                          <div className="text-sm text-gray-500">120 minutes • 50 questions</div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">Physics Assessment</span>
                            <span className="text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded">Scheduled</span>
                          </div>
                          <div className="text-sm text-gray-500">90 minutes • 40 questions</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">Secure</span>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -left-4 bg-indigo-600 rounded-lg shadow-lg p-3">
                  <div className="flex items-center space-x-2 text-sm text-white">
                    <Zap className="w-4 h-4" />
                    <span>Real-time Analytics</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
                <div className="text-gray-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">99.9%</div>
                <div className="text-gray-600">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">100+</div>
                <div className="text-gray-600">Exams Conducted</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">24/7</div>
                <div className="text-gray-600">Support</div>
              </div>
            </div>

            {/* System Requirements & Security - Side by Side */}
            <div className="grid lg:grid-cols-2 gap-12">
              
              {/* System Requirements */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">System Requirements</h2>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Laptop className="w-6 h-6 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">Windows</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">OS:</span>
                        <div className="font-medium text-gray-900">Windows 10/11</div>
                      </div>
                      <div>
                        <span className="text-gray-500">RAM:</span>
                        <div className="font-medium text-gray-900">8 GB</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Processor:</span>
                        <div className="font-medium text-gray-900">Intel i5 / AMD Ryzen 5</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Storage:</span>
                        <div className="font-medium text-gray-900">2 GB</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Apple className="w-6 h-6 text-gray-800" />
                      <h3 className="font-semibold text-gray-900">macOS</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">OS:</span>
                        <div className="font-medium text-gray-900">macOS 12.0+</div>
                      </div>
                      <div>
                        <span className="text-gray-500">RAM:</span>
                        <div className="font-medium text-gray-900">8 GB</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Processor:</span>
                        <div className="font-medium text-gray-900">Intel / Apple Silicon</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Storage:</span>
                        <div className="font-medium text-gray-900">2 GB</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security & Compliance */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Security & Compliance</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Shield className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="font-medium text-gray-900 mb-1">SOC 2 Type II</div>
                      <div className="text-sm text-gray-500">Security Certified</div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                      <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Lock className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="font-medium text-gray-900 mb-1">GDPR</div>
                      <div className="text-sm text-gray-500">Privacy Compliant</div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                      <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Database className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="font-medium text-gray-900 mb-1">ISO 27001</div>
                      <div className="text-sm text-gray-500">Info Security</div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                      <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Zap className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="font-medium text-gray-900 mb-1">HIPAA Ready</div>
                      <div className="text-sm text-gray-500">Healthcare Safe</div>
                    </div>
                  </div>

                  {/* Security Features */}
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4">Security Features</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        'End-to-end AES-256 encryption',
                        'Multi-factor authentication (MFA)',
                        'Role-based access control (RBAC)',
                        'Audit logging and monitoring',
                        'Regular security assessments',
                        '24/7 security monitoring'
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-gray-500">
            <div>© 2025 Evalvo. All rights reserved.</div>
            <div className="flex items-center space-x-6">
              <span>Need help? Contact support</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}