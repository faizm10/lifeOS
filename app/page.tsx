import Link from "next/link";


const QUOTES = [
  { text: "The unexamined life is not worth living.", attr: "Socrates" },
  { text: "Know thyself.", attr: "Delphic maxim" },
  { text: "Order is not pressure which is imposed on society from without, but an equilibrium which is set up from within.", attr: "Jose Ortega y Gasset" },
];

export default function LandingPage() {
  const year = new Date().getFullYear();
  const quote = QUOTES[1];

  return (
    <div className="min-h-screen flex flex-col">

      {/* Nav */}
      <nav className="flex items-center justify-between px-10 py-5 border-b border-rule-soft">
        <div className="font-serif italic text-[22px] leading-none text-ink">
          LifeOS<span className="text-[var(--accent)] not-italic">·</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn">Sign in</Link>
          <Link href="/signup" className="btn-primary btn">Get started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
        <p className="label-mono mb-5 tracking-[0.22em]">Personal Almanac · {year}</p>
        <h1 className="font-serif text-[clamp(48px,8vw,88px)] leading-[0.95] tracking-[-0.025em] text-ink max-w-3xl">
          One place for your{" "}
          <em className="text-[var(--accent)]">entire life</em>
        </h1>
        <p className="font-serif italic text-[18px] text-ink-2 mt-7 max-w-md leading-relaxed">
          Track money, log what you read and watch, record your wins,
          journal your days. Everything in one quiet dashboard.
        </p>

        <div className="flex items-center gap-4 mt-10">
          <Link href="/signup" className="btn-primary btn px-5 py-2 text-xs">
            Start your almanac
          </Link>
          <Link href="/login" className="btn px-5 py-2 text-xs">
            Sign in
          </Link>
        </div>

        <div className="hairline w-24 mx-auto mt-16" />
        <blockquote className="mt-8 max-w-xs mx-auto">
          <p className="font-serif italic text-[15px] text-ink-3 leading-snug">"{quote.text}"</p>
          <footer className="label-mono mt-3">— {quote.attr}</footer>
        </blockquote>
      </section>

      {/* CTA strip */}
      <div className="hairline-strong mx-10" />
      <section className="px-10 py-12 text-center">
        <p className="font-serif italic text-[17px] text-ink-2 mb-6">
          Built for a single person. Just you, your data, your record.
        </p>
        <Link href="/signup" className="btn-primary btn px-6 py-2 text-xs">
          Create your account
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-rule-soft px-10 py-5 flex items-center justify-between">
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
