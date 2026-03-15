// ReviewCard.tsx
import RatingStars from "./RatingStars";

type ReviewCardProps = {
  username: string;
  profilePicture: string;
  text: string;
  rate: number;
};

const ReviewCard = ({ username, profilePicture, text, rate }: ReviewCardProps) => {
  return (
    <div className="flex flex-col items-center text-center px-4">
      <RatingStars rate={rate} />

      <p className="mt-4 text-[#3E4348] text-[15px] leading-7 max-w-[280px]">
        {text}
      </p>

      <div className="mt-6 flex items-center gap-3">
        <img
          src={profilePicture}
          alt={username}
          className="w-12 h-12 rounded-full object-cover"
        />
        <span className="text-[#1D2125] font-semibold text-[16px]">
          {username}
        </span>
      </div>
    </div>
  );
};

export default ReviewCard;