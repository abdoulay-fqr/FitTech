import React, { useState } from 'react';
import LoginComponent from '../components/LoginComponents/LoginCard';
import ForgotPasswordComponent from '../components/LoginComponents/ForgotPasswordCard';
import logo from "../assets/logo.png";
import gymBg from "../assets/gym-bg.jpg";
import Footer from '../components/Footer';

export default function LoginPage() {
  // --- 1. ÉTATS (DATA) ---
  const [currentView, setCurrentView] = useState<'login' | 'forgot'>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  // Données statiques pour le test
  const STATIC_EMAIL = "admin@gmail.com";
  const STATIC_PASSWORD = "admin123";

  // --- 2. MÉTHODES (LOGIQUE) ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = { email: "", password: "" };

    // Validation Email
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (email !== STATIC_EMAIL) {
      newErrors.email = "Your email or phone number is incorrect.";
    }

    // Validation Password
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password !== STATIC_PASSWORD) {
      newErrors.password = "Your password is incorrect.";
    }

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.password) {
      alert("Success! Welcome Admin.");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center pt-8 pb-12 relative"
      style={{ backgroundImage: `url(${gymBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-0" />

      <div className="relative z-10 mb-10">
        <img src={logo} alt="FitTech Logo" className="h-24 object-contain" />
      </div>

      {/* --- SWITCH DE COMPOSANTS --- */}
      {currentView === 'login' ? (
        <LoginComponent 
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          errors={errors}
          handleSubmit={handleSubmit}
          onForgotPassword={() => setCurrentView('forgot')}
        />
      ) : (
        <ForgotPasswordComponent 
          onBack={() => setCurrentView('login')} 
        />
      )}

      <Footer  />
    </div>
  );
}