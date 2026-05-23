import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CoachHomePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Welcome back, Coach 👋</h1>
      <p className="text-gray-500 mb-8">You are logged in as COACH</p>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
      >
        Log Out
      </button>
    </div>
  );
}