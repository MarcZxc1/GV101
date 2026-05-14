import type { AppState, Booking, Provider, Review } from "../state/types";

function isoNow() {
  return new Date().toISOString();
}

export const mockProviders: Provider[] = [
  {
    id: "pro_miguel_santos",
    name: "Miguel Santos",
    category: "Plumbing",
    barangay: "Bagumbayan",
    location: { lat: 14.6318, lng: 121.0787 },
    serviceRadiusKm: 8,
    baseCalloutFeePhp: 350,
    hourlyRatePhp: 520,
    skills: [
      "Leak detection",
      "Faucet replacement",
      "Toilet repair",
      "Pipe sealing",
    ],
    bio: "Focused on clean fixes and clear estimates. I document before/after for peace of mind.",
    verificationStatus: "approved",
    availability: [
      { day: 1, startHour: 9, endHour: 18 },
      { day: 2, startHour: 9, endHour: 18 },
      { day: 3, startHour: 9, endHour: 18 },
      { day: 4, startHour: 9, endHour: 18 },
      { day: 5, startHour: 9, endHour: 16 },
    ],
    noShowFlags: 0,
    evidence: [
      {
        id: "ev_mig_1",
        beforeUrl:
          "https://images.unsplash.com/photo-1581579185169-1e1d2b4c8ad7?auto=format&fit=crop&w=1200&q=80",
        afterUrl:
          "https://images.unsplash.com/photo-1581579185168-1f0b1d9bb0c8?auto=format&fit=crop&w=1200&q=80",
        caption: "Kitchen sink leak sealed + trap replaced",
      },
    ],
  },
  {
    id: "pro_anna_reyes",
    name: "Anna Reyes",
    category: "Electrical",
    barangay: "Katipunan",
    location: { lat: 14.6361, lng: 121.0747 },
    serviceRadiusKm: 6,
    baseCalloutFeePhp: 400,
    hourlyRatePhp: 650,
    skills: [
      "Outlet diagnostics",
      "Breaker checks",
      "Lighting install",
      "Wiring tidy-up",
    ],
    bio: "Safety-first electrical troubleshooting with transparent pricing and tidy workmanship.",
    verificationStatus: "approved",
    availability: [
      { day: 1, startHour: 10, endHour: 19 },
      { day: 2, startHour: 10, endHour: 19 },
      { day: 4, startHour: 10, endHour: 19 },
      { day: 6, startHour: 10, endHour: 16 },
    ],
    noShowFlags: 0,
    evidence: [
      {
        id: "ev_anna_1",
        beforeUrl:
          "https://images.unsplash.com/photo-1523413451042-109c1d4c0c7e?auto=format&fit=crop&w=1200&q=80",
        afterUrl:
          "https://images.unsplash.com/photo-1523413451041-18f427b2e9c9?auto=format&fit=crop&w=1200&q=80",
        caption: "Outlet replaced + load tested",
      },
    ],
  },
  {
    id: "pro_joel_cruz",
    name: "Joel Cruz",
    category: "General Maintenance",
    barangay: "Commonwealth",
    location: { lat: 14.676, lng: 121.0646 },
    serviceRadiusKm: 10,
    baseCalloutFeePhp: 300,
    hourlyRatePhp: 480,
    skills: ["Door alignment", "Minor carpentry", "Caulking", "Wall patching"],
    bio: "General fixes done right — I’ll recommend the simplest durable solution.",
    verificationStatus: "approved",
    availability: [
      { day: 0, startHour: 9, endHour: 15 },
      { day: 3, startHour: 9, endHour: 17 },
      { day: 5, startHour: 9, endHour: 17 },
    ],
    noShowFlags: 1,
    evidence: [
      {
        id: "ev_joel_1",
        beforeUrl:
          "https://images.unsplash.com/photo-1581579185168-4132c0a2bf6d?auto=format&fit=crop&w=1200&q=80",
        afterUrl:
          "https://images.unsplash.com/photo-1581579185168-76c2dd126c2e?auto=format&fit=crop&w=1200&q=80",
        caption: "Door hinge re-aligned + latch adjusted",
      },
    ],
  },
  {
    id: "pro_kim_delosreyes",
    name: "Kim Dela Rosa",
    category: "Plumbing",
    barangay: "Project 8",
    location: { lat: 14.6581, lng: 121.0328 },
    serviceRadiusKm: 7,
    baseCalloutFeePhp: 380,
    hourlyRatePhp: 560,
    skills: [
      "Drain clearing",
      "Shower repair",
      "Water pressure checks",
      "Seal replacement",
    ],
    bio: "Fast diagnostics and neat clean-up. I share photos so you know what changed.",
    verificationStatus: "pending",
    availability: [
      { day: 2, startHour: 9, endHour: 18 },
      { day: 3, startHour: 9, endHour: 18 },
      { day: 4, startHour: 9, endHour: 18 },
    ],
    noShowFlags: 0,
    evidence: [
      {
        id: "ev_kim_1",
        beforeUrl:
          "https://images.unsplash.com/photo-1600566753177-3d6e4d10d6a0?auto=format&fit=crop&w=1200&q=80",
        afterUrl:
          "https://images.unsplash.com/photo-1600566753176-1b2b4d8732c7?auto=format&fit=crop&w=1200&q=80",
        caption: "Shower head replaced + leak eliminated",
      },
    ],
  },
  {
    id: "pro_paolo_lim",
    name: "Paolo Lim",
    category: "Electrical",
    barangay: "Diliman",
    location: { lat: 14.6537, lng: 121.0509 },
    serviceRadiusKm: 8,
    baseCalloutFeePhp: 420,
    hourlyRatePhp: 690,
    skills: [
      "Ceiling fan install",
      "Switch replacement",
      "Grounding checks",
      "Lighting repair",
    ],
    bio: "Meticulous installs and thorough testing. Clear communication from quote to finish.",
    verificationStatus: "approved",
    availability: [
      { day: 1, startHour: 9, endHour: 18 },
      { day: 2, startHour: 9, endHour: 18 },
      { day: 3, startHour: 9, endHour: 18 },
      { day: 4, startHour: 9, endHour: 18 },
      { day: 5, startHour: 9, endHour: 18 },
    ],
    noShowFlags: 0,
    evidence: [
      {
        id: "ev_paolo_1",
        beforeUrl:
          "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80",
        afterUrl:
          "https://images.unsplash.com/photo-1519710164238-1b8ddc9e1f1c?auto=format&fit=crop&w=1200&q=80",
        caption: "Ceiling light repaired + wiring tidied",
      },
    ],
  },
];

export const mockReviews: Review[] = [
  {
    id: "rev_1",
    bookingId: "seed_booking_1",
    providerId: "pro_miguel_santos",
    createdAt: isoNow(),
    ratings: { punctuality: 5, technicalSkill: 5, communication: 5 },
    remarks:
      "Arrived early, explained the leak source clearly, and left the area spotless. Very professional work.",
    photos: [],
    flags: { count: 0, hidden: false },
  },
  {
    id: "rev_2",
    bookingId: "seed_booking_2",
    providerId: "pro_anna_reyes",
    createdAt: isoNow(),
    ratings: { punctuality: 5, technicalSkill: 4.8, communication: 4.7 },
    remarks:
      "Diagnosed the issue quickly, gave an upfront estimate, and tested everything before leaving. Great communication.",
    photos: [],
    flags: { count: 0, hidden: false },
  },
  {
    id: "rev_3",
    bookingId: "seed_booking_3",
    providerId: "pro_paolo_lim",
    createdAt: isoNow(),
    ratings: { punctuality: 4.9, technicalSkill: 4.9, communication: 4.6 },
    remarks:
      "Careful and thorough. He double-checked the wiring and walked me through the safety checks after installation.",
    photos: [],
    flags: { count: 0, hidden: false },
  },
];

function seedCompletedBookings(providerId: string, count: number): Booking[] {
  const out: Booking[] = [];
  for (let i = 0; i < count; i++) {
    const created = new Date();
    created.setDate(created.getDate() - (i + 2));
    const scheduled = new Date(created);
    scheduled.setHours(10, 0, 0, 0);
    out.push({
      id: `seed_completed_${providerId}_${i}`,
      providerId,
      customerName: "Seed Customer",
      category: mockProviders.find((p) => p.id === providerId)!.category,
      barangay: "Quezon City",
      issueSummary:
        "Seed completed booking to demonstrate verified badge logic.",
      createdAt: created.toISOString(),
      requestedAt: created.toISOString(),
      providerResponseDueAt: created.toISOString(),
      scheduledFor: scheduled.toISOString(),
      status: "completed",
      priceQuotePhp: {
        calloutFee: 350,
        estimatedHours: 1,
        hourlyRate: 520,
        platformTrustFee: 49,
      },
      payment: {
        method: "GCash",
        status: "released",
        receiptId: `rcpt_${providerId}_${i}`,
      },
      reviewId: undefined,
    });
  }
  return out;
}

export const initialState: AppState = {
  locationLock: { city: "Quezon City", country: "Philippines" },
  auth: { session: null },
  role: "customer",
  customerName: "Quezon City Homeowner",
  customerLocation: { lat: 14.6542, lng: 121.0473 },
  providers: mockProviders,
  bookings: [
    ...seedCompletedBookings("pro_miguel_santos", 10),
    ...seedCompletedBookings("pro_anna_reyes", 10),
  ],
  reviews: mockReviews,
  messages: [],
  notifications: [],
};
