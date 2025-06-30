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
            
            {/* Bolt.new Badge */}
            <style>
              {`
                .bolt-badge {
                  transition: all 0.3s ease;
                }
                @keyframes badgeIntro {
                  0% { transform: rotateY(-90deg); opacity: 0; }
                  100% { transform: rotateY(0deg); opacity: 1; }
                }
                .bolt-badge-intro {
                  animation: badgeIntro 0.8s ease-out 1s both;
                }
                .bolt-badge-intro.animated {
                  animation: none;
                }
                @keyframes badgeHover {
                  0% { transform: scale(1) rotate(0deg); }
                  50% { transform: scale(1.1) rotate(22deg); }
                  100% { transform: scale(1) rotate(0deg); }
                }
                .bolt-badge:hover {
                  animation: badgeHover 0.6s ease-in-out;
                }
              `}
            </style>
            <div className="fixed bottom-4 left-4 z-50">
              <a href="https://bolt.new/?rid=os72mi" target="_blank" rel="noopener noreferrer" 
                 className="block transition-all duration-300 hover:shadow-2xl">
                <img src="https://storage.bolt.army/white_circle_360x360.png" 
                     alt="Built with Bolt.new badge" 
                     className="w-20 h-20 md:w-28 md:h-28 rounded-full shadow-lg bolt-badge bolt-badge-intro"
                     onAnimationEnd={(e) => e.currentTarget.classList.add('animated')} />
              </a>
            </div>
            
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