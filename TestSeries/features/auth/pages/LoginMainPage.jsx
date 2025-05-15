import React, { useState } from 'react'
import LoginHeader from './LoginHeader'
import InstituteLoginPage from './InstituteLogin/InstituteLoginPage';
import StudentLoginPage from './StudentLogin/StudentLoginPage';

const LoginMainPage = () => {
    const [loginFor, setLoginFor] = useState('institute');
    return (
    <div>
        <LoginHeader />
        {
            loginFor==="institute"
            ?
            <InstituteLoginPage setLoginFor={setLoginFor} />
            :
            <StudentLoginPage setLoginFor={setLoginFor}/>
        }
        
    </div>
  )
}

export default LoginMainPage