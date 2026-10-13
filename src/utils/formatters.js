export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

export function parseDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function toISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayISO() {
  return toISO(new Date());
}

export function addDays(iso, n) {
  const d = parseDate(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
}

export function daysBetween(a, b) {
  return Math.round((parseDate(b) - parseDate(a)) / 86400000);
}

export function formatDate(
  iso,
  options = { day: "numeric", month: "short", year: "numeric" },
) {
  if (!iso) return "—";
  return parseDate(iso).toLocaleDateString("en-IN", options);
}

export function getDayCount(trip) {
  const n = daysBetween(trip.startDate, trip.endDate) + 1;
  return Math.min(30, Math.max(1, n));
}

export function getTripStatus(trip) {
  const today = todayISO();
  if (today < trip.startDate) {
    const days = daysBetween(today, trip.startDate);
    return {
      label: days === 1 ? "Tomorrow" : `In ${days} days`,
      tone: "upcoming",
    };
  }
  if (today <= trip.endDate) return { label: "Ongoing", tone: "live" };
  return { label: "Completed", tone: "done" };
}

export function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
