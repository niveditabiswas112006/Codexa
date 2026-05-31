import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CrmPage from './pages/CrmPage';
import ProjectsPage from './pages/ProjectsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import BookingPage from './pages/BookingPage';
import InventoryPage from './pages/InventoryPage';
import MarketingPage from './pages/MarketingPage';
import CollaborationPage from './pages/CollaborationPage';
import HrPage from './pages/HrPage';
import RpaPage from './pages/RpaPage';
import ESignPage from './pages/ESignPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        {/* Protected Dashboard/CRM Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/crm"
          element={
            <ProtectedRoute>
              <CrmPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProjectsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <InventoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketing"
          element={
            <ProtectedRoute>
              <MarketingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/collab"
          element={
            <ProtectedRoute>
              <CollaborationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr"
          element={
            <ProtectedRoute>
              <HrPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rpa"
          element={
            <ProtectedRoute>
              <RpaPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/esign"
          element={
            <ProtectedRoute>
              <ESignPage />
            </ProtectedRoute>
          }
        />

        {/* Redirect any unknown paths to the landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
