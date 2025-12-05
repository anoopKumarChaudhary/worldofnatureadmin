"use client";

import { Bell, Search, User, Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="text-gray-400 hover:text-gray-600 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
        )}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-48 sm:w-64 rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="relative rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
            3
          </span>
        </button>
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
            <User className="h-4 w-4 text-gray-600" />
          </div>
          <span className="hidden sm:block text-sm font-medium text-gray-700">
            Admin User
          </span>
        </div>
      </div>
    </header>
  );
}
