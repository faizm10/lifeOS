import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ background: "oklch(0.965 0.014 85)" }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-10 py-5 border-b border-rule-soft">
        <div className="font-serif italic text-[22px] leading-none text-ink">
          LifeOS<span className="text-[var(--accent)] not-italic">·</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn">Sign in</Link>
          <Link href="/signup" className="btn-primary btn">Get started →</Link>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative px-10 pt-16 pb-0 overflow-hidden">
        {/* Eyebrow */}
        <p className="label-mono mb-6 tracking-[0.22em]">Personal Almanac · {year}</p>

        {/* Headline + screenshot side by side */}
        <div className="flex items-start gap-12">
          {/* Left: copy */}
          <div className="flex-shrink-0 max-w-[480px] pb-16">
            <h1 className="font-serif text-[clamp(52px,6.5vw,80px)] leading-[0.93] tracking-[-0.03em] text-ink">
              Your life,<br />
              <em className="text-[var(--accent)]">kept.</em>
            </h1>
            <p className="font-serif italic text-[17px] text-ink-2 mt-7 leading-relaxed max-w-sm">
              One quiet place for your money, your days, your wins, and everything you're working toward.
              No noise. No subscriptions. Just yours.
            </p>
            <div className="flex items-center gap-4 mt-10">
              <Link href="/signup" className="btn-primary btn px-5 py-2 text-xs">
                Start your almanac
              </Link>
              <Link href="/login" className="btn px-5 py-2 text-xs">
                Sign in
              </Link>
            </div>
            <div className="mt-12 border-t border-rule-soft pt-6 grid grid-cols-3 gap-6">
              {[
                ["Finance", "Accounts, transactions, bills, goals, wishlist"],
                ["Life", "Journal, wins, sports, media"],
                ["Private", "Single-user, self-contained, yours alone"],
              ].map(([label, desc]) => (
                <div key={label}>
                  <div className="font-serif italic text-[13px] text-[var(--accent)] mb-1">{label}</div>
                  <div className="font-mono text-[10.5px] text-ink-3 leading-snug" style={{ letterSpacing: "0.02em" }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: screenshot overflowing */}
          <div className="flex-1 relative min-w-0" style={{ marginRight: "-2.5rem" }}>
            <div className="relative" style={{ borderRadius: "4px 4px 0 0", overflow: "hidden", boxShadow: "0 2px 40px oklch(0.40 0.04 70 / 0.18), 0 0 0 1px oklch(0.80 0.020 72)" }}>
              <div className="flex items-center gap-1.5 px-3 py-2.5 border-b" style={{ background: "oklch(0.955 0.014 85)", borderColor: "oklch(0.84 0.020 72)" }}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "oklch(0.75 0.08 25)" }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "oklch(0.82 0.09 80)" }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "oklch(0.75 0.10 140)" }} />
                <span className="ml-3 font-mono text-[10px] text-ink-4">localhost:3000/dashboard</span>
              </div>
              <Image
                src="/image.png"
                alt="LifeOS dashboard — daily overview"
                width={1200}
                height={750}
                className="w-full"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Ticker ─────────────────────────────────────────────────── */}
      <div className="border-y border-rule-soft py-3 mt-0 overflow-hidden" style={{ background: "var(--accent)" }}>
        <div className="flex gap-12 whitespace-nowrap font-mono uppercase text-[10.5px] tracking-widest" style={{ color: "oklch(0.97 0.005 70)", letterSpacing: "0.18em" }}>
          {Array(3).fill(["Accounts", "Transactions", "Recurring bills", "Wishlist", "Savings goals", "Daily journal", "Career wins", "Sports log", "Media tracker"]).flat().map((item, i) => (
            <span key={i}>{item} &nbsp;·</span>
          ))}
        </div>
      </div>

      {/* ── Second screenshot ───────────────────────────────────────── */}
      <section className="px-10 py-20">
        <div className="flex items-center gap-16">
          {/* Screenshot */}
          <div className="flex-1 relative" style={{ marginLeft: "-2.5rem" }}>
            <div className="relative" style={{ borderRadius: "4px", overflow: "hidden", boxShadow: "0 2px 40px oklch(0.40 0.04 70 / 0.18), 0 0 0 1px oklch(0.80 0.020 72)" }}>
              <div className="flex items-center gap-1.5 px-3 py-2.5 border-b" style={{ background: "oklch(0.955 0.014 85)", borderColor: "oklch(0.84 0.020 72)" }}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "oklch(0.75 0.08 25)" }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "oklch(0.82 0.09 80)" }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "oklch(0.75 0.10 140)" }} />
                <span className="ml-3 font-mono text-[10px] text-ink-4">localhost:3000/dashboard</span>
              </div>
              <Image
                src="/image1.png"
                alt="LifeOS dashboard — goals and life tracker"
                width={1200}
                height={750}
                className="w-full"
              />
            </div>
          </div>

          {/* Copy */}
          <div className="flex-shrink-0 max-w-[380px]">
            <p className="label-mono mb-5 tracking-[0.18em]">Everything in one record</p>
            <h2 className="font-serif text-[clamp(32px,3.5vw,46px)] leading-[1.0] tracking-[-0.025em] text-ink">
              Not an app.<br />
              <em className="text-[var(--accent)]">An almanac.</em>
            </h2>
            <div className="space-y-5 mt-8">
              {[
                ["The ledger", "Every transaction, linked to the account it came from. Income, expenses, net — always visible."],
                ["Savings goals", "Set a target, track what's saved, see the pace. No bank integration needed."],
                ["Today, in life", "Journal entries with mood, your latest win, recent sports sessions — all on the dashboard."],
              ].map(([title, body]) => (
                <div key={title} className="border-l-2 pl-4" style={{ borderColor: "var(--accent)" }}>
                  <div className="font-serif italic text-[15px] text-ink">{title}</div>
                  <div className="font-serif text-[13.5px] text-ink-3 mt-0.5 leading-snug">{body}</div>
                </div>
              ))}
            </div>
            <Link href="/signup" className="btn-primary btn px-5 py-2 text-xs mt-10 inline-flex">
              Create your account
            </Link>
          </div>
        </div>
      </section>

      {/* ── Quote ──────────────────────────────────────────────────── */}
      <div className="border-t border-rule-soft mx-10" />
      <section className="px-10 py-16 flex flex-col items-center text-center">
        <blockquote className="max-w-lg">
          <p className="font-serif italic text-[22px] text-ink leading-snug">
            "The unexamined life is not worth living."
          </p>
          <footer className="label-mono mt-4">— Socrates</footer>
        </blockquote>
        <div className="flex items-center gap-4 mt-10">
          <Link href="/signup" className="btn-primary btn px-6 py-2 text-xs">
            Start your almanac
          </Link>
          <Link href="/login" className="btn px-6 py-2 text-xs">
            Sign in
          </Link>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="border-t border-rule-soft px-10 py-5 flex items-center justify-between mt-auto">
        <span className="font-serif italic text-[15px] text-ink-3">LifeOS</span>
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/faizm10/remotion"
            target="_blank"
            rel="noopener noreferrer"
            className="label-mono hover:text-ink transition-colors flex items-center gap-1.5"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>
          <span className="label-mono">Personal Almanac · {year}</span>
        </div>
      </footer>

    </div>
  );
}
