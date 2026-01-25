import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Layouts
import { MainLayout } from "@/components/layout/MainLayout";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import SetupWizard from "./pages/SetupWizard";
import Dashboard from "./pages/Dashboard";
import Billing from "./pages/Billing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/setup" element={<SetupWizard />} />

      {/* Protected Routes with Main Layout */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/bill-history" element={<Dashboard />} />
        <Route path="/hold-bills" element={<Dashboard />} />
        <Route path="/customers" element={<Dashboard />} />
        <Route path="/dues" element={<Dashboard />} />
        <Route path="/products" element={<Dashboard />} />
        <Route path="/inventory" element={<Dashboard />} />
        <Route path="/stock-adjustment" element={<Dashboard />} />
        <Route path="/purchase" element={<Dashboard />} />
        <Route path="/suppliers" element={<Dashboard />} />
        <Route path="/purchase-return" element={<Dashboard />} />
        <Route path="/returns" element={<Dashboard />} />
        <Route path="/alterations" element={<Dashboard />} />
        <Route path="/orders" element={<Dashboard />} />
        <Route path="/expenses" element={<Dashboard />} />
        <Route path="/staff" element={<Dashboard />} />
        <Route path="/reports" element={<Dashboard />} />
        <Route path="/gst-reports" element={<Dashboard />} />
        <Route path="/whatsapp" element={<Dashboard />} />
        <Route path="/settings" element={<Dashboard />} />
        <Route path="/users" element={<Dashboard />} />
        <Route path="/backup" element={<Dashboard />} />
        <Route path="/customize" element={<Dashboard />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
