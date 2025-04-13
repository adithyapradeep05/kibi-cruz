
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StrictMode } from "react";
import { ThemeProvider } from "next-themes";
import { GoalsProvider } from "./contexts/GoalsContext";
import { AuthProvider } from "./contexts/auth";
import { TutorialProvider } from "./contexts/TutorialContext";
import AnimatedBackground from "./components/AnimatedBackground";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import { useAuth } from "./contexts/auth";
import TutorialDrawer from "./components/tutorial/TutorialDrawer";
import TutorialStyles from "./components/tutorial/TutorialStyles";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/landing" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <GoalsProvider>
            <TutorialProvider>
              <BrowserRouter>
                <AnimatedBackground />
                <Routes>
                  <Route path="/landing" element={<Landing />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/" element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <TutorialDrawer />
                <TutorialStyles />
                <Toaster />
                <Sonner />
              </BrowserRouter>
            </TutorialProvider>
          </GoalsProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
);

export default App;
