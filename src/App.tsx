import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import CareerGoalsPage from './pages/CareerGoalsPage';
import CareerAdvicePage from './pages/CareerAdvicePage';
import ResumeUploadPage from './pages/ResumeUploadPage';
import MockInterviewPage from './pages/MockInterviewPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Navigation />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/signup" element={<SignupPage />} />
              <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/career-goals" element={
                <ProtectedRoute>
                  <CareerGoalsPage />
                </ProtectedRoute>
              } />
              <Route path="/career-advice" element={
                <ProtectedRoute>
                  <CareerAdvicePage />
                </ProtectedRoute>
              } />
              <Route path="/resume-upload" element={
                <ProtectedRoute>
                  <ResumeUploadPage />
                </ProtectedRoute>
              } />
              <Route path="/mock-interview" element={
                <ProtectedRoute>
                  <MockInterviewPage />
                </ProtectedRoute>
              } />
              
              {/* Redirect unknown routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;