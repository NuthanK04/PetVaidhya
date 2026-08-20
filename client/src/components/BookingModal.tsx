import { useState, useEffect, useCallback } from "react";
import {
  X,
  Calendar,
  Clock,
  Home,
  Building2,
  Video,
  AlertCircle,
  Coins,
  CheckCircle2,
  Sparkles,
  MapPin,
  FileText,
  PawPrint,
  CreditCard,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { api } from "../services/api";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialVet?: {
    id: string;
    name?: string;
    clinicName?: string;
    consultationFee?: number;
    homeVisitAvailable?: boolean;
    onlineAvailable?: boolean;
    emergencyAvailable?: boolean;
    user?: { name: string; email?: string; phoneNumber?: string; profileImage?: string };
  } | null;
  initialService?: {
    id: string;
    name: string;
    category: string;
    basePrice: number;
    description?: string;
  } | null;
  initialMode?: "CLINIC_VISIT" | "HOME_VISIT" | "ONLINE_CONSULTATION" | "EMERGENCY";
  onSuccess?: () => void;
}

// Load official Razorpay checkout.js dynamically
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function BookingModal({
  isOpen,
  onClose,
  initialVet,
  initialService,
  initialMode = "CLINIC_VISIT",
  onSuccess,
}: BookingModalProps) {
  const [pets, setPets] = useState<any[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string>("");
  const [newPetName, setNewPetName] = useState("");
  const [newPetSpecies, setNewPetSpecies] = useState("Dog");
  const [creatingQuickPet, setCreatingQuickPet] = useState(false);

  const [appointmentType, setAppointmentType] = useState<
    "CLINIC_VISIT" | "HOME_VISIT" | "ONLINE_CONSULTATION" | "EMERGENCY"
  >(initialMode);

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [selectedTime, setSelectedTime] = useState<string>("10:00 AM");
  const [reason, setReason] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [useTokens, setUseTokens] = useState(false);

  // Payment lifecycle state
  const [paymentStatus, setPaymentStatus] = useState<
    "IDLE" | "PREPARING" | "CHECKOUT" | "VERIFYING" | "SUCCESS" | "FAILED" | "CANCELLED"
  >("IDLE");
  const [paymentError, setPaymentError] = useState("");
  const [confirmedDetails, setConfirmedDetails] = useState<{
    orderId?: string;
    paymentId?: string;
    amount?: number;
  }>({});

  useEffect(() => {
    if (initialMode) {
      setAppointmentType(initialMode);
    }
  }, [initialMode]);

  const loadPets = useCallback(async () => {
    try {
      const res = await api.getPets();
      if (res.success && res.data && res.data.length > 0) {
        setPets(res.data);
        setSelectedPetId(res.data[0].id);
      } else {
        setCreatingQuickPet(true);
      }
    } catch {
      setCreatingQuickPet(true);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadPets();
      loadRazorpayScript();
      setPaymentStatus("IDLE");
      setPaymentError("");
      setConfirmedDetails({});
    }
  }, [isOpen, loadPets]);

  if (!isOpen) return null;

  const vetName = initialVet?.user?.name || initialVet?.name || "Dr. Ananya Sharma";
  const clinic = initialVet?.clinicName || "PawCare Multispeciality";
  const baseFee = initialService
    ? Number(initialService.basePrice)
    : Number(initialVet?.consultationFee || 500);

  const homeFee =
    appointmentType === "HOME_VISIT"
      ? 300
      : appointmentType === "EMERGENCY"
      ? 500
      : 0;
  const platformFee = 25;
  const subtotal = baseFee + homeFee;
  const tokenDiscount = useTokens ? Math.min(50, Math.floor(subtotal * 0.15)) : 0;
  const total = Math.max(1, subtotal + platformFee - tokenDiscount);

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:30 AM",
    "02:00 PM",
    "03:30 PM",
    "05:00 PM",
    "06:30 PM",
    "08:00 PM",
  ];

  // ==========================================
  // RAZORPAY STANDARD CHECKOUT FLOW
  // ==========================================
  const handlePaymentAndBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError("");
    setPaymentStatus("PREPARING");

    try {
      // 1. Ensure Razorpay SDK is loaded
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || !(window as any).Razorpay) {
        throw new Error(
          "Failed to load Razorpay SDK. Please check your internet connection and try again."
        );
      }

      // 2. Resolve or create Pet profile
      let finalPetId = selectedPetId;
      if (creatingQuickPet || !finalPetId) {
        if (!newPetName.trim()) {
          throw new Error("Please enter your pet's name");
        }
        const newPetRes = await api.createPet({
          name: newPetName.trim(),
          species: newPetSpecies,
        });
        if (!newPetRes.success) {
          throw new Error(newPetRes.message || "Failed to create pet profile");
        }
        finalPetId = newPetRes.data.id;
      }

      // 3. Create Razorpay Order on Backend
      const orderPayload: any = {
        type: initialService ? "SERVICE_BOOKING" : "APPOINTMENT",
        petId: finalPetId,
        address: address || (appointmentType === "HOME_VISIT" ? "Doorstep Address" : undefined),
        notes,
        tokensUsed: useTokens ? 500 : 0,
      };

      if (initialService) {
        orderPayload.serviceId = initialService.id;
        orderPayload.scheduledStart = `${selectedDate}T${
          selectedTime.includes("PM") ? "15:00:00" : "10:00:00"
        }Z`;
      } else {
        orderPayload.veterinarianId = initialVet?.id || "default-vet";
        orderPayload.appointmentDate = selectedDate;
        orderPayload.appointmentTime = selectedTime;
        orderPayload.appointmentType = appointmentType;
        orderPayload.reason = reason || "General Consultation";
      }

      const orderRes = await api.createPaymentOrder(orderPayload);

      if (!orderRes.success || !orderRes.data) {
        throw new Error(orderRes.message || "Failed to initialize payment order");
      }

      const { orderId, amount, currency, keyId } = orderRes.data;

      // 4. Retrieve logged-in user details for prefill
      let storedUser: any = {};
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) storedUser = JSON.parse(userStr);
      } catch {
        // ignore
      }

      // 5. Open Razorpay Checkout Modal
      setPaymentStatus("CHECKOUT");

      const options = {
        key: keyId,
        amount: amount, // in paise
        currency: currency || "INR",
        name: "Pet Vaidya",
        description: initialService
          ? initialService.name
          : `${vetName} (${appointmentType.replace("_", " ")})`,
        image: "https://cdn-icons-png.flaticon.com/512/616/616408.png",
        order_id: orderId,
        prefill: {
          name: storedUser.name || "Pet Owner",
          email: storedUser.email || "customer@petvaidya.com",
          contact: storedUser.phoneNumber || "+919876543210",
        },
        theme: {
          color: "#059669", // PetVaidya Emerald
        },
        modal: {
          backdropclose: false,
          escape: false,
          handleback: true,
          ondismiss: function () {
            setPaymentStatus("CANCELLED");
            setPaymentError("Payment was cancelled. You can retry when ready.");
          },
        },
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          // 6. Verify signature on backend
          setPaymentStatus("VERIFYING");
          try {
            const verifyRes = await api.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (!verifyRes.success) {
              throw new Error(
                verifyRes.message || "Payment verification failed on server"
              );
            }

            setConfirmedDetails({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              amount: total,
            });
            setPaymentStatus("SUCCESS");

            if (onSuccess) onSuccess();
          } catch (verifyErr: any) {
            setPaymentStatus("FAILED");
            setPaymentError(
              verifyErr.message ||
                "Payment could not be verified. Please contact support."
            );
          }
        },
      };

      const razorpay = new (window as any).Razorpay(options);

      razorpay.on("payment.failed", function (response: any) {
        setPaymentStatus("FAILED");
        setPaymentError(
          response.error?.description ||
            "Payment failed. Please try a different payment method."
        );
      });

      razorpay.open();
    } catch (err: any) {
      setPaymentStatus("FAILED");
      setPaymentError(err.message || "An unexpected error occurred during payment");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="pet-gradient relative px-6 py-5 text-white">
          <button
            onClick={onClose}
            disabled={paymentStatus === "PREPARING" || paymentStatus === "VERIFYING"}
            className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white transition hover:bg-white/30 disabled:opacity-40"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-100">
            <Sparkles size={14} />
            {initialService ? "Book Pet Care Service" : "Book Veterinary Care"}
          </div>

          <h2 className="mt-1 text-2xl font-black">
            {initialService ? initialService.name : vetName}
          </h2>
          <p className="text-xs text-emerald-50">
            {initialService ? initialService.category : `${clinic} • Verified Specialist`}
          </p>
        </div>

        {/* SUCCESS CONFIRMATION SCREEN */}
        {paymentStatus === "SUCCESS" ? (
          <div className="p-8 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-lg shadow-emerald-600/20">
              <CheckCircle2 size={36} />
            </div>

            <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
              <Sparkles size={12} /> Payment Verified via Razorpay
            </div>

            <h3 className="mt-3 text-2xl font-black text-slate-900">
              Payment Successful! 🐾
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              {appointmentType === "HOME_VISIT"
                ? "Your doorstep home visit is confirmed. Our veterinarian will arrive at your address on the scheduled slot."
                : appointmentType === "ONLINE_CONSULTATION"
                ? "Your online consultation link has been generated and added to your dashboard."
                : "Your appointment is confirmed. Please arrive 10 minutes before your slot."}
            </p>

            <div className="mt-6 rounded-2xl bg-emerald-50/80 border border-emerald-100 p-4 text-left text-xs text-emerald-900 space-y-1.5">
              <div className="flex justify-between py-1 border-b border-emerald-200/60">
                <span className="text-slate-500">Date & Slot:</span>
                <span className="font-bold text-slate-900">
                  {selectedDate} at {selectedTime}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-emerald-200/60">
                <span className="text-slate-500">Consultation Mode:</span>
                <span className="font-bold text-slate-900 uppercase">
                  {appointmentType.replace("_", " ")}
                </span>
              </div>
              {confirmedDetails.paymentId && (
                <div className="flex justify-between py-1 border-b border-emerald-200/60">
                  <span className="text-slate-500">Razorpay Payment ID:</span>
                  <span className="font-mono font-semibold text-slate-700">
                    {confirmedDetails.paymentId}
                  </span>
                </div>
              )}
              {confirmedDetails.orderId && (
                <div className="flex justify-between py-1 border-b border-emerald-200/60">
                  <span className="text-slate-500">Razorpay Order ID:</span>
                  <span className="font-mono font-semibold text-slate-700">
                    {confirmedDetails.orderId}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-1 pt-2">
                <span className="text-slate-600 font-bold">Total Paid:</span>
                <span className="text-sm font-black text-emerald-700">
                  ₹{confirmedDetails.amount || total}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-1.5 rounded-xl bg-amber-100/80 p-2.5 font-bold text-amber-900">
                <Coins size={16} className="text-amber-700" />
                <span>+50 PV Loyalty Reward Tokens Earned!</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-700"
            >
              Done & View in Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handlePaymentAndBooking} className="max-h-[80vh] overflow-y-auto p-6">
            {/* Status alerts */}
            {paymentError && (
              <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-700 animate-in fade-in duration-200">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">
                    {paymentStatus === "CANCELLED"
                      ? "Payment Cancelled"
                      : "Payment Failed"}
                  </p>
                  <p className="text-[11px] font-normal text-rose-600 mt-0.5">
                    {paymentError}
                  </p>
                </div>
              </div>
            )}

            {/* Visit Type Selector (if Vet Booking) */}
            {!initialService && (
              <div className="mb-5">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Select Consultation Mode
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <button
                    type="button"
                    onClick={() => setAppointmentType("CLINIC_VISIT")}
                    className={`flex flex-col items-center rounded-2xl border p-3 text-center transition ${
                      appointmentType === "CLINIC_VISIT"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-600/20"
                        : "border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Building2 size={18} className="mb-1 text-emerald-600" />
                    <span className="text-xs font-bold">In-Clinic</span>
                    <span className="text-[10px] text-slate-400">Regular Visit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAppointmentType("HOME_VISIT")}
                    className={`flex flex-col items-center rounded-2xl border p-3 text-center transition ${
                      appointmentType === "HOME_VISIT"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-600/20"
                        : "border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Home size={18} className="mb-1 text-emerald-600" />
                    <span className="text-xs font-bold">Home Visit</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">+₹300</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAppointmentType("ONLINE_CONSULTATION")}
                    className={`flex flex-col items-center rounded-2xl border p-3 text-center transition ${
                      appointmentType === "ONLINE_CONSULTATION"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-600/20"
                        : "border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Video size={18} className="mb-1 text-emerald-600" />
                    <span className="text-xs font-bold">Online</span>
                    <span className="text-[10px] text-slate-400">Video Call</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAppointmentType("EMERGENCY")}
                    className={`flex flex-col items-center rounded-2xl border p-3 text-center transition ${
                      appointmentType === "EMERGENCY"
                        ? "border-rose-600 bg-rose-50 text-rose-800 ring-2 ring-rose-600/20"
                        : "border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <AlertCircle size={18} className="mb-1 text-rose-600" />
                    <span className="text-xs font-bold text-rose-700">Emergency</span>
                    <span className="text-[10px] text-rose-600 font-semibold">Priority</span>
                  </button>
                </div>
              </div>
            )}

            {/* Pet Selection */}
            <div className="mb-4">
              <div className="mb-1 flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Select Pet
                </label>
                {pets.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setCreatingQuickPet(!creatingQuickPet)}
                    className="text-xs font-bold text-emerald-600 hover:underline"
                  >
                    {creatingQuickPet ? "Choose from my pets" : "+ Add new pet"}
                  </button>
                )}
              </div>

              {creatingQuickPet || pets.length === 0 ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600">Pet Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Bruno"
                        value={newPetName}
                        onChange={(e) => setNewPetName(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600">Species</label>
                      <select
                        value={newPetSpecies}
                        onChange={(e) => setNewPetSpecies(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:outline-none"
                      >
                        <option value="Dog">Dog 🐕</option>
                        <option value="Cat">Cat 🐈</option>
                        <option value="Bird">Bird 🦜</option>
                        <option value="Rabbit">Rabbit 🐇</option>
                        <option value="Other">Other 🐾</option>
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {pets.map((pet) => (
                    <button
                      key={pet.id}
                      type="button"
                      onClick={() => setSelectedPetId(pet.id)}
                      className={`flex items-center gap-2 rounded-2xl border p-2.5 text-left transition ${
                        selectedPetId === pet.id
                          ? "border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-600/20"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                        <PawPrint size={16} />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold truncate">{pet.name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{pet.species}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date & Time */}
            <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <Calendar size={13} />
                  Preferred Date
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <Clock size={13} />
                  Time Slot
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:outline-none"
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Home Address */}
            {(appointmentType === "HOME_VISIT" || initialService) && (
              <div className="mb-4">
                <label className="mb-1 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <MapPin size={13} />
                  Home Address for Visit *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Flat/House No., Street, Landmark, Area, City"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            )}

            {/* Reason */}
            <div className="mb-4">
              <label className="mb-1 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                <FileText size={13} />
                Reason / Pet Symptoms (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Describe pet symptoms, checkup reason, skin allergy, lethargy, etc."
                value={reason || notes}
                onChange={(e) => {
                  setReason(e.target.value);
                  setNotes(e.target.value);
                }}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* PV Loyalty Token Discount */}
            <div className="mb-5 flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50/60 p-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <Coins size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Use PV Reward Tokens</div>
                  <div className="text-[10px] text-slate-500">Redeem tokens for instant discount</div>
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={useTokens}
                  onChange={(e) => setUseTokens(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="peer h-5 w-9 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-600 peer-checked:after:translate-x-full" />
              </label>
            </div>

            {/* Price Breakdown */}
            <div className="mb-6 rounded-2xl bg-slate-50 p-4 text-xs border border-slate-200/80">
              <div className="flex justify-between py-1 text-slate-600">
                <span>Base Consultation / Service Fee:</span>
                <span className="font-semibold text-slate-900">₹{baseFee}</span>
              </div>
              {homeFee > 0 && (
                <div className="flex justify-between py-1 text-slate-600">
                  <span>Home Visit / Emergency Fee:</span>
                  <span className="font-semibold text-slate-900">+₹{homeFee}</span>
                </div>
              )}
              <div className="flex justify-between py-1 text-slate-600">
                <span>Platform & Insurance Fee:</span>
                <span className="font-semibold text-slate-900">+₹{platformFee}</span>
              </div>
              {tokenDiscount > 0 && (
                <div className="flex justify-between py-1 text-emerald-600 font-semibold">
                  <span>PV Token Discount:</span>
                  <span>-₹{tokenDiscount}</span>
                </div>
              )}
              <div className="mt-2 flex justify-between border-t border-slate-200 pt-2 text-sm font-black text-slate-900">
                <span className="flex items-center gap-1.5">
                  <CreditCard size={16} className="text-emerald-600" />
                  Total Payable (INR):
                </span>
                <span className="text-emerald-700 text-base">₹{total}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                <span>Secured by Razorpay Standard Checkout (Test Mode)</span>
                <span className="text-emerald-600 font-semibold">+50 PV Tokens</span>
              </div>
            </div>

            {/* Pay Now Button */}
            <button
              type="submit"
              disabled={
                paymentStatus === "PREPARING" ||
                paymentStatus === "CHECKOUT" ||
                paymentStatus === "VERIFYING"
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {paymentStatus === "PREPARING" ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Preparing Payment...</span>
                </>
              ) : paymentStatus === "CHECKOUT" ? (
                <>
                  <CreditCard size={18} className="animate-pulse" />
                  <span>Razorpay Checkout Active...</span>
                </>
              ) : paymentStatus === "VERIFYING" ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Verifying Payment...</span>
                </>
              ) : paymentStatus === "CANCELLED" || paymentStatus === "FAILED" ? (
                <>
                  <RefreshCw size={18} />
                  <span>Retry Payment (Pay ₹{total})</span>
                </>
              ) : (
                <>
                  <CreditCard size={18} />
                  <span>Pay Now (₹{total})</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
