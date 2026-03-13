import { useState } from "react";
import ForgotForm from "./ForgotForm";
import EmailSentCard from "./Emailsentcard";
import ResetPasswordForm from "./Resetpasswordform";
import SuccessCard from "./SuccessCard";

type ForgotView = "forgot" | "email-sent" | "reset" | "success";

interface Props {
  onBack: () => void;
}

export default function ForgotPasswordCard({ onBack }: Props) {
  const [forgotView, setForgotView] = useState<ForgotView>("forgot");
  const [confirmedEmail, setConfirmedEmail] = useState("");

  return (
    <div className="w-full max-w-lg px-5">
      {forgotView === "forgot" && (
        <ForgotForm
          onConfirm={(email) => {
            setConfirmedEmail(email); // 👈 sauvegarde l'email
            setForgotView("email-sent");
          }}
          onBack={onBack}
        />
      )}
      {forgotView === "email-sent" && (
        <EmailSentCard
          email={confirmedEmail} // 👈 utilise le vrai email tapé par l'user
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