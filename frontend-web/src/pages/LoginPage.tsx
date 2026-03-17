import React, { useState } from 'react';
import LoginComponent from '../components/LoginComponents/LoginCard';
import ForgotPasswordComponent from '../components/LoginComponents/ForgotPasswordCard';
import logo from "../assets/logo.png";
import gymBg from "../assets/gym-bg.jpg";
import Footer from '../components/Footer';
import { login } from "../api/auth.service";
import axiosInstance from "../api/axiosInstance";
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

  // ──► Step 1: Check empty fields
  if (!email && !password) {
    setErrors({ email: "Please fill in all fields", password: "" });
    return;
  }
  if (!email) {
    setErrors({ email: "Email is required", password: "" });
    return;
  }
  if (!password) {
    setErrors({ email: "", password: "Password is required" });
    return;
  }

  // ──► Step 2: Validate email format
  const emailRegex = /^[\w.-]+@[\w.-]+\.\w{2,}$/;
  if (!emailRegex.test(email)) {
    setErrors({ email: "Please enter a valid email address", password: "" });
    return;
  }

  try {
    // ──► Step 3: Check if email exists
    const existsResponse = await axiosInstance.get(`/auth/exists?email=${email}`);
    if (!existsResponse.data) {
      setErrors({ email: "No account found with this email", password: "" });
      return;
    }

    // ──► Step 4: Attempt login
    const data = await login(email, password);
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);

    if (data.role === "ADMIN") {
      navigate("/admin/home");
    } else if (data.role === "COACH") {
      navigate("/coach/home");
    } else {
      setErrors({
        email: "",
        password: "Access denied. Please use the mobile app.",
      });
    }
  } catch (error: any) {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      setErrors({ email: "", password: "Incorrect password. Please try again." });
    } else if (status === 500) {
      const message = error.response?.data?.message ?? "";
      if (message.includes("suspended")) {
        setErrors({ email: "", password: "Your account has been suspended." });
      } else {
        setErrors({ email: "", password: "Something went wrong. Try again later." });
      }
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