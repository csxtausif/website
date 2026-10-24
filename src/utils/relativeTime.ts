/**
 * Formats a date into a clean, human-readable uppercase relative time string
 * matching the editorial ZDNet format (e.g., "JUST NOW", "2 HOURS AGO", "YESTERDAY", "3 WEEKS AGO", "2 MONTHS AGO").
 *
 * @param date - The Date object, ISO timestamp, or epoch millisecond value.
 * @returns An uppercase relative time description.
 */
export function formatRelativeTime(date: Date | string | number): string {
  const target = new Date(date);
  if (isNaN(target.getTime())) return "";

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000);

  // Under a minute or future date safety
  if (diffInSeconds < 60) {
    return "JUST NOW";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return diffInMinutes === 1 ? "1 MIN AGO" : `${diffInMinutes} MINS AGO`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return diffInHours === 1 ? "1 HOUR AGO" : `${diffInHours} HOURS AGO`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return "YESTERDAY";
  }
  if (diffInDays < 7) {
    return `${diffInDays} DAYS AGO`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 5) {
    return diffInWeeks === 1 ? "1 WEEK AGO" : `${diffInWeeks} WEEKS AGO`;
  }

  const diffInMonths = Math.floor(diffInDays / 30.4375);
  if (diffInMonths < 12) {
    return diffInMonths <= 1 ? "1 MONTH AGO" : `${diffInMonths} MONTHS AGO`;
  }

  const diffInYears = Math.floor(diffInDays / 365.25);
  return diffInYears <= 1 ? "1 YEAR AGO" : `${diffInYears} YEARS AGO`;
}

export default formatRelativeTime;
