"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Mail, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Something went wrong");
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 2000);
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
              Check Your Email
            </h2>
            
            <p className="text-[#F2F0EA]/60 text-base mb-8">
              We've sent a password reset code to <span className="font-bold text-white">{email}</span>. Redirecting you...
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
              <span className="text-2xl font-bold text-white">?</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-white mb-2">
              Forgot Password
            </h2>
            <p className="text-[#F2F0EA]/60 text-sm">
              Enter your email and we'll send you a code to reset your password.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-[#F2F0EA]/60 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#F2F0EA]/40 group-focus-within:text-[#BC5633] transition-colors" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#BC5633] focus:border-transparent transition-all"
                  placeholder="admin@worldofnature.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
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
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-[#BC5633] hover:bg-[#A04628] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BC5633] focus:ring-offset-[#14281D] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#BC5633]/20 hover:shadow-[#BC5633]/40"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <span className="flex items-center gap-2">
                  Send Reset Code <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
