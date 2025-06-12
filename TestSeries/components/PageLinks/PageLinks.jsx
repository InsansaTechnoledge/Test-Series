import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BeforeAuthLanding from '../../features/beforeAuth/BeforeAuthLanding';
import BeforeAuthLayout from '../../layouts/BeforeAuthLayout';
import AuthLayout from '../../layouts/authLayout';
import LoginMainPage from '../../features/auth/pages/LoginMainPage';
import InstituteRegistrationPage from '../../features/auth/pages/InstituteRegistrationPage';
import AfterAuthLayout from '../../layouts/afterAuthLayout';
import StudentLanding from '../../features/afterAuth/pages/StudentLanding';
import { useUser } from '../../contexts/currentUserContext';
import { checkAuth } from '../../utils/services/authService';
import OrganizationLayout from '../../layouts/OrganizationLayout';
import BatchList from '../../features/afterAuth/components/InstituteSide/BatchList';
import UserList from '../../features/afterAuth/components/InstituteSide/UserList';
import CreateUser from '../../features/afterAuth/components/InstituteSide/CreateUser';
import CreateBatch from '../../features/afterAuth/components/InstituteSide/CreateBatch';
import CreateStudent from '../../features/afterAuth/components/InstituteSide/AddStudent';
import FeatureBasedRoleGroups from '../../features/afterAuth/components/InstituteSide/RoleGroup';
import SessionExpireError from '../Error/SessionExpireError';
import InstituteLandingPage from '../../features/afterAuth/components/InstituteSide/components/InstituteLandingPage';
import AuthRoutes from '../../routes/AuthRoutes';
import StudentLayout from '../../layouts/StudentLayout';
import UpcomingExam from '../../features/afterAuth/components/StudentSide/UpcomingExams/UpcomingExam';
import StudentListPage from '../../features/afterAuth/components/InstituteSide/StudentListComponent';
import CreateExam from '../../features/afterAuth/components/InstituteSide/ExamFlow/CreateExam';
import ExamListPage from '../../features/afterAuth/components/InstituteSide/ExamListPage';
import ResultsPage from '../../features/afterAuth/components/StudentSide/CompletedExams/ResultsPage';
import TestWindow from '../../features/Test/TestWindow';
import BatchViewPage from '../../features/afterAuth/components/InstituteSide/ViewPages/BatchViewPage';
import ResultDetailPage from '../../features/afterAuth/components/StudentSide/CompletedExams/DetailedResultPage';
import StudentRoutes from '../../routes/StudentRoutes';
import InstituteRoutes from '../../routes/InstituteRoutes';
import LandingRoutes from '../../routes/LandingRoutes';
import VideoDisplay from '../../features/Video/Pages/VideoDisplay';
import UploadVideo from '../../features/Video/Pages/uploadVideo';
import EditBatchPage from '../../features/afterAuth/components/InstituteSide/EditPages/EditBatchPage';
import StudentViewPage from '../../features/afterAuth/components/InstituteSide/ViewPages/StudentViewPage';
import StudentEditPage from '../../features/afterAuth/components/InstituteSide/EditPages/EditStudentPage';
import UserViewPage from '../../features/afterAuth/components/InstituteSide/ViewPages/UserViewPage';
import EditUserPage from '../../features/afterAuth/components/InstituteSide/EditPages/EditUserPage';
import SyllabusViewPage from '../../features/afterAuth/components/InstituteSide/ViewPages/SyllabusViewPage';
import YoutubeConnection from '../../features/Video/Pages/YoutubeConnection';
import CodingPlatform from '../../features/Test/CodeEditor/CodingPlatform';
import QuestionCreator from '../../features/Test/CodeEditor/codeCreator/QuestionCreator';
import CreateContest from '../../features/afterAuth/components/InstituteSide/CreateContest';
import ContestList from '../../features/afterAuth/components/InstituteSide/ContestList';

const PageLinks = () => {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await checkAuth();
      if (response.status === 200) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>; // or a spinner
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path='/institute-registration' element={<InstituteRegistrationPage />} />
          <Route path='/login' element={<LoginMainPage />} />
        </Route>

        {/* Authenticated Institute Routes */}
        <Route element={<AuthRoutes />}>
          <Route element={<AfterAuthLayout />}>
            <Route element={<InstituteRoutes />}>
              <Route path='/institute' element={<OrganizationLayout />}>
                <Route path='batch-list' element={<BatchList />} />
                <Route path='user-list' element={<UserList />} />
                <Route path='user-edit/:id' element={<EditUserPage />} />
                <Route path='user-detail' element={<UserViewPage />} />
                <Route path='create-user' element={<CreateUser />} />
                <Route path='create-batch' element={<CreateBatch />} />
                <Route path='add-student' element={<CreateStudent />} />
                <Route path='student-list' element={<StudentListPage />} />
                <Route path='student-detail' element={<StudentViewPage />} />
                <Route path='student-edit' element={<StudentEditPage />} />
                <Route path='create-role-group' element={<FeatureBasedRoleGroups />} />
                <Route path='create-exam/:examId?' element={<CreateExam />} />
                <Route path='exam-list' element={<ExamListPage />} />
                <Route path='syllabus/:syllabusId' element={<SyllabusViewPage />} />
                <Route path='institute-landing' element={<InstituteLandingPage />} />
                <Route path='batch-details' element={<BatchViewPage />} />
                <Route path='edit-batch' element={<EditBatchPage />} />
                <Route path='video' element={<YoutubeConnection />} />
                <Route path='create-contest/:contestId?' element={<CreateContest/>}/>
                <Route path='contest-list' element={<ContestList/>} />
                <Route path='*' element={<div>Invalid path</div>} />
              </Route>
            </Route>

            {/* Student Routes */}
            <Route element={<StudentRoutes />}>
              <Route path='/student' element={<StudentLayout />}>
                <Route path='student-landing' element={<StudentLanding />} />
                <Route path='upcoming-exams' element={<UpcomingExam />} />
                <Route path='completed-exams' element={ <ResultsPage />} />
                <Route path='result/:examId' element={<ResultDetailPage />} />
                <Route path='test' element={<TestWindow />} />
              </Route>
            </Route>
          </Route>
        </Route>

        {/* Before Auth Landing */}
        <Route element={<BeforeAuthLayout />}>
          <Route path="/" element={<LandingRoutes />} />
        </Route>

        {/* Top-level routes */}
        <Route path='video' element={<YoutubeConnection />} /> {/* <== Fix added! */}
        <Route path='video/upload' element={<UploadVideo />} />
        <Route path='session-expired' element={<SessionExpireError />} />
        <Route path='code' element={<CodingPlatform/>} />
        <Route path='code-create' element={<QuestionCreator/>}/>

        
      </Routes>
    </Router>
  );
};

export default PageLinks;
