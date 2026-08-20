import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Star,
  Home,
  Building2,
  Video,
  AlertCircle,
  Stethoscope,
  Award,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import { api } from "../services/api";
import BookingModal from "../components/BookingModal";

export default function FindVets() {
  const [vets, setVets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [filterHomeVisit, setFilterHomeVisit] = useState(false);
  const [filterOnline, setFilterOnline] = useState(false);
  const [filterEmergency, setFilterEmergency] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");

  // Booking Modal State
  const [selectedVet, setSelectedVet] = useState<any>(null);
  const [bookingMode, setBookingMode] = useState<
    "CLINIC_VISIT" | "HOME_VISIT" | "ONLINE_CONSULTATION" | "EMERGENCY"
  >("CLINIC_VISIT");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const fetchVets = async () => {
    setLoading(true);
    try {
      const res = await api.getVeterinarians({
        search: search || undefined,
        city: selectedCity || undefined,
        specialization: selectedSpecialty || undefined,
        homeVisitAvailable: filterHomeVisit ? true : undefined,
        onlineAvailable: filterOnline ? true : undefined,
        emergencyAvailable: filterEmergency ? true : undefined,
      });

      if (res.success) {
        setVets(res.data);
      }
    } catch (err) {
      console.error("Failed to load veterinarians", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVets();
  }, [selectedCity, filterHomeVisit, filterOnline, filterEmergency, selectedSpecialty]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVets();
  };

  const handleOpenBooking = (
    vet: any,
    mode: "CLINIC_VISIT" | "HOME_VISIT" | "ONLINE_CONSULTATION" | "EMERGENCY"
  ) => {
    setSelectedVet(vet);
    setBookingMode(mode);
    setIsBookingModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-[#fffdf7] pb-20">
      {/* Header Banner */}
      <section className="pet-gradient px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur">
            <Sparkles size={14} />
            Verified & Trusted Veterinary Care
          </div>
          <h1 className="mt-4 text-3xl font-black sm:text-5xl">
            Find Veterinarians & Consultants
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50 sm:text-base">
            Book appointments at top clinics, schedule convenient home veterinary visits,
            or consult with certified specialists online.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search by doctor name, clinic, or specialization..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl bg-white py-3.5 pl-12 pr-4 text-sm font-medium text-slate-900 shadow-xl shadow-slate-900/10 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div className="relative w-full sm:w-48">
              <MapPin className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full appearance-none rounded-2xl bg-white py-3.5 pl-11 pr-8 text-sm font-medium text-slate-900 shadow-xl shadow-slate-900/10 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="">All Cities</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Mumbai">Mumbai</option>
                <option value="New Delhi">New Delhi</option>
                <option value="Chennai">Chennai</option>
              </select>
            </div>

            <button
              type="submit"
              className="rounded-2xl bg-amber-400 px-7 py-3.5 text-sm font-black text-slate-950 shadow-lg shadow-amber-400/30 transition hover:bg-amber-300"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Filter Chips */}
      <section className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-400">
            <SlidersHorizontal size={14} />
            Filters:
          </span>

          <button
            type="button"
            onClick={() => {
              setFilterHomeVisit(false);
              setFilterOnline(false);
              setFilterEmergency(false);
              setSelectedSpecialty("");
            }}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              !filterHomeVisit && !filterOnline && !filterEmergency && !selectedSpecialty
                ? "bg-emerald-600 text-white"
                : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
            }`}
          >
            All Specialists
          </button>

          <button
            type="button"
            onClick={() => setFilterHomeVisit(!filterHomeVisit)}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              filterHomeVisit
                ? "bg-emerald-600 text-white shadow-sm"
                : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Home size={14} />
            Home Visit Available 🏡
          </button>

          <button
            type="button"
            onClick={() => setFilterOnline(!filterOnline)}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              filterOnline
                ? "bg-emerald-600 text-white shadow-sm"
                : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Video size={14} />
            Online Video Consult 💻
          </button>

          <button
            type="button"
            onClick={() => setFilterEmergency(!filterEmergency)}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              filterEmergency
                ? "bg-rose-600 text-white shadow-sm"
                : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
            }`}
          >
            <AlertCircle size={14} />
            24/7 Emergency 🚨
          </button>

          <button
            type="button"
            onClick={() =>
              setSelectedSpecialty(
                selectedSpecialty === "Surgery" ? "" : "Surgery"
              )
            }
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              selectedSpecialty === "Surgery"
                ? "bg-emerald-600 text-white"
                : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
            }`}
          >
            Surgery & Orthopedics 🩺
          </button>

          <button
            type="button"
            onClick={() =>
              setSelectedSpecialty(
                selectedSpecialty === "Feline" ? "" : "Feline"
              )
            }
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              selectedSpecialty === "Feline"
                ? "bg-emerald-600 text-white"
                : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
            }`}
          >
            Feline Specialist 🐈
          </button>
        </div>
      </section>

      {/* Veterinarian Cards Grid */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-slate-600">
            Showing <span className="text-slate-900">{vets.length}</span> verified veterinarians
          </p>
        </div>

        {loading ? (
          <div className="mt-12 flex justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
              <p className="text-xs font-semibold text-slate-500">Finding best veterinarians near you...</p>
            </div>
          </div>
        ) : vets.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <Stethoscope size={28} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">No veterinarians found</h3>
            <p className="mt-1 text-xs text-slate-500">
              Try adjusting your search criteria, city filter, or toggle options.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vets.map((vet) => (
              <article
                key={vet.id}
                className="hover-lift flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div>
                  {/* Top info */}
                  <div className="flex items-start gap-4">
                    <img
                      src={
                        vet.user?.profileImage ||
                        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200"
                      }
                      alt={vet.user?.name || "Doctor"}
                      className="h-16 w-16 rounded-2xl object-cover ring-2 ring-emerald-100"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-black text-slate-900 truncate">
                          {vet.user?.name || "Dr. Veterinarian"}
                        </h3>
                        {vet.verified && (
                          <span
                            title="Verified Practitioner"
                            className="inline-flex rounded-full bg-emerald-100 p-0.5 text-emerald-700"
                          >
                            <Award size={14} />
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-semibold text-emerald-700 truncate">
                        {vet.specialization || "General Veterinary Physician"}
                      </p>

                      <p className="text-[11px] text-slate-400 truncate">
                        {vet.qualification} • {vet.experienceYears || 5}+ yrs exp
                      </p>

                      {/* Rating */}
                      <div className="mt-1.5 flex items-center gap-1">
                        <div className="flex items-center text-amber-500">
                          <Star size={13} fill="currentColor" />
                          <span className="ml-1 text-xs font-black text-slate-900">
                            {vet.rating || 4.9}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          ({vet.reviewCount || 18} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Clinic & Location */}
                  <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <Building2 size={14} className="text-slate-400" />
                      <span className="truncate">{vet.clinicName || "Pet Care Clinic"}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-slate-500">
                      <MapPin size={14} className="text-slate-400" />
                      <span className="truncate">
                        {vet.address ? `${vet.address}, ` : ""}{vet.city || "Bengaluru"}
                      </span>
                    </div>
                  </div>

                  {/* Bio */}
                  {vet.bio && (
                    <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-500">
                      {vet.bio}
                    </p>
                  )}

                  {/* Availability Badges */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {vet.homeVisitAvailable && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-100">
                        <Home size={12} />
                        Home Visits
                      </span>
                    )}
                    {vet.onlineAvailable && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700 border border-blue-100">
                        <Video size={12} />
                        Video Consult
                      </span>
                    )}
                    {vet.emergencyAvailable && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700 border border-rose-100">
                        <AlertCircle size={12} />
                        24/7 Emergency
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer & Actions */}
                <div className="mt-6 border-t border-slate-100 pt-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400">
                        Consultation Fee
                      </span>
                      <div className="text-lg font-black text-slate-900">
                        ₹{Number(vet.consultationFee)}
                      </div>
                    </div>
                    {vet.homeVisitAvailable && (
                      <div className="text-right">
                        <span className="text-[10px] uppercase tracking-wider text-emerald-700 font-semibold">
                          Home Visit
                        </span>
                        <div className="text-xs font-bold text-emerald-700">
                          +₹300 doorstep
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {vet.homeVisitAvailable ? (
                      <button
                        type="button"
                        onClick={() => handleOpenBooking(vet, "HOME_VISIT")}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700"
                      >
                        <Home size={14} />
                        Home Visit
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenBooking(vet, "ONLINE_CONSULTATION")}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700"
                      >
                        <Video size={14} />
                        Online Consult
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleOpenBooking(vet, "CLINIC_VISIT")}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 py-2.5 text-xs font-bold text-slate-800 transition hover:bg-slate-50"
                    >
                      <Building2 size={14} />
                      Clinic Visit
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        initialVet={selectedVet}
        initialMode={bookingMode}
        onSuccess={() => {
          // Success handled in modal
        }}
      />
    </main>
  );
}
