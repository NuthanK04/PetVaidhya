import { useEffect, useState } from "react";
import {
  Menu,
  X,
  PawPrint,
  LayoutDashboard,
  LogOut,
  Stethoscope,
  Heart,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

interface NavbarProps {
  onLogin: () => void;
  onRegister: () => void;
}

export default function Navbar({ onLogin, onRegister }: NavbarProps) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLogin = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(Boolean(token));
  };

  useEffect(() => {
    checkLogin();

    const handleAuthChange = () => {
      checkLogin();
    };

    window.addEventListener("petVaidyaAuthChanged", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("petVaidyaAuthChanged", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  const closeMenu = () => {
    setMobileOpen(false);
  };

  const goHome = () => {
    navigate("/");
    closeMenu();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("petVaidyaAuthChanged"));
    setIsLoggedIn(false);
    closeMenu();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* LOGO */}
        <button
          type="button"
          onClick={goHome}
          className="flex items-center gap-2 text-left"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
            <PawPrint size={22} />
          </div>
          <div>
            <div className="text-lg font-black leading-none text-slate-900">
              Pet Vaidya
            </div>
            <div className="text-[11px] font-semibold text-emerald-700">
              Better care. Happier pets.
            </div>
          </div>
        </button>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden items-center gap-6 lg:flex">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `text-sm font-bold transition ${
                isActive
                  ? "text-emerald-600"
                  : "text-slate-700 hover:text-emerald-600"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/vets"
            className={({ isActive }) =>
              `flex items-center gap-1.5 text-sm font-bold transition ${
                isActive
                  ? "text-emerald-600"
                  : "text-slate-700 hover:text-emerald-600"
              }`
            }
          >
            <Stethoscope size={16} />
            Find Vets
          </NavLink>

          <NavLink
            to="/services"
            className={({ isActive }) =>
              `text-sm font-bold transition ${
                isActive
                  ? "text-emerald-600"
                  : "text-slate-700 hover:text-emerald-600"
              }`
            }
          >
            Services
          </NavLink>

          {isLoggedIn && (
            <>
              <NavLink
                to="/pets"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 text-sm font-bold transition ${
                    isActive
                      ? "text-emerald-600"
                      : "text-slate-700 hover:text-emerald-600"
                  }`
                }
              >
                <Heart size={16} />
                My Pets & Health
              </NavLink>

              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 text-sm font-bold transition ${
                    isActive
                      ? "text-emerald-600"
                      : "text-slate-700 hover:text-emerald-600"
                  }`
                }
              >
                <LayoutDashboard size={16} />
                Dashboard
              </NavLink>
            </>
          )}

          <NavLink
            to="/how-it-works"
            className={({ isActive }) =>
              `text-sm font-bold transition ${
                isActive
                  ? "text-emerald-600"
                  : "text-slate-700 hover:text-emerald-600"
              }`
            }
          >
            How It Works
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `text-sm font-bold transition ${
                isActive
                  ? "text-emerald-600"
                  : "text-slate-700 hover:text-emerald-600"
              }`
            }
          >
            About
          </NavLink>
        </nav>

        {/* DESKTOP AUTH BUTTONS */}
        <div className="hidden items-center gap-3 lg:flex">
          {isLoggedIn ? (
            <>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100 border border-emerald-200"
              >
                <LayoutDashboard size={16} />
                My Dashboard
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
              >
                <LogOut size={15} />
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onLogin}
                className="rounded-xl px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
              >
                Login
              </button>

              <button
                type="button"
                onClick={onRegister}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-black text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700"
              >
                Get Started
              </button>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          className="rounded-lg p-2 text-slate-700 lg:hidden"
          onClick={() => setMobileOpen((value) => !value)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            <NavLink
              to="/"
              end
              onClick={closeMenu}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2.5 text-sm font-bold ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/vets"
              onClick={closeMenu}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2.5 text-sm font-bold ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              Find Veterinarians 🩺
            </NavLink>

            <NavLink
              to="/services"
              onClick={closeMenu}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2.5 text-sm font-bold ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              Services & Home Care
            </NavLink>

            {isLoggedIn && (
              <>
                <NavLink
                  to="/pets"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2.5 text-sm font-bold ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-slate-700 hover:bg-slate-100"
                    }`
                  }
                >
                  My Pets & Health Records 🐾
                </NavLink>

                <NavLink
                  to="/dashboard"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2.5 text-sm font-bold ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-slate-700 hover:bg-slate-100"
                    }`
                  }
                >
                  Dashboard
                </NavLink>
              </>
            )}

            <NavLink
              to="/how-it-works"
              onClick={closeMenu}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2.5 text-sm font-bold ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              How It Works
            </NavLink>

            <NavLink
              to="/about"
              onClick={closeMenu}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2.5 text-sm font-bold ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              About
            </NavLink>

            {/* MOBILE AUTH */}
            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
              {isLoggedIn ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();
                      navigate("/dashboard");
                    }}
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-xs font-bold text-emerald-800"
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 rounded-xl bg-rose-50 border border-rose-200 px-4 py-2.5 text-xs font-bold text-rose-700"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();
                      onLogin();
                    }}
                    className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-700"
                  >
                    Login
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();
                      onRegister();
                    }}
                    className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}