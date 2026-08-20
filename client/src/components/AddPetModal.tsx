import { useState } from "react";
import { X, PawPrint, Calendar, Scale, Sparkles } from "lucide-react";
import { api } from "../services/api";

interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddPetModal({
  isOpen,
  onClose,
  onSuccess,
}: AddPetModalProps) {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("Dog");
  const [breed, setBreed] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "UNKNOWN">("MALE");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your pet's name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.createPet({
        name: name.trim(),
        species,
        breed: breed.trim() || undefined,
        gender,
        dateOfBirth: dateOfBirth || undefined,
        weightKg: weightKg ? parseFloat(weightKg) : undefined,
      });

      if (!res.success) {
        throw new Error(res.message || "Failed to add pet");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Error adding pet profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
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
            Add Pet Profile
          </div>
          <h2 className="mt-1 text-2xl font-black">Register Your Pet</h2>
          <p className="text-xs text-emerald-50">
            Keep health records, vaccinations, and appointments organized in one place.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Pet Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Bruno, Bella, Simba"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Species *
                </label>
                <select
                  value={species}
                  onChange={(e) => setSpecies(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Dog">Dog 🐕</option>
                  <option value="Cat">Cat 🐈</option>
                  <option value="Bird">Bird 🦜</option>
                  <option value="Rabbit">Rabbit 🐇</option>
                  <option value="Other">Other 🐾</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="MALE">Male ♂️</option>
                  <option value="FEMALE">Female ♀️</option>
                  <option value="UNKNOWN">Unknown</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Breed (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Golden Retriever, Persian, Beagle"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <Calendar size={13} />
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <Scale size={13} />
                  Weight (Kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 12.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

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
              <PawPrint size={18} />
              {loading ? "Saving..." : "Save Pet Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
