import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AppShell } from "./components/AppShell.tsx";
import { PageLoader } from "./components/PageLoader.tsx";
import { PageTransition } from "./components/PageTransition.tsx";

const LandingPage = lazy(() =>
  import("./pages/LandingPage.tsx").then((m) => ({ default: m.LandingPage })),
);
const MarketplacePage = lazy(() =>
  import("./pages/MarketplacePage.tsx").then((m) => ({
    default: m.MarketplacePage,
  })),
);
const ProviderProfilePage = lazy(() =>
  import("./pages/ProviderProfilePage.tsx").then((m) => ({
    default: m.ProviderProfilePage,
  })),
);
const BookingCheckoutPage = lazy(() =>
  import("./pages/BookingCheckoutPage.tsx").then((m) => ({
    default: m.BookingCheckoutPage,
  })),
);
const CustomerDashboardPage = lazy(() =>
  import("./pages/CustomerDashboardPage.tsx").then((m) => ({
    default: m.CustomerDashboardPage,
  })),
);
const ProviderDashboardPage = lazy(() =>
  import("./pages/ProviderDashboardPage.tsx").then((m) => ({
    default: m.ProviderDashboardPage,
  })),
);
const ReviewSubmissionPage = lazy(() =>
  import("./pages/ReviewSubmissionPage.tsx").then((m) => ({
    default: m.ReviewSubmissionPage,
  })),
);
const MessagesPage = lazy(() =>
  import("./pages/MessagesPage.tsx").then((m) => ({ default: m.MessagesPage })),
);
const AdminDashboardPage = lazy(() =>
  import("./pages/AdminDashboardPage.tsx").then((m) => ({
    default: m.AdminDashboardPage,
  })),
);

export default function App() {
  const location = useLocation();

  return (
    <AppShell>
      <Suspense fallback={<PageLoader />}>
        <PageTransition key={`${location.pathname}${location.search}`}>
          <Routes location={location}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route
              path="/providers/:providerId"
              element={<ProviderProfilePage />}
            />
            <Route path="/book/:providerId" element={<BookingCheckoutPage />} />
            <Route
              path="/review/:bookingId"
              element={<ReviewSubmissionPage />}
            />
            <Route path="/messages/:bookingId" element={<MessagesPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />

            <Route path="/customer" element={<CustomerDashboardPage />} />
            <Route path="/provider" element={<ProviderDashboardPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageTransition>
      </Suspense>
    </AppShell>
  );
}
