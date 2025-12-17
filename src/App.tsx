import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Certifications from "./pages/Certifications";
import TeamTracker from "./pages/TeamTracker";
import DashboardLayout from "./components/layout/DashboardLayout";
import AIChatPanel from "./components/ai/AIChatPanel";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import EmployeeManagement from "./pages/admin/EmployeeManagement";
import AdminManagement from "./pages/admin/AdminManagement";
import ProjectGroups from "./pages/admin/ProjectGroups";
import EmailTemplates from "./pages/admin/EmailTemplates";

const queryClient = new QueryClient();

// Wrapper component for authenticated pages
const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  return (
    <>
      <DashboardLayout onOpenAIChat={() => setIsAIChatOpen(true)}>
        {children}
      </DashboardLayout>
      <AIChatPanel isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
            <Route path="/admin/employees" element={<AdminLayout><EmployeeManagement /></AdminLayout>} />
            <Route path="/admin/admins" element={<AdminLayout><AdminManagement /></AdminLayout>} />
            <Route path="/admin/groups" element={<AdminLayout><ProjectGroups /></AdminLayout>} />
            <Route path="/admin/email-templates" element={<AdminLayout><EmailTemplates /></AdminLayout>} />

            {/* Authenticated routes */}
            <Route
              path="/dashboard"
              element={
                <AuthenticatedLayout>
                  <Dashboard />
                </AuthenticatedLayout>
              }
            />
            <Route
              path="/courses"
              element={
                <AuthenticatedLayout>
                  <Courses />
                </AuthenticatedLayout>
              }
            />
            <Route
              path="/certifications"
              element={
                <AuthenticatedLayout>
                  <Certifications />
                </AuthenticatedLayout>
              }
            />
            <Route
              path="/team"
              element={
                <AuthenticatedLayout>
                  <TeamTracker />
                </AuthenticatedLayout>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
