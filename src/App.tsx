import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";

// Page imports
import HomePage from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Auth from "@/pages/Auth";
import Consultation from "@/pages/Consultation";
import Marketplace from "@/pages/Marketplace";
import ProductDetails from "@/pages/ProductDetails";
import Checkout from "@/pages/Checkout";
import About from "@/pages/About";
import DoctorPortal from "@/pages/DoctorPortal";
import AdminPortal from "@/pages/AdminPortal";
import MyProfile from "@/pages/MyProfile";

// Component imports
import WhatsAppBubble from "@/components/WhatsAppBubble";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import DoctorAppointmentForm from "@/components/DoctorAppointmentForm";
import ContactDetails from "@/components/ContactDetails";

// Onboarding
import Onboarding from "@/pages/onboarding/Onboarding";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const getBasename = () =>
  process.env.NODE_ENV === "production" ? "/socio-smile-market-23" : "/";

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter basename={getBasename()}>
        <AuthProvider>
          <Navbar />
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<Onboarding />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/consultation" element={<Consultation />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/marketplace/:productId" element={<ProductDetails />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/doctor-portal" element={<DoctorPortal />} />
            <Route path="/admin-portal" element={<AdminPortal />} />
            <Route path="/admin/login" element={<Auth />} />
            <Route path="/about" element={<About />} />
            <Route path="/appointment" element={<DoctorAppointmentForm />} />
            <Route path="/contact" element={<ContactDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <WhatsAppBubble />
          <Footer />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;