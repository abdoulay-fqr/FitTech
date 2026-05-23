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

  const role = localStorage.getItem("role");

  const settingsRoute =
      role === "SUPER_ADMIN" ? "/super-admin/settings" : "/admin/settings";

  const dashboardRoute =
      role === "SUPER_ADMIN" ? "/super-admin/settings" : "/admin/home";

  const coachRoute =
      role === "SUPER_ADMIN" ? "/admin/coaches" : "/admin/coaches";

  const membersRoute =
      role === "SUPER_ADMIN" ? "/admin/home" : "/admin/home";

  const menuItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard size={16} strokeWidth={1.8} />,
      path: dashboardRoute,
    },
    {
      label: "Members",
      icon: <Users size={16} strokeWidth={1.8} />,
      path: membersRoute,
    },
    {
      label: "Coachs",
      icon: <UserCog size={16} strokeWidth={1.8} />,
      path: coachRoute,
    },
    {
      label: "Free Trial",
      icon: <Ticket size={16} strokeWidth={1.8} />,
      path: "/admin/free-trial",
    },
    {
      label: "Settings",
      icon: <Settings size={16} strokeWidth={1.8} />,
      path: settingsRoute,
    },
  ];

  const handleCloseMobile = () => {
    if (window.innerWidth < 768) setIsOpen(false);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleCloseMobile();
  };

  const handleLogoutClick = () => {
    handleCloseMobile();
    onLogout?.();
  };

  const isActive = (path: string) => {
    if (path === "/admin/home") {
      return (
          location.pathname === "/admin/home" ||
          location.pathname.startsWith("/admin/members")
      );
    }

    if (path === "/admin/coaches") {
      return location.pathname.startsWith("/admin/coaches");
    }

    if (path === "/admin/settings" || path === "/super-admin/settings") {
      return (
          location.pathname.startsWith("/admin/settings") ||
          location.pathname.startsWith("/super-admin/settings") ||
          location.pathname.startsWith("/super-admin/admins")
      );
    }

    return location.pathname === path;
  };

  return (
      <>
        <div className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between border-b border-[#e3e3e3] bg-[#f3f3f8] px-4 md:hidden">
          <img src={logo} alt="FiTTECH Logo" className="h-8 w-auto object-contain" />

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
              <img src={logo} alt="FiTTECH Logo" className="h-auto w-[86px] object-contain" />

              <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close sidebar"
                  className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-200 md:hidden"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex flex-col gap-3">
              {menuItems.map((item) => (
                  <button
                      key={item.label}
                      onClick={() => handleNavigate(item.path)}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-left text-[14px] transition-all ${
                          isActive(item.path)
                              ? "bg-[#ece6d6] font-medium text-[#f2b300]"
                              : "text-[#a7a8c3] hover:bg-[#ebeaf4]"
                      }`}
                  >
                <span className="flex h-4 w-4 items-center justify-center">
                  {item.icon}
                </span>
                    <span>{item.label}</span>
                  </button>
              ))}
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