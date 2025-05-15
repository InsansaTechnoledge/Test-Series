import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BeforeAuthLanding from '../../features/beforeAuth/BeforeAuthLanding';
import BeforeAuthLayout from '../../layouts/BeforeAuthLayout';
import AuthLayout from '../../layouts/authLayout';
import InstituteLoginPage from '../../features/auth/pages/InstituteLoginPage';

const PageLinks = () => {
  return (
    <Router>
      <Routes>
        <Route element={<BeforeAuthLayout />}>
          <Route path="/" element={<BeforeAuthLanding />} />
        </Route>
        <Route element={<AuthLayout/>}/>
          <Route path='/institute-registration' element={<InstituteLoginPage/>}/>
        </Routes>
    </Router>
  );
};

export default PageLinks;
