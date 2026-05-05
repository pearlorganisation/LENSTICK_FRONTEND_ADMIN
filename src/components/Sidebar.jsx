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
} from "lucide-react";
import { cn } from "../lib/utils";
import { useLogOutMutation } from "../services/authApi";
import { useDispatch } from "react-redux";
import { logOut } from "../redux/auth/authSlice";
import { useRouter } from "next/navigation";
import { api } from "../services/api";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Products (Frames)", href: "/admin/products", icon: Glasses },
  { name: "Categories", href: "/admin/category", icon: Layers },
  { name: "Lens Options", href: "/admin/lenses", icon: Layers },
  { name: "Customers", href: "/admin/users", icon: Users },
  { name: "Store Locations", href: "/admin/stores", icon: MapPin },
  { name: "Content/Blogs", href: "/admin/content", icon: BookOpen },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // Mobile toggle state

  const [logOut, { isLoading }] = useLogOutMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logOut().unwrap();
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <>
      {/* MOBILE TOP BAR (Only visible on small screens) */}
      <div className="flex items-center justify-between bg-[#072369] p-4 text-white md:hidden sticky top-0 z-50">
        <Image
          src="/Logo.png"
          alt="Logo"
          width={100}
          height={30}
          className="brightness-0 invert"
          style={{ width: "auto" }}
        />
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 bg-white/10 rounded-lg"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* BACKDROP (Dark overlay when mobile menu is open) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[60] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-[70] w-72 bg-[#072369] text-white transition-transform duration-300 ease-in-out md:relative md:translate-x-0 shadow-2xl md:shadow-none flex flex-col h-screen",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* CLOSE BUTTON (Mobile Only) */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 p-2 text-blue-300 hover:text-white md:hidden"
        >
          <X size={24} />
        </button>

        {/* LOGO */}
        <div className="px-8 py-10">
          <Image
            src="/Logo.png"
            alt="Lenstick Logo"
            width={140}
            height={40}
            className="brightness-0 invert"
          />
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-300/60 mt-4">
            Management Portal
          </p>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)} // Close menu when a link is clicked
                className={cn(
                  "group flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative",
                  isActive
                    ? "bg-white/10 text-white font-semibold"
                    : "text-blue-100/70 hover:bg-white/5 hover:text-white"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 w-1 h-6 bg-blue-400 rounded-r-full" />
                )}
                <item.icon
                  size={20}
                  className={
                    isActive
                      ? "text-blue-400"
                      : "text-blue-300/50 group-hover:text-white"
                  }
                />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* USER FOOTER */}
        <div className="p-6 border-t border-white/10 bg-black/10">
          <div className="flex items-center justify-between">
            {/* Admin Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center border-2 border-white/20 font-bold">
                AD
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Admin User</span>
                <span className="text-[11px] text-blue-300/60">
                  Administrator
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-blue-300/60 hover:bg-blue-300/60 transition"
            >
              {isLoading ? "..." : "Logout"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
