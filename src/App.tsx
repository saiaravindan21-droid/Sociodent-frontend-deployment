import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import DevLogger from "@/components/DevLogger";
import { Loading } from "@/components/Loading";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppBubble from "@/components/WhatsAppBubble";

// Lazy load components
const DoctorAppointmentForm = lazy(() => import("@/components/DoctorAppointmentForm"));
const ContactDetails = lazy(() => import("@/components/ContactDetails"));

// Lazy load pages
const HomePage = lazy(() => import("@/pages/Index"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Auth = lazy(() => import("@/pages/Auth"));
const Consultation = lazy(() => import("@/pages/Consultation"));
const Marketplace = lazy(() => import("@/pages/Marketplace"));
const ProductDetails = lazy(() => import("@/pages/ProductDetails"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const About = lazy(() => import("@/pages/About"));
const DoctorPortal = lazy(() => import("@/pages/DoctorPortal"));
const AdminPortal = lazy(() => import("@/pages/AdminPortal"));
const MyProfile = lazy(() => import("@/pages/MyProfile"));
const Onboarding = lazy(() => import("@/pages/onboarding/Onboarding"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const getBasename = () =>
  process.env.NODE_ENV === "production" ? "/Sociodent-frontend-deployment/" : "/";

const App: React.FC = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter basename={getBasename()}>
          <Navbar />
          <Toaster />
          <Sonner />
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/signup" element={<Onboarding />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/my-profile" element={<MyProfile />} />
              <Route path="/consultation" element={<Consultation />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/marketplace/:productId" element={<ProductDetails />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/doctor-portal" element={<DoctorPortal />} />
              <Route path="/admin-portal" element={<AdminPortal />} />
              <Route path="/about" element={<About />} />
              <Route path="/appointment" element={<DoctorAppointmentForm />} />
              <Route path="/contact" element={<ContactDetails />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Footer />
          <WhatsAppBubble />
          {process.env.NODE_ENV === 'development' && <DevLogger />}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
