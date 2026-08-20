import {
  ArrowRight,
  Heart,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

interface AboutProps {
  onRegister: () => void;
}

export default function About({
  onRegister,
}: AboutProps) {
  return (
    <main>
      <section className="pet-gradient px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-100">
              About Pet Vaidya
            </p>

            <h1 className="mt-4 text-4xl font-black sm:text-5xl">
              A digital care ecosystem built around pets.
            </h1>

            <p className="mt-5 text-base leading-7 text-emerald-50 sm:text-lg">
              Pet Vaidya brings veterinary healthcare and everyday
              pet services together so pet owners can discover, book
              and manage care from one place.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#fffdf7] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <Heart
              className="text-emerald-600"
              size={28}
            />

            <h2 className="mt-5 text-xl font-black">
              Pet First
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Every feature is designed around making pet care easier,
              clearer and more convenient.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <ShieldCheck
              className="text-emerald-600"
              size={28}
            />

            <h2 className="mt-5 text-xl font-black">
              Trust Matters
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              We are designing a platform where providers, bookings,
              records and payments can be managed transparently.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <Sparkles
              className="text-emerald-600"
              size={28}
            />

            <h2 className="mt-5 text-xl font-black">
              Better Experience
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Modern interfaces, reminders, rewards and simple
              workflows make everyday pet care easier.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-600">
              Our Vision
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              One trusted place for your pet's entire care journey.
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              Pet Vaidya is being built as more than a veterinary
              booking website. The long-term vision is to connect
              healthcare, home visits, grooming, walking, sitting,
              boarding, medical records, payments and rewards in one
              ecosystem.
            </p>
          </div>

          <div className="rounded-3xl bg-slate-900 p-8 text-white">
            <Users
              size={28}
              className="text-emerald-400"
            />

            <h3 className="mt-5 text-2xl font-black">
              Built for everyone involved
            </h3>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="font-bold">
                  Pet Owners
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Manage pets, care, bookings and rewards.
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 p-4">
                <p className="font-bold">
                  Veterinarians
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Manage appointments and deliver professional care.
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 p-4">
                <p className="font-bold">
                  Service Providers
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Offer grooming, walking, sitting, boarding and other
                  services.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onRegister}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-bold transition hover:bg-emerald-700"
            >
              Join Pet Vaidya
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}