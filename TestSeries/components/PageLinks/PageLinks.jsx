import React, { Children, useEffect, useState } from 'react';
import { BrowserRouter,HashRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
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
import InstituteLandingPage from '../../features/afterAuth/components/InstituteSide/components/LandingPage/InstituteLandingPage';
import AuthRoutes from '../../routes/AuthRoutes';
import StudentLayout from '../../layouts/StudentLayout';
import UpcomingExam from '../../features/afterAuth/components/StudentSide/UpcomingExams/UpcomingExam';
import StudentListPage from '../../features/afterAuth/components/InstituteSide/StudentListComponent';
import CreateExam from '../../features/afterAuth/components/InstituteSide/ExamFlow/ExamCreationControll/CreateExam';
import ExamListPage from '../../features/afterAuth/components/InstituteSide/ExamListPage';
import ResultsPage from '../../features/afterAuth/components/StudentSide/CompletedExams/ResultsPage';
import TestWindow from '../../features/Test/TestWindow';
import BatchViewPage from '../../features/afterAuth/components/InstituteSide/ViewPages/BatchViewPage';
import ResultDetailPage from '../../features/afterAuth/components/StudentSide/CompletedExams/DetailedResultPage';
import StudentRoutes from '../../routes/StudentRoutes';
import InstituteRoutes from '../../routes/InstituteRoutes';
import LandingRoutes from '../../routes/LandingRoutes';
import VideoDisplay from '../../features/Video/VideoDisplay';
import UploadVideo from '../../features/Video/UploadVideo';
import EditBatchPage from '../../features/afterAuth/components/InstituteSide/EditPages/EditBatchPage';
import StudentViewPage from '../../features/afterAuth/components/InstituteSide/ViewPages/StudentViewPage';
import StudentEditPage from '../../features/afterAuth/components/InstituteSide/EditPages/EditStudentPage';
import UserViewPage from '../../features/afterAuth/components/InstituteSide/ViewPages/UserViewPage';
import EditUserPage from '../../features/afterAuth/components/InstituteSide/EditPages/EditUserPage';
import SyllabusViewPage from '../../features/afterAuth/components/InstituteSide/ViewPages/SyllabusViewPage';
import YoutubeConnection from '../../features/Video/YoutubeConnection';
import CodingPlatform from '../../features/Test/CodeEditor/CodingPlatform';
import QuestionCreator from '../../features/Test/CodeEditor/codeCreator/QuestionCreator';
import CreateContest from '../../features/afterAuth/components/InstituteSide/CreateContest';
import ContestList from '../../features/afterAuth/components/InstituteSide/ContestList';
import ContestListPage from '../../features/afterAuth/components/StudentSide/Coding-Contests/ContestListPageStudent';
import VideoListPageInstitute from '../../features/Video/VideoListPageInstitute';
import StudentClassroom from '../../features/afterAuth/components/StudentSide/Landing/StudentClassroom';
import ContestInstructionWindow from '../../features/afterAuth/components/StudentSide/Coding-Contests/ContestInstructionWindow';
import Analysis from '../../features/Analytics/Analysis';
import PageAccessGuard from '../ProtectedRoute/PageAccessGuard';
import FallBackPage from '../../features/auth/pages/FallBackPage';
import FallBackPageForOrg from '../../features/afterAuth/pages/FallBackPageForOrg';
import Loader from '../Loader/Loader';
import YourPlanPage from '../../features/afterAuth/components/InstituteSide/components/PlanPage/YourPlanPage';
import AboutPage from '../../features/beforeAuth/pages/AboutPage';
import ContactPage from "../../features/beforeAuth/pages/ContactPage";
import ProctorSplash from '../../features/afterAuth/components/StudentSide/Landing/ProctorSplash';
import ProfilePage from '../../features/UserProfile/ProfilePage';
import ContestRegistrationPage from '../../features/afterAuth/components/StudentSide/Coding-Contests/Registration/ContestRegistrationPage';
import RegisteredAndScheduledContestPage from '../../features/afterAuth/components/StudentSide/Coding-Contests/RegisteredAndScheduled/RegisteredAndScheduledContestPage';
import LiveContestPage from '../../features/afterAuth/components/StudentSide/Coding-Contests/LiveContest/LiveContestPage';
import LeaderBoard from '../../features/afterAuth/components/StudentSide/Coding-Contests/contestResult/LeaderBoard';
import ExamAnomalyControlSection from '../../features/afterAuth/components/InstituteSide/ExamFlow/ExamAnomalyControl/ExamAnomalyControlSection';
import QBMS from '../../features/afterAuth/components/InstituteSide/QuestionBankManagementSystem/QBMS';
import AppDownloadPage from '../../features/App/AppDownloadPage';
import CertificateAssignment from '../../features/afterAuth/components/InstituteSide/Certificate_Assignment/CertificateAssignment';

let Router = window.electronAPI ? HashRouter : BrowserRouter;

// Error Boundary Component
class ElectronErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Electron Handler Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red' }}>
          <h3>Electron Integration Error</h3>
          <p>The app is running in web mode. Electron features are disabled.</p>
          <details>
            <summary>Error Details</summary>
            <pre>{this.state.error?.toString()}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

// Component to handle Electron-specific logic
const ElectronHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    // Check if running in Electron
    const checkElectronEnvironment = () => {
      if (window.electronAPI) {
         Router =  HashRouter;
        console.log('🔧 Running in Electron environment');
        setIsElectron(true);
        return true;
      } else {
        Router = BrowserRouter;
        console.log('🌐 Running in web browser');
        setIsElectron(false);
        return false;
      }
    };

    if (checkElectronEnvironment()) {
      // Setup Electron-specific functionality
      const setupElectronListeners = () => {
        try {
          // Listen for exam parameters from main process
          const handleExamParameters = (event, params) => {
            console.log('📨 Received exam parameters:', params);
            
            if (params.userId && params.examId) {
              console.log('🎯 Exam Parameters:', {
                userId: params.userId,
                examId: params.examId,
                eventId: params.eventId,
                route: params.route
              });

              // Navigate to the appropriate route if specified
              if (params.route) {
                navigate(params.route);
              } else {
                // Default navigation for exam
                navigate('/student/proctor-splash');
              }
            }
          };

          // Set up the listener
          window.electronAPI.onExamParameters(handleExamParameters);

          // Get URL parameters if available
          window.electronAPI.getURLParams().then(urlParams => {
            if (urlParams) {
              console.log('🔗 URL Parameters:', urlParams);
              handleExamParameters(null, urlParams);
            }
          }).catch(error => {
            console.warn('Failed to get URL params:', error);
          });

          // Cleanup listener on component unmount
          return () => {
            if (window.electronAPI.removeAllListeners) {
              window.electronAPI.removeAllListeners('protocol-url-received');
            }
          };
        } catch (error) {
          console.error('Error setting up Electron listeners:', error);
          return () => {}; // Return empty cleanup function
        }
      };

      return setupElectronListeners();
    }

    // Return empty cleanup function for non-Electron environments
    return () => {};
  }, [navigate, setUser]);

  // Log current environment
  useEffect(() => {
    console.log(`🔍 Environment: ${isElectron ? 'Electron' : 'Web Browser'}`);
    
    // Set global flag for other components to check
    window.isElectronApp = isElectron;
  }, [isElectron]);

  return null; // This component doesn't render anything
};

