  import MultiBatch from "../../../assests/Landing/SoftwareCapabilities/Multi-Batch Management.svg"
  import  FManagemnet from "../../../assests/Landing/SoftwareCapabilities/Faculty Management.svg"
  import  RBAC from "../../../assests/Landing/SoftwareCapabilities/Complete RBAC System.svg"
  import  SMangement from "../../../assests/Landing/SoftwareCapabilities/Student Data Management.svg"
  import  CSV from "../../../assests/Landing/SoftwareCapabilities/CSV Bulk Upload.svg"
  import  MOrg from "../../../assests/Landing/SoftwareCapabilities/Multi-Organization Support.svg"
  import  AdvExam from "../../../assests/Landing/SoftwareCapabilities/Advanced Exam Creation.svg"
  import  FmarkingSystem from "../../../assests/Landing/SoftwareCapabilities/Flexible Marking System.svg"
  import  AIpower from "../../../assests/Landing/SoftwareCapabilities/Al-Powered Proctoring.svg"
  import  TExam from "../../../assests/Landing/SoftwareCapabilities/Timed Examinations.svg"
  import  Que from "../../../assests/Landing/SoftwareCapabilities/Question Bank Management.svg"
  import  Automated from "../../../assests/Landing/SoftwareCapabilities/Automated Grading.svg"
  import  Contest from "../../../assests/Landing/SoftwareCapabilities/Contest Management.svg"
  import  AutoCom from "../../../assests/Landing/SoftwareCapabilities/Automated Communications.svg"
  import  VManag from "../../../assests/Landing/SoftwareCapabilities/Video Management.svg"
  import  DExam from "../../../assests/Landing/SoftwareCapabilities/Video Management.svg"
  import  CG from "../../../assests/Landing/SoftwareCapabilities/Certificate Generation.svg"
  import  MAPP from "../../../assests/Landing/SoftwareCapabilities/Mobile App Support.svg"
  import  AADash from "../../../assests/Landing/SoftwareCapabilities/Advanced Analytics Dashboard.svg"
  import  ARG from "../../../assests/Landing/SoftwareCapabilities/Automated Report Generation.svg"
  import  Snoti from "../../../assests/Landing/SoftwareCapabilities/Smart Notifications.svg"
  import  PA from "../../../assests/Landing/SoftwareCapabilities/Predictive Analytics.svg"
  import  DA from "../../../assests/Landing/SoftwareCapabilities/Data Visualization.svg"
  import  PD from "../../../assests/Landing/SoftwareCapabilities/Plagiarism Detection.svg"
  import  APII from "../../../assests/Landing/SoftwareCapabilities/API Integration.svg"
  import  CB from "../../../assests/Landing/SoftwareCapabilities/Custom Branding.svg"
  import  LiveChat from "../../../assests/Landing/SoftwareCapabilities/Live Chat Support.svg"
 
  
