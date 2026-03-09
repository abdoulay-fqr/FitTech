import { useState } from "react";
import Button from "../Button"; 
import ForgotForm from "./ForgotForm";
import EmailSentCard from "./Emailsentcard";
import ResetPasswordForm from "./Resetpasswordform";
import SuccessCard from "./SuccessCard";

type ForgotView = "forgot" | "email-sent" | "reset" | "success";

interface Props {
  onBack: () => void;
}

const STATIC_EMAIL = "admin@gmail.com";

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ForgotPasswordCard({ onBack }: Props) {
  const [forgotView, setForgotView] = useState<ForgotView>("forgot");

  return (
    <div className="w-full max-w-lg px-5">
      {forgotView === "forgot" && (
        <ForgotForm
          onConfirm={(email) => setForgotView("email-sent")}
          onBack={onBack}
          staticEmail={STATIC_EMAIL}
        />
      )}
      {forgotView === "email-sent" && (
        <EmailSentCard
          email={STATIC_EMAIL}
          onCheckInbox={() => setForgotView("reset")}
          onBack={onBack}
        />
      )}
      {forgotView === "reset" && (
        <ResetPasswordForm onSuccess={() => setForgotView("success")} />
      )}
      {forgotView === "success" && (
        <SuccessCard onSignIn={onBack} />
      )}
    </div>
  );
}
