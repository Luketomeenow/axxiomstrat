import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { BrandGuidelinesPage } from './pages/BrandGuidelinesPage'
import { DocumentPage } from './pages/DocumentPage'
import { HomePage } from './pages/HomePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/brandguidelines" element={<BrandGuidelinesPage />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/doc/:slug" element={<DocumentPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
