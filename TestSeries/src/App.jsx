import React from 'react'
import PageLinks from '../components/PageLinks/PageLinks'
import { UserProvider } from '../contexts/currentUserContext'
import { QueryClientProvider ,QueryClient} from '@tanstack/react-query'
import ErrorBoundary from '../features/afterAuth/components/ErrorBoundry/ErrorBoundry'

const App = () => {
  return (
    <ErrorBoundary>
      <UserProvider > 
          <QueryClientProvider client={new QueryClient()}>
        <PageLinks/>
        </QueryClientProvider>
      </UserProvider>
    </ErrorBoundary>
  )
}

export default App
