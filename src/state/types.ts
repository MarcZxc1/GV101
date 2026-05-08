export type ServiceCategory = 'Plumbing' | 'Electrical' | 'General Maintenance'

export type Role = 'customer' | 'provider'

export type GeoPoint = {
  lat: number
  lng: number
}

export type AvailabilityWindow = {
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6
  startHour: number
  endHour: number
}

export type ProviderVerificationStatus = 'pending' | 'approved' | 'rejected'

export type RatingDimensions = {
  punctuality: number
  technicalSkill: number
  communication: number
}

export type JobEvidence = {
  id: string
  beforeUrl: string
  afterUrl: string
  caption?: string
}

export type Review = {
  id: string
  bookingId: string
  providerId: string
  createdAt: string
  ratings: RatingDimensions
  remarks: string
  photos?: string[]
  providerResponse?: {
    text: string
    createdAt: string
  }
  flags: {
    count: number
    hidden: boolean
  }
}

export type Provider = {
  id: string
  name: string
  category: ServiceCategory
  barangay: string
  location: GeoPoint
  serviceRadiusKm: number
  baseCalloutFeePhp: number
  hourlyRatePhp: number
  skills: string[]
  bio: string
  verificationStatus: ProviderVerificationStatus
  availability: AvailabilityWindow[]
  noShowFlags: number
  evidence: JobEvidence[]
}

export type BookingStatus =
  | 'requested'
  | 'accepted'
  | 'in_progress'
  | 'pending_review'
  | 'completed'
  | 'cancelled'
  | 'declined'

export type PaymentMethod = 'GCash' | 'PayMaya' | 'Card'
export type PaymentStatus = 'unpaid' | 'escrow_held' | 'released' | 'refunded'

export type Booking = {
  id: string
  providerId: string
  customerName: string
  category: ServiceCategory
  barangay: string
  issueSummary: string
  createdAt: string
  requestedAt: string
  providerResponseDueAt: string
  scheduledFor: string
  status: BookingStatus
  priceQuotePhp: {
    calloutFee: number
    estimatedHours: number
    hourlyRate: number
    platformTrustFee: number
  }
  payment: {
    method: PaymentMethod
    status: PaymentStatus
    receiptId?: string
  }
  cancelledAt?: string
  cancelReason?: string
  rescheduledFrom?: string
  reviewId?: string
}

export type Message = {
  id: string
  bookingId: string
  sender: 'customer' | 'provider'
  createdAt: string
  text: string
}

export type InAppNotification = {
  id: string
  createdAt: string
  level: 'info' | 'success' | 'warning'
  title: string
  message: string
  read: boolean
}

export type AppState = {
  locationLock: {
    city: 'Quezon City'
    country: 'Philippines'
  }
  role: Role
  customerName: string
  customerLocation: GeoPoint
  providers: Provider[]
  bookings: Booking[]
  reviews: Review[]
  messages: Message[]
  notifications: InAppNotification[]
}

