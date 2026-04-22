/**
 * Date formatting utilities for Partner Hub
 */

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Format a date range from YYYY-MM-DD format to readable text
 * Examples:
 * - Same month: "April 21 – 24"
 * - Different months: "April 21 – May 24"
 *
 * @param checkIn - Check-in date in YYYY-MM-DD format
 * @param checkOut - Check-out date in YYYY-MM-DD format
 * @returns Formatted date range string
 */
export function formatDateRange(checkIn: string, checkOut: string): string {
  const [inYear, inMonth, inDay] = checkIn.split('-');
  const [outYear, outMonth, outDay] = checkOut.split('-');

  const inMonthName = MONTH_NAMES[parseInt(inMonth) - 1];
  const outMonthName = MONTH_NAMES[parseInt(outMonth) - 1];

  // If same month: "April 21 – 24"
  if (inMonth === outMonth) {
    return `${inMonthName} ${parseInt(inDay)} – ${parseInt(outDay)}`;
  }

  // Different months: "April 21 – May 24"
  return `${inMonthName} ${parseInt(inDay)} – ${outMonthName} ${parseInt(outDay)}`;
}

/**
 * Format a number as COP currency with proper locale
 *
 * @param amount - Amount in COP
 * @returns Formatted string like "COP 150,000"
 */
export function formatCOP(amount: number): string {
  return `COP ${amount.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}
