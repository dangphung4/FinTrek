import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QuickstartProvider } from './context/index.tsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QuickstartProvider>
      <App />
    </QuickstartProvider>
  </StrictMode>,
)
