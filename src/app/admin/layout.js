
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Sidebar from "../../components/Sidebar";
import { cn } from "../../lib/utils"; // Assuming you have a cn utility

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!isAuthenticated && !token) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  return (
    // 1. We use flex-col for mobile (so main is below the header)
    // 2. We use md:flex-row for desktop (so main is next to sidebar)
    <div className="flex flex-col md:flex-row h-screen w-full bg-slate-50 overflow-hidden">
      {/* 
        This component handles:
        - Mobile: Sticky Top Nav + Fixed Drawer
        - Desktop: Side Nav (Collapsible)
      */}
      <Sidebar />

      {/* 
        The Main Section:
        - flex-1: takes remaining space
        - h-full: ensures it fills the height
        - overflow-y-auto: makes the content area scrollable while sidebar/header stay put
      */}
      <main className="flex-1 h-full w-full overflow-y-auto overflow-x-hidden">
        <div
          className={cn(
            "p-4 md:p-6 lg:p-8", // Responsive padding
            "max-w-screen-2xl mx-auto w-full" // Constrains width on massive screens
          )}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
