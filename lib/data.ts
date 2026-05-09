// LifeOS — typed seed data
export type Category =
  | "Groceries" | "Dining" | "Transport" | "Subscriptions"
  | "Income" | "Health" | "Shopping" | "Bills" | "Entertainment";

export interface Transaction {
  id: string; date: string; merchant: string; desc: string;
  category: Category; amount: number;
}
export interface Bill {
  id: string; name: string; desc: string; logo: string;
  amount: number; due: string;
  status: "scheduled" | "due" | "paid" | "over";
  recurring: "monthly" | "yearly";
}
export interface WishlistItem { id: string; name: string; price: number; priority: "high"|"med"|"low"; note: string; }
export interface Goal { id: string; name: string; target: number; saved: number; monthly: number; }
export interface Budget { id: string; category: string; spent: number; limit: number; }
export interface MonthChart { m: string; income: number; expenses: { Bills: number; Groceries: number; Dining: number; Other: number }; }
export interface JournalEntry { id: string; date: string; mood: 1|2|3|4|5; title: string; body: string; tags: string[]; }
export interface SportsEntry { id: string; date: string; type: "Run"|"Strength"|"Yoga"; name: string; metric: string; }
export interface Win { id: string; date: string; type: "Shipped"|"Skill"|"PR"|"Talk"|"Project"|"Promotion"; title: string; body: string; tags: string[]; pinned?: boolean; }
export interface MediaItem { id: string; type: "Book"|"Show"|"Film"; title: string; author: string; status: "reading"|"watching"|"done"; rating: number|null; }

export const transactions: Transaction[] = [
  { id: "t1",  date: "2026-05-08", merchant: "Whole Foods Market", desc: "Weekly groceries",   category: "Groceries",     amount: -84.32 },
  { id: "t2",  date: "2026-05-08", merchant: "Blue Bottle Coffee",  desc: "Cortado",            category: "Dining",        amount: -5.75 },
  { id: "t3",  date: "2026-05-07", merchant: "Lyft",                desc: "Mission → SoMa",     category: "Transport",     amount: -14.20 },
  { id: "t4",  date: "2026-05-07", merchant: "Acme Corp",           desc: "May payroll",        category: "Income",        amount: 6420.00 },
  { id: "t5",  date: "2026-05-06", merchant: "Apple",               desc: "iCloud 200GB",       category: "Subscriptions", amount: -2.99 },
  { id: "t6",  date: "2026-05-06", merchant: "Equinox",             desc: "Monthly membership", category: "Health",        amount: -215.00 },
  { id: "t7",  date: "2026-05-05", merchant: "Tartine",             desc: "Brunch with Mira",   category: "Dining",        amount: -52.40 },
  { id: "t8",  date: "2026-05-05", merchant: "Muji",                desc: "Notebooks",          category: "Shopping",      amount: -36.85 },
  { id: "t9",  date: "2026-05-04", merchant: "Spotify",             desc: "Premium Family",     category: "Subscriptions", amount: -16.99 },
  { id: "t10", date: "2026-05-04", merchant: "Trader Joe's",        desc: "Pantry restock",     category: "Groceries",     amount: -47.18 },
  { id: "t11", date: "2026-05-03", merchant: "Uber Eats",           desc: "Thai Stick",         category: "Dining",        amount: -28.40 },
  { id: "t12", date: "2026-05-02", merchant: "Stripe (freelance)",  desc: "Logo project",       category: "Income",        amount: 1200.00 },
  { id: "t13", date: "2026-05-02", merchant: "PG&E",                desc: "April electric",     category: "Bills",         amount: -78.30 },
  { id: "t14", date: "2026-05-01", merchant: "Avalon Mission",      desc: "May rent",           category: "Bills",         amount: -2850.00 },
];

export const bills: Bill[] = [
  { id: "b1", name: "Rent — Avalon Mission", desc: "Monthly", logo: "AM", amount: 2850, due: "2026-06-01", status: "scheduled", recurring: "monthly" },
  { id: "b2", name: "Equinox", desc: "Gym", logo: "EQ", amount: 215, due: "2026-06-06", status: "scheduled", recurring: "monthly" },
  { id: "b3", name: "Comcast", desc: "Internet", logo: "CO", amount: 79.99, due: "2026-05-14", status: "due", recurring: "monthly" },
  { id: "b4", name: "Verizon", desc: "Phone plan", logo: "VZ", amount: 65, due: "2026-05-12", status: "due", recurring: "monthly" },
  { id: "b5", name: "PG&E", desc: "Electric & gas", logo: "PG", amount: 78.30, due: "2026-05-10", status: "paid", recurring: "monthly" },
  { id: "b6", name: "Spotify", desc: "Family", logo: "SP", amount: 16.99, due: "2026-06-04", status: "scheduled", recurring: "monthly" },
  { id: "b7", name: "Apple One", desc: "Premier", logo: "AP", amount: 37.95, due: "2026-05-22", status: "scheduled", recurring: "monthly" },
  { id: "b8", name: "ChatGPT Plus", desc: "AI tools", logo: "AI", amount: 20, due: "2026-05-09", status: "over", recurring: "monthly" },
];

