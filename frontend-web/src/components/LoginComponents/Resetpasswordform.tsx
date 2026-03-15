import { useState } from "react";
import Button from "../Button"; 
import EyeOffIcon from "../EyeOffIcon";
import { resetPassword } from "../../api/auth.service";

interface Props {
  onSuccess: () => void;
}

export default function ResetPasswordForm({ onSuccess }: Props) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({ newPassword: "", confirmPassword: "" });

  const validate = () => {
    const newErrors = { newPassword: "", confirmPassword: "" };

    if (!newPassword) newErrors.newPassword = "Password is required.";
    if (!confirmPassword) newErrors.confirmPassword = "Password is required.";
    else if (newPassword !== confirmPassword)
      newErrors.confirmPassword = "The password you entered doesn't match the first one";

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const errors = validate();
  setErrors(errors);
  if (Object.values(errors).some((msg) => msg !== "")) return;

  try {
    const token = new URLSearchParams(window.location.search).get("token") ?? "";
    await resetPassword(token, newPassword);
    onSuccess();
  } catch (error: any) {
    setErrors((prev) => ({ ...prev, newPassword: "Something went wrong." }));
  }
};

  return (
   <div className="bg-white rounded-2xl shadow-lg p-10 flex-1 w-full max-w-md flex flex-col">        
     <h1 className="text-3xl font-semibold text-gray-900 text-center mb-5">
        Reset your password
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 ">

        {/* New Password */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-sm text-gray-400">
              Enter your new password
            </label>
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="flex items-center gap-1 text-gray-400 text-sm hover:text-gray-600 transition"
            >
              <EyeOffIcon />
              <span>Hide</span>
            </button>
          </div>
          <input
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setErrors((prev) => ({ ...prev, newPassword: "" }));
            }}
            className={`border rounded-xl px-4 py-3.5 text-sm bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 transition
              ${errors.newPassword
                ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                : "border-gray-200 focus:border-yellow-400 focus:ring-yellow-100"
              }`}
          />
          {errors.newPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-sm text-gray-400">
              Enter your new password again
            </label>
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="flex items-center gap-1 text-gray-400 text-sm hover:text-gray-600 transition"
            >
              <EyeOffIcon />
              <span>Hide</span>
            </button>
          </div>
          <input
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors((prev) => ({ ...prev, confirmPassword: "" }));
            }}
            className={`border rounded-xl px-4 py-3.5 text-sm bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 transition
              ${errors.confirmPassword
                ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                : "border-gray-200 focus:border-yellow-400 focus:ring-yellow-100"
              }`}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        <Button label="Save changes" variant="primary" size="full" type="submit" />

        

      </form>
    </div>
  );
}