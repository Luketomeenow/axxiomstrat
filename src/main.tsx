import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HubPasswordGate } from './components/HubPasswordGate'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HubPasswordGate>
      <App />
    </HubPasswordGate>
  </StrictMode>,
)
