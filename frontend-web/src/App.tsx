import React from 'react';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import FreeTrialPage from './pages/FreetrialePage';
import CoachDashboard from './pages/CoachPages/CoachDashboard';
import ClassesPage from './pages/CoachPages/ClassesPage';
import SettingsPage from './pages/CoachPages/SettingsPage';
import EditSettingsPage from './pages/CoachPages/EditSettingsPage';
import AddClassPage from './pages/CoachPages/AddClassPage';
import ClassDetailPage from './pages/CoachPages/ClassDetailPage';
import EditClassPage from './pages/CoachPages/EditClassPage';
import CoachesPage from './pages/CoachPages/CoachesPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/Dashboard" element={<DashboardPage />} />
        <Route path="/Freetrial" element={<FreeTrialPage />} />
        <Route path="/coach/dashboard" element={<CoachDashboard />} />
        <Route path="/coach/classes" element={<ClassesPage />} />
        <Route path="/coach/settings" element={<SettingsPage />} />
        <Route path="/coach/settings/edit" element={<EditSettingsPage />} />
        <Route path="/coach/add-class" element={<AddClassPage />} />
       <Route path="/coach/classes/:id" element={<ClassDetailPage />} />
       <Route path="/coach/classes/:id/edit" element={<EditClassPage />} />
       <Route path="/coach/coaches" element={<CoachesPage />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
