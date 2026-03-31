import React, { useState } from "react";
import logo from "../../assets/logo.png";
import {
  LayoutDashboard,
  Users,
  UserCog,
  Ticket,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

type SidebarProps = {
  onLogout?: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleCloseMobile = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleCloseMobile();
  };

  const handleLogoutClick = () => {
    handleCloseMobile();
    onLogout?.();
  };

  const getItemClass = (isActive: boolean) =>
      `flex items-center gap-3 rounded-md px-3 py-2 text-left text-[14px] transition-all ${
          isActive
              ? "bg-[#ece6d6] font-medium text-[#f2b300]"
              : "text-[#a7a8c3] hover:bg-[#ebeaf4]"
      }`;

  const isDashboardActive = location.pathname === "/admin/home";
  const isMembersActive = location.pathname.includes("/admin/members");
  const isCoachesActive = location.pathname.includes("/admin/coaches");
  const isFreeTrialActive = location.pathname.includes("/admin/free-trial");
  const isSettingsActive = location.pathname.includes("/admin/settings");

  return (
      <>
        <div className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between border-b border-[#e3e3e3] bg-[#f3f3f8] px-4 md:hidden">
          <img
              src={logo}
              alt="FiTTECH Logo"
              className="h-8 w-auto object-contain"
          />

          <button
              onClick={() => setIsOpen(true)}
              aria-label="Open sidebar"
              className="flex h-10 w-10 items-center justify-center rounded-md text-gray-700 transition hover:bg-gray-200"
          >
            <Menu size={22} />
          </button>
        </div>

        {isOpen && (
            <div
                className="fixed inset-0 z-40 bg-black/40 md:hidden"
                onClick={() => setIsOpen(false)}
            />
        )}

        <aside
            className={`fixed left-0 top-0 z-50 flex h-screen w-[156px] flex-col justify-between border-r border-[#e1e1e1] bg-[#f3f3f8] px-3 py-4 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
        >
          <div>
            <div className="relative mb-8 mt-1 flex flex-col items-center">
              <img
                  src={logo}
                  alt="FiTTECH Logo"
                  className="h-auto w-[86px] object-contain"
              />

              <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close sidebar"
                  className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-200 md:hidden"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex flex-col gap-3">
              <button
                  onClick={() => handleNavigate("/admin/home")}
                  className={getItemClass(isDashboardActive)}
              >
              <span className="flex h-4 w-4 items-center justify-center">
                <LayoutDashboard size={16} strokeWidth={1.8} />
              </span>
                <span>Dashboard</span>
              </button>

              <button
                  onClick={() => handleNavigate("/admin/home")}
                  className={getItemClass(isMembersActive)}
              >
              <span className="flex h-4 w-4 items-center justify-center">
                <Users size={16} strokeWidth={1.8} />
              </span>
                <span>Members</span>
              </button>

              <button
                  onClick={() => handleNavigate("/admin/coaches")}
                  className={getItemClass(isCoachesActive)}
              >
              <span className="flex h-4 w-4 items-center justify-center">
                <UserCog size={16} strokeWidth={1.8} />
              </span>
                <span>Coachs</span>
              </button>

              <button
                  onClick={() => handleNavigate("/admin/free-trial")}
                  className={getItemClass(isFreeTrialActive)}
              >
              <span className="flex h-4 w-4 items-center justify-center">
                <Ticket size={16} strokeWidth={1.8} />
              </span>
                <span>Free Trial</span>
              </button>

              <button
                  onClick={() => handleNavigate("/admin/settings")}
                  className={getItemClass(isSettingsActive)}
              >
              <span className="flex h-4 w-4 items-center justify-center">
                <Settings size={16} strokeWidth={1.8} />
              </span>
                <span>Settings</span>
              </button>
            </nav>
          </div>

          <button
              onClick={handleLogoutClick}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-red-400 py-2 text-[13px] font-medium text-red-500 transition-all hover:bg-red-50"
          >
            <LogOut size={15} />
            <span>Log out</span>
          </button>
        </aside>
      </>
  );
};

export default Sidebar;