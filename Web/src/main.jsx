import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QuickstartProvider } from './context/index.tsx'
import { ThemeProvider as ThemeProviderForMUI } from './context/themeContext.jsx';
import { BudgetProvider } from './context/budgetContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BudgetProvider initTotalBudget={1000}>
      <ThemeProviderForMUI>
        <QuickstartProvider>
          <App />
        </QuickstartProvider>
      </ThemeProviderForMUI>
    </BudgetProvider>
  </StrictMode>,
)
