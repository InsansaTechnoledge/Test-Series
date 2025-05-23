import React, { useEffect } from 'react'
import { useUser } from '../contexts/currentUserContext'
import { Outlet, useNavigate } from 'react-router-dom';

const InstituteRoutes = () => {
    const {user} = useUser();
    const navigate = useNavigate();
    useEffect(() => {
        if(!user || user.role==='student'){
            navigate('/');
        }
    },[user, navigate])

    if(!user){
        return (
            <div>Loading...</div>
        )
    }

    console.log("route", user);
    
    return (
        user && (user.role=='organization' || user.role=='user')
        ?
        <Outlet />
        :
        <div>here</div>
  )
}

export default InstituteRoutes