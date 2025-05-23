import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/currentUserContext';
import BeforeAuthLanding from '../features/beforeAuth/BeforeAuthLanding';

const LandingRoutes = () => {
  const navigate = useNavigate();
    const {user} = useUser();    

    useEffect(() => {
    if (user) {
      navigate(user.role === 'student' ? '/student/student-landing' : '/institute/institute-landing');
    }
  }, [user, navigate]);

  return !user ? <BeforeAuthLanding /> : null;

};

export default LandingRoutes;
