import Link from "next/link";

const FEATURES = [
  {
    num: "01",
    group: "Finance",
    items: ["Transaction ledger", "Recurring bills", "Savings goals", "Wishlist with delay rule"],
  },
  {
    num: "02",
    group: "Life tracker",
    items: ["Daily journal with mood", "Career wins timeline", "Sports & fitness log", "Media log — books & shows"],
  },
];

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

      {/* Divider */}
      <div className="hairline-strong mx-10" />

      {/* Features */}
      <section className="px-10 py-16 max-w-4xl mx-auto w-full">
        <p className="label-mono mb-10 text-center tracking-[0.20em]">What lives inside</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {FEATURES.map(f => (
            <div key={f.num} className="border border-rule-soft p-8">
              <div className="flex items-baseline gap-3 mb-6">
                <span className="font-mono text-[10px] text-ink-4 tracking-widest">{f.num}</span>
                <span className="font-serif italic text-[22px] text-ink">{f.group}</span>
              </div>
              <ul className="space-y-3">
                {f.items.map(item => (
                  <li key={item} className="flex items-baseline gap-3">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: "var(--accent)" }} />
                    <span className="font-serif text-[15px] text-ink-2">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
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
        <span className="label-mono">Personal Almanac · {year}</span>
      </footer>

    </div>
  );
}
