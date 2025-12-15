import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Certifications from "./pages/Certifications";
import TeamTracker from "./pages/TeamTracker";
import DashboardLayout from "./components/layout/DashboardLayout";
import AIChatPanel from "./components/ai/AIChatPanel";
import NotFound from "./pages/NotFound";

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
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

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
  </QueryClientProvider>
);

export default App;
