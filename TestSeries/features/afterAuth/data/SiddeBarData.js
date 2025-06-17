import BatchLogo from '../../../assests/Navigator/Batch.svg';
import ActiveBatch from '../../../assests/Navigator/activeBatch.svg';
import { User } from 'lucide-react';

export const controls = [
    {
        name: "All Batches",
        path: 'batch-list',
        icon: BatchLogo, 
        activeIcon: ActiveBatch
    },
    {
        name: "User Details",
        path: "user-list",
        icon: BatchLogo, 
        activeIcon: ActiveBatch
    },
    {
        name: "Add User",
        path: "create-user",
        icon: BatchLogo, 
        activeIcon: ActiveBatch
    },
    {
        name: "Create Batch",
        path: "create-batch",
        icon: BatchLogo, 
        activeIcon: ActiveBatch
    },
    {
        name: "Create Role Group",
        path: "create-role-group",
        icon: BatchLogo, 
        activeIcon: ActiveBatch
    },
    {
        name: "Add Student",
        path: "add-student",
        icon: BatchLogo, 
        activeIcon: ActiveBatch
    },
    {
        name: "Student List",
        path: "student-list",
        icon: BatchLogo, 
        activeIcon: ActiveBatch
    },
    {
        name: "Create Exams",
        path: "create-exam",
        icon: BatchLogo, 
        activeIcon: ActiveBatch
    },
    {
        name: "Exam List Page",
        path: "exam-list",
        icon: BatchLogo, 
        activeIcon: ActiveBatch
    },
    {
        name: "Upload videos",
        path: "video",
        icon: BatchLogo, 
        activeIcon: ActiveBatch
    },
    {
        name: "Uploaded Videos",
        path: "video-list",
        icon: BatchLogo, 
        activeIcon: ActiveBatch
    },
    {
        name: "Create Contest",
        path: "create-contest",
        icon: BatchLogo, 
        activeIcon: ActiveBatch
    },
    {
        name: "Contest list",
        path: "contest-list",
        icon: BatchLogo, 
        activeIcon: ActiveBatch
    }
];


export const categories = [
  {
    name: 'Users & Roles',
    icon: User,
    features: [
      'User Details',
      'Add User',
      'Create Role Group'
    ]
  },
  {
    name: 'Batches',
    icon: User,
    features: [
      'All Batches',
      'Create Batch'
    ]
  },
  {
    name: 'Students',
    icon: User,
    features: [
      'Add Student',
      'Student List'
    ]
  },
  {
    name: 'Exams',
    icon: User,
    features: [
      'Create Exams',
      'Exam List Page'
    ]
  },
  {
    name: 'Videos',
    icon: User,
    features: [
      'Upload videos',
      'Uploaded Videos'
    ]
  },
  {
    name: 'Contests',
    icon: User,
    features: [
      'Create Contest',
      'Contest list'
    ]
  }
];
