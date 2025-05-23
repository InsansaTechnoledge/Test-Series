import React, { useEffect } from 'react'
import { useUser } from '../contexts/currentUserContext'
import { Outlet, useNavigate } from 'react-router-dom';

const AuthRoutes = () => {
  const { user, isUserLoggedOut } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if(!user){
      if (isUserLoggedOut) {
        navigate('/');
      }
      else {
        navigate('/session-expired')
      }
    }

  }, [isUserLoggedOut, user, navigate])

  return (
    user
      ?
      <Outlet />
      :
      null
  )
}

export default AuthRoutes