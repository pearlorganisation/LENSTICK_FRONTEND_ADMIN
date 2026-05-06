"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  ShoppingCart,
  Glasses,
  Layers,
  Users,
  MapPin,
  Settings,
  BookOpen,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useLogOutMutation } from "../services/authApi";
import { useDispatch } from "react-redux";
import { logout } from "../redux/auth/authSlice";
import { useRouter } from "next/navigation";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Products", href: "/admin/products", icon: Glasses },
  { name: "Categories", href: "/admin/category", icon: Layers },
  { name: "Lens Options", href: "/admin/lenses", icon: Layers },
  { name: "Customers", href: "/admin/users", icon: Users },
  { name: "Store Locations", href: "/admin/stores", icon: MapPin },
  { name: "Content/Blogs", href: "/admin/content", icon: BookOpen },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // Mobile drawer state
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop collapse state

  const [logOut, { isLoading }] = useLogOutMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logOut().unwrap();
      dispatch(logout());
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <>
      {/* 📱 MOBILE NAVIGATION BAR */}
      <div className="flex items-center justify-between bg-[#072369] px-5 py-2 text-white md:hidden sticky top-0 z-50 border-b border-white/5">
        {/* Wrapper div controls the size */}
        <div className="relative w-77 h-16">
          <Image
            src="/Logo.png"
            alt="Logo"
            fill // This makes the image fill the wrapper div
            priority
            className="brightness-0 invert object-contain object-left" // object-left keeps it pinned to the left
          />
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors shrink-0"
        >
          <Menu size={28} />
        </button>
      </div>

      {/*  MOBILE OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/*  MAIN SIDEBAR */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[70] bg-[#072369] text-slate-300 transition-all duration-300 ease-in-out md:relative flex flex-col h-screen border-r border-white/5",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "w-20" : "w-72",
          "md:translate-x-0"
        )}
      >
        {/* DESKTOP COLLAPSE TOGGLE BUTTON */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute -right-3 top-10 bg-blue-600 hover:bg-blue-500 text-white rounded-full w-6 h-6 items-center justify-center shadow-lg border border-[#0a192f] z-50 transition-transform"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* MOBILE CLOSE BUTTON */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white md:hidden"
        >
          <X size={24} />
        </button>

        {/* LOGO AREA */}
        <div className="h-24 flex items-center px-6 mb-4">
          <div className="relative w-full h-10">
            <Image
              src="/Logo.png"
              alt="Logo"
              fill
              className={cn(
                "brightness-0 invert object-contain transition-all duration-300",
                isCollapsed ? "scale-75 origin-left" : "scale-100"
              )}
            />
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 relative",
                  isCollapsed ? "justify-center" : "justify-start",
                  isActive
                    ? "bg-blue-600/10 text-blue-400 font-medium"
                    : "hover:bg-white/5 hover:text-white"
                )}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full" />
                )}

                <item.icon
                  size={20}
                  className={cn(
                    "shrink-0 transition-colors",
                    isActive
                      ? "text-blue-400"
                      : "text-slate-500 group-hover:text-white"
                  )}
                />

                {!isCollapsed && (
                  <span className="text-[14px] whitespace-nowrap">
                    {item.name}
                  </span>
                )}

                {/* Tooltip for Collapsed State */}
                {isCollapsed && (
                  <span className="absolute left-16 scale-0 group-hover:scale-100 transition-all bg-slate-800 text-white text-xs p-2 rounded shadow-xl z-50">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* FOOTER USER SECTION */}
        <div className="p-4 mt-auto border-t border-white/5 bg-black/20">
          <div
            className={cn(
              "flex items-center gap-3",
              isCollapsed ? "justify-center" : "justify-between"
            )}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center border border-white/10 shrink-0 shadow-lg text-white font-bold">
                A
              </div>

              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-white truncate">
                    Admin
                  </span>
                  <span className="text-[11px] text-slate-500 truncate">
                    admin@store.com
                  </span>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                title="Logout"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <LogOut size={18} />
                )}
              </button>
            )}
          </div>

          {/* Logout Icon only for collapsed state */}
          {isCollapsed && (
            <button
              onClick={handleLogout}
              className="w-full mt-4 flex justify-center text-slate-500 hover:text-red-400 transition-colors"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
