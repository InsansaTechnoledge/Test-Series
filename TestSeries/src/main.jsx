import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from '../hooks/useTheme.jsx'
import 'primereact/resources/themes/lara-light-blue/theme.css';  
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
