import { useState } from "react";
import Button from "../Button"; // 👈 adapte le chemin

interface Props {
  onConfirm: (email: string) => void;
  onBack: () => void;
  staticEmail: string;
}

export default function ForgotForm({ onConfirm, onBack, staticEmail }: Props) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setEmailError("Email is required.");
      return;
    }

    if (email !== staticEmail) {
      setEmailError("Email is incorrect.");
      return;
    }

    setEmailError("");
    onConfirm(email);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-12 flex flex-col gap-6 relative z-10">

      <h1 className="text-3xl font-semibold text-gray-900 text-center">
        Forget your password
      </h1>

      <p className="text-sm text-gray-500 text-center leading-relaxed">
        Enter your email address to receive a temporary link to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400">email address</label>
          <input
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
            className={`border rounded-xl px-4 py-3.5 text-sm bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 transition
              ${emailError
                ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                : "border-gray-200 focus:border-yellow-400 focus:ring-yellow-100"
              }`}
            autoComplete="email"
          />
          {emailError && (
            <p className="text-red-500 text-xs mt-1">{emailError}</p>
          )}
        </div>

         <Button label="Sign in" variant="primary" size="full" type="submit" />


      </form>

      <div className="text-center">
        <button
          onClick={onBack}
          className="text-sm underline text-gray-800 hover:text-yellow-600 transition"
        >
          Go back to sign in page
        </button>
      </div>

    </div>
  );
}