import Button from "../Button"; // 👈 adapte le chemin

interface Props {
  email: string;
  onCheckInbox: () => void;
  onBack: () => void;
}

export default function EmailSentCard({ email, onCheckInbox, onBack }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-12 flex flex-col gap-6 relative z-10">

      <h1 className="text-3xl font-semibold text-gray-900 text-center">
        Forget your password
      </h1>

      <p className="text-sm text-gray-500 text-center leading-relaxed">
        You will receive a link to reset your password at the following address :{" "}
        <span className="font-semibold text-gray-800">{email}</span>
      </p>
      

         <Button label="Check your inbox" variant="primary" size="full" type="submit" onClick={onCheckInbox}/>


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