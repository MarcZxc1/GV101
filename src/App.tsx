import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell.tsx'
import { LandingPage } from './pages/LandingPage.tsx'
import { MarketplacePage } from './pages/MarketplacePage.tsx'
import { ProviderProfilePage } from './pages/ProviderProfilePage.tsx'
import { BookingCheckoutPage } from './pages/BookingCheckoutPage.tsx'
import { CustomerDashboardPage } from './pages/CustomerDashboardPage.tsx'
import { ProviderDashboardPage } from './pages/ProviderDashboardPage.tsx'
import { ReviewSubmissionPage } from './pages/ReviewSubmissionPage.tsx'
import { MessagesPage } from './pages/MessagesPage.tsx'
import { AdminDashboardPage } from './pages/AdminDashboardPage.tsx'

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/providers/:providerId" element={<ProviderProfilePage />} />
        <Route path="/book/:providerId" element={<BookingCheckoutPage />} />
        <Route path="/review/:bookingId" element={<ReviewSubmissionPage />} />
        <Route path="/messages/:bookingId" element={<MessagesPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />

        <Route path="/customer" element={<CustomerDashboardPage />} />
        <Route path="/provider" element={<ProviderDashboardPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}
