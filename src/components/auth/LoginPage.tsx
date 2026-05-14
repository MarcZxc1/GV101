import { useMemo, useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  User,
  Briefcase,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppStore } from "../../state/storeContext";
import type { Role } from "../../state/types";

export default function LoginPage() {
  const { actions } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as
    | { from?: string; role?: Role }
    | undefined;
  const preferredRole = locationState?.role ?? null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(preferredRole);
  const [error, setError] = useState<string | null>(null);

  const displayName = useMemo(() => {
    const fallback = selectedRole === "provider" ? "Provider" : "Customer";
    if (!email.trim()) return fallback;
    const base = email.split("@")[0] ?? "";
    if (!base.trim()) return fallback;
    return base
      .split(/[._-]+/)
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase() + part.slice(1))
      .join(" ");
  }, [email, selectedRole]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      setError("Select a role to continue.");
      return;
    }
    setError(null);
    actions.login({
      email: email.trim(),
      role: selectedRole,
      displayName,
    });
    const destination = locationState?.from ?? "/";
    navigate(destination, { replace: true });
  };

  return (
    <div className="min-h-dvh bg-white flex items-center justify-center p-4">
      {/* Back Button */}
      <button
        className="fixed top-6 left-6 w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors duration-200 z-10"
        aria-label="Go back"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-5 h-5 text-slate-700" />
      </button>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-[16px] font-black text-slate-900 tracking-wide uppercase mb-2">
            Sign In
          </h1>
          <p className="text-sm text-slate-500">
            Welcome back! Please enter your details.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-[#636363] rounded-[25px] p-6 shadow-xl">
          {/* Role Selection */}
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => setSelectedRole("customer")}
              className={`flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-[11px] transition-all duration-200 ${
                selectedRole === "customer"
                  ? "bg-[#9A9A9A] text-white"
                  : "bg-[#DEDEDE] text-slate-600 hover:bg-[#d0d0d0]"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide">
                Customer
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole("provider")}
              className={`flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-[11px] transition-all duration-200 ${
                selectedRole === "provider"
                  ? "bg-[#9A9A9A] text-white"
                  : "bg-[#DEDEDE] text-slate-600 hover:bg-[#d0d0d0]"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide">
                Provider
              </span>
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error ? (
              <div className="rounded-[11px] bg-white/15 px-3 py-2 text-xs font-semibold text-white">
                {error}
              </div>
            ) : null}
            {/* Email Field */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full h-14.5 bg-[#DEDEDE] rounded-[11px] pl-12 pr-4 text-slate-800 placeholder:text-slate-500 text-sm font-medium outline-none focus:ring-2 focus:ring-[#9A9A9A] transition-all duration-200"
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full h-14.5 bg-[#DEDEDE] rounded-[11px] pl-12 pr-12 text-slate-800 placeholder:text-slate-500 text-sm font-medium outline-none focus:ring-2 focus:ring-[#9A9A9A] transition-all duration-200"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <a
                href="#"
                className="text-xs font-semibold text-white/80 hover:text-white transition-colors duration-200"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-17.25 bg-[#1F1F1F] text-white rounded-[23px] text-[16px] font-black uppercase tracking-wide hover:bg-slate-800 active:translate-y-0.5 transition-all duration-200 shadow-lg"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Sign Up Link */}
        <p className="text-center mt-6 text-sm text-slate-600">
          Don't have an account?{" "}
          <a
            href="#"
            className="font-semibold text-slate-900 hover:underline transition-colors duration-200"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
