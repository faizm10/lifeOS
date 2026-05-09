export const TODAY = "2026-05-09";

export function fmtDate(iso: string): string {
  const d = new Date(iso + "T00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function fmtUsd0(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export function fmtUsd2(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function daysUntil(iso: string): number {
  const d = new Date(iso + "T00:00");
  const now = new Date(TODAY + "T00:00");
  return Math.round((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function relativeDue(iso: string): string {
  const n = daysUntil(iso);
  if (n < 0) return `${Math.abs(n)}d overdue`;
  if (n === 0) return "Due today";
  if (n === 1) return "Due tomorrow";
  if (n < 7) return `In ${n} days`;
  return fmtDate(iso);
}

export function clsx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
