import { useState, useRef, useEffect } from "react";
import { Bell, Menu, Search, X } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";

interface PageHeaderProps {
  showSearchBar?: boolean; // Nouvelle prop pour contrôler l'affichage
  searchValue?: string;    // Rendu optionnel
  onSearchChange?: (value: string) => void; // Rendu optionnel
  searchPlaceholder?: string;
  onMenuClick: () => void;
}

export default function PageHeader({
  showSearchBar = true, // Par défaut, on l'affiche
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  onMenuClick,
}: PageHeaderProps) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  return (
    <>
      <div className="flex items-center lg:justify-end justify-between gap-3 mb-6">
        {/* Mobile menu button */}
        <button
          className="lg:hidden shrink-0 text-gray-600 hover:text-gray-900"
          onClick={onMenuClick}
        >
          <Menu size={22} />
        </button>

        <div className="flex items-center justify-end gap-2">
          {/* Search Bar — desktop only (Conditionnel) */}
          {showSearchBar && (
            <div className="hidden lg:flex flex-1 max-w-xl relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d3a6e]/20 transition-all"
              />
            </div>
          )}

          {/* Search icon — mobile (Conditionnel) */}
          {showSearchBar && (
            <button
              className="lg:hidden shrink-0 text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-all"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              {isSearchOpen ? <X size={20} /> : <Search size={20} />}
            </button>
          )}

          {/* Notifications */}
          <div className="relative shrink-0" ref={containerRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                isNotifOpen ? "bg-gray-100 text-blue-600" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="relative">
                <Bell size={20} />
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-red-500 border-2 border-white rounded-full" />
              </div>
              <span className="font-medium hidden lg:block">Notifications</span>
            </button>
            
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 z-50 animate-in fade-in zoom-in duration-200">
                <NotificationDropdown />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search bar mobile — (Conditionnel) */}
      {showSearchBar && isSearchOpen && (
        <div className="lg:hidden mb-4">
          <div className="relative ">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              ref={searchRef}
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d3a6e]/20 transition-all"
            />
          </div>
        </div>
      )}
    </>
  );
}