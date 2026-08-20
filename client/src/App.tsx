import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Services from "./pages/Services";
import FindVets from "./pages/FindVets";
import Pets from "./pages/Pets";
import Dashboard from "./pages/Dashboard";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";

/*
 * ==========================================
 * CHECK LOGIN STATUS
 * ==========================================
 */
function isAuthenticated(): boolean {
  const token = localStorage.getItem("token");
  return Boolean(token);
}

/*
 * ==========================================
 * PROTECTED ROUTE
 * ==========================================
 */
function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <>{children}</>;
}

/*
 * ==========================================
 * PUBLIC-ONLY ROUTE
 * ==========================================
 */
function PublicOnlyRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  if (isAuthenticated()) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <>{children}</>;
}

function App() {
  const [authenticated, setAuthenticated] =
    useState(isAuthenticated());

  useEffect(() => {
    document.title =
      "Pet Vaidya | Centralized Veterinary & Pet Healthcare Platform";
  }, []);

  useEffect(() => {
    const updateAuthState = () => {
      setAuthenticated(isAuthenticated());
    };

    window.addEventListener("petVaidyaAuthChanged", updateAuthState);
    window.addEventListener("storage", updateAuthState);

    return () => {
      window.removeEventListener("petVaidyaAuthChanged", updateAuthState);
      window.removeEventListener("storage", updateAuthState);
    };
  }, []);

  const handleLogin = () => {
    window.location.href = "/login";
  };

  const handleRegister = () => {
    window.location.href = "/register";
  };

  return (
    <div className="min-h-screen bg-[#fffdf7] flex flex-col justify-between">
      <div>
        {/* NAVBAR */}
        <Navbar
          onLogin={handleLogin}
          onRegister={handleRegister}
        />

        <Routes>
          {/* ==================================
              HOME
          ================================== */}
          <Route
            path="/"
            element={
              <Home
                onLogin={handleLogin}
                onRegister={handleRegister}
              />
            }
          />

          {/* ==================================
              FIND VETERINARIANS & CONSULTANTS
          ================================== */}
          <Route
            path="/vets"
            element={<FindVets />}
          />

          {/* ==================================
              SERVICES & HOME CARE
          ================================== */}
          <Route
            path="/services"
            element={
              <Services
                onRegister={handleRegister}
              />
            }
          />

          {/* ==================================
              MY PETS & HEALTH PASSPORT
          ================================== */}
          <Route
            path="/pets"
            element={
              <ProtectedRoute>
                <Pets />
              </ProtectedRoute>
            }
          />

          {/* ==================================
              DASHBOARD
          ================================== */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* ==================================
              HOW IT WORKS
          ================================== */}
          <Route
            path="/how-it-works"
            element={<HowItWorks />}
          />

          {/* ==================================
              ABOUT
          ================================== */}
          <Route
            path="/about"
            element={
              <About
                onRegister={handleRegister}
              />
            }
          />

          {/* ==================================
              LOGIN
          ================================== */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />

          {/* ==================================
              REGISTER
          ================================== */}
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <Register />
              </PublicOnlyRoute>
            }
          />

          {/* ==================================
              FALLBACK
          ================================== */}
          <Route
            path="*"
            element={
              <Navigate
                to={authenticated ? "/" : "/login"}
                replace
              />
            }
          />
        </Routes>
      </div>

      {/* ==================================
          FOOTER
      ================================== */}
      <footer className="border-t border-slate-200 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-700">
            🐾 Pet Vaidya
            <span className="text-xs font-normal text-slate-400">
              • Centralized Pet Care & Veterinary Platform
            </span>
          </div>

          <div>
            Better care. Happier pets. © {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;