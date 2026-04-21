/**
 * Commission calculation for Partner Hub
 * Supports two models: 10% deduction or custom markup
 */

export type CommissionType = '10percent' | 'markup';

export interface CommissionResult {
  commission: number;
  finalPrice: number;
}

/**
 * Calculate commission based on proposed price and commission type
 *
 * @param proposedPrice - The nightly rate proposed by owner (USD)
 * @param commissionType - '10percent' (deducted) or 'markup' (added)
 * @param markupAmount - Amount to add (only used when commissionType is 'markup')
 * @returns Object with commission amount and final price
 */
export function calculateCommission(
  proposedPrice: number,
  commissionType: CommissionType,
  markupAmount?: number
): CommissionResult {
  if (commissionType === '10percent') {
    // 10% commission is deducted from the proposed price
    const commission = proposedPrice * 0.1;
    return {
      commission,
      finalPrice: proposedPrice - commission,
    };
  }

  // Markup: proposed price increased by admin's margin
  const markup = markupAmount || 0;
  return {
    commission: markup,
    finalPrice: proposedPrice + markup,
  };
}

/**
 * Calculate total commission from a booking
 *
 * @param nightlyRate - The final agreed nightly rate
 * @param nights - Number of nights booked
 * @param commissionPercent - Commission percentage (used for historical tracking)
 * @returns Total commission for the booking
 */
export function calculateTotalCommission(
  nightlyRate: number,
  nights: number,
  commissionPercent: number
): number {
  const totalBookingAmount = nightlyRate * nights;
  return (totalBookingAmount * commissionPercent) / 100;
}

/**
 * Calculate final price including cleaning fee
 * Commission is ONLY applied to nightly price, not cleaning fee
 *
 * @param nightlyPrice - The nightly rate after commission
 * @param cleaningFee - One-time cleaning fee (no commission applied)
 * @returns Total price (nightly + cleaning fee)
 */
export function calculateFinalPriceWithCleaning(
  nightlyPrice: number,
  cleaningFee: number
): number {
  return nightlyPrice + cleaningFee;
}
