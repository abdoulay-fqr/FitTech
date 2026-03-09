// AreaCard.tsx
type AreaCardProps = {
  img: string;
  title: string;
  text: string;
};

const AreaCard = ({ img, title, text }: AreaCardProps) => {
  return (
    <div className="w-full   overflow-hidden rounded-[20px] sm:rounded-[24px] md:rounded-[28px] bg-[#FFF5BF] transition-transform duration-300 hover:scale-[1.02]">
      <div className="h-[180px] sm:h-[200px] md:h-[220px] lg:h-[240px] w-full overflow-hidden">
        <img
          src={img}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>

      <div className="px-4 sm:px-5 md:px-6 py-5 sm:py-6 md:py-7 transition-transform duration-300 hover:scale-[1.02]">
        <h3 className="text-[#1D2125] text-2xl sm:text-[26px] md:text-[28px] font-semibold leading-tight">
          {title}
        </h3>

        <p className="mt-3 sm:mt-4 text-[#2F3438] text-sm sm:text-[15px] md:text-[16px] leading-6 sm:leading-7 md:leading-8">
          {text}
        </p>
      </div>
    </div>
  );
};

export default AreaCard;