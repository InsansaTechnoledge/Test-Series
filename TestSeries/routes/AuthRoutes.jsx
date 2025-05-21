import React from 'react'
import { useUser } from '../contexts/currentUserContext'
import { Outlet, useNavigate } from 'react-router-dom';

const AuthRoutes = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    return (
        user
        ?
        <Outlet />
        :
        navigate("/session-expired")
  )
}

export default AuthRoutes