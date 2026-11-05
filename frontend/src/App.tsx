import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { DigitalTwinPage } from './pages/DigitalTwinPage';
import { CareerExplorerPage } from './pages/CareerExplorerPage';
import { SkillGapPage } from './pages/SkillGapPage';
import { SimulationLabPage } from './pages/SimulationLabPage';
import { AIMentorPage } from './pages/AIMentorPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { EvolutionPage } from './pages/EvolutionPage';
import { SettingsPage } from './pages/SettingsPage';

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-full border-2 border-primary-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Layout wrapper for authenticated platform modules
const PlatformRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
};

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-slate-900 selection:bg-primary-50 selection:text-primary-700">
      <Routes>
        {/* Public Landing Page */}
        <Route
          path="/"
          element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <LandingPage />
              </main>
              <Footer />
            </div>
          }
        />

        {/* Auth Pages (Clean focused layout) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Onboarding Flow */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />

        {/* Platform Modules (Wrapped in SaaS Sidebar + Header Layout) */}
        <Route
          path="/dashboard"
          element={
            <PlatformRoute>
              <DashboardPage />
            </PlatformRoute>
          }
        />
        <Route
          path="/twin"
          element={
            <PlatformRoute>
              <DigitalTwinPage />
            </PlatformRoute>
          }
        />
        <Route
          path="/careers"
          element={
            <PlatformRoute>
              <CareerExplorerPage />
            </PlatformRoute>
          }
        />
        <Route
          path="/gaps"
          element={
            <PlatformRoute>
              <SkillGapPage />
            </PlatformRoute>
          }
        />
        <Route
          path="/simulation"
          element={
            <PlatformRoute>
              <SimulationLabPage />
            </PlatformRoute>
          }
        />
        <Route
          path="/mentor"
          element={
            <PlatformRoute>
              <AIMentorPage />
            </PlatformRoute>
          }
        />
        <Route
          path="/roadmap"
          element={
            <PlatformRoute>
              <RoadmapPage />
            </PlatformRoute>
          }
        />
        <Route
          path="/evolution"
          element={
            <PlatformRoute>
              <EvolutionPage />
            </PlatformRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PlatformRoute>
              <SettingsPage />
            </PlatformRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
