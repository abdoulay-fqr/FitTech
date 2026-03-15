type ServiceCardProps = {
  icon: React.ReactNode;
  title: string;
  text: string;
};

const ServiceCard = ({ icon, title, text }: ServiceCardProps) => {
  return (
    <div className="flex flex-col items-center text-center max-w-[280px] mx-auto transition-transform duration-300 hover:scale-[1.05]">
      <div className="w-[80px] h-[80px] bg-[#F4EBC5] rounded-2xl flex items-center justify-center mb-4">
        {icon}
      </div>

      <h3 className="text-[#24292D] text-[22px] font-semibold leading-tight mb-3">
        {title}
      </h3>

      <p className="text-[#3E4348] text-[15px] leading-7">
        {text}
      </p>
    </div>
  );
};

export default ServiceCard;