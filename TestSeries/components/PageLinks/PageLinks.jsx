import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BeforeAuthLanding from '../../features/beforeAuth/BeforeAuthLanding';
import BeforeAuthLayout from '../../layouts/BeforeAuthLayout';
import AuthLayout from '../../layouts/authLayout';
import InstituteLoginPage from '../../features/auth/pages/InstituteRegistrationPage';

const PageLinks = () => {
  return (
    <Router>
      <Routes>
        {/* Routes with BeforeAuthLayout */}
        <Route element={<BeforeAuthLayout />}>
          <Route path="/" element={<BeforeAuthLanding />} />
        </Route>

        {/* Routes with AuthLayout */}
        <Route element={<AuthLayout />}>
          <Route path="/institute-registration" element={<InstituteLoginPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default PageLinks;
