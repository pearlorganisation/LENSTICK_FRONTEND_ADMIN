"use client";
import React, { useState, useEffect } from "react";
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
  const router = useRouter();
  const dispatch = useDispatch();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [logOut, { isLoading }] = useLogOutMutation();

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

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
      {/* MOBILE TOP BAR */}
      <div className="flex md:hidden items-center justify-between bg-[#072369] px-4 h-16 sticky top-0 z-[50] border-b border-white/10 w-full shrink-0">
        <div className="relative w-32 h-10">
          <Image
            src="/Logo.png"
            alt="Logo"
            fill
            className="brightness-0 invert object-contain object-left"
            priority
          />
        </div>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 text-white"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* MOBILE OVERLAY */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={cn(
          "bg-[#072369] text-slate-300 flex flex-col transition-all duration-300 ease-in-out border-r border-white/5 h-[100dvh] z-[70]",
          // Mobile Logic: Fixed and Slide
          "fixed md:relative inset-y-0 left-0",
          isMobileOpen
            ? "translate-x-0 w-[280px]"
            : "-translate-x-full md:translate-x-0",
          // Desktop Logic: Width toggle
          isCollapsed ? "md:w-20" : "md:w-72"
        )}
      >
        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute -right-3 top-10 bg-blue-600 hover:bg-blue-500 text-white rounded-full w-6 h-6 items-center justify-center shadow-lg z-[80]"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div className="h-20 flex items-center px-6 shrink-0 relative">
          <div className="relative w-full h-10">
            <Image
              src="/Logo.png"
              alt="Logo"
              fill
              className={cn(
                "brightness-0 invert object-contain transition-all",
                isCollapsed ? "md:scale-75 md:origin-left" : "scale-100"
              )}
            />
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden ml-auto p-2 text-slate-400"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar pt-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 px-3 py-3 rounded-xl transition-all relative",
                  isCollapsed ? "md:justify-center" : "justify-start",
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon
                  size={20}
                  className={cn(
                    "shrink-0",
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-white"
                  )}
                />
                <span
                  className={cn(
                    "text-sm whitespace-nowrap transition-all",
                    isCollapsed ? "md:hidden" : "opacity-100"
                  )}
                >
                  {item.name}
                </span>
                {isCollapsed && (
                  <div className="hidden md:block absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 bg-black/20 border-t border-white/5 mt-auto">
          <div
            className={cn(
              "flex items-center gap-3",
              isCollapsed ? "md:justify-center" : "justify-between"
            )}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 text-white font-bold">
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
                className="p-2 text-slate-400 hover:text-red-400"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <LogOut size={18} />
                )}
              </button>
            )}
          </div>
          {isCollapsed && (
            <button
              onClick={handleLogout}
              className="hidden md:flex w-full mt-4 justify-center text-slate-400 hover:text-red-400"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
