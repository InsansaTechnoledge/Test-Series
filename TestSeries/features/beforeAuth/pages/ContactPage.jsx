import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle, ArrowRight, MessageCircle, Clock, Users } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setFormData({ name: '', email: '', company: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-1/2 bg-white">
      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-indigo-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-8">
              <MessageCircle className="w-4 h-4 mr-2" />
              Get in touch with our experts
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
              Contact
              <span className="text-indigo-600 block">Our Team</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
              Ready to transform your business? Let's discuss how we can help you achieve your goals with innovative technology solutions.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">24hrs</div>
                <div className="text-gray-600">Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">500+</div>
                <div className="text-gray-600">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">98%</div>
                <div className="text-gray-600">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-5 gap-16">
          
          {/* Contact Information */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Contact Methods */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="group flex items-start space-x-4 p-4 rounded-xl hover:bg-indigo-50 transition-colors duration-200">
                  <div className="w-12 h-12 bg-indigo-100 group-hover:bg-indigo-200 rounded-lg flex items-center justify-center transition-colors duration-200">
                    <Mail className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <a href="mailto:queries@insansa.com" className="text-indigo-600 hover:text-indigo-700 transition-colors">
                      queries@insansa.com
                    </a>
                    <p className="text-sm text-gray-500 mt-1">We'll respond within 24 hours</p>
                  </div>
                </div>

                <div className="group flex items-start space-x-4 p-4 rounded-xl hover:bg-indigo-50 transition-colors duration-200">
                  <div className="w-12 h-12 bg-indigo-100 group-hover:bg-indigo-200 rounded-lg flex items-center justify-center transition-colors duration-200">
                    <Clock className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Support Hours</h3>
                    <p className="text-indigo-600">Monday - Friday: 10am - 6pm</p>
                    <p className="text-sm text-gray-500 mt-1">Saturday & Sunday: Closed</p>
                  </div>
                </div>

                <div className="group flex items-start space-x-4 p-4 rounded-xl hover:bg-indigo-50 transition-colors duration-200">
                  <div className="w-12 h-12 bg-indigo-100 group-hover:bg-indigo-200 rounded-lg flex items-center justify-center transition-colors duration-200">
                    <MapPin className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Office</h3>
                    <p className="text-gray-600">B/321 Monalisa Business Center</p>
                    <p className="text-gray-600">Manjalpur, Vadodara</p>
                    <p className="text-gray-600">Gujarat, INDIA 390011</p>
                  </div>
  
                </div>
              </div>
            </div>

            {/* Why Choose Us */}
            <div className="bg-indigo-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Why Choose EvalvoTech?</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-indigo-200 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Expert Team</div>
                    <div className="text-indigo-100 text-sm">Skilled professionals with years of experience</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-indigo-200 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Fast Delivery</div>
                    <div className="text-indigo-100 text-sm">On-time project completion guaranteed</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-indigo-200 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">24/7 Support</div>
                    <div className="text-indigo-100 text-sm">Round-the-clock assistance when you need it</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                <p className="text-gray-600">Tell us about your project and we'll get back to you with a personalized solution.</p>
              </div>
              
              {isSubmitted && (
                <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-800 font-medium">Thank you! Your message has been sent successfully.</span>
                </div>
              )}

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField('')}
                      required
                      className={`w-full px-4 py-3 border rounded-xl outline-none transition-all duration-200 ${
                        focusedField === 'name' 
                          ? 'border-indigo-500 ring-2 ring-indigo-100 bg-white' 
                          : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                      }`}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField('')}
                      required
                      className={`w-full px-4 py-3 border rounded-xl outline-none transition-all duration-200 ${
                        focusedField === 'email' 
                          ? 'border-indigo-500 ring-2 ring-indigo-100 bg-white' 
                          : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                      }`}
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('company')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full px-4 py-3 border rounded-xl outline-none transition-all duration-200 ${
                        focusedField === 'company' 
                          ? 'border-indigo-500 ring-2 ring-indigo-100 bg-white' 
                          : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                      }`}
                      placeholder="Your Company"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('subject')}
                      onBlur={() => setFocusedField('')}
                      required
                      className={`w-full px-4 py-3 border rounded-xl outline-none transition-all duration-200 ${
                        focusedField === 'subject' 
                          ? 'border-indigo-500 ring-2 ring-indigo-100 bg-white' 
                          : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                      }`}
                    >
                      <option value="">Select a topic</option>
                      <option value="general">General Inquiry</option>
                      <option value="project">New Project</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership</option>
                      <option value="quote">Request Quote</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField('')}
                    required
                    rows="6"
                    className={`w-full px-4 py-3 border rounded-xl outline-none transition-all duration-200 resize-none ${
                      focusedField === 'message' 
                        ? 'border-indigo-500 ring-2 ring-indigo-100 bg-white' 
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                    }`}
                    placeholder="Tell us about your project requirements, timeline, and how we can help you achieve your goals..."
                  ></textarea>
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-[1.01]"
                >
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Your Next Project?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Let's schedule a consultation to discuss your requirements and provide a tailored solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors">
              Schedule a Call
            </button>
            <button className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white font-semibold py-3 px-8 rounded-xl transition-colors">
              View Portfolio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}