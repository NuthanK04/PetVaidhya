import { useState, useEffect } from "react";
import {
  PawPrint,
  Calendar,
  Home,
  Building2,
  Video,
  AlertCircle,
  Coins,
  Plus,
  Stethoscope,
  Scissors,
  Syringe,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import BookingModal from "../components/BookingModal";
import AddPetModal from "../components/AddPetModal";

export default function Dashboard() {
  const navigate = useNavigate();
  const [pets, setPets] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingMode, setBookingMode] = useState<
    "CLINIC_VISIT" | "HOME_VISIT" | "ONLINE_CONSULTATION" | "EMERGENCY"
  >("CLINIC_VISIT");
  const [isAddPetOpen, setIsAddPetOpen] = useState(false);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [petsRes, apptRes, bookRes, remRes] = await Promise.all([
        api.getPets(),
        api.getAppointments(),
        api.getBookings(),
        api.getVaccinationReminders(),
      ]);

      if (petsRes.success) setPets(petsRes.data);
      if (apptRes.success) setAppointments(apptRes.data);
      if (bookRes.success) setBookings(bookRes.data);
      if (remRes.success) setReminders(remRes.data);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleCancelAppointment = async (id: string) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await api.updateAppointmentStatus(id, "CANCELLED");
        loadDashboardData();
      } catch (err) {
        console.error("Failed to cancel appointment", err);
      }
    }
  };

  const getVisitTypeIcon = (type: string) => {
    switch (type) {
      case "HOME_VISIT":
        return <Home size={16} className="text-emerald-600" />;
      case "ONLINE_CONSULTATION":
        return <Video size={16} className="text-blue-600" />;
      case "EMERGENCY":
        return <AlertCircle size={16} className="text-rose-600" />;
      default:
        return <Building2 size={16} className="text-slate-600" />;
    }
  };

  return (
    <main className="min-h-screen bg-[#fffdf7] pb-20">
      {/* Top Banner */}
      <section className="pet-gradient px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur">
              <Sparkles size={14} />
              Unified Pet Healthcare Hub
            </div>
            <h1 className="mt-3 text-3xl font-black sm:text-4xl">
              Welcome back to Pet Vaidya 🐾
            </h1>
            <p className="mt-1 text-xs text-emerald-50 sm:text-sm">
              All your veterinary consultations, doorstep home visits, and pet health records in one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setBookingMode("HOME_VISIT");
                setIsBookingOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-5 py-3 text-xs font-black text-slate-950 shadow-lg shadow-amber-400/20 transition hover:bg-amber-300"
            >
              <Home size={16} />
              Request Home Vet Visit
            </button>

            <button
              type="button"
              onClick={() => navigate("/vets")}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-black text-emerald-800 shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-50"
            >
              <Stethoscope size={16} />
              Find Veterinarians
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                My Pets
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <PawPrint size={18} />
              </div>
            </div>
            <p className="mt-3 text-2xl font-black text-slate-900">{pets.length}</p>
            <Link
              to="/pets"
              className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline"
            >
              Manage Pets & Vaccinations <ChevronRight size={13} />
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Appointments
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <Calendar size={18} />
              </div>
            </div>
            <p className="mt-3 text-2xl font-black text-slate-900">
              {appointments.filter((a) => a.status === "CONFIRMED" || a.status === "PENDING").length}
            </p>
            <span className="mt-2 block text-xs font-semibold text-slate-500">
              Upcoming visits
            </span>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Vaccine Alerts
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                <Syringe size={18} />
              </div>
            </div>
            <p className="mt-3 text-2xl font-black text-slate-900">{reminders.length}</p>
            <span className="mt-2 block text-xs font-semibold text-slate-500">
              Due / Scheduled
            </span>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                PV Tokens
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Coins size={18} />
              </div>
            </div>
            <p className="mt-3 text-2xl font-black text-amber-600">350</p>
            <span className="mt-2 block text-xs font-semibold text-slate-500">
              ₹35 reward discount
            </span>
          </div>
        </div>

        {/* Vaccination Reminder Notice (if any) */}
        {reminders.length > 0 && (
          <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50/70 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-amber-200/80 p-2 text-amber-900">
                <AlertCircle size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-black text-amber-950">
                  Upcoming Vaccination Reminder
                </h3>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {reminders.slice(0, 2).map((rem) => (
                    <div key={rem.id} className="rounded-xl bg-white/80 p-3 text-xs shadow-sm">
                      <div className="font-bold text-slate-900">
                        {rem.pet?.name} • {rem.vaccineName}
                      </div>
                      <div className="text-slate-500">
                        Due on: {new Date(rem.nextDueDate).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setBookingMode("HOME_VISIT");
                  setIsBookingOpen(true);
                }}
                className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-amber-700"
              >
                Schedule Shot at Home
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
          {/* Left: Upcoming Appointments & Bookings */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    Veterinary Consultations & Visits
                  </h2>
                  <p className="text-xs text-slate-400">
                    Your scheduled clinic, home, and video appointments
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setBookingMode("CLINIC_VISIT");
                    setIsBookingOpen(true);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
                >
                  <Plus size={14} />
                  Book New
                </button>
              </div>

              {loading ? (
                <div className="py-8 text-center">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
                </div>
              ) : appointments.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-500">
                  No upcoming veterinary appointments.
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => navigate("/vets")}
                      className="rounded-xl bg-emerald-50 px-4 py-2 font-bold text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                    >
                      Find a Doctor Near You
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {appointments.map((appt) => (
                    <div
                      key={appt.id}
                      className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition hover:bg-slate-50 sm:flex-row sm:items-center"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
                          {getVisitTypeIcon(appt.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">
                              {appt.veterinarian?.user?.name || "Veterinary Doctor"}
                            </span>
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase">
                              {appt.type.replace("_", " ")}
                            </span>
                          </div>

                          <div className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-slate-500">
                            <span>Pet: <strong>{appt.pet?.name}</strong></span>
                            <span>📅 {new Date(appt.appointmentDate).toLocaleDateString()}</span>
                            <span>⏰ {appt.appointmentTime}</span>
                          </div>

                          {appt.reason && (
                            <p className="mt-1 text-xs text-slate-600 italic">
                              Reason: "{appt.reason}"
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className="text-xs font-black text-slate-900">
                          ₹{Number(appt.totalAmount)}
                        </span>
                        {appt.status !== "CANCELLED" && (
                          <button
                            type="button"
                            onClick={() => handleCancelAppointment(appt.id)}
                            className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-700"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Essential Care Service Bookings */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    Pet Care Service Bookings
                  </h2>
                  <p className="text-xs text-slate-400">
                    Grooming, Bathing, Walking, Sitting, and Boarding
                  </p>
                </div>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
                >
                  View All Services <ChevronRight size={13} />
                </Link>
              </div>

              {bookings.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No service bookings yet. Treat your pet to grooming or daily walking!
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                          <Scissors size={18} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">
                            {booking.service?.name || "Pet Service"}
                          </div>
                          <div className="text-xs text-slate-500">
                            Booking #{booking.bookingNumber} • Pet: {booking.pet?.name}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                          {booking.status}
                        </span>
                        <div className="mt-1 text-xs font-black text-slate-900">
                          ₹{Number(booking.totalAmount)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: My Pets List & Quick Launchers */}
          <div className="space-y-6">
            {/* Pets Card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-lg font-black text-slate-900">
                  My Pet Family ({pets.length})
                </h2>
                <button
                  type="button"
                  onClick={() => setIsAddPetOpen(true)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
                >
                  <Plus size={14} /> Add Pet
                </button>
              </div>

              {pets.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No pets registered yet.
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {pets.map((pet) => (
                    <div
                      key={pet.id}
                      onClick={() => navigate("/pets")}
                      className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 transition hover:bg-emerald-50/50 hover:border-emerald-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-2xl font-bold text-emerald-800">
                          {pet.species === "Cat" ? "🐈" : pet.species === "Dog" ? "🐕" : "🐾"}
                        </div>
                        <div>
                          <div className="font-black text-slate-900">{pet.name}</div>
                          <div className="text-xs text-slate-500">
                            {pet.breed || pet.species} • {pet.gender}
                          </div>
                        </div>
                      </div>

                      <ChevronRight size={18} className="text-slate-400" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Care Actions */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black text-slate-900">
                Quick Healthcare Actions
              </h2>

              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => navigate("/vets")}
                  className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center transition hover:bg-emerald-50 hover:border-emerald-300"
                >
                  <Stethoscope size={24} className="mb-2 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-900">Find a Vet</span>
                  <span className="text-[10px] text-slate-400">Clinic & Online</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setBookingMode("HOME_VISIT");
                    setIsBookingOpen(true);
                  }}
                  className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center transition hover:bg-emerald-50 hover:border-emerald-300"
                >
                  <Home size={24} className="mb-2 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-900">Home Vet Visit</span>
                  <span className="text-[10px] text-emerald-700 font-bold">Doorstep Care</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/services")}
                  className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center transition hover:bg-emerald-50 hover:border-emerald-300"
                >
                  <Scissors size={24} className="mb-2 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-900">Grooming & Bath</span>
                  <span className="text-[10px] text-slate-400">Hygiene Care</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/pets")}
                  className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center transition hover:bg-emerald-50 hover:border-emerald-300"
                >
                  <Syringe size={24} className="mb-2 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-900">Vaccine Passport</span>
                  <span className="text-[10px] text-slate-400">Health History</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialMode={bookingMode}
        onSuccess={loadDashboardData}
      />

      <AddPetModal
        isOpen={isAddPetOpen}
        onClose={() => setIsAddPetOpen(false)}
        onSuccess={loadDashboardData}
      />
    </main>
  );
}
