import Database from "better-sqlite3";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import crypto from "crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new Database(resolve(__dirname, "../auth.db"));
db.pragma("journal_mode = WAL");

const uid = db.prepare("SELECT id FROM user LIMIT 1").get()?.id;
if (!uid) { console.error("No user found — sign up first."); process.exit(1); }
console.log("Seeding for user:", uid);

const id = () => crypto.randomUUID().replace(/-/g, "").slice(0, 20);

// ── Clear existing data ───────────────────────────────────────────────────────
for (const t of ["accounts","transactions","bills","wishlist","goals","journal_entries","wins","sports_log","media_items"]) {
  db.prepare(`DELETE FROM ${t} WHERE user_id = ?`).run(uid);
}

// ── Accounts ──────────────────────────────────────────────────────────────────
const acctChecking = id(), acctSavings = id(), acctCredit = id(), acctInvest = id();
db.prepare(`INSERT INTO accounts (id,user_id,name,type,balance,credit_limit,note) VALUES (?,?,?,?,?,?,?)`).run(acctChecking, uid, "TD Chequing", "Checking", 4820.55, null, "Day-to-day spending");
db.prepare(`INSERT INTO accounts (id,user_id,name,type,balance,credit_limit,note) VALUES (?,?,?,?,?,?,?)`).run(acctSavings, uid, "EQ Bank Savings", "Savings", 18200.00, null, "Emergency fund + short-term goals");
db.prepare(`INSERT INTO accounts (id,user_id,name,type,balance,credit_limit,note) VALUES (?,?,?,?,?,?,?)`).run(acctCredit, uid, "Scotiabank Visa", "Credit", 1340.20, 8000, "Cashback card");
db.prepare(`INSERT INTO accounts (id,user_id,name,type,balance,credit_limit,note) VALUES (?,?,?,?,?,?,?)`).run(acctInvest, uid, "Wealthsimple TFSA", "Investment", 31500.00, null, "Index funds");
console.log("✓ accounts");

// ── Transactions ──────────────────────────────────────────────────────────────
const txns = [
  ["2026-05-10","Whole Foods","Weekly groceries","Groceries",-94.32,acctChecking],
  ["2026-05-10","Transit","Monthly pass","Transport",-138.00,acctChecking],
  ["2026-05-09","Employer","May salary","Income",5200.00,acctChecking],
  ["2026-05-08","Spotify","Monthly sub","Subscriptions",-10.99,acctCredit],
  ["2026-05-08","Netflix","Monthly sub","Subscriptions",-19.99,acctCredit],
  ["2026-05-07","Ramen Nagi","Dinner with friends","Dining",-62.40,acctCredit],
  ["2026-05-06","Shoppers Drug Mart","Pharmacy","Health",-28.15,acctChecking],
  ["2026-05-05","Amazon","USB hub","Shopping",-54.99,acctCredit],
  ["2026-05-04","Whole Foods","Groceries","Groceries",-78.12,acctChecking],
  ["2026-05-03","LCBO","Wine","Dining",-34.80,acctChecking],
  ["2026-05-02","Tim Hortons","Coffee","Dining",-6.75,acctChecking],
  ["2026-05-01","Rogers","Internet bill","Bills",-89.00,acctChecking],
  ["2026-04-30","Freelance","Side project payment","Income",1800.00,acctChecking],
  ["2026-04-28","IKEA","Desk lamp","Shopping",-49.99,acctCredit],
  ["2026-04-25","Whole Foods","Groceries","Groceries",-101.44,acctChecking],
  ["2026-04-22","Cineplex","Movie night","Entertainment",-32.00,acctChecking],
  ["2026-04-20","Steam","Game purchase","Entertainment",-29.99,acctCredit],
  ["2026-04-18","Employer","April salary","Income",5200.00,acctChecking],
  ["2026-04-15","Physio clinic","Physiotherapy","Health",-120.00,acctChecking],
  ["2026-04-10","Sobeys","Groceries","Groceries",-88.60,acctChecking],
];
const txInsert = db.prepare(`INSERT INTO transactions (id,user_id,date,merchant,description,category,amount,account_id) VALUES (?,?,?,?,?,?,?,?)`);
for (const [date,merchant,description,category,amount,account_id] of txns) {
  txInsert.run(id(), uid, date, merchant, description, category, amount, account_id);
}
console.log("✓ transactions");

