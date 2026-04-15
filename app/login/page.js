"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here (e.g., calling an API or NextAuth)
    console.log("Logging in with:", email, password);
    window.location.href = "/admin"; // Temporary redirect for demo
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* BACKGROUND DECORATION */}
      <div className="fixed top-0 left-0 w-full h-1 bg-[#072369]"></div>

      <div className="w-full max-w-md">
        {/* LOGO AREA */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Admin Portal</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Please enter your details to sign in
          </p>
        </div>

        {/* LOGIN CARD */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-blue-900/10 border border-slate-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* EMAIL FIELD */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#072369] transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@lenstick.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#072369] focus:ring-4 focus:ring-blue-500/5 transition-all text-slate-700 font-medium"
                />
              </div>
            </div>

            {/* PASSWORD FIELD */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="#"
                  className="text-xs font-bold text-[#072369] hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#072369] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#072369] focus:ring-4 focus:ring-blue-500/5 transition-all text-slate-700 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* REMEMBER ME */}
            <div className="flex items-center gap-2 ml-1">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-slate-300 text-[#072369] focus:ring-[#072369]"
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium text-slate-500 cursor-pointer"
              >
                Keep me logged in
              </label>
            </div>

            {/* SIGN IN BUTTON */}
            <button
              type="submit"
              className="w-full bg-[#072369] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#0a2e8a] transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]"
            >
              Sign In to Dashboard <ArrowRight size={18} />
            </button>
          </form>

          {/* FOOTER OF CARD */}
          <div className="bg-slate-50 p-6 border-t border-slate-100 text-center">
            <p className="text-xs font-medium text-slate-400">
              Protected by Lenstick Security System
            </p>
          </div>
        </div>

        {/* BACK TO MAIN SITE */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="text-sm font-bold text-slate-400 hover:text-[#072369] transition-colors"
          >
            &larr; Back to Lenstick Store
          </Link>
        </div>
      </div>
    </div>
  );
}
