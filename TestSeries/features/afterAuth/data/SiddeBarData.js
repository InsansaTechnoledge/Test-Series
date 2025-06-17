import { icons, User } from 'lucide-react'

export const controls = [
    {
        name: "All Batches",
        path: 'batch-list',
        icon: User
    },
    {
        name: "User Details",
        path: "user-list",
        icon: User
    },
    {
        name: "Add User",
        path: "create-user",
        icon: User
    },
    {
        name: "Create Batch",
        path: "create-batch",
        icon: User
    },
    {
        name: "Create Role Group",
        path: "create-role-group",
        icon: User
    },
    {
        name: "Add Student",
        path: "add-student",
        icon: User
    },
    {
        name: "Student List",
        path: "student-list",
        icon: User
    },
    {
        name: "Create Exams",
        path: "create-exam",
        icon: User
    },
    {
        name: "Exam List Page",
        path: "exam-list",
        icon: User
    },
    {
        name: "Upload videos",
        path : "video",
        icon: User
    },
    {
        name: "Uploaded Videos",
        path: "video-list",
        icon: User
    },
    {
        name: "create Contest",
        path: "create-contest",
        icon: User
    },
    {
        name: "contest list",
        path: "contest-list",
        icon: User
    }
]



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
      'create Contest',
      'contest list'
    ]
  }
];