// ── Bills ─────────────────────────────────────────────────────────────────────
const bills = [
  ["Rogers Internet","Internet","RGR",89.00,"2026-05-15","scheduled","monthly"],
  ["Hydro One","Electricity","HYD",72.40,"2026-05-18","scheduled","monthly"],
  ["Spotify","Music streaming","SPO",10.99,"2026-05-08","paid","monthly"],
  ["Netflix","Video streaming","NFL",19.99,"2026-05-08","paid","monthly"],
  ["GitHub Pro","Dev tools","GH",4.00,"2026-05-20","scheduled","monthly"],
  ["iCloud 200GB","Cloud storage","iCL",3.99,"2026-05-22","scheduled","monthly"],
  ["Renter's Insurance","Insurance","INS",28.00,"2026-06-01","scheduled","monthly"],
  ["Domain renewal","Namecheap","DOM",18.00,"2026-12-01","scheduled","yearly"],
];
const billInsert = db.prepare(`INSERT INTO bills (id,user_id,name,description,logo,amount,due,status,recurring) VALUES (?,?,?,?,?,?,?,?,?)`);
for (const [name,desc,logo,amount,due,status,recurring] of bills) {
  billInsert.run(id(), uid, name, desc, logo, amount, due, status, recurring);
}
console.log("✓ bills");

// ── Wishlist ──────────────────────────────────────────────────────────────────
const wishlist = [
  ["Sony WH-1000XM6","349.99","high","New headphones for focus work"],
  ["Standing desk mat","79.99","med","Comfort while standing"],
  ["Kindle Scribe","419.00","med","For reading + annotating PDFs"],
  ["Patagonia fleece","148.00","low","Winter layer"],
  ["Espresso machine","599.00","low","De'Longhi — once I have more counter space"],
];
const wishInsert = db.prepare(`INSERT INTO wishlist (id,user_id,name,price,priority,note) VALUES (?,?,?,?,?,?)`);
for (const [name,price,priority,note] of wishlist) {
  wishInsert.run(id(), uid, name, parseFloat(price), priority, note);
}
console.log("✓ wishlist");

// ── Goals ─────────────────────────────────────────────────────────────────────
const goals = [
  ["Emergency fund","20000","18200","500","Keep 6 months of expenses liquid"],
  ["Japan trip","6000","2100","400","Tokyo + Kyoto — planning for March 2027"],
  ["New laptop","2500","800","200","M4 MacBook Pro when the time comes"],
  ["RRSP top-up","7000","3500","300","Contribute max before deadline"],
];
const goalInsert = db.prepare(`INSERT INTO goals (id,user_id,name,target,saved,monthly) VALUES (?,?,?,?,?,?)`);
for (const [name,target,saved,monthly] of goals) {
  goalInsert.run(id(), uid, name, parseFloat(target), parseFloat(saved), parseFloat(monthly));
}
console.log("✓ goals");

// ── Journal ───────────────────────────────────────────────────────────────────
const journal = [
  ["2026-05-10",4,"Productive Sunday","Finished a big refactor at work. Took a walk in the afternoon, felt clear-headed. Made pasta for dinner."],
  ["2026-05-09",3,"Quiet Saturday","Slept in. Read for two hours. Nothing remarkable happened — sometimes that's good."],
  ["2026-05-08",5,"Shipped something","Deployed the accounts feature. Felt genuinely proud of how clean it turned out."],
  ["2026-05-07",3,"Mid-week drag","Wednesday always feels like treading water. Dinner out helped."],
  ["2026-05-06",4,"Good gym session","Hit a new squat PR. Spent the evening reading and felt really settled."],
  ["2026-05-05",2,"Rough Monday","Didn't sleep well. Caffeine carried me through. Needed to be kinder to myself."],
  ["2026-05-03",4,"Weekend reset","Cleaned the apartment, meal prepped, caught up on a few TV episodes. Ready for the week."],
  ["2026-05-01",5,"May Day","Something about the first of the month feels like a fresh start. Set some intentions."],
  ["2026-04-28",4,"Good feedback","Got a strong review at work. It's easy to forget progress when you're inside it every day."],
  ["2026-04-25",3,"Normal Saturday","Nothing notable. Existential at midnight, fine by morning."],
];
const jInsert = db.prepare(`INSERT INTO journal_entries (id,user_id,date,mood,title,body,tags) VALUES (?,?,?,?,?,?,?)`);
for (const [date,mood,title,body] of journal) {
  jInsert.run(id(), uid, date, mood, title, body, "[]");
}
console.log("✓ journal");

