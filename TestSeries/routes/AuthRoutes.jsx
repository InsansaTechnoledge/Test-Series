import React from 'react'
import { useUser } from '../contexts/currentUserContext'
import { useNavigate } from 'react-router-dom';

const AuthRoutes = ({ children }) => {
    const { user } = useUser();
    const navigate = useNavigate();
    return (
        user
        ?
        {children}
        :
        navigate("/session-expired")
  )
}

export default AuthRoutes