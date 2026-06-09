import { nanoid } from "nanoid";

export function id(): string {
  return nanoid();
}

export function now(): string {
  return new Date().toISOString();
}

export function parseTags(tags: string): string[] {
  if (!tags.trim()) return [];
  return tags.split(",").map((t) => t.trim()).filter(Boolean);
}

export function formatTags(tags: string[]): string {
  return tags.join(", ");
}

export function daysSince(iso: string | null): number | null {
  if (!iso) return null;
  const diff = Date.now() - new Date(iso).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function formatRelative(iso: string): string {
  const days = daysSince(iso);
  if (days === null) return "—";
  if (days === 0) return "today";
  if (days === 1) return "1d ago";
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}
