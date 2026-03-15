import Button from "../Button"; 

interface Props {
  onSignIn: () => void;
}

export default function SuccessCard({ onSignIn }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-12 flex flex-col gap-6 items-center text-center relative z-10">

      <h1 className="text-3xl font-semibold text-gray-900">
        Your password is reset successfully
      </h1>

      <p className="text-sm text-gray-500 leading-relaxed">
        You can now sign in with your new password and continue enjoying our services.
      </p>

       <Button label="Sign in" variant="primary" size="full" type="submit" onClick={onSignIn}/>
      


    </div>
  );
}