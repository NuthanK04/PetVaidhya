const getBaseUrl = (): string => {
  let envUrl = import.meta.env.VITE_API_URL;
  if (
    !envUrl ||
    typeof envUrl !== "string" ||
    envUrl.includes("<") ||
    envUrl.includes(">") ||
    envUrl.includes("pet-vaidya.vercel.app")
  ) {
    if (typeof window !== "undefined" && window.location.hostname.includes("vercel.app")) {
      return "https://pet-vaidhya.vercel.app/api";
    }
    return "http://localhost:4000/api";
  }
  const clean = envUrl.trim().replace(/\/+$/, "");
  return clean.endsWith("/api") ? clean : `${clean}/api`;
};

const API_BASE_URL = getBaseUrl();

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // ---------------- AUTH ----------------
  login: async (identifier: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });
    return res.json();
  },

  register: async (userData: any) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return res.json();
  },

  // ---------------- VETERINARIANS ----------------
  getVeterinarians: async (params?: {
    search?: string;
    city?: string;
    specialization?: string;
    homeVisitAvailable?: boolean;
    onlineAvailable?: boolean;
    emergencyAvailable?: boolean;
    maxFee?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.search) query.append("search", params.search);
    if (params?.city) query.append("city", params.city);
    if (params?.specialization) query.append("specialization", params.specialization);
    if (params?.homeVisitAvailable !== undefined)
      query.append("homeVisitAvailable", String(params.homeVisitAvailable));
    if (params?.onlineAvailable !== undefined)
      query.append("onlineAvailable", String(params.onlineAvailable));
    if (params?.emergencyAvailable !== undefined)
      query.append("emergencyAvailable", String(params.emergencyAvailable));
    if (params?.maxFee) query.append("maxFee", String(params.maxFee));

    const res = await fetch(`${API_BASE_URL}/veterinarians?${query.toString()}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  getVeterinarian: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/veterinarians/${id}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  // ---------------- PETS ----------------
  getPets: async () => {
    const res = await fetch(`${API_BASE_URL}/pets`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  getPet: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/pets/${id}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  createPet: async (petData: {
    name: string;
    species: string;
    breed?: string;
    gender?: string;
    dateOfBirth?: string;
    weightKg?: number;
    profileImage?: string;
  }) => {
    const res = await fetch(`${API_BASE_URL}/pets`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(petData),
    });
    return res.json();
  },

  updatePet: async (id: string, petData: any) => {
    const res = await fetch(`${API_BASE_URL}/pets/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(petData),
    });
    return res.json();
  },

  deletePet: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/pets/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return res.json();
  },

  // ---------------- HEALTH RECORDS & VACCINATIONS ----------------
  getPetMedicalRecords: async (petId: string) => {
    const res = await fetch(`${API_BASE_URL}/pets/${petId}/medical-records`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  addPetMedicalRecord: async (petId: string, data: any) => {
    const res = await fetch(`${API_BASE_URL}/pets/${petId}/medical-records`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  getPetVaccinations: async (petId: string) => {
    const res = await fetch(`${API_BASE_URL}/pets/${petId}/vaccinations`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  addPetVaccination: async (petId: string, data: any) => {
    const res = await fetch(`${API_BASE_URL}/pets/${petId}/vaccinations`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  getVaccinationReminders: async () => {
    const res = await fetch(`${API_BASE_URL}/pets/reminders/vaccinations`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  // ---------------- APPOINTMENTS ----------------
  getAppointments: async () => {
    const res = await fetch(`${API_BASE_URL}/appointments`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  bookAppointment: async (data: {
    petId: string;
    veterinarianId: string;
    appointmentDate: string;
    appointmentTime: string;
    type: "CLINIC_VISIT" | "HOME_VISIT" | "ONLINE_CONSULTATION" | "EMERGENCY";
    reason?: string;
    notes?: string;
    address?: string;
    tokensUsed?: number;
  }) => {
    const res = await fetch(`${API_BASE_URL}/appointments`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  updateAppointmentStatus: async (id: string, status: string) => {
    const res = await fetch(`${API_BASE_URL}/appointments/${id}/status`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  // ---------------- SERVICES & BOOKINGS ----------------
  getServices: async (category?: string) => {
    const query = category ? `?category=${category}` : "";
    const res = await fetch(`${API_BASE_URL}/services${query}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  getBookings: async () => {
    const res = await fetch(`${API_BASE_URL}/bookings`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  bookService: async (data: {
    petId: string;
    serviceId?: string;
    scheduledStart: string;
    quantity?: number;
    address?: string;
    notes?: string;
    tokensUsed?: number;
  }) => {
    const res = await fetch(`${API_BASE_URL}/bookings`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // ---------------- PAYMENTS (RAZORPAY) ----------------
  createPaymentOrder: async (data: {
    type: "APPOINTMENT" | "SERVICE_BOOKING";
    petId: string;
    veterinarianId?: string;
    appointmentDate?: string;
    appointmentTime?: string;
    appointmentType?: "CLINIC_VISIT" | "HOME_VISIT" | "ONLINE_CONSULTATION" | "EMERGENCY";
    reason?: string;
    serviceId?: string;
    scheduledStart?: string;
    quantity?: number;
    address?: string;
    notes?: string;
    tokensUsed?: number;
  }) => {
    const res = await fetch(`${API_BASE_URL}/payments/create-order`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  verifyPayment: async (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => {
    const res = await fetch(`${API_BASE_URL}/payments/verify`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
};
