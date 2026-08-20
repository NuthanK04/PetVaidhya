import { useState } from "react";
import { X, Syringe, FileText, Calendar, Sparkles } from "lucide-react";
import { api } from "../services/api";

interface AddHealthRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  petId: string;
  petName: string;
  initialTab?: "VACCINATION" | "MEDICAL";
  onSuccess: () => void;
}

export default function AddHealthRecordModal({
  isOpen,
  onClose,
  petId,
  petName,
  initialTab = "VACCINATION",
  onSuccess,
}: AddHealthRecordModalProps) {
  const [activeTab, setActiveTab] = useState<"VACCINATION" | "MEDICAL">(initialTab);

  // Vaccination fields
  const [vaccineName, setVaccineName] = useState("");
  const [vaccinationDate, setVaccinationDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [nextDueDate, setNextDueDate] = useState("");
  const [batchNumber, setBatchNumber] = useState("");

  // Medical Record fields
  const [recordType, setRecordType] = useState<"DIAGNOSIS" | "TREATMENT" | "PRESCRIPTION" | "GENERAL">("DIAGNOSIS");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [prescription, setPrescription] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (activeTab === "VACCINATION") {
        if (!vaccineName.trim()) {
          throw new Error("Vaccine name is required");
        }
        const res = await api.addPetVaccination(petId, {
          vaccineName: vaccineName.trim(),
          vaccinationDate,
          nextDueDate: nextDueDate || undefined,
          batchNumber: batchNumber.trim() || undefined,
          notes: notes.trim() || undefined,
        });

        if (!res.success) throw new Error(res.message || "Failed to record vaccination");
      } else {
        const res = await api.addPetMedicalRecord(petId, {
          type: recordType,
          diagnosis: diagnosis.trim() || undefined,
          treatment: treatment.trim() || undefined,
          prescription: prescription.trim() || undefined,
          notes: notes.trim() || undefined,
          recordDate: new Date().toISOString(),
        });

        if (!res.success) throw new Error(res.message || "Failed to save medical record");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Error saving record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="pet-gradient relative px-6 py-5 text-white">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white transition hover:bg-white/30"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-100">
            <Sparkles size={14} />
            Pet Health Record • {petName}
          </div>
          <h2 className="mt-1 text-2xl font-black">
            {activeTab === "VACCINATION" ? "Add Vaccination Entry" : "Add Medical Record"}
          </h2>
        </div>

        {/* Tab selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-2">
          <button
            type="button"
            onClick={() => setActiveTab("VACCINATION")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition ${
              activeTab === "VACCINATION"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Syringe size={16} />
            Vaccination Log
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("MEDICAL")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition ${
              activeTab === "MEDICAL"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText size={16} />
            Diagnosis & Prescription
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          {activeTab === "VACCINATION" ? (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Vaccine Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anti-Rabies, DHPP, Canine Parvovirus, Deworming"
                  value={vaccineName}
                  onChange={(e) => setVaccineName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <Calendar size={13} />
                    Given Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={vaccinationDate}
                    onChange={(e) => setVaccinationDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <Calendar size={13} />
                    Next Due Date
                  </label>
                  <input
                    type="date"
                    value={nextDueDate}
                    onChange={(e) => setNextDueDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Batch / Serial Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. VAC-99281-X"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Any post-vaccine observations or vet instructions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Record Type
                </label>
                <select
                  value={recordType}
                  onChange={(e) => setRecordType(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="DIAGNOSIS">Diagnosis & Evaluation</option>
                  <option value="TREATMENT">Treatment / Procedure</option>
                  <option value="PRESCRIPTION">Prescription & Medication</option>
                  <option value="GENERAL">General Health Checkup</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Diagnosis / Condition
                </label>
                <input
                  type="text"
                  placeholder="e.g. Skin Dermatitis, Ear Infection, Mild Fever"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Prescription / Medications
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Amoxicillin 250mg twice daily for 5 days, Ear Drops 2 drops morning/night"
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Treatment / Care Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Doctor's notes, dietary adjustments, follow-up date..."
                  value={treatment || notes}
                  onChange={(e) => {
                    setTreatment(e.target.value);
                    setNotes(e.target.value);
                  }}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 rounded-xl border border-slate-300 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex w-2/3 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
