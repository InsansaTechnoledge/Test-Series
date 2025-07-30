import React, { useState, useEffect } from 'react';
import { Download, Star, Shield, Zap, Users, Check, BarChart3, Database, Lock, Globe, Cpu, HardDrive, Monitor, Smartphone } from 'lucide-react';
import Logo from '../../assests/Logo/Frame 8.svg'

export default function EvalvoDownloadPage() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Main Content */}
      <div className="px-6 pt-16 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className={`space-y-8 transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              <div className="space-y-6">
                
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Download
                  <img className='mt-4 ' src={Logo} alt="" />
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                    powerful Examination and evaluation platform with analytics.
                </p>
              </div>

              {/* Download Buttons */}
              <div className="space-y-4">
                <button className="group w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-3">
                  <Download className="w-5 h-5 group-hover:animate-bounce" />
                  <a href="https://github.com/InsansaTechnoledge/Test-Series/releases/download/evalvoTech/Evalvo.Proctor.Setup.1.0.0.exe"><span>Download for Windows</span></a>
                </button>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2">
                    <Download className="w-4 h-4" />
                    <a href="https://github.com/InsansaTechnoledge/Test-Series/releases/download/evalvoTech/Evalvo.Proctor-1.0.0.dmg"><span>macOS</span></a>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Content - Simple Laptop Mockup */}
            <div className={`relative transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
              <div className="relative max-w-lg mx-auto">
                {/* Laptop Screen */}
                <div className="bg-gray-800 rounded-t-2xl p-4 shadow-2xl">
                  <div className="bg-white rounded-lg h-80 p-6 relative overflow-hidden">
                    {/* App Interface */}
                    <div className="flex items-center space-x-2 mb-6 pb-4 border-b border-gray-100">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <div className="ml-6 text-gray-600 text-sm font-medium">Evalvo Dashboard</div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-bold">E</span>
                        </div>
                        <div>
                          <div className="text-gray-900 font-semibold">Project Dashboard</div>
                          <div className="text-gray-500 text-sm">Analytics Overview</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <div className="text-indigo-600 text-xl font-bold">1,247</div>
                          <div className="text-gray-600 text-xs">Evaluations</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <div className="text-indigo-600 text-xl font-bold">98.2%</div>
                          <div className="text-gray-600 text-xs">Accuracy</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <div className="text-indigo-600 text-xl font-bold">45</div>
                          <div className="text-gray-600 text-xs">Projects</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-gray-700 text-sm">Market Analysis Complete</span>
                          </div>
                          <Check className="w-4 h-4 text-green-500" />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                            <span className="text-gray-700 text-sm">Processing Data Set...</span>
                          </div>
                          <div className="text-yellow-600 text-sm">75%</div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-700 text-sm">Report Generation</span>
                          </div>
                          <div className="text-blue-600 text-sm">Queued</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Laptop Base */}
                <div className="bg-gray-700 rounded-b-2xl h-6 shadow-lg relative">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-1 bg-gray-600 rounded-full"></div>
                </div>
                
                {/* Shadow */}
                <div className="absolute -bottom-4 left-4 right-4 h-4 bg-gray-200 rounded-full blur-lg opacity-50"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Requirements */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">System Requirements</h2>
            <p className="text-xl text-gray-600">Ensure your system meets these requirements for optimal performance</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Windows Requirements */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center space-x-3 mb-6">
                <h3 className="text-xl font-bold text-gray-900">Windows</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">OS Version:</span>
                  <span className="font-medium">Windows 10/11</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Processor:</span>
                  <span className="font-medium">Intel i5 / AMD Ryzen 5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Memory:</span>
                  <span className="font-medium">8 GB RAM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Storage:</span>
                  <span className="font-medium">2 GB available</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Graphics:</span>
                  <span className="font-medium">DirectX 11</span>
                </div>
              </div>
            </div>

            {/* macOS Requirements */}
            <div className="bg-gradient-to-br from-gray-50 to-slate-100 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center space-x-3 mb-6">
                <h3 className="text-xl font-bold text-gray-900">macOS</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">OS Version:</span>
                  <span className="font-medium">macOS 12.0+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Processor:</span>
                  <span className="font-medium">Intel / Apple Silicon</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Memory:</span>
                  <span className="font-medium">8 GB RAM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Storage:</span>
                  <span className="font-medium">2 GB available</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Graphics:</span>
                  <span className="font-medium">Metal support</span>
                </div>
              </div>
            </div>

            {/* Recommended Specs */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 border border-green-200">
              <div className="flex items-center space-x-3 mb-6">
                <h3 className="text-xl font-bold text-gray-900">Recommended</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Processor:</span>
                  <span className="font-medium">Intel i7 / AMD Ryzen 7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Memory:</span>
                  <span className="font-medium">16 GB RAM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Storage:</span>
                  <span className="font-medium">SSD with 10 GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Network:</span>
                  <span className="font-medium">Broadband Internet</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Display:</span>
                  <span className="font-medium">1920x1080 or higher</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance & Security */}
      <div className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Security & Compliance</h2>
            <p className="text-xl text-gray-300">Enterprise-grade security standards and regulatory compliance</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">SOC 2 Type II</h3>
              <p className="text-gray-300 text-sm">Certified for security, availability, and confidentiality</p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">GDPR Compliant</h3>
              <p className="text-gray-300 text-sm">Full compliance with European data protection regulations</p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">ISO 27001</h3>
              <p className="text-gray-300 text-sm">International standard for information security management</p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">HIPAA Ready</h3>
              <p className="text-gray-300 text-sm">Healthcare data protection compliance available</p>
            </div>
          </div>

          <div className="mt-16 bg-gray-800 rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">Security Features</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>End-to-end AES-256 encryption</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>Multi-factor authentication (MFA)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>Role-based access control (RBAC)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>Audit logging and monitoring</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>Regular security assessments</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>Data residency controls</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>Secure API endpoints</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>24/7 security monitoring</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
}