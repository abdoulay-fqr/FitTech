import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logosport.png";
import Button from "./Button";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = [
    { name: "Home", path: "#home" },
    { name: "Services", path: "#services" },
    { name: "Membership", path: "#membership" },
    { name: "Coachs", path: "#coachs" },
    { name: "Contact Us", path: "#contact" },
  ];
  return (
    <nav className="w-full px-6 md:px-10 lg:px-20 py-5">
      <div className="flex items-center justify-between">
        <a href="#home">
          <img src={logo} alt="FitTech Logo" className="h-12 md:h-16" />
        </a>
        <ul className="hidden md:flex gap-8 lg:gap-10 text-base lg:text-lg items-center">
          {navItems.map((item, index) => (
            <li key={index}>
              <a href={item.path} className="font-medium text-[#24292D] hover:text-yellow-500 transition">
                {item.name}
              </a>
            </li>
          ))}
        </ul>
        <div className="hidden md:block">
          <Link to="/login">
            <Button label="Login" variant="outline" size="small"
              className="bg-[#1D2125] text-yellow-400 hover:bg-[#F7D211] hover:text-white rounded-lg border-yellow-400" />
          </Link>
        </div>
        <button className="md:hidden flex flex-col justify-center items-center gap-1.5"
          onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          <span className={`block h-0.5 w-6 bg-[#24292D] transition ${isOpen ? "rotate-45 translate-y-2" : ""}`}></span>
          <span className={`block h-0.5 w-6 bg-[#24292D] transition ${isOpen ? "opacity-0" : ""}`}></span>
          <span className={`block h-0.5 w-6 bg-[#24292D] transition ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden mt-4 bg-white rounded-xl shadow-lg p-5">
          <ul className="flex flex-col gap-4 text-base">
            {navItems.map((item, index) => (
              <li key={index}>
                <a href={item.path} onClick={() => setIsOpen(false)}
                  className="font-medium text-[#24292D] hover:text-yellow-500 transition">
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-5">
            <Link to="/login" onClick={() => setIsOpen(false)}>
              <Button label="Login" variant="outline" size="small"
                className="w-full bg-[#1D2125] text-[#F7D211] hover:bg-[#F7D211] hover:text-white rounded-lg border border-[#F7D211]" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
