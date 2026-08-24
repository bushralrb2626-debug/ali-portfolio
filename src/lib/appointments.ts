export type OpenSlot = {
  id: string;
  startsAt: string;
  label: string;
  display: string;
};

export function formatSlotTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Karachi",
  }).format(date);
}