export const wishlist: WishlistItem[] = [
  { id: "w1", name: "Sony WH-1000XM6", price: 449, priority: "high", note: "Replace XM4s — battery's dying" },
  { id: "w2", name: "Aer Travel Pack 3", price: 250, priority: "med", note: "For Japan trip" },
  { id: "w3", name: "Roark Coalition jacket", price: 178, priority: "low", note: "" },
  { id: "w4", name: "Hario V60 02 + scale", price: 95, priority: "med", note: "" },
];

export const goals: Goal[] = [
  { id: "g1", name: "Emergency fund", target: 18000, saved: 12450, monthly: 600 },
  { id: "g2", name: "Japan, Sept '26", target: 4500, saved: 2100, monthly: 400 },
  { id: "g3", name: "New laptop", target: 3500, saved: 2890, monthly: 250 },
];

export const budgets: Budget[] = [
  { id: "bg1", category: "Groceries",     spent: 343, limit: 600 },
  { id: "bg2", category: "Dining",        spent: 188, limit: 250 },
  { id: "bg3", category: "Transport",     spent: 47,  limit: 150 },
  { id: "bg4", category: "Entertainment", spent: 19,  limit: 100 },
  { id: "bg5", category: "Shopping",      spent: 168, limit: 200 },
  { id: "bg6", category: "Subscriptions", spent: 100, limit: 90  },
];

export const monthlyChart: MonthChart[] = [
  { m: "Dec",  income: 6800, expenses: { Bills: 3100, Groceries: 580, Dining: 290, Other: 410 } },
  { m: "Jan",  income: 7100, expenses: { Bills: 3120, Groceries: 540, Dining: 320, Other: 380 } },
  { m: "Feb",  income: 6900, expenses: { Bills: 3060, Groceries: 510, Dining: 280, Other: 340 } },
  { m: "Mar",  income: 7400, expenses: { Bills: 3180, Groceries: 620, Dining: 410, Other: 480 } },
  { m: "Apr",  income: 7620, expenses: { Bills: 3210, Groceries: 590, Dining: 350, Other: 510 } },
  { m: "May",  income: 7620, expenses: { Bills: 3072, Groceries: 343, Dining: 188, Other: 215 } },
];

export const journalEntries: JournalEntry[] = [
  { id: "j1", date: "2026-05-09", mood: 4, title: "Long run, slow morning",
    body: "10k along the Embarcadero before fog burned off. Felt strong on the back half.\n\nMira mentioned she's thinking about the Tahoe trip again. I want to go but should run the numbers — Japan is the real one.",
    tags: ["run", "morning"] },
  { id: "j2", date: "2026-05-08", mood: 5, title: "Shipped the redesign",
    body: "Finally pushed the dashboard rework live. Feedback in #design has been good.", tags: ["work"] },
  { id: "j3", date: "2026-05-07", mood: 3, title: "Slow Wednesday",
    body: "Nothing much. Calls all morning. Did 30min of reading at night.", tags: [] },
];

export const sportsLog: SportsEntry[] = [
  { id: "s1", date: "Today", type: "Run", name: "Easy 10k", metric: '10.2 km · 52\'18"' },
  { id: "s2", date: "Yesterday", type: "Strength", name: "Push day", metric: "5 exercises · 48 min" },
  { id: "s3", date: "May 6", type: "Run", name: "Recovery jog", metric: '5.1 km · 28\'40"' },
  { id: "s4", date: "May 5", type: "Yoga", name: "Vinyasa flow", metric: "60 min" },
];

export const wins: Win[] = [
  { id: "wn1", date: "May 8, 2026", type: "Shipped", title: "Shipped LifeOS dashboard redesign v2", body: "Two months of iteration. Reduced time-to-first-action from ~12s to under 4s.", tags: ["work", "design"], pinned: true },
  { id: "wn2", date: "Apr 28, 2026", type: "Skill", title: "Finished Building a Second Brain", body: "Spent 6 weeks on it. The PARA bit clicked.", tags: ["learning"] },
  { id: "wn3", date: "Apr 22, 2026", type: "PR", title: "Sub-22 5k for the first time", body: "21:47 on the Crissy loop. Negative split.", tags: ["fitness"] },
  { id: "wn4", date: "Mar 21, 2026", type: "Promotion", title: "Promoted to Senior Product Designer", body: "Eighteen months earlier than the standard track.", tags: ["work", "milestone"], pinned: true },
];

export const media: MediaItem[] = [
  { id: "m1", type: "Book", title: "Slouching Towards Bethlehem", author: "Joan Didion", status: "reading",  rating: null },
  { id: "m2", type: "Show", title: "Severance, S2",               author: "Apple TV+",   status: "watching", rating: null },
  { id: "m3", type: "Book", title: "Designing Design",            author: "Kenya Hara",  status: "done",     rating: 5 },
  { id: "m4", type: "Film", title: "Perfect Days",                author: "Wim Wenders", status: "done",     rating: 5 },
];
