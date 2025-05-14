import React from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import BeforeAuthLanding from '../../features/beforeAuth/BeforeAuthLanding';

const PageLinks = () => {
  return (
    <Router>
        <Routes>
            <Route path={'/'} element={<BeforeAuthLanding />}/>
        </Routes>
    </Router>
  )
}

export default PageLinks