// Categories
export const categories = [
    { title: "All", color: "bg-indigo-600" },
    { title: "Organization", color: "from-indigo-600 to-indigo-600" },
    { title: "Examination", color: "from-indigo-600 to-indigo-600" },
    { title: "Student Experience", color: "from-indigo-600 to-indigo-600" },
    { title: "Analytics", color: "from-indigo-600 to-indigo-600" },
    { title: "Security", color: "from-indigo-600 to-indigo-600" },
    { title: "Integration", color: "from-indigo-600 to-indigo-600" }
  ];

  // Comprehensive features list combining original and new features
 export const allFeatures = [
    // Organization Management
    {
      title: 'Multi-Batch Management',
      description: 'Create and manage multiple batches with complete organizational hierarchy',
      icon: MultiBatch,
      category: 'Organization',
      tier: 'Pro'
    },
    {
      title: 'Faculty Management',
      description: 'Add and manage all organizational faculty members with ease',
      icon: FManagemnet,
      category: 'Organization',
      tier: 'Basic'
    },
    {
      title: 'Complete RBAC System',
      description: 'Full Role-Based Access Control with granular permissions',
      icon: RBAC,
      category: 'Organization',
      tier: 'Pro'
    },
    {
      title: 'Student Data Management',
      description: 'Comprehensive student database with batch-wise grouping',
      icon: SMangement,
      category: 'Organization',
      tier: 'Basic'
    },
    {
      title: 'CSV Bulk Upload',
      description: 'Upload thousands of users and data through CSV files with validation',
      icon: CSV,
      category: 'Organization',
      tier: 'Pro'
    },
    {
      title: 'Multi-Organization Support',
      description: 'Manage multiple organizations from a single dashboard',
      icon: MOrg,
      category: 'Organization',
      tier: 'Enterprise'
    },

    // Examination System
    {
      title: 'Advanced Exam Creation',
      description: '8 different question types with flexible scheduling options',
      icon: AdvExam,
      category: 'Examination',
      tier: 'Basic'
    },
    {
      title: 'Flexible Marking System',
      description: 'Positive, negative, and partial negative marking systems',
      icon: FmarkingSystem,
      category: 'Examination',
      tier: 'Pro'
    },
    {
      title: 'AI-Powered Proctoring',
      description: 'Advanced AI monitoring with face detection and behavior analysis',
      icon: AIpower,
      category: 'Examination',
      tier: 'Enterprise'
    },
    {
      title: 'Timed Examinations',
      description: 'Comprehensive timing controls with real-time monitoring',
      icon: TExam,
      category: 'Examination',
      tier: 'Basic'
    },
    {
      title: 'Question Bank Management',
      description: 'Centralized question repository with tagging and categorization',
      icon: Que,
      category: 'Examination',
      tier: 'Pro'
    },
    {
      title: 'Automated Grading',
      description: 'AI-powered automatic grading for objective and subjective questions',
      icon: Automated,
      category: 'Examination',
      tier: 'Pro'
    },

    // Student Experience
    {
      title: 'Contest Management',
      description: 'Create coding contests and tech fests with flexible participation',
      icon: Contest,
      category: 'Student Experience',
      tier: 'Pro'
    },
    {
      title: 'Automated Communications',
      description: 'Automatic result emails to parents and certificate generation',
      icon: AutoCom,
      category: 'Student Experience',
      tier: 'Basic'
    },
    {
      title: 'Video Management',
      description: 'Upload to YouTube or use cloud-based service with complete management',
      icon: VManag,
      category: 'Student Experience',
      tier: 'Pro'
    },
    {
      title: 'Detailed Exam Analysis',
      description: 'Comprehensive exam analytics and performance insights',
      icon: DExam,
      category: 'Student Experience',
      tier: 'Pro'
    },
    {
      title: 'Certificate Generation',
      description: 'Automated certificate generation with custom templates',
      icon: CG,
      category: 'Student Experience',
      tier: 'Pro'
    },
    {
      title: 'Mobile App Support',
      description: 'Native mobile applications with offline capabilities',
      icon: MAPP,
      category: 'Student Experience',
      tier: 'Basic'
    },

    // Analytics & Automation
    {
      title: 'Advanced Analytics Dashboard',
      description: 'Real-time insights and comprehensive performance metrics',
      icon: AADash,
      category: 'Analytics',
      tier: 'Pro'
    },
    {
      title: 'Automated Report Generation',
      description: 'Generate detailed reports automatically with custom templates',
      icon: ARG,
      category: 'Analytics',
      tier: 'Pro'
    },
    {
      title: 'Smart Notifications',
      description: 'Intelligent notification system with automated alerts',
      icon: Snoti,
      category: 'Analytics',
      tier: 'Basic'
    },
    {
      title: 'Predictive Analytics',
      description: 'AI-powered insights to predict student performance',
      icon: PA,
      category: 'Analytics',
      tier: 'Enterprise'
    },

    {
      title: 'Data Visualization',
      description: 'Interactive charts and graphs for comprehensive analysis',
      icon: DA,
      category: 'Analytics',
      tier: 'Pro'
    },

    // Security & Integration
    {
      title: 'Plagiarism Detection',
      description: 'AI-powered plagiarism detection for written answers',
      icon: PD,
      category: 'Security',
      tier: 'Enterprise'
    },
    {
      title: 'API Integration',
      description: 'RESTful APIs and webhooks for seamless system integration',
      icon: APII,
      category: 'Integration',
      tier: 'Enterprise'
    },
    {
      title: 'Custom Branding',
      description: 'White-label solution with custom branding and domain',
      icon: CB,
      category: 'Integration',
      tier: 'Enterprise'
    },
    {
      title: 'Live Chat Support',
      description: '24/7 live chat support during exams with priority response',
      icon: LiveChat,
      category: 'Integration',
      tier: 'Enterprise'
    }
  ];