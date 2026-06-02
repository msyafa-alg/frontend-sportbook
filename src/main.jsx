import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/index.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* mendaftarkan / menggunakan routing dari routes/index.jsx */}
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
)
