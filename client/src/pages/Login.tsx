import { useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  PawPrint,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /*
   * ==========================================
   * EMAIL + PASSWORD LOGIN
   * ==========================================
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    const cleanIdentifier = email.trim();

    try {
      const result = await api.login(cleanIdentifier, password);

      if (!result.success) {
        throw new Error(result.message || "Invalid email or password");
      }

      /*
       * Save login token
       */
      localStorage.setItem("token", result.data.token);

      /*
       * Save user profile
       */
      if (result.data.user) {
        localStorage.setItem("user", JSON.stringify(result.data.user));
      }

      /*
       * Broadcast auth change
       */
      window.dispatchEvent(new Event("petVaidyaAuthChanged"));

      /*
       * Redirect to Home
       */
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login error:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#fffdf7] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl lg:grid-cols-2">
        {/* ==================================
            LEFT SIDE
        ================================== */}
        <div className="pet-gradient relative hidden overflow-hidden p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="relative">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
              <PawPrint size={28} />
            </div>

            <h1 className="mt-8 text-4xl font-black leading-tight">
              Welcome back to
              <span className="block text-amber-300">Pet Vaidya.</span>
            </h1>

            <p className="mt-5 max-w-md leading-7 text-emerald-50">
              Continue managing your pet's healthcare, appointments, home visits,
              services, and rewards from one convenient place.
            </p>
          </div>

          <div className="relative space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/10 p-2">
                <ShieldCheck size={20} />
              </div>

              <div>
                <p className="font-bold">Your information stays protected</p>
                <p className="text-sm text-emerald-100">
                  Secure authentication and protected access.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/10 p-2">
                <PawPrint size={20} />
              </div>

              <div>
                <p className="font-bold">Everything about your pet</p>
                <p className="text-sm text-emerald-100">
                  Pets, appointments, records and services.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================
            RIGHT SIDE
        ================================== */}
        <div className="p-6 sm:p-10 lg:p-12">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <PawPrint size={22} />
            </div>

            <div>
              <p className="font-black text-slate-900">Pet Vaidya</p>
              <p className="text-xs text-slate-500">Better care. Happier pets.</p>
            </div>
          </div>

          <div className="max-w-md">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-600">
              Welcome back
            </p>

            <h2 className="mt-2 text-3xl font-black text-slate-900">
              Sign in to your account
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Access your pets, appointments and Pet Vaidya services.
            </p>

            {/* ERROR */}
            {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Email or Mobile Number
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@gmail.com or 9876543210"
                    required
                    autoComplete="username"
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-bold text-slate-700"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
                    onClick={() =>
                      alert(
                        "Please use your registered password or create a new account."
                      )
                    }
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            {/* REGISTER */}
            <div className="mt-8 border-t border-slate-200 pt-6 text-center">
              <p className="text-sm text-slate-500">
                Don't have a Pet Vaidya account?
              </p>

              <Link
                to="/register"
                className="mt-2 inline-flex font-bold text-emerald-700 hover:text-emerald-800"
              >
                Create an account
                <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}