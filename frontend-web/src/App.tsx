import React from 'react';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import FreeTrialPage from './pages/FreetrialePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/Dashboard" element={<DashboardPage />} />
        <Route path="/Freetrial" element={<FreeTrialPage />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;