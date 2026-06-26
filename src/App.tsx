import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";

// Layouts
import { MainLayout } from "@/components/layout/MainLayout";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import SetupWizard from "./pages/SetupWizard";
import Dashboard from "./pages/Dashboard";
import Billing from "./pages/Billing";
import SareeMaster from "./pages/SareeMaster";
import BillHistory from "./pages/BillHistory";
import HoldBill from "./pages/HoldBill";
import CustomerManagement from "./pages/CustomerManagement";
import Inventory from "./pages/Inventory";
import StockAdjustment from "./pages/StockAdjustment";
import PurchaseEntry from "./pages/PurchaseEntry";
import SupplierManagement from "./pages/SupplierManagement";
import PurchaseReturn from "./pages/PurchaseReturn";
import ReturnsExchange from "./pages/ReturnsExchange";
import OrderBooking from "./pages/OrderBooking";
import DueManagement from "./pages/DueManagement";
import Expenses from "./pages/Expenses";
import StaffManagement from "./pages/StaffManagement";
import Reports from "./pages/Reports";
import GstReports from "./pages/GstReports";
import WhatsappMessenger from "./pages/WhatsappMessenger";
import Settings from "./pages/Settings";
import BarcodeGenerator from "./pages/BarcodeGenerator";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { BackupRestore } from "./pages/BackupRestore";
import { DataMigration } from "./pages/DataMigration";

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
        <Route path="/bill-history" element={<BillHistory />} />
        <Route path="/hold-bills" element={<HoldBill />} />
        <Route path="/customers" element={<CustomerManagement />} />
        <Route path="/dues" element={<DueManagement />} />
        <Route path="/products" element={<SareeMaster />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/stock-adjustment" element={<StockAdjustment />} />
        <Route path="/purchase" element={<PurchaseEntry />} />
        <Route path="/suppliers" element={<SupplierManagement />} />
        <Route path="/purchase-return" element={<PurchaseReturn />} />
        <Route path="/returns" element={<ReturnsExchange />} />
        <Route path="/orders" element={<OrderBooking />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/staff" element={<StaffManagement />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/gst-reports" element={<GstReports />} />
        <Route path="/whatsapp" element={<WhatsappMessenger />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/barcode-generator" element={<BarcodeGenerator />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/backup" element={<BackupRestore />} />
        <Route path="/migration" element={<DataMigration />} />
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
        <DataProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </DataProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
