import { useState, useEffect } from "react";
import {
  PawPrint,
  Plus,
  Syringe,
  FileText,
  Calendar,
  Scale,
  Sparkles,
  Stethoscope,
  Home as HomeIcon,
  Trash2,
} from "lucide-react";
import { api } from "../services/api";
import AddPetModal from "../components/AddPetModal";
import AddHealthRecordModal from "../components/AddHealthRecordModal";
import BookingModal from "../components/BookingModal";

export default function Pets() {
  const [pets, setPets] = useState<any[]>([]);
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [medicalRecords, setMedicalRecords] = useState<any[]>([]);
  const [vaccinations, setVaccinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"VACCINATIONS" | "MEDICAL">("VACCINATIONS");

  // Modals
  const [isAddPetOpen, setIsAddPetOpen] = useState(false);
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);
  const [recordModalTab, setRecordModalTab] = useState<"VACCINATION" | "MEDICAL">("VACCINATION");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingMode, setBookingMode] = useState<"CLINIC_VISIT" | "HOME_VISIT">("CLINIC_VISIT");

  const loadPets = async () => {
    setLoading(true);
    try {
      const res = await api.getPets();
      if (res.success && res.data) {
        setPets(res.data);
        if (res.data.length > 0) {
          if (!selectedPet || !res.data.find((p: any) => p.id === selectedPet.id)) {
            setSelectedPet(res.data[0]);
          }
        } else {
          setSelectedPet(null);
        }
      }
    } catch (err) {
      console.error("Failed to load pets", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPets();
  }, []);

  const loadPetHealthData = async (petId: string) => {
    try {
      const [recordsRes, vacRes] = await Promise.all([
        api.getPetMedicalRecords(petId),
        api.getPetVaccinations(petId),
      ]);

      if (recordsRes.success) setMedicalRecords(recordsRes.data);
      if (vacRes.success) setVaccinations(vacRes.data);
    } catch (err) {
      console.error("Failed to load pet health records", err);
    }
  };

  useEffect(() => {
    if (selectedPet?.id) {
      loadPetHealthData(selectedPet.id);
    }
  }, [selectedPet]);

  const handleDeletePet = async (petId: string) => {
    if (confirm("Are you sure you want to delete this pet profile?")) {
      try {
        await api.deletePet(petId);
        loadPets();
      } catch (err) {
        console.error("Failed to delete pet", err);
      }
    }
  };

  const getAge = (dobString?: string) => {
    if (!dobString) return "Age not specified";
    const dob = new Date(dobString);
    const diffMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffMs);
    const years = Math.abs(ageDate.getUTCFullYear() - 1970);
    const months = ageDate.getUTCMonth();

    if (years === 0) {
      return `${months} month${months !== 1 ? "s" : ""} old`;
    }
    return `${years} yr${years !== 1 ? "s" : ""} ${months > 0 ? `${months} mo` : ""}`;
  };

  const getVaccinationStatus = (nextDue?: string) => {
    if (!nextDue) return { text: "Completed", color: "bg-emerald-100 text-emerald-700" };
    const due = new Date(nextDue);
    const now = new Date();
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: "Overdue", color: "bg-rose-100 text-rose-700" };
    } else if (diffDays <= 14) {
      return { text: `Due in ${diffDays} days`, color: "bg-amber-100 text-amber-800" };
    }
    return { text: "Up to Date", color: "bg-emerald-100 text-emerald-700" };
  };

  return (
    <main className="min-h-screen bg-[#fffdf7] pb-20">
      {/* Header Banner */}
      <section className="pet-gradient px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur">
              <Sparkles size={14} />
              Pet Health & Medical Passport
            </div>
            <h1 className="mt-3 text-3xl font-black sm:text-4xl">
              My Pets & Health Records
            </h1>
            <p className="mt-1 text-xs text-emerald-50 sm:text-sm">
              Manage your pet profiles, track vaccination schedules, and store medical prescriptions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddPetOpen(true)}
            className="inline-flex items-center gap-2 self-start rounded-2xl bg-white px-5 py-3 text-sm font-black text-emerald-700 shadow-xl shadow-emerald-950/20 transition hover:bg-emerald-50"
          >
            <Plus size={18} />
            Add New Pet
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          </div>
        ) : pets.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <PawPrint size={32} />
            </div>
            <h3 className="mt-4 text-xl font-black text-slate-900">
              No pets registered yet
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Add your first pet to manage vaccinations, medical records, and book vet visits seamlessly.
            </p>
            <button
              type="button"
              onClick={() => setIsAddPetOpen(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700"
            >
              <Plus size={18} />
              Register Pet Now
            </button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
            {/* Left: Pet selector sidebar */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Your Pets ({pets.length})
              </h2>

              <div className="space-y-2">
                {pets.map((pet) => (
                  <button
                    key={pet.id}
                    type="button"
                    onClick={() => setSelectedPet(pet)}
                    className={`flex w-full items-center justify-between rounded-2xl border p-3.5 text-left transition ${
                      selectedPet?.id === pet.id
                        ? "border-emerald-600 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-600/20"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-xl font-bold text-emerald-800">
                        {pet.species === "Cat" ? "🐈" : pet.species === "Dog" ? "🐕" : "🐾"}
                      </div>
                      <div>
                        <div className="font-black text-slate-900">{pet.name}</div>
                        <div className="text-xs text-slate-500">
                          {pet.breed || pet.species} • {getAge(pet.dateOfBirth)}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setIsAddPetOpen(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white py-3 text-xs font-bold text-emerald-700 transition hover:border-emerald-500 hover:bg-emerald-50/30"
                >
                  <Plus size={16} />
                  Add Another Pet
                </button>
              </div>
            </div>

            {/* Right: Selected Pet Health Details */}
            {selectedPet && (
              <div className="space-y-6">
                {/* Pet Profile Card */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div className="flex items-start gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-3xl">
                        {selectedPet.species === "Cat" ? "🐈" : selectedPet.species === "Dog" ? "🐕" : "🐾"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-2xl font-black text-slate-900">
                            {selectedPet.name}
                          </h2>
                          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                            {selectedPet.gender === "MALE" ? "Male ♂️" : selectedPet.gender === "FEMALE" ? "Female ♀️" : "Pet"}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-slate-500">
                          {selectedPet.breed ? `${selectedPet.breed} • ` : ""}{selectedPet.species}
                        </p>
                      </div>
                    </div>

                    {/* Quick Vet Actions */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setBookingMode("HOME_VISIT");
                          setIsBookingOpen(true);
                        }}
                        className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700"
                      >
                        <HomeIcon size={14} />
                        Request Home Vet
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setBookingMode("CLINIC_VISIT");
                          setIsBookingOpen(true);
                        }}
                        className="flex items-center gap-1.5 rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      >
                        <Stethoscope size={14} />
                        Book Clinic Visit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePet(selectedPet.id)}
                        className="rounded-xl border border-slate-200 p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                        title="Delete Pet"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Vitals Grid */}
                  <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 sm:grid-cols-4">
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                        <Calendar size={13} />
                        Age
                      </span>
                      <p className="mt-1 text-sm font-black text-slate-900">
                        {getAge(selectedPet.dateOfBirth)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-3">
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                        <Scale size={13} />
                        Weight
                      </span>
                      <p className="mt-1 text-sm font-black text-slate-900">
                        {selectedPet.weightKg ? `${selectedPet.weightKg} kg` : "Not recorded"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-3">
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                        <Syringe size={13} />
                        Vaccines
                      </span>
                      <p className="mt-1 text-sm font-black text-emerald-700">
                        {vaccinations.length} logged
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-3">
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                        <FileText size={13} />
                        Medical History
                      </span>
                      <p className="mt-1 text-sm font-black text-slate-900">
                        {medicalRecords.length} records
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tab Navigator */}
                <div className="flex border-b border-slate-200">
                  <button
                    type="button"
                    onClick={() => setActiveTab("VACCINATIONS")}
                    className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-black transition ${
                      activeTab === "VACCINATIONS"
                        ? "border-emerald-600 text-emerald-700"
                        : "border-transparent text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <Syringe size={16} />
                    Vaccination Passport ({vaccinations.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("MEDICAL")}
                    className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-black transition ${
                      activeTab === "MEDICAL"
                        ? "border-emerald-600 text-emerald-700"
                        : "border-transparent text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <FileText size={16} />
                    Medical Records & Prescriptions ({medicalRecords.length})
                  </button>
                </div>

                {/* Tab Content */}
                {activeTab === "VACCINATIONS" ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-700">
                        Vaccination History & Reminders
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setRecordModalTab("VACCINATION");
                          setIsAddRecordOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                      >
                        <Plus size={14} />
                        Log Vaccination
                      </button>
                    </div>

                    {vaccinations.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
                        No vaccination records logged for {selectedPet.name} yet.
                      </div>
                    ) : (
                      <div className="grid gap-3">
                        {vaccinations.map((vac) => {
                          const status = getVaccinationStatus(vac.nextDueDate);
                          return (
                            <div
                              key={vac.id}
                              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                  <Syringe size={20} />
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900">
                                    {vac.vaccineName}
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    Administered: {new Date(vac.vaccinationDate).toLocaleDateString()}
                                    {vac.batchNumber && ` • Batch #${vac.batchNumber}`}
                                  </div>
                                  {vac.notes && (
                                    <div className="mt-1 text-xs text-slate-600 italic">
                                      "{vac.notes}"
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="text-right">
                                <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${status.color}`}>
                                  {status.text}
                                </span>
                                {vac.nextDueDate && (
                                  <div className="mt-1 text-[11px] text-slate-500">
                                    Next: {new Date(vac.nextDueDate).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-700">
                        Diagnosis, Prescriptions & Vet Notes
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setRecordModalTab("MEDICAL");
                          setIsAddRecordOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                      >
                        <Plus size={14} />
                        Add Medical Record
                      </button>
                    </div>

                    {medicalRecords.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
                        No medical records logged for {selectedPet.name} yet.
                      </div>
                    ) : (
                      <div className="grid gap-3">
                        {medicalRecords.map((rec) => (
                          <div
                            key={rec.id}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                          >
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                              <div className="flex items-center gap-2">
                                <span className="rounded-lg bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                                  {rec.type}
                                </span>
                                <span className="text-xs text-slate-400">
                                  {new Date(rec.recordDate).toLocaleDateString()}
                                </span>
                              </div>
                              {rec.veterinarian?.user?.name && (
                                <span className="text-xs font-semibold text-slate-600">
                                  by {rec.veterinarian.user.name}
                                </span>
                              )}
                            </div>

                            {rec.diagnosis && (
                              <div className="mt-3">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                  Diagnosis
                                </span>
                                <p className="text-sm font-bold text-slate-900">
                                  {rec.diagnosis}
                                </p>
                              </div>
                            )}

                            {rec.prescription && (
                              <div className="mt-3 rounded-xl bg-amber-50/70 p-3 text-xs text-amber-950">
                                <span className="font-bold uppercase tracking-wider text-amber-800">
                                  Prescribed Medications:
                                </span>
                                <p className="mt-1 whitespace-pre-line font-medium">
                                  {rec.prescription}
                                </p>
                              </div>
                            )}

                            {rec.treatment && (
                              <div className="mt-3 text-xs text-slate-600">
                                <span className="font-bold text-slate-700">Treatment Plan: </span>
                                {rec.treatment}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Add Pet Modal */}
      <AddPetModal
        isOpen={isAddPetOpen}
        onClose={() => setIsAddPetOpen(false)}
        onSuccess={loadPets}
      />

      {/* Add Health Record Modal */}
      {selectedPet && (
        <AddHealthRecordModal
          isOpen={isAddRecordOpen}
          onClose={() => setIsAddRecordOpen(false)}
          petId={selectedPet.id}
          petName={selectedPet.name}
          initialTab={recordModalTab}
          onSuccess={() => loadPetHealthData(selectedPet.id)}
        />
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialMode={bookingMode}
        onSuccess={() => {}}
      />
    </main>
  );
}
