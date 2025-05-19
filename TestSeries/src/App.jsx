import React from 'react'
import PageLinks from '../components/PageLinks/PageLinks'
import { UserProvider } from '../contexts/currentUserContext'

const App = () => {
  return (
    <UserProvider>
      <PageLinks/>
    </UserProvider>
  )
}

export default App
