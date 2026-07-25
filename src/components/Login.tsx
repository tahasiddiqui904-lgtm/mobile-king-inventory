import React, { useState } from "react";
import { Lock, ArrowRight, Sparkles } from "lucide-react";

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [password, setPassword] = useState("Mobile2026");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Mobile2026") {
      sessionStorage.setItem("auth", "true");
      onLogin();
    } else {
      setError("Incorrect security key. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#070708] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans selection:bg-amber-500/20 selection:text-amber-300">
      {/* Decorative luxury gradient ambient glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-600/5 blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.2)] border border-amber-300/20">
            <Lock className="w-8 h-8 text-[#070708]" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-white uppercase font-sans">
          Mobile King <span className="text-amber-500 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">Hub</span>
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Enter admin credentials to access the secure suite
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#121215] py-8 px-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] sm:rounded-2xl sm:px-10 border border-amber-500/10 backdrop-blur-md">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-amber-500/80 uppercase tracking-widest"
                >
                  Access Password
                </label>
                <span className="text-[10px] text-slate-500 font-mono">Mobile2026</span>
              </div>
              <div className="mt-2 relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="appearance-none block w-full px-4 py-3 border border-[#212126] rounded-xl shadow-inner placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 sm:text-sm bg-[#18181d] text-white transition-all font-mono"
                  placeholder="••••••••••••"
                />
              </div>
              {error && (
                <div className="mt-3 flex items-center gap-2 text-xs text-red-400 font-medium bg-red-950/20 border border-red-900/30 p-2 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 focus:ring-offset-[#121215] transition-all cursor-pointer font-sans tracking-wide"
              >
                Sign In
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

