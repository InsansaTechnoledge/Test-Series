import React from 'react'
import PageLinks from '../components/PageLinks/PageLinks'
import { UserProvider } from '../contexts/currentUserContext'
import { QueryClientProvider ,QueryClient} from '@tanstack/react-query'

const App = () => {
  return (
 
    <UserProvider > 
         <QueryClientProvider client={new QueryClient()}>
      <PageLinks/>
      </QueryClientProvider>
    </UserProvider>
  )
}

export default App
