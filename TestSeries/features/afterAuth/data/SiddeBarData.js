import BatchLogo from '../../../assests/Navigator/batch/All batch/all batch - normal.svg';
import ActiveBatch from '../../../assests/Navigator/batch/All batch/all batch - act.svg';

import UserList from '../../../assests/Navigator/User/user list/user list - nor.svg'
import UserListActive from '../../../assests/Navigator/User/user list/user list - act.svg'

import AddUser from '../../../assests/Navigator/User/add user/add user - nor.svg'
import AddUserActive from '../../../assests/Navigator/User/add user/add user - act.svg'

import CreateBatch from '../../../assests/Navigator/batch/Create batch/create batch - normal.svg'
import CreateBatchActive from '../../../assests/Navigator/batch/Create batch/create batch - act.svg'

import RoloGroup from '../../../assests/Navigator/create role/create role - nor.svg'
import RoloGroupActive from '../../../assests/Navigator/create role/create role - act.svg'

import AddStudent from '../../../assests/Navigator/students/add students/add students - nor.svg'
import AddStudentActive from '../../../assests/Navigator/students/add students/add students - act.svg'

import StudentList from '../../../assests/Navigator/students/students list/students list - nor.svg'
import StudentListActive from '../../../assests/Navigator/students/students list/students list - act.svg'

import ExamList from '../../../assests/Navigator/exam/publish exam/publish exam - nor.svg'
import ExamListActive from '../../../assests/Navigator/exam/publish exam/publish exam - act.svg'

import CreateExam from '../../../assests/Navigator/exam/create exam/create exam - nor.svg'
import CreateExamActive from '../../../assests/Navigator/exam/create exam/create exam - act.svg'

import UploadVideo from '../../../assests/Navigator/videos/video - nor.svg'
import UploadVideoActive from '../../../assests/Navigator/videos/video - act.svg'

import VideoList from '../../../assests/Navigator/videos/list video/list video - nor.svg'
import VideoListActive from '../../../assests/Navigator/videos/list video/list video - act.svg'

import CrerateContest from '../../../assests/Navigator/code contest/code contest - nor.svg'
import CrerateContestActive from '../../../assests/Navigator/code contest/code contest - act.svg'

import CreateContestList from '../../../assests/Navigator/contest list/contest list - nor.svg'
import CreateContestListActive from '../../../assests/Navigator/contest list/contest list - act.svg'



import AllBatch from "../../../assests/Navigator/batch/batch - normal.svg"
import user from "../../../assests/Navigator/User/user - nor.svg"
import  student from "../../../assests/Navigator/students/sttudent - nor.svg"
import  exam from "../../../assests/Navigator/exam/exam - nor.svg"
import video from "../../../assests/Navigator/videos/video - nor.svg"
import  contest from "../../../assests/Navigator/code contest/code contest - nor.svg"
import { User } from 'lucide-react';

export const controlData = [
    {
        name: "Create Batch",
        path: "create-batch",
        icon: CreateBatch, 
        activeIcon: CreateBatchActive
    },
    {
        name: "All Batches",
        path: 'batch-list',
        icon: BatchLogo, 
        activeIcon: ActiveBatch
    },
    {
        name: "Add User",
        path: "create-user",
        icon: AddUser, 
        activeIcon: AddUserActive
    },
    {
        name: "User Details",
        path: "user-list",
        icon: UserList, 
        activeIcon: UserListActive
    },
    
    {
        name: "Create Role Group",
        path: "create-role-group",
        icon: RoloGroup, 
        activeIcon: RoloGroupActive
    },
    {
        name: "Add Student",
        path: "add-student",
        icon: AddStudent, 
        activeIcon: AddStudentActive
    },
    {
        name: "Student List",
        path: "student-list",
        icon: StudentList, 
        activeIcon: StudentListActive
    },
    {
        name: "Create Exams",
        path: "create-exam",
        icon: CreateExam, 
        activeIcon: CreateExamActive
    },
    {
        name: "Exam List Page",
        path: "exam-list",
        icon: ExamList, 
        activeIcon: ExamListActive
    },
    {
        name: "Upload videos",
        path: "video",
        icon: UploadVideo, 
        activeIcon: UploadVideoActive
    },
    {
        name: "Uploaded Videos",
        path: "video-list",
        icon: VideoList, 
        activeIcon: VideoListActive
    },
    {
        name: "Create Contest",
        path: "create-contest",
        icon: CrerateContest, 
        activeIcon: CrerateContestActive
    },
    {
        name: "Contest list",
        path: "contest-list",
        icon: CreateContestList, 
        activeIcon: CreateContestListActive
    }
];


export const categoryData = [
  {
    name: 'Users & Roles',
    icon: user,
    features: [
      'User Details',
      'Add User',
      'Create Role Group'
    ]
  },
  {
    name: 'Batches',
    icon: AllBatch,
    features: [
      'All Batches',
      'Create Batch'
    ]
  },
  {
    name: 'Students',
    icon: student,
    features: [
      'Add Student',
      'Student List'
    ]
  },
  {
    name: 'Exams',
    icon: exam,
    features: [
      'Create Exams',
      'Exam List Page'
    ]
  },
  {
    name: 'Videos',
    icon: video,
    features: [
      'Upload videos',
      'Uploaded Videos'
    ]
  },
  {
    name: 'Contests',
    icon: contest,
    features: [
      'Create Contest',
      'Contest list'
    ]
  }
];


export const studentControlData = [
  {
    name: "Student Landing",
    path: "student-landing",
    icon: '', activeIcon: ''
  },
  {
    name: "Upcoming Exams",
    path: "upcoming-exams",
    icon: '', activeIcon: ''
  },
  {
    name: "Exam Results",
    path: "completed-exams",
    icon: '', activeIcon: ''
  },
  {
    name: "Batch Videos",
    path: "classroom",
    icon: '', activeIcon: ''
  },
  {
    name: "Batch Notes",
    path: "",
    icon: '' , activeIcon: ''
  },
  {
    name: "New Contests",
    path: "register-contest",
    icon: '', activeIcon: ''
  },
  {
    name: "Registered Contests",
    path: "registered-contest",
    icon: '', activeIcon: ''
  },
  {
    name: "Live Contests",
    path: "live-contest",
    icon: '', activeIcon: ''
  },
  {
    name: "Analysis",
    path: "analysis",
    icon: '', activeIcon: ''
  },

];

export const studentCategoryData = [
  {
    name: "Exams",
    icon: exam,
    features: [
      "Upcoming Exams",
      "Exam Results"
    ]
  },
  {
    name: "Contests",
    icon: contest,
    features: ["New Contests", "Registered Contests", "Live Contests"]
  },
  {
    name: "Academics",
    icon: video,
    features: ["Analysis"]
  },
  {
    name: "Classroom",
    icon: exam,
    features: ["Batch Videos" , "Batch Notes" ]
  }
];
