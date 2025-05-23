import React from 'react'
import { useUser } from '../contexts/currentUserContext'
import { Outlet, useNavigate } from 'react-router-dom';

const AuthRoutes = () => {
  const { user, isUserLoggedOut } = useUser();
  const navigate = useNavigate();
  return (
    user
      ?
      <Outlet />
      :
      isUserLoggedOut ?
        navigate('/')
        :
        navigate("/session-expired")
  )
}

export default AuthRoutes