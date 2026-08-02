import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/index.jsx'
import ToastProvider from './context/ToastContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <RouterProvider router={router}></RouterProvider>
    </ToastProvider>
  </StrictMode>,
)