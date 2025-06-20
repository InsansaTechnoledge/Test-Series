import React, { useEffect, useState } from 'react'
import LoginHeader from './LoginHeader'
import InstituteLoginPage from './login/InstituteLoginPage';
import StudentLoginPage from './login/StudentLoginPage';
import { useNavigate, useSearchParams } from 'react-router-dom';

const LoginMainPage = () => {
    const [loginFor, setLoginFor] = useState('Institute');
    const [searchParams] = useSearchParams();
    const role = searchParams.get('role');
    const navigate = useNavigate('Institute');

    useEffect(() => {
        if (role === 'Student' || role === 'Institute') {
            setLoginFor(role);
        }
        else {
            navigate('/login?role=Institute');
        }
    }, [role])
    
    return (
        <div>
            <LoginHeader loginFor={loginFor} />
            {
                loginFor === "Institute"
                    ?
                    <InstituteLoginPage setLoginFor={setLoginFor} />
                    :
                    <StudentLoginPage setLoginFor={setLoginFor} />
            }

        </div>
    )
}

export default LoginMainPage