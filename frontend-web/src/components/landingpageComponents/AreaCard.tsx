type AreaCardProps = {
  img: string;
  title: string;
  text: string;
};

const AreaCard = ({ img, title, text }: AreaCardProps) => {
  return (
    <div className="w-full overflow-hidden rounded-[16px] sm:rounded-[18px] md:rounded-[20px] bg-[#FFF5BF] transition-transform duration-300 hover:scale-[1.02]">
      <div className="h-[140px] sm:h-[160px] md:h-[180px] lg:h-[200px] w-full overflow-hidden">
        <img
          src={img}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>

      <div className="px-3 sm:px-4 md:px-5 py-3 sm:py-4 md:py-5">
        <h3 className="text-[#1D2125] text-[18px] sm:text-[20px] md:text-[22px] font-semibold leading-tight">
          {title}
        </h3>

        <p className="mt-2 sm:mt-3 text-[#2F3438] text-[12px] sm:text-[13px] md:text-[14px] leading-6 sm:leading-6 md:leading-7">
          {text}
        </p>
      </div>
    </div>
  );
};

export default AreaCard;