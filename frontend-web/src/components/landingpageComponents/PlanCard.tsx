type PlanCardProps = {
  type: string;
  text: string;
  features: string[];
  price: string | number;
};

const PlanCard = ({ type, text, features, price }: PlanCardProps) => {
  return (
    <div className="w-full rounded-[10px] border-2 border-[#F7D211]  min-h-[600px] px-5 py-6 sm:px-6 sm:py-7 md:px-7 md:py-6">
      <h3 className="text-center text-[#24292D] text-[24px] sm:text-[26px] md:text-[28px] font-bold leading-tight">
        {type}
      </h3>

      <p className="mt-4 text-[#2F3438] text-[12px] md:text-[14px] leading-8 text-left">
        {text}
      </p>

      <p className="mt-4 text-center text-[#F7D211] text-[16px] font-semibold">
        Features
      </p>

      <ul className="mt- list-disc pl-5 text-[#2F3438] text-[12px] md:text-[14px] leading-8">
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>

      <div className="mt-6 flex items-end justify-center">
        <span className="text-[#24292D] text-[28px] font-bold leading-none">
          {price}$
        </span>
        <span className="ml-1 text-[#9A9A9A] text-[14px] leading-none">
          /USDT
        </span>
      </div>
    </div>
  );
};

export default PlanCard;