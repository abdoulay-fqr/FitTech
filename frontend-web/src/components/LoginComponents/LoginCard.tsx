import React from 'react';
import Button from '../Button';
import googlePlayBadge from "../../assets/googlePlayBadge.svg";
import appStoreBadge from "../../assets/appStoreBadge.svg";
import EyeOffIcon from '../EyeOffIcon';


// On définit ce que le composant a besoin de recevoir pour fonctionner
interface LoginComponentProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  errors: { email?: string; password?: string };
  handleSubmit: (e: React.FormEvent) => void;
  onForgotPassword: () => void; 
}

export default function LoginCard({
  email, setEmail, password, setPassword, 
  showPassword, setShowPassword, errors, 
  handleSubmit, onForgotPassword
}: LoginComponentProps) {
  return (
    <div className="relative z-10 flex flex-col md:flex-row gap-4 w-full max-w-5xl px-5  items-center md:items-start  justify-center   ">
      
      {/* ── Sign In Card ── */}
      <div className="bg-white rounded-2xl shadow-lg p-10 flex-1 w-full max-w-md flex flex-col  ">
        <h1 className="text-3xl font-semibold text-gray-900 text-center mb-8">
          Sign in
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400">Email or mobile phone number</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`border rounded-xl px-4 py-3.5 text-sm bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 transition
                 ${errors.email ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:ring-yellow-400 focus:ring-yellow-100"}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-gray-400">Your password</label>
              <button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
  className="flex items-center gap-1 text-gray-400 text-sm hover:text-gray-600 transition"
>
  {showPassword ? (
    <EyeOffIcon />
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )}
  <span>{showPassword ? 'Hide' : 'Show'}</span>
</button>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`border rounded-xl px-4 py-3.5 text-sm bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 transition
                ${errors.password ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:ring-yellow-400 focus:ring-yellow-100"}`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <Button label="Sign in" variant="primary" size="full" type="submit" />

          {/* Forgot password */}
          <div className="text-right">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm underline text-gray-800 hover:text-yellow-600 transition bg-transparent border-none cursor-pointer"
            >
              Forget your password
            </button>
          </div>
        </form>
      </div>

      {/* ── Mobile App Card ── */}
      <div className="bg-white rounded-2xl shadow-lg p-10 flex-1 w-full max-w-md flex flex-col items-center justify-center gap-6 ">
        <h2 className="text-xl font-bold text-gray-900 text-center">Join Us on the Mobile App !</h2>
         <p className="text-sm text-gray-500 text-center leading-relaxed">
            To unlock all the features of our gym platform, please download the
            mobile app and sign up or log in.{" "}
           <strong className="text-gray-900">
            The web version is exclusively for coaches and admins.
           </strong>{" "}
            For full access to your workouts, progress, and more, the mobile app
            is your best option!
         </p> 
        <div className="flex flex-wrap gap-3 justify-center">
          <img src={googlePlayBadge} alt="Google Play" className="h-12 object-contain" />
          <img src={appStoreBadge} alt="App Store" className="h-12 object-contain" />
        </div>
      </div>
    </div>
  );
}