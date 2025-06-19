import { 
    Users, UserPlus, Shield, Database, Calendar, FileText, 
    Award, Eye, Clock, Mail, Video, BarChart3, Code, 
    Settings, Target, Brain, CheckCircle, AlertTriangle,
    Camera, Smartphone, Monitor, ArrowRight, Sparkles,
    GraduationCap, Building, Play, Cloud, Youtube,
    TrendingUp, PieChart, Activity, Bell, Zap, Bot,
    LineChart, Download, Filter, Upload, Table, Search,
    Wifi, Globe, MessageSquare, Star, Bookmark
  } from 'lucide-react';
  
// Categories
export const categories = [
    { title: "All", color: "from-indigo-600 to-indigo-600" },
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
      icon: Users,
      category: 'Organization',
      tier: 'Pro'
    },
    {
      title: 'Faculty Management',
      description: 'Add and manage all organizational faculty members with ease',
      icon: UserPlus,
      category: 'Organization',
      tier: 'Basic'
    },
    {
      title: 'Complete RBAC System',
      description: 'Full Role-Based Access Control with granular permissions',
      icon: Shield,
      category: 'Organization',
      tier: 'Pro'
    },
    {
      title: 'Student Data Management',
      description: 'Comprehensive student database with batch-wise grouping',
      icon: Database,
      category: 'Organization',
      tier: 'Basic'
    },
    {
      title: 'CSV Bulk Upload',
      description: 'Upload thousands of users and data through CSV files with validation',
      icon: Upload,
      category: 'Organization',
      tier: 'Pro'
    },
    {
      title: 'Multi-Organization Support',
      description: 'Manage multiple organizations from a single dashboard',
      icon: Building,
      category: 'Organization',
      tier: 'Enterprise'
    },

    // Examination System
    {
      title: 'Advanced Exam Creation',
      description: '8 different question types with flexible scheduling options',
      icon: FileText,
      category: 'Examination',
      tier: 'Basic'
    },
    {
      title: 'Flexible Marking System',
      description: 'Positive, negative, and partial negative marking systems',
      icon: Target,
      category: 'Examination',
      tier: 'Pro'
    },
    {
      title: 'AI-Powered Proctoring',
      description: 'Advanced AI monitoring with face detection and behavior analysis',
      icon: Eye,
      category: 'Examination',
      tier: 'Enterprise'
    },
    {
      title: 'Timed Examinations',
      description: 'Comprehensive timing controls with real-time monitoring',
      icon: Clock,
      category: 'Examination',
      tier: 'Basic'
    },
    {
      title: 'Question Bank Management',
      description: 'Centralized question repository with tagging and categorization',
      icon: Database,
      category: 'Examination',
      tier: 'Pro'
    },
    {
      title: 'Automated Grading',
      description: 'AI-powered automatic grading for objective and subjective questions',
      icon: Bot,
      category: 'Examination',
      tier: 'Pro'
    },

    // Student Experience
    {
      title: 'Contest Management',
      description: 'Create coding contests and tech fests with flexible participation',
      icon: Code,
      category: 'Student Experience',
      tier: 'Pro'
    },
    {
      title: 'Automated Communications',
      description: 'Automatic result emails to parents and certificate generation',
      icon: Mail,
      category: 'Student Experience',
      tier: 'Basic'
    },
    {
      title: 'Video Management',
      description: 'Upload to YouTube or use cloud-based service with complete management',
      icon: Video,
      category: 'Student Experience',
      tier: 'Pro'
    },
    {
      title: 'Detailed Exam Analysis',
      description: 'Comprehensive exam analytics and performance insights',
      icon: PieChart,
      category: 'Student Experience',
      tier: 'Pro'
    },
    {
      title: 'Certificate Generation',
      description: 'Automated certificate generation with custom templates',
      icon: Award,
      category: 'Student Experience',
      tier: 'Pro'
    },
    {
      title: 'Mobile App Support',
      description: 'Native mobile applications with offline capabilities',
      icon: Smartphone,
      category: 'Student Experience',
      tier: 'Basic'
    },

    // Analytics & Automation
    {
      title: 'Advanced Analytics Dashboard',
      description: 'Real-time insights and comprehensive performance metrics',
      icon: TrendingUp,
      category: 'Analytics',
      tier: 'Pro'
    },
    {
      title: 'Automated Report Generation',
      description: 'Generate detailed reports automatically with custom templates',
      icon: Download,
      category: 'Analytics',
      tier: 'Pro'
    },
    {
      title: 'Smart Notifications',
      description: 'Intelligent notification system with automated alerts',
      icon: Bell,
      category: 'Analytics',
      tier: 'Basic'
    },
    {
      title: 'Predictive Analytics',
      description: 'AI-powered insights to predict student performance',
      icon: Brain,
      category: 'Analytics',
      tier: 'Enterprise'
    },

    {
      title: 'Data Visualization',
      description: 'Interactive charts and graphs for comprehensive analysis',
      icon: LineChart,
      category: 'Analytics',
      tier: 'Pro'
    },

    // Security & Integration
    {
      title: 'Plagiarism Detection',
      description: 'AI-powered plagiarism detection for written answers',
      icon: Search,
      category: 'Security',
      tier: 'Enterprise'
    },
    {
      title: 'API Integration',
      description: 'RESTful APIs and webhooks for seamless system integration',
      icon: Code,
      category: 'Integration',
      tier: 'Enterprise'
    },
    {
      title: 'Custom Branding',
      description: 'White-label solution with custom branding and domain',
      icon: Star,
      category: 'Integration',
      tier: 'Enterprise'
    },
    {
      title: 'Live Chat Support',
      description: '24/7 live chat support during exams with priority response',
      icon: MessageSquare,
      category: 'Integration',
      tier: 'Enterprise'
    }
  ];