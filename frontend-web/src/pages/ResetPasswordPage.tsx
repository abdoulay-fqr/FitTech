import React, { useState } from 'react';
import logo from "../assets/logo.png";
import gymBg from "../assets/gym-bg.jpg";
import ResetPasswordForm from '../components/LoginComponents/Resetpasswordform';
import SuccessCard from '../components/LoginComponents/SuccessCard';
import { useNavigate } from 'react-router-dom';

export default function ResetPasswordPage() {
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center pt-8 pb-12 relative"
      style={{ backgroundImage: `url(${gymBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-0" />
      <div className="relative z-10 mb-10">
        <img src={logo} alt="FitTech Logo" className="h-24 object-contain" />
      </div>
      <div className="relative z-10 flex flex-col md:flex-row gap-4 w-full max-w-5xl px-5 justify-center">
        {success ? (
          <SuccessCard onSignIn={() => navigate('/login')} />
        ) : (
          <ResetPasswordForm onSuccess={() => setSuccess(true)} />
        )}
      </div>
    </div>
  );
}