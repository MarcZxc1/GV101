import type { Provider, RatingDimensions, Review } from '../state/types'
import type { Booking } from '../state/types'

export function clampRating(n: number) {
  return Math.max(1, Math.min(5, n))
}

export function overallFromDimensions(r: RatingDimensions) {
  const v = (r.punctuality + r.technicalSkill + r.communication) / 3
  return Math.round(v * 10) / 10
}

export function providerReviews(reviews: Review[], providerId: string) {
  return reviews.filter((r) => r.providerId === providerId)
}

export function providerOverallRating(reviews: Review[], providerId: string) {
  const rs = providerReviews(reviews, providerId)
  if (rs.length === 0) return null
  const avg =
    rs.reduce((sum, r) => sum + overallFromDimensions(r.ratings), 0) / rs.length
  return Math.round(avg * 10) / 10
}

export function completedBookingsCount(bookings: Booking[], providerId: string) {
  return bookings.filter((b) => b.providerId === providerId && b.status === 'completed').length
}

export function isVerifiedProvider(
  provider: Provider,
  reviews: Review[],
  bookings: Booking[] = [],
) {
  const overall = providerOverallRating(reviews, provider.id)
  const completed = completedBookingsCount(bookings, provider.id)
  return (
    overall !== null &&
    overall >= 4.7 &&
    provider.noShowFlags === 0 &&
    completed >= 10 &&
    provider.verificationStatus === 'approved'
  )
}

