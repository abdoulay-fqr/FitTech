import React, { useState } from 'react';
import LoginComponent from '../components/LoginComponents/LoginCard';
import ForgotPasswordComponent from '../components/LoginComponents/ForgotPasswordCard';
import logo from "../assets/logo.png";
import gymBg from "../assets/gym-bg.jpg";
import Footer from '../components/Footer';
import { login } from "../api/auth.service";
import { useNavigate } from "react-router-dom";


export default function LoginPage() {
  // --- 1. ÉTATS (DATA) ---
  const [currentView, setCurrentView] = useState<'login' | 'forgot'>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  

  

  // --- 2. MÉTHODES (LOGIQUE) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = { email: "", password: "" };
  if (!email) newErrors.email = "Email is required.";
  if (!password) newErrors.password = "Password is required.";
  setErrors(newErrors);
  if (newErrors.email || newErrors.password) return;

  try {
    const data = await login(email, password);
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    console.log("Login successful!", data); // ✅ on verra ça dans la console
    alert("Login successful! Role: " + data.role); // ✅ popup de c
  } catch (error: any) {
    const status = error.response?.status;
   if (status === 401 || status === 403) {
      setErrors({
        email: "",
        password: "Your email or password is incorrect.",
      });
    }
  }
  };


  console.log("API URL:", process.env.REACT_APP_API_URL);
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

      {/* <Footer  /> */}
    </div>
  );
}