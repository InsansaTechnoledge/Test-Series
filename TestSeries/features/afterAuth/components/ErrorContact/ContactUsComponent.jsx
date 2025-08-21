import React, { useMemo, useState } from 'react'
import { useUser } from '../../../../contexts/currentUserContext'
import { Mail, Phone, MessageCircle, User, Settings, BookOpen, Code, Users, Award, Eye, Database, UserCheck, Play, HelpCircle, Send, Upload, X, Paperclip } from 'lucide-react'

const ContactUsComponent = () => {
    const {user} = useUser();
    const [featuresAvailable] = useState(user?.planFeatures)
    const [PersonalDetails] = useState([{name: user?.name} , {email: user?.email}])
    const [supportForm, setSupportForm] = useState({
        subject: '',
        priority: 'medium',
        message: '',
        relatedFeature: '',
        functionality: '',
        attachments: []
    });
    
    const [showFunctionalities, setShowFunctionalities] = useState(false);

    const featureFunctionalities = {
        'analysis': ['Data Analysis', 'Report Generation', 'Analytics Dashboard', 'Export Results'],
        'batch': ['Batch Creation', 'Batch Management', 'Bulk Operations', 'Batch Settings'],
        'certificate': ['Certificate Generation', 'Template Management', 'Certificate Verification', 'Download Issues'],
        'code': ['Code Editor', 'Syntax Highlighting', 'Code Compilation', 'Debug Tools'],
        'exam': ['Exam Creation', 'Question Management', 'Exam Scheduling', 'Results Review'],
        'proctor': ['Live Monitoring', 'Recording Issues', 'Authentication Problems', 'Browser Lockdown'],
        'questionbank': ['Question Creation', 'Question Import/Export', 'Category Management', 'Search Functionality'],
        'role': ['Role Assignment', 'Permission Management', 'Access Control', 'Role Creation'],
        'student': ['Student Registration', 'Profile Management', 'Progress Tracking', 'Communication'],
        'user': ['User Management', 'Account Settings', 'Login Issues', 'Profile Updates'],
        'video': ['Video Upload', 'Video Playback', 'Streaming Issues', 'Video Quality']
    };

    const getFeatureIcon = (category) => {
        const iconMap = {
            'analysis': Settings,
            'batch': Users,
            'certificate': Award,
            'code': Code,
            'exam': BookOpen,
            'proctor': Eye,
            'questionbank': Database,
            'role': UserCheck,
            'student': User,
            'user': User,
            'video': Play
        };
        return iconMap[category] || HelpCircle;
    };

    const formatFeatureValue = (feature) => {
        if (typeof feature?.value === 'boolean') {
            return feature.value ? 'Enabled' : 'Disabled';
        }
        return feature?.value?.toString() || 'N/A';
    };

    const activeFeatures = useMemo(() => {
        if (!featuresAvailable) return [];
        return Object.entries(featuresAvailable)
            .filter(([_, feature]) => feature?.isActive)
            .map(([key, feature]) => {
                const IconComponent = getFeatureIcon(feature.category);
                return {
                    name: key.replace('_feature', '').replace(/([A-Z])/g, ' $1').trim(),
                    ...feature,
                    IconComponent
                };
            });
    }, [featuresAvailable]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSupportForm({
            ...supportForm,
            [name]: value
        });
        
        if (name === 'relatedFeature') {
            setShowFunctionalities(value !== '');
            setSupportForm(prev => ({
                ...prev,
                functionality: '' // Reset functionality when feature changes
            }));
        }
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        setSupportForm({
            ...supportForm,
            attachments: [...supportForm.attachments, ...files]
        });
    };

    const removeAttachment = (index) => {
        const newAttachments = supportForm.attachments.filter((_, i) => i !== index);
        setSupportForm({
            ...supportForm,
            attachments: newAttachments
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Support form submitted:', supportForm);
        // Handle form submission here
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-indigo-600 text-white py-12">
                <div className="mx-auto px-6">
                    <h1 className="text-3xl font-bold mb-4">Support Center</h1>
                    <p className="text-indigo-100 text-lg">We're here to help you get the most out of your platform</p>
                </div>
            </div>

            <div className=" mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Information */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
                            
                            {/* User Details */}
                            {PersonalDetails && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-medium text-gray-700 mb-3">Your Account</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <User className="w-4 h-4 mr-2 text-indigo-600" />
                                            {PersonalDetails[0]?.name || 'Not provided'}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Mail className="w-4 h-4 mr-2 text-indigo-600" />
                                            {PersonalDetails[1]?.email || 'Not provided'}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Contact Methods */}
                            <div className="space-y-4">
                                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                    <Mail className="w-5 h-5 text-indigo-600 mr-3" />
                                    <div>
                                        <div className="font-medium text-gray-900">Email Support</div>
                                        <div className="text-sm text-gray-600">support@platform.com</div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                    <Phone className="w-5 h-5 text-indigo-600 mr-3" />
                                    <div>
                                        <div className="font-medium text-gray-900">Phone Support</div>
                                        <div className="text-sm text-gray-600">+1 (555) 123-4567</div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                    <MessageCircle className="w-5 h-5 text-indigo-600 mr-3" />
                                    <div>
                                        <div className="font-medium text-gray-900">Live Chat</div>
                                        <div className="text-sm text-gray-600">Available 24/7</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Active Features */}
                        {activeFeatures.length > 0 && (
                            <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Active Features</h2>
                                <div className="space-y-3">
                                    {activeFeatures.map((feature, index) => {
                                        const IconComponent = feature.IconComponent;
                                        return (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center">
                                                    <IconComponent className="w-4 h-4 text-indigo-600 mr-3" />
                                                    <span className="font-medium text-gray-900 capitalize">
                                                        {feature.name}
                                                    </span>
                                                </div>
                                                <span className="text-sm text-gray-600">
                                                    {formatFeatureValue(feature)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Support Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Submit a Support Request</h2>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={supportForm.subject}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                        placeholder="Brief description of your issue"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                                        Priority Level
                                    </label>
                                    <select
                                        id="priority"
                                        name="priority"
                                        value={supportForm.priority}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                    >
                                        <option value="low">Low - General inquiry</option>
                                        <option value="medium">Medium - Feature issue</option>
                                        <option value="high">High - Service disruption</option>
                                        <option value="urgent">Urgent - Critical system issue</option>
                                    </select>
                                </div>

                                {/* Feature Selection */}
                                <div>
                                    <label htmlFor="relatedFeature" className="block text-sm font-medium text-gray-700 mb-2">
                                        Related Feature (Optional)
                                    </label>
                                    <select
                                        id="relatedFeature"
                                        name="relatedFeature"
                                        value={supportForm.relatedFeature}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                    >
                                        <option value="">Select a feature (if applicable)</option>
                                        {activeFeatures.map((feature, index) => (
                                            <option key={index} value={feature.category}>
                                                {feature.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Functionality Selection */}
                                {showFunctionalities && supportForm.relatedFeature && (
                                    <div>
                                        <label htmlFor="functionality" className="block text-sm font-medium text-gray-700 mb-2">
                                            Specific Functionality
                                        </label>
                                        <select
                                            id="functionality"
                                            name="functionality"
                                            value={supportForm.functionality}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                        >
                                            <option value="">Select the specific functionality</option>
                                            {featureFunctionalities[supportForm.relatedFeature]?.map((func, index) => (
                                                <option key={index} value={func}>
                                                    {func}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={supportForm.message}
                                        onChange={handleInputChange}
                                        rows={6}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                        placeholder="Please describe your issue in detail..."
                                        required
                                    />
                                </div>

                                {/* File Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Attachments (Optional)
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600 mb-2">
                                            Upload screenshots, videos, or documents to help us understand your issue
                                        </p>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                                        >
                                            <Paperclip className="w-4 h-4 mr-2" />
                                            Choose Files
                                        </label>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Max file size: 10MB. Supported: Images, Videos, PDF, DOC, TXT
                                        </p>
                                    </div>

                                    {/* Display uploaded files */}
                                    {supportForm.attachments.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            <p className="text-sm font-medium text-gray-700">Uploaded Files:</p>
                                            {supportForm.attachments.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center">
                                                        <Paperclip className="w-4 h-4 text-gray-500 mr-2" />
                                                        <span className="text-sm text-gray-700">{file.name}</span>
                                                        <span className="text-xs text-gray-500 ml-2">
                                                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeAttachment(index)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200 flex items-center justify-center"
                                >
                                    <Send className="w-4 h-4 mr-2" />
                                    Submit Support Request
                                </button>
                            </form>
                        </div>

                        {/* FAQ Section */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
                            <div className="space-y-4">
                                <div className="border-b border-gray-200 pb-4">
                                    <h3 className="font-medium text-gray-900 mb-2">How do I reset my password?</h3>
                                    <p className="text-sm text-gray-600">You can reset your password by clicking the "Forgot Password" link on the login page.</p>
                                </div>
                                
                                <div className="border-b border-gray-200 pb-4">
                                    <h3 className="font-medium text-gray-900 mb-2">How can I upgrade my plan features?</h3>
                                    <p className="text-sm text-gray-600">Contact our sales team or visit the billing section in your account settings to upgrade your plan.</p>
                                </div>
                                
                                <div className="border-b border-gray-200 pb-4">
                                    <h3 className="font-medium text-gray-900 mb-2">What are the system requirements?</h3>
                                    <p className="text-sm text-gray-600">Our platform works on all modern browsers. For optimal performance, we recommend Chrome, Firefox, or Safari.</p>
                                </div>
                                
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">How do I contact technical support?</h3>
                                    <p className="text-sm text-gray-600">You can reach us via email, phone, or live chat. Response times vary based on your plan and issue priority.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactUsComponent