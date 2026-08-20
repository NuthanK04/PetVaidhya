import prisma from "../config/prisma";

export const seedInitialData = async () => {
  try {
    // 1. Check if any veterinarian exists
    const vetCount = await prisma.veterinarian.count();
    if (vetCount === 0) {
      console.log("🌱 Seeding initial verified veterinarians...");

      const sampleVets = [
        {
          name: "Dr. Ananya Sharma",
          email: "dr.ananya@petvaidya.com",
          phoneNumber: "+91 98765 43210",
          clinicName: "PawCare Multispeciality Hospital",
          specialization: "General Physician & Canine Specialist",
          qualification: "BVSc & AH, MVSc (Medicine)",
          experienceYears: 8,
          consultationFee: 500,
          bio: "Passionate veterinarian with 8+ years experience in small animal internal medicine, preventive healthcare, and geriatric pet care.",
          address: "142 Indiranagar 100ft Road",
          city: "Bengaluru",
          state: "Karnataka",
          postalCode: "560038",
          homeVisitAvailable: true,
          onlineAvailable: true,
          emergencyAvailable: true,
          verified: true,
          profileImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
        },
        {
          name: "Dr. Rajesh Kulkarni",
          email: "dr.rajesh@petvaidya.com",
          phoneNumber: "+91 98765 43211",
          clinicName: "Pet Life Veterinary Clinic & Surgery",
          specialization: "Veterinary Surgeon & Orthopedics",
          qualification: "BVSc, MVSc (Surgery & Radiology)",
          experienceYears: 12,
          consultationFee: 700,
          bio: "Senior orthopedic surgeon specializing in soft tissue surgeries, fracture repair, and emergency trauma care for dogs and cats.",
          address: "24 Banjara Hills Road No. 3",
          city: "Hyderabad",
          state: "Telangana",
          postalCode: "500034",
          homeVisitAvailable: true,
          onlineAvailable: true,
          emergencyAvailable: true,
          verified: true,
          profileImage: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300",
        },
        {
          name: "Dr. Priya Nair",
          email: "dr.priya@petvaidya.com",
          phoneNumber: "+91 98765 43212",
          clinicName: "Feline & Small Pet Wellness Center",
          specialization: "Feline Medicine & Dermatology",
          qualification: "BVSc, Certified Feline Practitioner",
          experienceYears: 6,
          consultationFee: 450,
          bio: "Dedicated cat specialist and pet dermatologist treating complex skin allergies, nutritional deficiencies, and chronic feline ailments.",
          address: "88 Powai Lake Road",
          city: "Mumbai",
          state: "Maharashtra",
          postalCode: "400076",
          homeVisitAvailable: true,
          onlineAvailable: true,
          emergencyAvailable: false,
          verified: true,
          profileImage: "https://images.unsplash.com/photo-1594824813587-f58c704f05b0?auto=format&fit=crop&q=80&w=300",
        },
        {
          name: "Dr. Vikram Sethi",
          email: "dr.vikram@petvaidya.com",
          phoneNumber: "+91 98765 43213",
          clinicName: "Vaidya 24/7 Animal Emergency Care",
          specialization: "Critical Care & Emergency Medicine",
          qualification: "BVSc & AH, MVSc (Emergency & Critical Care)",
          experienceYears: 10,
          consultationFee: 650,
          bio: "Expert in critical pet triage, poisoning treatment, oxygen therapy, and prompt home emergency dispatch.",
          address: "51 Vasant Kunj Sector C",
          city: "New Delhi",
          state: "Delhi",
          postalCode: "110070",
          homeVisitAvailable: true,
          onlineAvailable: true,
          emergencyAvailable: true,
          verified: true,
          profileImage: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300",
        },
        {
          name: "Dr. Meera Iyer",
          email: "dr.meera@petvaidya.com",
          phoneNumber: "+91 98765 43214",
          clinicName: "Happy Tails Pet Dental & Nutrition Clinic",
          specialization: "Pet Nutrition & Dental Care",
          qualification: "BVSc, Certified Veterinary Nutritionist",
          experienceYears: 7,
          consultationFee: 400,
          bio: "Helping pet parents formulate customized breed-specific diet plans, manage obesity, and provide dental scaling and hygiene.",
          address: "12 T Nagar 1st Main",
          city: "Chennai",
          state: "Tamil Nadu",
          postalCode: "600017",
          homeVisitAvailable: true,
          onlineAvailable: true,
          emergencyAvailable: false,
          verified: true,
          profileImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
        },
      ];

      for (const vetData of sampleVets) {
        let user = await prisma.user.findUnique({
          where: { email: vetData.email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              name: vetData.name,
              email: vetData.email,
              phoneNumber: vetData.phoneNumber,
              passwordHash: "dummy-hash-vet",
              role: "VETERINARIAN",
              profileImage: vetData.profileImage,
              isVerified: true,
              tokenBalance: 100,
            },
          });
        }

        await prisma.veterinarian.create({
          data: {
            userId: user.id,
            clinicName: vetData.clinicName,
            specialization: vetData.specialization,
            qualification: vetData.qualification,
            experienceYears: vetData.experienceYears,
            consultationFee: vetData.consultationFee,
            bio: vetData.bio,
            address: vetData.address,
            city: vetData.city,
            state: vetData.state,
            postalCode: vetData.postalCode,
            homeVisitAvailable: vetData.homeVisitAvailable,
            onlineAvailable: vetData.onlineAvailable,
            emergencyAvailable: vetData.emergencyAvailable,
            verified: vetData.verified,
          },
        });
      }

      console.log("✅ Seeded sample veterinarians.");
    }

    // 2. Check if services exist
    const serviceCount = await prisma.service.count();
    if (serviceCount === 0) {
      console.log("🌱 Seeding essential pet services...");

      const sampleServices = [
        {
          name: "General Veterinary Consultation",
          description: "Comprehensive physical examination, health assessment, and treatment prescription by verified veterinarians.",
          category: "VETERINARY" as const,
          pricingType: "FIXED" as const,
          basePrice: 500,
        },
        {
          name: "Doorstep Home Vet Visit",
          description: "Experienced veterinarian visits your home for checkups, minor treatments, and vaccinations in a stress-free environment.",
          category: "VETERINARY" as const,
          pricingType: "FIXED" as const,
          basePrice: 800,
        },
        {
          name: "Full Pet Grooming & Styling",
          description: "Breed-specific haircut, bath, blow dry, nail clipping, ear cleaning, and coat conditioning.",
          category: "GROOMING" as const,
          pricingType: "FIXED" as const,
          basePrice: 799,
        },
        {
          name: "Medicated & Flea Bath",
          description: "Therapeutic bath using vet-approved medicated shampoos for ticks, fleas, and sensitive skin conditions.",
          category: "BATHING" as const,
          pricingType: "FIXED" as const,
          basePrice: 499,
        },
        {
          name: "Daily Pet Walking (30 Mins)",
          description: "Energetic outdoor walk with GPS-tracked route, hydration, and paw cleaning by certified walkers.",
          category: "PET_WALKING" as const,
          pricingType: "PER_SESSION" as const,
          basePrice: 249,
        },
        {
          name: "In-Home Pet Sitting",
          description: "Attentive pet sitting at your home while you are away, including feeding, playtime, and regular photo updates.",
          category: "PET_SITTING" as const,
          pricingType: "PER_DAY" as const,
          basePrice: 650,
        },
        {
          name: "Cage-Free Pet Boarding",
          description: "Safe, cage-free homestay boarding with 24/7 supervision, customized meals, and play sessions.",
          category: "BOARDING" as const,
          pricingType: "PER_DAY" as const,
          basePrice: 850,
        },
        {
          name: "Pet Ambulance & Clinic Transport",
          description: "Comfortable pet taxi for hospital visits, emergency pickups, or relocation with trained handlers.",
          category: "PET_TRANSPORT" as const,
          pricingType: "PER_KM" as const,
          basePrice: 399,
        },
      ];

      for (const service of sampleServices) {
        await prisma.service.create({
          data: service,
        });
      }

      console.log("✅ Seeded essential pet services.");
    }
  } catch (error) {
    console.error("⚠️ Seeding skipped or encountered error:", error);
  }
};
