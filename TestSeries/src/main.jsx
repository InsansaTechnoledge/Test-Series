import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from '../hooks/useTheme.jsx'
import 'primereact/resources/themes/lara-light-blue/theme.css';  
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { ToastProvider } from '../utils/Toaster_new.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>

    
    <ThemeProvider>
      <App />
    </ThemeProvider>
    </ToastProvider>
  </StrictMode>,
)
