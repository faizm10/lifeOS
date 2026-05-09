import { clsx } from "@/lib/utils";

export function Bar({ value, max, className }: { value: number; max: number; className?: string }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const over = value > max;
  return (
    <div className={clsx("h-px bg-rule-soft relative", className)}>
      <div
        className="absolute inset-y-0 left-0"
        style={{ width: pct + "%", background: over ? "oklch(0.48 0.17 28)" : "var(--accent)" }}
      />
    </div>
  );
}

export function Tag({ category, children, solid }: { category?: string; children?: React.ReactNode; solid?: boolean }) {
  return <span className={clsx("tag", solid && "tag-solid")}>{children ?? category}</span>;
}

export function LabelMono({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={clsx("label-mono", className)}>{children}</div>;
}

export function Money({ value, signed = false, className }: { value: number; signed?: boolean; className?: string }) {
  const n = Math.abs(value);
  const formatted = n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const sign = value < 0 ? "−" : signed ? "+" : "";
  const pos = value >= 0;
  return (
    <span className={clsx("tabular-nums", signed && (pos ? "text-pos" : "text-neg"), className)}>
      {sign}${formatted}
    </span>
  );
}

export function SectionHead({ num, title, meta, action }: {
  num: string; title: string; meta?: React.ReactNode; action?: React.ReactNode;
}) {
  return (
    <div className="section-head">
      <span className="num">§ {num}</span>
      <h2>{title}</h2>
      {meta && <span className="meta">{meta}</span>}
      {action}
    </div>
  );
}

export function Hairline({ strong, className }: { strong?: boolean; className?: string }) {
  return <div className={clsx(strong ? "hairline-strong" : "hairline", className)} />;
}
