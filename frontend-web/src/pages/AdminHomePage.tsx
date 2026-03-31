import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/adminComponents/Sidebar";
import MembersPage from "./MembersPage";

export default function AdminHomePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white">
      <Sidebar onLogout={handleLogout} />

      <main className="pt-14 md:ml-[156px] md:pt-0">
        <MembersPage />
      </main>
    </div>
  );
}