// Protocol Handler Hook
export const useElectronProtocol = () => {
  const [protocolData, setProtocolData] = useState(null);
  
  useEffect(() => {
    if (window.electronAPI) {
      const handleProtocolData = (event, data) => {
        setProtocolData(data);
      };
      
      window.electronAPI.onExamParameters(handleProtocolData);
      
      return () => {
        if (window.electronAPI.removeAllListeners) {
          window.electronAPI.removeAllListeners('protocol-url-received');
        }
      };
    }
  }, []);
  
  return protocolData;
};

const PageLinks = () => {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [isElectronEnvironment, setIsElectronEnvironment] = useState(false);
  
  console.log('User in PageLinks:', user);

  useEffect(() => {
    // Check if we're in Electron
    setIsElectronEnvironment(!!window.electronAPI);
  }, []);

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
    // Only check localStorage if we're not in Electron or if Electron allows it
    const hasLoggedIn = isElectronEnvironment ? 
      false : // In Electron, always fetch user fresh
      localStorage.getItem('hasLoggedIn') === 'true';
      
    if (!user && hasLoggedIn) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [user, isElectronEnvironment]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <Loader />
        {isElectronEnvironment && (
          <p style={{ marginTop: '10px', color: '#666' }}>
            Starting Electron App...
          </p>
        )}
      </div>
    );
  }

  return (
    <Router>
      <ElectronErrorBoundary>
        <ElectronHandler />
      </ElectronErrorBoundary>
      
      <Routes>
        {/* Before auth Landing Routes */}
        <Route element={<BeforeAuthLayout />}>
          <Route path="/" element={<LandingRoutes />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path='/institute-registration' element={<InstituteRegistrationPage />} />
          <Route path='/login' element={<LoginMainPage />} />
          <Route path='*' element={<FallBackPage />} />
        </Route>

        {/* Authenticated Institute Routes */}
        <Route element={<AuthRoutes />}>
          <Route element={<AfterAuthLayout />}>
            <Route element={
              <PageAccessGuard>
                <InstituteRoutes />
              </PageAccessGuard>
            }>
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
               
                <Route path='exam-anomaly' element={<ExamAnomalyControlSection/>}/>
                <Route path='institute-landing' element={<InstituteLandingPage />} />
                <Route path='batch-details' element={<BatchViewPage />} />
                <Route path='edit-batch' element={<EditBatchPage />} />
                <Route path='video' element={<YoutubeConnection />} />
                <Route path='video-list' element={<VideoListPageInstitute />} />
                <Route path='create-contest/:contestId?' element={<CreateContest />} />
                <Route path='contest-list' element={<ContestList />} />
                <Route path='code-create' element={<QuestionCreator />} />
                <Route path='video/upload' element={<UploadVideo />} />
                <Route path='syllabus/:syllabusId' element={<SyllabusViewPage />} />
                <Route path='certificate-assignment' element={<CertificateAssignment/>}/>
                {user?.role === "organization" && (
          <Route path='institute-subscription' element={<YourPlanPage />} />
        )}
                <Route path='*' element={<FallBackPageForOrg />} />
                
              </Route>
            </Route>

            {/* Student Routes */}
            <Route element={<StudentRoutes />}>
              <Route path='/student' element={<StudentLayout />}>
                <Route path='student-landing' element={<StudentLanding />} />
                <Route path='upcoming-exams' element={<UpcomingExam />} />
                <Route path='completed-exams' element={<ResultsPage />} />
                <Route path='result/:examId' element={<ResultDetailPage />} />
                <Route path='test' element={<TestWindow />} />
                <Route path="proctor-splash" element={<ProctorSplash />} />
                <Route path='coding-contests' element={<ContestListPage />} />
                <Route path='classroom' element={<StudentClassroom />} />
                <Route path='contest/:contestId' element={<ContestInstructionWindow />} />
                <Route path='code/:contestId' element={<CodingPlatform />} />
                <Route path='analysis' element={<Analysis />} />
                <Route path='register-contest' element={<ContestRegistrationPage/>}/>
                <Route path='registered-contest' element={<RegisteredAndScheduledContestPage/>}/>
                <Route path='live-contest' element={<LiveContestPage/>}/>
                <Route path='leader-board' element={<LeaderBoard/>}/>
                <Route path='*' element={<div>Invalid path</div>} />
              </Route>
            </Route>
          </Route>
        </Route>

        {/* Top-level routes */}
        
        <Route path='session-expired' element={<SessionExpireError />} />
         <Route path='download-app' element={<AppDownloadPage/>}/>
        <Route path='qbms/:id' element={<QBMS/>}/>
        {
          ( user?.role === 'user' || user?.role === 'student' ) && (
            <Route path='edit-profile/:id' element={<ProfilePage/>}/>
          )
        }
      </Routes>
    </Router>
  );
};

export default PageLinks;