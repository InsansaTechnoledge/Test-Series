import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BeforeAuthLanding from '../../features/beforeAuth/BeforeAuthLanding';
import BeforeAuthLayout from '../../layouts/BeforeAuthLayout';
import LoginForm from '../../features/auth/pages/loginForm';

const PageLinks = () => {
  return (
    <Router>
      <Routes>
        <Route element={<BeforeAuthLayout />}>
          <Route path="/" element={<BeforeAuthLanding />} />
          <Route path='/login' element={<LoginForm />} />
        </Route>

      </Routes>
    </Router>
  );
};

export default PageLinks;
