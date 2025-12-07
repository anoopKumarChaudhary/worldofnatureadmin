"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

import Image from "next/image";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Products", href: "/products", icon: Package },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Users", href: "/users", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-[#14281D] text-[#F2F0EA] shadow-xl border-r border-[#F2F0EA]/5">
      {/* Logo Section */}
      <div className="flex h-24 shrink-0 items-center px-6 justify-center border-b border-[#F2F0EA]/10">
        <div className="relative w-40 h-12">
          <Image
            src="/image.png"
            alt="World of Nature"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-4 py-6">
        <ul role="list" className="flex flex-1 flex-col gap-y-4">
          <li>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#F2F0EA]/40 mb-4 px-2">
              Menu
            </div>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`group flex gap-x-3 rounded-xl p-3 text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? "bg-[#BC5633] text-white shadow-lg shadow-[#BC5633]/20"
                          : "text-[#F2F0EA]/70 hover:bg-[#F2F0EA]/10 hover:text-white"
                      }`}
                    >
                      <item.icon
                        className={`h-5 w-5 shrink-0 transition-transform duration-300 ${
                          isActive ? "scale-110" : "group-hover:scale-110"
                        }`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
          
          <li className="mt-auto">
            <div className="h-px bg-[#F2F0EA]/10 my-4" />
            <button className="group flex w-full gap-x-3 rounded-xl p-3 text-sm font-medium text-[#F2F0EA]/70 hover:bg-[#8F4F3D]/20 hover:text-[#EBB09E] transition-all">
              <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
