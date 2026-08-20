import { useState } from "react";
import {
  ArrowRight,
  Bath,
  HeartPulse,
  Home,
  PawPrint,
  Scissors,
  ShieldCheck,
  Stethoscope,
  Footprints,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BookingModal from "../components/BookingModal";

interface ServicesProps {
  onRegister: () => void;
}

const serviceItems = [
  {
    id: "vet-consultation",
    title: "Veterinary Consultation",
    category: "VETERINARY",
    basePrice: 500,
    icon: Stethoscope,
    description:
      "Find qualified veterinarians and book consultations for checkups, illness evaluation and ongoing pet healthcare.",
    features: [
      "General consultations",
      "Health checkups",
      "Specialist veterinary care",
      "Prescription support",
    ],
    mode: "CLINIC_VISIT" as const,
  },
  {
    id: "home-visit",
    title: "Home Veterinary Visit",
    category: "VETERINARY",
    basePrice: 800,
    icon: Home,
    description:
      "Get professional veterinary care at your doorstep without putting your pet through unnecessary travel.",
    features: [
      "Home consultation",
      "Home examination",
      "Flexible scheduling",
      "Comfortable for pets",
    ],
    mode: "HOME_VISIT" as const,
  },
  {
    id: "grooming",
    title: "Pet Grooming",
    category: "GROOMING",
    basePrice: 799,
    icon: Scissors,
    description:
      "Book professional grooming services according to your pet's breed, size and grooming requirements.",
    features: [
      "Hair trimming",
      "Coat grooming",
      "Nail care",
      "Breed-specific grooming",
    ],
  },
  {
    id: "bathing",
    title: "Pet Bathing",
    category: "BATHING",
    basePrice: 499,
    icon: Bath,
    description:
      "Keep your pet clean, fresh and comfortable with professional bathing and hygiene services.",
    features: [
      "Pet bathing",
      "Drying",
      "Basic hygiene care",
      "Suitable products",
    ],
  },
  {
    id: "walking",
    title: "Pet Walking",
    category: "PET_WALKING",
    basePrice: 249,
    icon: Footprints,
    description:
      "Give your pet regular exercise with reliable and bookable pet walking services.",
    features: [
      "Single walks",
      "Scheduled walks",
      "Recurring walks",
      "Walk duration tracking",
    ],
  },
  {
    id: "sitting",
    title: "Pet Sitting",
    category: "PET_SITTING",
    basePrice: 650,
    icon: HeartPulse,
    description:
      "Find trusted pet sitters who can take care of your pet while you are away.",
    features: [
      "Hourly sitting",
      "Daily sitting",
      "At-home care",
      "Pet updates",
    ],
  },
  {
    id: "boarding",
    title: "Pet Boarding",
    category: "BOARDING",
    basePrice: 850,
    icon: ShieldCheck,
    description:
      "Find comfortable boarding options for your pet when you are travelling or unavailable.",
    features: [
      "Short-term stays",
      "Long-term stays",
      "Care preferences",
      "Provider reviews",
    ],
  },
  {
    id: "transport",
    title: "Pet Transport",
    category: "PET_TRANSPORT",
    basePrice: 399,
    icon: PawPrint,
    description:
      "Arrange safe pickup and drop services for veterinary appointments and other pet-care needs.",
    features: [
      "Pickup and drop",
      "Appointment transport",
      "Distance-based pricing",
      "Service coordination",
    ],
  },
];

export default function Services(_props: ServicesProps) {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<any>(null);
  const [bookingMode, setBookingMode] = useState<any>("CLINIC_VISIT");
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleBookService = (service: any) => {
    if (service.id === "vet-consultation") {
      navigate("/vets");
      return;
    }

    if (service.id === "home-visit") {
      setBookingMode("HOME_VISIT");
      setSelectedService(null);
      setIsBookingOpen(true);
      return;
    }

    setSelectedService({
      id: service.id,
      name: service.title,
      category: service.category,
      basePrice: service.basePrice,
      description: service.description,
    });
    setIsBookingOpen(true);
  };

  return (
    <main>
      <section className="pet-gradient px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur">
              <Sparkles size={14} />
              Pet Vaidya Services
            </div>

            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
              Everything your pet needs,
              <span className="block text-amber-300">in one place.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-emerald-50 sm:text-lg">
              From veterinary healthcare and doorstep home visits to grooming, walking,
              sitting and boarding, Pet Vaidya connects you with trusted professionals.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate("/vets")}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-emerald-700 transition hover:bg-emerald-50"
              >
                Find Veterinarians
                <ArrowRight size={18} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setBookingMode("HOME_VISIT");
                  setSelectedService(null);
                  setIsBookingOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 font-bold text-slate-950 transition hover:bg-amber-300"
              >
                <Home size={18} />
                Book Home Vet Visit
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fffdf7] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-600">
              Explore our services
            </p>

            <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
              Care designed around your pet
            </h2>

            <p className="mt-4 text-slate-600">
              Choose the service your pet needs and book instant appointments or doorstep care.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {serviceItems.map((service) => {
              const Icon = service.icon;

              return (
                <article
                  key={service.title}
                  className="hover-lift flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                        <Icon size={26} />
                      </div>
                      <span className="rounded-xl bg-slate-100 px-3 py-1 text-xs font-black text-slate-900">
                        From ₹{service.basePrice}
                      </span>
                    </div>

                    <h3 className="mt-5 text-xl font-black text-slate-900">
                      {service.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {service.description}
                    </p>

                    <div className="mt-6 space-y-2.5">
                      {service.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-center gap-2 text-xs font-medium text-slate-700"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleBookService(service)}
                    className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700"
                  >
                    Book This Service
                    <ArrowRight size={16} />
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialService={selectedService}
        initialMode={bookingMode}
        onSuccess={() => {}}
      />
    </main>
  );
}