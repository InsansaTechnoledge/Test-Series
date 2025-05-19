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

const PageLinks = () => {
  const {user,setUser} = useUser();

  const fetchUser = () => {
    try {
      const response = checkAuth();
      if (response.status === 200) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
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

        <Route element={<AfterAuthLayout/>}>
          <Route path='/institute-landing' element={<InstituteLanding />} />
          <Route path='/student-landing' element={<StudentLanding />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default PageLinks;
