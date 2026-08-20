import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  PawPrint,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phoneNumber.trim();

    if (!cleanEmail && !cleanPhone) {
      setError("Please provide an email address or mobile number.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail !== "" ? cleanEmail : undefined,
          phoneNumber: cleanPhone !== "" ? cleanPhone : undefined,
          password,
          role: "PET_OWNER",
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Registration failed");
      }

      setSuccess("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
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
        {/* LEFT SIDE */}
        <div className="pet-gradient relative hidden overflow-hidden p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="relative">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
              <PawPrint size={28} />
            </div>

            <h1 className="mt-8 text-4xl font-black leading-tight">
              Join
              <span className="block text-amber-300">Pet Vaidya.</span>
            </h1>

            <p className="mt-5 max-w-md leading-7 text-emerald-50">
              Create your account and start managing your pet's healthcare,
              appointments, home visits, services, and rewards from one place.
            </p>
          </div>

          <div className="relative space-y-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/10 p-2">
                <PawPrint size={20} />
              </div>
              <div>
                <p className="font-bold">Create pet profiles</p>
                <p className="text-sm text-emerald-100">
                  Keep important pet medical & vaccine history together.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/10 p-2">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="font-bold">Manage care securely</p>
                <p className="text-sm text-emerald-100">
                  Access appointments, home visits, and records.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
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
              Get started
            </p>

            <h2 className="mt-2 text-3xl font-black text-slate-900">
              Create your account
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Join Pet Vaidya and start managing your pet's care.
            </p>

            {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* NAME */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Full name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Enter your full name"
                    required
                    autoComplete="name"
                    className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="register-email"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@gmail.com"
                    required
                    autoComplete="email"
                    className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>
              </div>

              {/* PHONE */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Phone number
                  <span className="ml-1 font-normal text-slate-400">
                    (optional)
                  </span>
                </label>

                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(event) => setPhoneNumber(event.target.value)}
                    placeholder="+91 98765 43210"
                    autoComplete="tel"
                    className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label
                  htmlFor="register-password"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Minimum 6 characters"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-12 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Confirm password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Enter password again"
                    required
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-12 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create Account"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="mt-8 border-t border-slate-200 pt-6 text-center">
              <p className="text-sm text-slate-500">Already have an account?</p>

              <Link
                to="/login"
                className="mt-2 inline-flex items-center font-bold text-emerald-700 hover:text-emerald-800"
              >
                Sign in
                <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}