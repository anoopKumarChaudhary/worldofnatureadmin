"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Lock, CheckCircle2, Eye, EyeOff } from "lucide-react";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Something went wrong");
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#14281D] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#BC5633] rounded-full blur-[150px] opacity-20 animate-float"></div>

        <div className="max-w-md w-full mx-4 relative z-10">
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl text-center">
            <div className="w-20 h-20 bg-[#BC5633] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-3xl font-serif font-bold text-white mb-4">
              Password Reset!
            </h2>
            
            <p className="text-[#F2F0EA]/60 text-base mb-8">
              Your password has been successfully updated. Redirecting you to login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#14281D] relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#BC5633] rounded-full blur-[150px] opacity-20 animate-float"></div>

      <div className="max-w-md w-full mx-4 relative z-10">
        <div className="absolute -top-12 left-0">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#F2F0EA]/60 hover:text-[#BC5633] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-6 border border-white/10">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-white mb-2">
              Reset Password
            </h2>
            <p className="text-[#F2F0EA]/60 text-sm">
              Enter the code sent to <strong>{email}</strong> and your new password.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#F2F0EA]/60 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                required
                placeholder="000000"
                className="block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-center text-xl font-bold tracking-[0.5em] placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#BC5633] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#F2F0EA]/60 mb-2">
                New Password
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#BC5633] focus:border-transparent transition-all"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#F2F0EA]/40 hover:text-white transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <div className="text-sm text-red-200">{error}</div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || otp.length !== 6 || newPassword.length < 6}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-[#BC5633] hover:bg-[#A04628] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BC5633] focus:ring-offset-[#14281D] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#BC5633]/20 hover:shadow-[#BC5633]/40"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <span className="flex items-center gap-2">
                  Reset Password <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