// ── Wins ─────────────────────────────────────────────────────────────────────
const wins = [
  ["2026-05-08","Shipped","Launched accounts feature","Built account tracking with credit utilization bars and transaction linking. Clean.","1"],
  ["2026-04-22","Shipped","Finished LifeOS MVP","End-to-end: auth, 8 data modules, custom design system. Solo.","1"],
  ["2026-04-10","PR","Got quoted in a team retrospective","The infra migration I led last quarter was cited as a model for future work.","0"],
  ["2026-03-28","Skill","Learned SQLite WAL internals","Deep-dived into write-ahead logging for a performance investigation. Wrote up notes.","0"],
  ["2026-03-15","Project","Open-sourced a small utility","Published a CLI tool I'd been sitting on. Already has 30 stars.","0"],
  ["2026-02-20","Talk","Gave a lightning talk at work","5 minutes on monorepo tooling. First time presenting to the whole eng org.","0"],
  ["2026-01-31","Skill","Completed TypeScript advanced course","Finished every module. Now I actually understand conditional types.","0"],
];
const winsInsert = db.prepare(`INSERT INTO wins (id,user_id,date,type,title,body,tags,pinned) VALUES (?,?,?,?,?,?,?,?)`);
for (const [date,type,title,body,pinned] of wins) {
  winsInsert.run(id(), uid, date, type, title, body, "[]", parseInt(pinned));
}
console.log("✓ wins");

// ── Sports ────────────────────────────────────────────────────────────────────
const sports = [
  ["2026-05-10","Gym","Legs day","Squat 3×5 @ 120kg, RDL 3×8 @ 90kg"],
  ["2026-05-09","Run","Easy 5k","28:42 — kept it comfortable"],
  ["2026-05-07","Gym","Push day","Bench 3×5 @ 85kg, OHP 3×8 @ 55kg"],
  ["2026-05-06","Gym","Pull day","Deadlift 1×5 @ 145kg, rows, pull-ups"],
  ["2026-05-04","Run","Interval run","6×400m @ 5k pace with 90s rest"],
  ["2026-05-02","Gym","Legs day","Squat 3×5 @ 117.5kg — felt strong"],
  ["2026-04-30","Hike","Don Valley trail","~14km, 2h40m. Great to be outside."],
  ["2026-04-28","Gym","Push day","Bench 3×5 @ 82.5kg"],
  ["2026-04-26","Run","Long run","12km, 1h08m. Consistent pace throughout."],
  ["2026-04-24","Gym","Pull day","Conventional deadlift 1×5 @ 142.5kg"],
  ["2026-04-22","Gym","Legs day","Squat 3×5 @ 115kg, Bulgarian split squats"],
  ["2026-04-20","Cycling","Ravine loop","~22km, 58 minutes. Fun Sunday ride."],
];
const sportsInsert = db.prepare(`INSERT INTO sports_log (id,user_id,date,type,name,metric) VALUES (?,?,?,?,?,?)`);
for (const [date,type,name,metric] of sports) {
  sportsInsert.run(id(), uid, date, type, name, metric);
}
console.log("✓ sports");

// ── Media ─────────────────────────────────────────────────────────────────────
const media = [
  ["Book","The Remains of the Day","Kazuo Ishiguro","done",5],
  ["Book","Meditations","Marcus Aurelius","done",5],
  ["Book","The Almanack of Naval Ravikant","Eric Jorgenson","done",4],
  ["Book","Deep Work","Cal Newport","done",4],
  ["Book","Thinking, Fast and Slow","Daniel Kahneman","reading",null],
  ["Book","The Design of Everyday Things","Don Norman","reading",null],
  ["Show","Severance","Apple TV+","watching",null],
  ["Show","The Bear","Hulu/Disney+","done",5],
  ["Show","Succession","HBO","done",5],
  ["Show","Slow Horses","Apple TV+","done",4],
  ["Film","Past Lives","A24","done",5],
  ["Film","All Quiet on the Western Front","Netflix","done",4],
  ["Film","Oppenheimer","Universal","done",4],
  ["Film","The Holdovers","Focus Features","done",5],
];
const mediaInsert = db.prepare(`INSERT INTO media_items (id,user_id,type,title,author,status,rating) VALUES (?,?,?,?,?,?,?)`);
for (const [type,title,author,status,rating] of media) {
  mediaInsert.run(id(), uid, type, title, author, status, rating);
}
console.log("✓ media");

console.log("\nDone! All tables seeded.");
