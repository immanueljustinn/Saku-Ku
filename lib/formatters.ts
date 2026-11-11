/**
 * Format number into Indonesian Rupiah (IDR) currency format.
 * If isPrivate is true, returns masked placeholder `Rp ••••••••`.
 */
export function formatIDR(amount: number, isPrivate = false): string {
  if (isPrivate) {
    return "Rp ••••••••";
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(absAmount);

  // Replace default "Rp " or "IDR" spacing to standard clean "Rp "
  const cleanFormatted = formatted.replace("Rp", "Rp ").trim();
  return isNegative ? `-${cleanFormatted}` : cleanFormatted;
}

/**
 * Format large numbers compactly for charts or badges (e.g. Rp 1.5jt, Rp 250rb)
 */
export function formatCompactIDR(amount: number, isPrivate = false): string {
  if (isPrivate) {
    return "Rp •••";
  }

  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";

  if (abs >= 1_000_000_000) {
    return `${sign}Rp ${(abs / 1_000_000_000).toFixed(1).replace(".", ",")} M`;
  }
  if (abs >= 1_000_000) {
    return `${sign}Rp ${(abs / 1_000_000).toFixed(1).replace(".", ",")} Jt`;
  }
  if (abs >= 1_000) {
    return `${sign}Rp ${(abs / 1_000).toFixed(0)} Rb`;
  }
  return `${sign}Rp ${abs.toLocaleString("id-ID")}`;
}

/**
 * Format date string into readable Indonesian format
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Format date with time
 */
export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return dateString;
  }
}
