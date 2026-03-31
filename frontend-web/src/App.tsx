import React from "react";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AdminHomePage from "./pages/AdminHomePage";
import CoachHomePage from "./pages/CoachHomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import MemberDetailsPage from "./pages/MemberDetailsPage";
import EditMemberPage from "./pages/EditMemberPage";
import AdminCoachesPage from "./pages/AdminCoachesPage";
import CoachDetailsPage from "./pages/CoachDetailsPage";
import EditCoachPage from "./pages/EditCoachPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";
import EditAdminSettingsPage from "./pages/EditAdminSettingsPage";

function App() {
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/login";
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                <Route
                    path="/admin/home"
                    element={
                        <ProtectedRoute allowedRole="ADMIN">
                            <AdminHomePage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/members/:id"
                    element={
                        <ProtectedRoute allowedRole="ADMIN">
                            <MemberDetailsPage onLogout={handleLogout} />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/members/:id/edit"
                    element={
                        <ProtectedRoute allowedRole="ADMIN">
                            <EditMemberPage onLogout={handleLogout} />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/coach/home"
                    element={
                        <ProtectedRoute allowedRole="COACH">
                            <CoachHomePage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/coaches"
                    element={
                        <ProtectedRoute allowedRole="ADMIN">
                            <AdminCoachesPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/coaches/:id"
                    element={
                        <ProtectedRoute allowedRole="ADMIN">
                            <CoachDetailsPage onLogout={handleLogout} />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/coaches/:id/edit"
                    element={
                        <ProtectedRoute allowedRole="ADMIN">
                            <EditCoachPage onLogout={handleLogout} />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/settings"
                    element={
                        <ProtectedRoute allowedRole="ADMIN">
                            <AdminSettingsPage onLogout={handleLogout} />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/settings/edit"
                    element={
                        <ProtectedRoute allowedRole="ADMIN">
                            <EditAdminSettingsPage onLogout={handleLogout} />
                        </ProtectedRoute>
                    }
                />
            </Routes>

        </BrowserRouter>
    );
}

export default App;