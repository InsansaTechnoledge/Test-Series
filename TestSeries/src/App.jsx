import React from 'react'
import PageLinks from '../components/PageLinks/PageLinks'
import { UserProvider } from '../contexts/currentUserContext'
import { QueryClientProvider ,QueryClient} from '@tanstack/react-query'
import ErrorBoundary from '../features/afterAuth/components/ErrorBoundry/ErrorBoundry'
import { DockProvider } from '../features/afterAuth/components/Navbar/context/DockContext'

const App = () => {
  return (
    <ErrorBoundary>
      <DockProvider>
        <UserProvider > 
            <QueryClientProvider client={new QueryClient()}>
          <PageLinks/>
          </QueryClientProvider>
        </UserProvider>
      </DockProvider>
    </ErrorBoundary>
  )
}

export default App
