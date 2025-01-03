import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/page";
import LandingPage from "./pages/landingPage/page";
import Register from "./pages/register/page";
import Home from "./pages/home/page";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import "./index.css";
import PublicRoute from "./components/PublicRoute";
import { AuthProvider } from "./context/AuthContext";
import { SidebarProvider } from "./components/ui/sidebar";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <SidebarProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes (accessible by unauthenticated users) */}
              <Route path="/" element={<LandingPage />} />{" "}
              {/* No need for PublicRoute here if it's public */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />
              {/* Protected Routes (accessible only by authenticated users) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>

          <Toaster />
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
