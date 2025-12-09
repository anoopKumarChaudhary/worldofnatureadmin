"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  ChevronRight
} from "lucide-react";
import Image from "next/image";

const navigation = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
    ]
  },
  {
    title: "Management",
    items: [
      { name: "Products", href: "/products", icon: Package },
      { name: "Orders", href: "/orders", icon: ShoppingCart },
      { name: "Users", href: "/users", icon: Users },
    ]
  },
  {
    title: "System",
    items: [
      { name: "Settings", href: "/settings", icon: Settings },
    ]
  }
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="flex h-full w-72 flex-col bg-[#14281D] text-[#F2F0EA] shadow-2xl border-r border-[#F2F0EA]/5 relative overflow-hidden">
      {/* Background Texture/Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F2F0EA]/5 to-transparent pointer-events-none" />

      {/* Logo Section */}
      <div className="relative z-10 flex h-28 shrink-0 items-center justify-center px-8 border-b border-[#F2F0EA]/5">
        <div className="relative w-32 h-12">
          <Image
            src="/image.png"
            alt="Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex-1 overflow-y-auto px-6 py-8 space-y-8">
        {navigation.map((group) => (
          <div key={group.title}>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#BC5633] mb-4 px-2">
              {group.title}
            </h3>
            <ul role="list" className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`group relative flex items-center gap-x-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? "bg-[#F2F0EA] text-[#14281D] shadow-lg shadow-[#000]/10"
                          : "text-[#F2F0EA]/60 hover:bg-[#F2F0EA]/10 hover:text-[#F2F0EA]"
                      }`}
                    >
                      <item.icon
                        className={`h-5 w-5 shrink-0 transition-transform duration-300 ${
                          isActive ? "text-[#BC5633] scale-110" : "group-hover:scale-110"
                        }`}
                        aria-hidden="true"
                      />
                      <span className="flex-1">{item.name}</span>
                      {isActive && (
                        <ChevronRight className="w-4 h-4 text-[#BC5633] animate-pulse" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Profile & Logout */}
      <div className="relative z-10 border-t border-[#F2F0EA]/5 p-6 bg-[#14281D]/50">
        <div className="flex items-center gap-3 mb-4 px-2">
           <div className="w-10 h-10 rounded-full bg-[#BC5633] flex items-center justify-center text-[#F2F0EA] font-serif font-bold text-lg shadow-lg shrink-0">
              {session?.user?.name?.charAt(0) || "A"}
           </div>
           <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#F2F0EA] truncate">{session?.user?.name || "Admin User"}</p>
              <p className="text-xs text-[#F2F0EA]/50 truncate">{session?.user?.email || "admin@won.com"}</p>
           </div>
        </div>
        
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="group flex w-full items-center justify-center gap-x-2 rounded-xl border border-[#F2F0EA]/10 p-2.5 text-xs font-bold uppercase tracking-wider text-[#F2F0EA]/70 hover:bg-[#8F4F3D] hover:text-white hover:border-[#8F4F3D] transition-all"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
