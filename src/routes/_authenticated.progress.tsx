import { createFileRoute } from "@tanstack/react-router";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from "recharts";
import { weeklyReading } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/progress")({
  head: () => ({ meta: [{ title: "Reading Progress — StoryMagic" }] }),
  component: ProgressPage,
});

const monthly = [
  { week: "W1", books: 2 }, { week: "W2", books: 3 }, { week: "W3", books: 4 }, { week: "W4", books: 5 },
];

function ProgressPage() {
  const total = weeklyReading.reduce((a, b) => a + b.minutes, 0);
  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-white p-6 shadow-card">
        <h1 className="font-display text-3xl font-bold">Reading Progress</h1>
        <p className="mt-1 text-sm text-muted-foreground">A magical look at this week's reading adventures.</p>
      </header>

      <div className="grid gap-5 md:grid-cols-3">
        <Stat label="Total minutes" value={total} accent="from-magic-purple to-magic-pink" />
        <Stat label="Reading streak" value={5} suffix=" days" accent="from-magic-orange to-magic-yellow" />
        <Stat label="Books completed" value={14} accent="from-magic-sky to-magic-mint" />
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-card">
        <h2 className="font-display text-lg font-bold">Weekly minutes</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyReading}>
              <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
              <XAxis dataKey="day" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip />
              <Bar dataKey="minutes" fill="url(#g1)" radius={[12, 12, 0, 0]} />
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.72 0.22 305)" />
                  <stop offset="100%" stopColor="oklch(0.78 0.13 230)" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-card">
        <h2 className="font-display text-lg font-bold">Monthly books</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthly}>
              <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
              <XAxis dataKey="week" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip />
              <Line type="monotone" dataKey="books" stroke="oklch(0.72 0.22 0)" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, suffix = "", accent }: { label: string; value: number; suffix?: string; accent: string }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${accent} p-6 text-white shadow-card`}>
      <p className="text-xs font-bold uppercase tracking-wider text-white/80">{label}</p>
      <p className="mt-2 font-display text-4xl font-bold">{value}{suffix}</p>
    </div>
  );
}
