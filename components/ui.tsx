import Link from "next/link";
import { cn } from "@/lib/cn";

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
      {children}
    </p>
  );
}

export function StatusDot({
  active = true,
  className,
}: {
  active?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block h-2 w-2 rounded-full",
        active ? "animate-pulse-dot bg-accent" : "bg-dim",
        className
      )}
    />
  );
}

export function RelevantChip({
  variant = "relevant",
}: {
  variant?: "relevant" | "stale" | "archived";
}) {
  const labels = {
    relevant: "RELEVANT",
    stale: "STALE",
    archived: "ARCHIVED",
  };
  const colors = {
    relevant: "border-accent/50 text-accent bg-accent/10",
    stale: "border-muted/50 text-muted bg-elevated",
    archived: "border-dim text-dim bg-elevated",
  };
  return (
    <span
      className={cn(
        "inline-block border px-2 py-0.5 font-mono text-[10px] tracking-wider",
        colors[variant]
      )}
    >
      [ {labels[variant]} ]
    </span>
  );
}

export function TerminalLog({
  timestamp,
  content,
  type,
}: {
  timestamp: string;
  content: string;
  type?: string;
}) {
  return (
    <div className="border-l-2 border-hairline py-2 pl-3 font-mono text-xs">
      <div className="mb-1 flex gap-2 text-dim">
        <span>{new Date(timestamp).toLocaleString()}</span>
        {type && <span className="text-link">[{type}]</span>}
      </div>
      <p className="text-ink">{content}</p>
    </div>
  );
}

export function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("terminal-panel p-4", className)}>{children}</div>
  );
}

export function Button({
  children,
  variant = "default",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "primary" | "danger";
}) {
  return (
    <button
      className={cn(
        "terminal-btn",
        variant === "primary" && "terminal-btn-primary",
        variant === "danger" && "border-danger/50 text-danger hover:border-danger",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className="terminal-input" {...props} />;
}

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      className="terminal-input min-h-[100px] resize-y"
      {...props}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className="terminal-input appearance-none bg-elevated"
      {...props}
    />
  );
}

export function LinkButton({
  href,
  children,
  variant = "default",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "default" | "primary";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "terminal-btn inline-flex",
        variant === "primary" && "terminal-btn-primary",
        className
      )}
    >
      {children}
    </Link>
  );
}
