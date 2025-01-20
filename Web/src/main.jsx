import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QuickstartProvider } from './context/index.tsx'
import { ThemeProvider as ThemeProviderForMUI } from './context/themeContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProviderForMUI>
      <QuickstartProvider>
        <App />
      </QuickstartProvider>
    </ThemeProviderForMUI>
  </StrictMode>,
)
