type PlanCardProps = {
  type: string;
  text: string;
  features: string[];
  price: string | number;
};

const PlanCard = ({ type, text, features, price }: PlanCardProps) => {
  return (
    <div className="w-full rounded-[10px] border-2 border-[#F7D211] md:min-h-[450px] px-4 py-5 sm:px-5 sm:py-5 md:px-6 md:py-5">
      <h3 className="text-center text-[#24292D] text-[20px] sm:text-[22px] md:text-[24px] font-bold leading-tight">
        {type}
      </h3>

      <p className="mt-2 text-[#2F3438] text-[12px] md:text-[13px] leading-6 text-left">
        {text}
      </p>

      <p className="mt-3 text-center text-[#F7D211] text-[14px] font-semibold">
        Features
      </p>

      <ul className="mt-1 list-disc pl-4 text-[#2F3438] text-[12px] md:text-[13px] leading-7">
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>

      <div className="mt-4 flex items-end justify-center">
        <span className="text-[#24292D] text-[24px] font-bold leading-none">
          {price}$
        </span>
        <span className="ml-1 text-[#9A9A9A] text-[13px] leading-none">
          /USDT
        </span>
      </div>
    </div>
  );
};

export default PlanCard;