import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BeforeAuthLanding from '../../features/beforeAuth/BeforeAuthLanding';
import BeforeAuthLayout from '../../layouts/BeforeAuthLayout';
import AuthLayout from '../../layouts/authLayout';
import LoginMainPage from '../../features/auth/pages/LoginMainPage';
import InstituteRegistrationPage from '../../features/auth/pages/InstituteRegistrationPage';
import StudentHero from '../../features/afterAuth/components/StudentSide/StudentHero';
import AfterAuthLayout from '../../layouts/afterAuthLayout';
import InstituteLanding from '../../features/afterAuth/pages/InstituteLanding';
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

const PageLinks = () => {
  const { user, setUser } = useUser();

  const fetchUser = async () => {
    try {
      const response = await checkAuth();
      if (response.status === 200) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      // alert("Something went wrong while fetching user data");
      console.error('Error fetching user:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Routes with BeforeAuthLayout */}
        <Route element={<BeforeAuthLayout />}>
          <Route path="/" element={<BeforeAuthLanding />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path='/institute-registration' element={<InstituteRegistrationPage />} />
          <Route path='/login' element={<LoginMainPage />} />
        </Route>

        <Route element={<AfterAuthLayout />}>
          <Route path='/institute' element={<OrganizationLayout />}>
            <Route path='batch-list' element={<BatchList />} />
            <Route path='user-list' element={<UserList />} />
            <Route path='create-user' element={<CreateUser />} />
            <Route path='create-batch' element={<CreateBatch />} />
            <Route path='add-student' element={<CreateStudent />} />
            <Route path='create-role-group' element={<FeatureBasedRoleGroups />} />
            <Route path='add-student' element={<CreateStudent />} />
            <Route path='institute-landing' element={<InstituteLandingPage />} />
            <Route path='*' element={<div>Invalid path</div>} />
          </Route>
          <Route path='session-expired' element={<SessionExpireError />} />
          <Route path='student-landing' element={<StudentLanding />} />
        </Route>

      </Routes>
    </Router>
  );
};

export default PageLinks;
