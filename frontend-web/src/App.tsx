import React from "react";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AdminHomePage from "./pages/AdminHomePage";
import CoachHomePage from "./pages/CoachHomePage";
import MemberDetailsPage from "./pages/MemberDetailsPage";
import EditMemberPage from "./pages/EditMemberPage";
import AddMemberPage from "./pages/AddMemberPage";
import AdminCoachesPage from "./pages/AdminCoachesPage";
import CoachDetailsPage from "./pages/CoachDetailsPage";
import EditCoachPage from "./pages/EditCoachPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";
import EditAdminSettingsPage from "./pages/EditAdminSettingsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AddCoachPage from "./pages/AddCoachPage";
import SuperAdminSettingsPage from "./pages/SuperAdminSettingsPage";
import EditSuperAdminPasswordPage from "./pages/EditSuperAdminPasswordPage";
import AdminsPage from "./pages/AdminsPage";
import AddAdminPage from "./pages/AddAdminPage";
import AdminDetailsPage from "./pages/AdminDetailsPage";
import EditAdminPage from "./pages/EditAdminPage";

function App() {
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("id");
        window.location.href = "/login";
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                <Route path="/admin/home" element={<ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}><AdminHomePage /></ProtectedRoute>} />
                <Route path="/admin/members/new" element={<ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}><AddMemberPage onLogout={handleLogout} /></ProtectedRoute>} />
                <Route path="/admin/members/:id" element={<ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}><MemberDetailsPage onLogout={handleLogout} /></ProtectedRoute>} />
                <Route path="/admin/members/:id/edit" element={<ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}><EditMemberPage onLogout={handleLogout} /></ProtectedRoute>} />
                <Route path="/admin/coaches" element={<ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}><AdminCoachesPage /></ProtectedRoute>} />
                <Route path="/admin/coaches/new" element={<ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}><AddCoachPage onLogout={handleLogout} /></ProtectedRoute>} />
                <Route path="/admin/coaches/:id" element={<ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}><CoachDetailsPage onLogout={handleLogout} /></ProtectedRoute>} />
                <Route path="/admin/coaches/:id/edit" element={<ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}><EditCoachPage onLogout={handleLogout} /></ProtectedRoute>} />
                <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminSettingsPage onLogout={handleLogout} /></ProtectedRoute>} />
                <Route path="/admin/settings/edit" element={<ProtectedRoute allowedRoles={["ADMIN"]}><EditAdminSettingsPage onLogout={handleLogout} /></ProtectedRoute>} />

                <Route path="/coach/home" element={<ProtectedRoute allowedRoles={["COACH"]}><CoachHomePage /></ProtectedRoute>} />

                <Route path="/super-admin/settings" element={<ProtectedRoute allowedRoles={["SUPER_ADMIN"]}><SuperAdminSettingsPage onLogout={handleLogout} /></ProtectedRoute>} />
                <Route path="/super-admin/settings/password" element={<ProtectedRoute allowedRoles={["SUPER_ADMIN"]}><EditSuperAdminPasswordPage onLogout={handleLogout} /></ProtectedRoute>} />
                <Route path="/super-admin/admins" element={<ProtectedRoute allowedRoles={["SUPER_ADMIN"]}><AdminsPage onLogout={handleLogout} /></ProtectedRoute>} />
                <Route path="/super-admin/admins/new" element={<ProtectedRoute allowedRoles={["SUPER_ADMIN"]}><AddAdminPage onLogout={handleLogout} /></ProtectedRoute>} />
                <Route path="/super-admin/admins/:id" element={<ProtectedRoute allowedRoles={["SUPER_ADMIN"]}><AdminDetailsPage onLogout={handleLogout} /></ProtectedRoute>} />

                <Route path="*" element={<Navigate to="/login" replace />} />
                <Route
                    path="/super-admin/admins/:id/edit"
                    element={
                        <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
                            <EditAdminPage onLogout={handleLogout} />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

