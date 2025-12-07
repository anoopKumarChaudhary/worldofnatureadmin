"use client";

import { Bell, Search, User, Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="flex h-20 items-center justify-between px-4 sm:px-8 py-4 z-20">
      <div className="flex items-center gap-4 flex-1">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="text-[#1A2118]/50 hover:text-[#BC5633] lg:hidden transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
        )}
        
        {/* Search Bar */}
        <div className="relative group max-w-md w-full hidden sm:block">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-xl rounded-full shadow-sm border border-white/50 transition-all group-focus-within:border-[#BC5633]/30 group-focus-within:shadow-md" />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#1A2118]/40 w-4 h-4 group-focus-within:text-[#BC5633] transition-colors z-10" />
          <input
            type="text"
            placeholder="Search..."
            className="relative z-10 w-full bg-transparent border-none rounded-full py-2.5 pl-10 pr-4 text-sm font-medium text-[#1A2118] placeholder-[#1A2118]/40 focus:ring-0 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2.5 rounded-full bg-white/40 hover:bg-white/80 backdrop-blur-sm text-[#1A2118]/60 hover:text-[#BC5633] transition-all shadow-sm border border-white/50">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-[#BC5633] border-2 border-[#F2F0EA]" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-[#1A2118]/5">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-[#1A2118]">Admin User</p>
            <p className="text-xs text-[#1A2118]/50">Super Admin</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-[#14281D] flex items-center justify-center text-[#F2F0EA] shadow-md ring-2 ring-white/50">
            <User className="h-5 w-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
