"use client";

import { Bell, User, Menu } from "lucide-react";

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
