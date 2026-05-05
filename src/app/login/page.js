"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  ArrowRight,
  ShieldCheck,
  Edit3,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useDispatch } from "react-redux";

import {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useResendMutation,
} from "../../services/api";
import { setCredentials } from "../../redux/auth/authSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [resendOtp, { isLoading: isResending }] = useResendMutation();
  const [step, setStep] = useState("email"); // 'email' or 'otp'
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [errorMessage, setErrorMessage] = useState("");
  const inputRefs = useRef([]);

  // RTK Query Mutations
  const [sendOtp, { isLoading: isSending }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || email.trim() === "") {
      setErrorMessage("Email is required");
      return;
    }

    try {
      await sendOtp({ email: email.trim() }).unwrap();
      setStep("otp");
    } catch (err) {
      setErrorMessage(
        err?.data?.message || "Failed to send OTP. Please try again."
      );
    }
  };

  const handleResend = async () => {
    setErrorMessage("");

    try {
      await resendOtp({ email, type: "LOGIN" }).unwrap();
    } catch (err) {
      setErrorMessage(err?.data?.message || "Failed to resend OTP. Try again.");
    }
  };

  // Handle OTP Digit Input
  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle Verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");
    setErrorMessage("");

    if (finalOtp.length === 4) {
      try {
        // Send email and otp to backend
        const userData = await verifyOtp({
          email,
          otp: finalOtp,
          type: "LOGIN",
        }).unwrap();

        console.log("user data ", userData);

        dispatch(
          setCredentials({
            admin: userData.data.user,
            token: userData.data.tokens.accessToken,
          })
        );

        // Redirect to dashboard
        router.push("/admin");
      } catch (err) {
        setErrorMessage(err?.data?.message || "Invalid or expired OTP code.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="fixed top-0 left-0 w-full h-1 bg-[#072369]"></div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Lenstick Admin
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            {step === "email"
              ? "Secure access for administrators"
              : "Verify your identity"}
          </p>
        </div>

        <div className="bg-white rounded-[2rem] shadow-2xl shadow-blue-900/10 border border-slate-100 overflow-hidden">
          {/* Error Alert */}
          {errorMessage && (
            <div className="mx-8 mt-6 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-2 text-sm">
              <AlertCircle size={16} />
              {errorMessage}
            </div>
          )}

          {step === "email" ? (
            <form onSubmit={handleEmailSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">
                  Administrator Email
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
                    placeholder="name@lenstick.com"
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#072369] focus:ring-4 focus:ring-blue-500/5 transition-all text-slate-700 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full bg-[#072369] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#0a2e8a] transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98] disabled:opacity-70"
              >
                {isSending ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Send Verification Code <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="p-8 space-y-8">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 bg-blue-50 text-[#072369] rounded-2xl flex items-center justify-center mb-4">
                  <ShieldCheck size={28} />
                </div>
                <h2 className="font-bold text-slate-800 text-lg">Enter Code</h2>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-slate-500">{email}</p>
                  <button
                    type="button"
                    onClick={() => setStep("email")}
                    className="text-[#072369] hover:text-blue-800"
                  >
                    <Edit3 size={12} />
                  </button>
                </div>
              </div>

              <div className="flex justify-between gap-2">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-12 h-14 text-center text-xl font-bold bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:border-[#072369] focus:ring-4 focus:ring-blue-500/5 transition-all text-[#072369]"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isVerifying || otp.join("").length < 4}
                className="w-full bg-[#072369] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#0a2e8a] transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Verify & Sign In"
                )}
              </button>

              <p className="text-center text-xs text-slate-400">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-[#072369] font-bold hover:underline"
                >
                  Resend
                </button>
              </p>
            </form>
          )}

          <div className="bg-slate-50/50 p-6 border-t border-slate-100 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Lenstick Secure Admin Access
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/"
            className="text-sm font-bold text-slate-400 hover:text-[#072369] transition-colors"
          >
            &larr; Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
