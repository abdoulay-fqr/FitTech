interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "outline";
  size?: "small" | "large" | "full";
  className?: string;
}

const Button = ({ label, onClick, type = "button", variant = "primary", size = "full", className = "" }: ButtonProps) => {
  
  // Styles communs : On ajoute une ombre (shadow) et une police plus grasse (font-bold)
  const baseStyles = "rounded-full font-bold transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-md active:scale-95";

  const variants = {
    // Le jaune exact de ta maquette (proche de #FFD700 ou #FFD300)
    primary: "bg-[#FFD300] text-black hover:bg-[#F2C700]", 
    outline: "bg-transparent border-2 border-black text-black",
  };

  const sizes = {
    small: "px-4 py-2 text-sm",
    large: "px-8 py-3 text-lg",
    full: "w-full py-4 text-xl", // "full" prend toute la largeur et est plus haut
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;