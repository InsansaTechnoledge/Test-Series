import React, { useEffect } from 'react'
import { useUser } from '../contexts/currentUserContext'
import { Outlet, useNavigate } from 'react-router-dom';

const StudentRoutes = () => {
    const navigate = useNavigate();
    const {user} = useUser();

    useEffect(()=>{
        if(!user || user.role!='student'){
            navigate("/");
        }
    },[user, navigate]);

    return (
        user && user.role=='student'
        ?
        <Outlet />
        :
        null
    )
}

export default StudentRoutes