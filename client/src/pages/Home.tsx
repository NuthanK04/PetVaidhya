import {
  ArrowRight,
  Bath,
  CalendarCheck,
  Check,
  ChevronRight,
  Heart,
  Home as HomeIcon,
  PawPrint,
  Scissors,
  Sparkles,
  Stethoscope,
  WalletCards,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HomeProps {
  onLogin: () => void;
  onRegister: () => void;
}

const quickServices = [
  {
    title: "Find a Vet",
    subtitle: "Trusted veterinary care",
    icon: Stethoscope,
    path: "/vets",
  },
  {
    title: "Home Visit",
    subtitle: "Care at your doorstep",
    icon: HomeIcon,
    path: "/vets",
  },
  {
    title: "Grooming",
    subtitle: "Fresh, clean & happy",
    icon: Scissors,
    path: "/services",
  },
  {
    title: "Bathing",
    subtitle: "Gentle pet bathing",
    icon: Bath,
    path: "/services",
  },
  {
    title: "Pet Walking",
    subtitle: "Daily walks made easy",
    icon: PawPrint,
    path: "/services",
  },
  {
    title: "Pet Sitting",
    subtitle: "Caring help when away",
    icon: Heart,
    path: "/services",
  },
];

const popularServices = [
  {
    title: "Veterinary Consultation",
    category: "Healthcare",
    price: "From ₹500",
    icon: Stethoscope,
    path: "/vets",
  },
  {
    title: "Home Veterinary Visit",
    category: "Healthcare",
    price: "From ₹800",
    icon: HomeIcon,
    path: "/vets",
  },
  {
    title: "Premium Grooming",
    category: "Pet Care",
    price: "From ₹799",
    icon: Scissors,
    path: "/services",
  },
];

const benefits = [
  "Verified veterinarians and pet-care professionals",
  "Simple online booking for clinic & home visits",
  "Digital pet medical records & prescriptions",
  "Vaccination reminders & schedule tracking",
  "Rewards & exclusive loyalty token discounts",
  "24/7 Emergency veterinary care access",
];

export default function Home(_props: HomeProps) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <main className="overflow-hidden">
      {/* ================= HERO ================= */}
      <section
        id="home"
        className="relative px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pb-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="pet-gradient relative overflow-hidden rounded-[2rem] px-5 py-12 text-white shadow-2xl sm:px-10 lg:px-14 lg:py-16">
            {/* Decorative circles */}
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-amber-300/10 blur-3xl" />

            <div className="relative grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
              {/* Hero text */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
                  <Sparkles size={16} />
                  Your pet's complete care companion
                </div>

                <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                  Care for them.
                  <span className="block text-amber-300">Love them.</span>
                </h1>

                <p className="mt-6 max-w-xl text-base leading-7 text-emerald-50 sm:text-lg">
                  Find verified veterinarians, book doorstep home visits, manage digital
                  health records, and discover essential care — all in one centralized platform.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => navigate(token ? "/vets" : "/register")}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-emerald-700 transition hover:bg-emerald-50"
                  >
                    Find Veterinarians
                    <ArrowRight size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(token ? "/dashboard" : "/login")}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 font-bold text-white backdrop-blur transition hover:bg-white/15"
                  >
                    {token ? "Go to Dashboard" : "I already have an account"}
                  </button>
                </div>

                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-emerald-50">
                  <div className="flex items-center gap-2">
                    <Check size={16} />
                    Verified Doctors & Specialists
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={16} />
                    Doorstep Home Visits
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={16} />
                    PV Loyalty Rewards
                  </div>
                </div>
              </div>

              {/* Hero dashboard */}
              <div
                onClick={() => navigate(token ? "/dashboard" : "/vets")}
                className="glass-card soft-shadow cursor-pointer rounded-3xl border border-white/30 p-4 text-slate-900 transition hover:scale-[1.01] sm:p-5"
              >
                <div className="rounded-2xl bg-slate-50 p-5">
                  {/* Pet profile */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                        <PawPrint size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          My pet passport
                        </p>
                        <h2 className="font-black text-slate-900">Bruno (Golden Retriever)</h2>
                      </div>
                    </div>
                    <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                      Healthy • Active
                    </div>
                  </div>

                  {/* Pet stats */}
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white p-4">
                      <p className="text-xs text-slate-400">Next vaccination</p>
                      <p className="mt-1 text-sm font-bold">Anti-Rabies</p>
                      <p className="mt-1 text-xs text-slate-500">Due in 7 days</p>
                    </div>

                    <div className="rounded-2xl bg-white p-4">
                      <p className="text-xs text-slate-400">PV Tokens</p>
                      <p className="mt-1 text-xl font-black text-amber-600">350</p>
                      <p className="mt-1 text-xs text-slate-500">₹35 reward value</p>
                    </div>
                  </div>

                  {/* Upcoming appointment */}
                  <div className="mt-3 rounded-2xl bg-white p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
                          <CalendarCheck size={20} />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Upcoming appointment</p>
                          <p className="text-sm font-bold">Doorstep Home Vet Visit</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= QUICK SERVICES ================= */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-600">
                Quick care
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
                What does your pet need today?
              </h2>
            </div>

            <button
              type="button"
              onClick={() => navigate("/services")}
              className="hidden items-center gap-1 text-sm font-bold text-emerald-700 sm:flex"
            >
              View all
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {quickServices.map((service) => {
              const Icon = service.icon;

              return (
                <button
                  key={service.title}
                  type="button"
                  onClick={() => navigate(service.path)}
                  className="hover-lift group rounded-2xl border border-slate-200 bg-white p-4 text-left"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-4 text-sm font-bold text-slate-900">
                    {service.title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {service.subtitle}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= FIRST BOOKING OFFER ================= */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-orange-50">
            <div className="grid items-center gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:p-10">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700">
                  <Sparkles size={14} />
                  Welcome offer
                </div>

                <h2 className="mt-4 text-3xl font-black text-slate-900">
                  Get ₹100 OFF your first veterinary or care booking
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                  New to Pet Vaidya? Enjoy ₹100 OFF with coupon WELCOME100 on any eligible vet
                  consultation, home visit, or grooming session.
                </p>

                <div className="mt-5 inline-flex items-center gap-3 rounded-xl border border-dashed border-amber-300 bg-white px-4 py-3">
                  <span className="text-xs font-semibold text-slate-500">CODE</span>
                  <span className="font-black tracking-widest text-amber-700">
                    WELCOME100
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/vets")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 font-bold text-white transition hover:bg-amber-600"
              >
                Claim & Book
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= POPULAR SERVICES ================= */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-600">
              Popular care
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
              Care that fits your pet's needs
            </h2>
            <p className="mt-4 text-slate-600">
              From veterinary consultations to everyday grooming, choose trusted services.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {popularServices.map((service) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.title}
                  className="hover-lift overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="h-2 bg-emerald-600" />
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                        <Icon size={23} />
                      </div>
                      <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        {service.category}
                      </div>
                    </div>

                    <h3 className="mt-5 text-xl font-black text-slate-900">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-2xl font-black text-emerald-700">
                      {service.price}
                    </p>

                    <button
                      type="button"
                      onClick={() => navigate(service.path)}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 font-bold text-white transition hover:bg-slate-800"
                    >
                      Book & Explore
                      <ArrowRight size={17} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= WHY PET VAIDYA ================= */}
      <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-600">
              Why Pet Vaidya
            </p>
            <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
              More than a booking website
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-slate-600">
              Pet Vaidya is your pet's complete digital care companion — from their first checkup
              to medical history and doorstep home veterinary visits.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <Check size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                  <span className="text-sm font-semibold text-slate-700">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Rewards Card */}
          <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-2xl sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Your Pet Vaidya Wallet</p>
                <h3 className="mt-1 text-3xl font-black">350 PV</h3>
              </div>
              <div className="rounded-2xl bg-amber-400/15 p-3 text-amber-300">
                <WalletCards size={25} />
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Reward value</span>
                <span className="font-bold text-amber-300">₹35</span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[68%] rounded-full bg-amber-400" />
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-400">
                Earn PV Tokens through verified bookings, medical record uploads, and reviews.
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs text-slate-400">Next reward</p>
                <p className="mt-1 font-bold">50 tokens</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs text-slate-400">Referral bonus</p>
                <p className="mt-1 font-bold">100 tokens</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="pet-gradient mx-auto max-w-7xl rounded-[2rem] px-6 py-12 text-white sm:px-10 lg:px-14">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-100">
                Start today
              </p>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                Your pet deserves care built around them.
              </h2>
              <p className="mt-4 text-emerald-50">
                Find trusted veterinarians, book doorstep visits, and manage all your pet's healthcare in one place.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate(token ? "/vets" : "/register")}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-7 py-4 font-black text-emerald-700 transition hover:bg-emerald-50"
            >
              Get Started Now
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}