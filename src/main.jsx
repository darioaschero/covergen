import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider as BalancerProvider } from 'react-wrap-balancer'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BalancerProvider>
      <App />
    </BalancerProvider>
  </StrictMode>,
)
