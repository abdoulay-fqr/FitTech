import { useState } from "react";
import logo from "../assets/logo.png"; 
import Button from "./Button";
import FacebookIcon from "./IconsComponents/FacebookIcon";
import InstagramIcon from "./IconsComponents/InstagramIcon";
import XIcon from "./IconsComponents/XIcon";
import LinkedInIcon from "./IconsComponents/LinkedinIcon";
import YoutubeIcon from "./IconsComponents/YoutubeIcon";

export default function Footer() {
    const [email, setEmail] = useState("");
 const [emailError, setEmailError] = useState("");

    const handleSubscribe = () => {
  if (!email) {
    setEmailError("Email is required.");
    return;
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    setEmailError("Please enter a valid email address.");
    return;
  }
  setEmailError("");
  console.log("Subscribed:", email);
};
  return (
    <footer className="w-full bg-[#1a1a1a] text-white relative z-10 mt-12 ">

      {/* ── Newsletter Section ── */}
      <div className="w-full border-b border-white/10 py-8 px-6 md:px-16 ">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

          {/* Left text */}
          <div>
            <h3 className="text-lg font-bold text-white">Join our newsletter</h3>
            <p className="text-sm text-gray-400 mt-1">
              Subscribe to be receiving up-to-date features and updates
            </p>
          </div>

          {/* Right — input + button */}
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <div className="flex gap-3">
                
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                placeholder="Enter your email"
               className={`flex-1 md:w-72 px-4 py-3 rounded-lg bg-transparent border text-white text-sm placeholder-gray-400 focus:outline-none transition
        ${emailError
          ? "border-red-400 focus:border-red-400"
          : "border-white/30 focus:border-yellow-400"
        }`}
        
    />
     
               
              <Button
                  label="Subscribe"
                  variant="primary"
                  size="small"
                  className="!rounded-lg"
                  onClick={handleSubscribe}
               />
               
                

            </div>
            {emailError && (
                 <p className="text-red-400 text-xs mt-1">{emailError}</p>
                )}
            <p className="text-xs text-gray-400 text-center md:text-left">
              By subscribing you agree to with our{" "}
              <a href="#" className="underline text-gray-300 hover:text-yellow-400 transition">
                Privacy Policy
              </a>
            </p>
          </div>

        </div>
      </div>

      {/* ── Main Footer Content ── */}
      <div className="max-w-6xl mx-auto px-6 md:px-16 py-12">
        <div className="flex flex-col md:flex-row gap-10 md:gap-0 justify-between  ">

          {/* ── Col 1 : Logo + Address + Contact ── */}
          <div className="flex flex-col gap-6 max-w-xs ">
            {/* Logo */}
            <div className="bg-white rounded-lg p-3 w-fit">
              <img src={logo} alt="FitTech Logo" className="h-14 object-contain" />
            </div>

            {/* Address */}
            <div >
              <p className="text-sm font-semibold text-white mb-1">Address:</p>
              <p className="text-sm text-gray-400 leading-relaxed">
                Rue Benhamouda,<br />
                Sidi Bel Abbès 22000, Algeria
              </p>
            </div>

            {/* Contact */}
            <div >
              <p className="text-sm font-semibold text-white mb-1">Contact:</p>
              <p className="text-sm text-gray-400">+213 737 286 945</p>
              <p className="text-sm text-gray-400">contact@fittech.org</p>
            </div>
          </div>

          {/* ── Col 2 : Company Links ── */}
          <div className="flex flex-col gap-4">
            <h4 className="text-base font-bold text-white">Company</h4>
            <ul className="flex flex-col gap-3">
              {["Home", "Services", "Membership", "Coachs", "Contact Us"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-yellow-400 transition"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 3 : Follow Us ── */}
          <div className="flex flex-col gap-4">
            <h4 className="text-base font-bold text-white">Follow Us</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <a href="#" className="flex items-center gap-3 text-sm text-gray-400 hover:text-yellow-400 transition">
                  <FacebookIcon /> Facebook
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-3 text-sm text-gray-400 hover:text-yellow-400 transition">
                  <InstagramIcon /> Instagram
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-3 text-sm text-gray-400 hover:text-yellow-400 transition">
                  <XIcon /> X
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-3 text-sm text-gray-400 hover:text-yellow-400 transition">
                  <LinkedInIcon /> LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-3 text-sm text-gray-400 hover:text-yellow-400 transition">
                  <YoutubeIcon /> Youtube
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-white/10 px-6 md:px-16 py-5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            © 2026 FitTech. &nbsp; All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-gray-400 underline hover:text-yellow-400 transition">Privacy Policy</a>
            <a href="#" className="text-xs text-gray-400 underline hover:text-yellow-400 transition">Terms of Service</a>
            <a href="#" className="text-xs text-gray-400 underline hover:text-yellow-400 transition">Cookies Settings</a>
          </div>
        </div>
      </div>

    </footer>
  );
}