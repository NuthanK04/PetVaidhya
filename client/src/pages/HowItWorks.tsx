import {
  ArrowRight,
  CalendarCheck,
  CreditCard,
  PawPrint,
  Search,
  ShieldCheck,
  UserRoundPlus,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Create your account",
    description:
      "Register using your email address or mobile number. Your account becomes the center of your Pet Vaidya experience.",
    icon: UserRoundPlus,
  },
  {
    number: "02",
    title: "Add your pet",
    description:
      "Create one or more pet profiles with their name, species, breed, gender, weight and other important information.",
    icon: PawPrint,
  },
  {
    number: "03",
    title: "Discover care",
    description:
      "Search for veterinarians and pet-care providers or explore services such as grooming, walking, boarding and sitting.",
    icon: Search,
  },
  {
    number: "04",
    title: "Choose a time",
    description:
      "Select your preferred appointment or service timing and provide the information needed by the provider.",
    icon: CalendarCheck,
  },
  {
    number: "05",
    title: "Review your charges",
    description:
      "See service charges, additional fees, discounts, coupon savings and Pet Vaidya token discounts before payment.",
    icon: CreditCard,
  },
  {
    number: "06",
    title: "Manage everything",
    description:
      "Track bookings, medical records, vaccinations, payments and rewards from your Pet Vaidya account.",
    icon: ShieldCheck,
  },
];

export default function HowItWorks() {
  return (
    <main>
      <section className="pet-gradient px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-100">
              How Pet Vaidya Works
            </p>

            <h1 className="mt-4 text-4xl font-black sm:text-5xl">
              Simple pet care from start to finish.
            </h1>

            <p className="mt-5 text-base leading-7 text-emerald-50 sm:text-lg">
              From creating your account to booking services and
              managing your pet's records, everything is connected.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#fffdf7] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="space-y-5">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="hover-lift flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-start"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                    <Icon size={25} />
                  </div>

                  <div className="flex-1">
                    <div className="text-xs font-black tracking-[0.18em] text-emerald-600">
                      STEP {step.number}
                    </div>

                    <h2 className="mt-1 text-xl font-black text-slate-900">
                      {step.title}
                    </h2>

                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                      {step.description}
                    </p>
                  </div>

                  <ArrowRight
                    size={20}
                    className="hidden text-slate-300 sm:block"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}