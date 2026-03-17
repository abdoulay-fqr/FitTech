import React from 'react';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import LandingPage from './pages/LandingPage';
import AdminHomePage from './pages/AdminHomePage';
import CoachHomePage from './pages/CoachHomePage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/admin/home" element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminHomePage />
          </ProtectedRoute>
        } />
        <Route path="/coach/home" element={
          <ProtectedRoute allowedRole="COACH">
            <CoachHomePage />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
