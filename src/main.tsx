import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { authReady } from './firebase'

// Every Firestore/RTDB call happens inside the app, so gating the first render gates them all on auth.
authReady.then(() => createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
))
