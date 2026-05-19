import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { BrandGuidelinesPage } from './pages/BrandGuidelinesPage'
import { DocumentPage } from './pages/DocumentPage'
import { HomePage } from './pages/HomePage'
import { MarketingCampaignPage } from './pages/MarketingCampaignPage'
import { MarketingVidsPromptsPage } from './pages/MarketingVidsPromptsPage'
import { VectorDbComparisonPage } from './pages/VectorDbComparisonPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/brandguidelines" element={<BrandGuidelinesPage />} />
        <Route path="/vectordbcomparison" element={<VectorDbComparisonPage />} />
        <Route path="/marketingvidsprompts" element={<MarketingVidsPromptsPage />} />
        <Route path="/marketingcampaign" element={<MarketingCampaignPage />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/doc/:slug" element={<DocumentPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
