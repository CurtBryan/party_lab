/**
 * Utility functions for formatting times in 12-hour format
 */

/**
 * Convert 24-hour time (HH:mm) to 12-hour format (h:mm AM/PM)
 * @param time24 - Time in 24-hour format (e.g., "17:00", "09:30")
 * @returns Time in 12-hour format (e.g., "5:00 PM", "9:30 AM")
 */
export function formatTime12Hour(time24: string): string {
  if (!time24) return '';

  // Handle both "HH:mm" and "HH:mm:ss" formats
  const [hourStr, minuteStr] = time24.split(':');
  const hour24 = parseInt(hourStr, 10);
  const minute = minuteStr || '00';

  // Convert to 12-hour format
  const period = hour24 >= 12 ? 'PM' : 'AM';
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12; // 0 becomes 12 (midnight/noon)

  return `${hour12}:${minute} ${period}`;
}

/**
 * Format a time block (start-end) in 12-hour format
 * @param timeBlock - Time block string (e.g., "17:00-20:00")
 * @returns Formatted time range (e.g., "5:00 PM - 8:00 PM")
 */
export function formatTimeBlock12Hour(timeBlock: string): string {
  if (!timeBlock) return '';

  const [startTime, endTime] = timeBlock.split('-');
  const startFormatted = formatTime12Hour(startTime);
  const endFormatted = formatTime12Hour(endTime);

  return `${startFormatted} - ${endFormatted}`;
}
