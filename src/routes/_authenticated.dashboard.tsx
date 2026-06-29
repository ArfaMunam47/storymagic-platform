import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Play, Sparkles, ArrowRight, BookOpen, Flame, Clock, Trophy, Heart, Wand2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { store, type Story } from "@/lib/store";
import dashHero from "@/assets/dash-hero.png";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — StoryMagic" }] }),
  component: Dashboard,
});

function greet() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let r = 0; const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 900);
      setN(Math.floor(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) r = requestAnimationFrame(tick);
    };
    r = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(r);
  }, [to]);
  return <span>{n.toLocaleString()}{suffix}</span>;
}

function Dashboard() {
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  useEffect(() => { setStories(store.stories()); }, []);

  const stats = [
    { label: "Stories Created", value: stories.length, icon: BookOpen, color: "from-magic-purple to-magic-pink" },
    { label: "Books Read", value: stories.filter((s) => s.progress === 100).length + 7, icon: Trophy, color: "from-magic-orange to-magic-pink" },
    { label: "Reading Streak", value: 5, suffix: "d", icon: Flame, color: "from-magic-orange to-magic-yellow" },
    { label: "Minutes Read", value: 178, icon: Clock, color: "from-magic-sky to-magic-purple" },
    { label: "Achievements", value: 4, icon: Trophy, color: "from-magic-purple to-magic-yellow" },
    { label: "Favorites", value: stories.filter((s) => s.favorite).length, icon: Heart, color: "from-magic-pink to-magic-orange" },
  ];

  const continueReading = stories.filter((s) => s.progress > 0 && s.progress < 100).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-magic p-6 text-white shadow-float sm:p-10">
        <div className="pointer-events-none absolute inset-0 opacity-50">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="absolute animate-twinkle" style={{ left: `${i * 11}%`, top: `${(i * 19) % 80}%`, animationDelay: `${i * 0.3}s` }} aria-hidden>
              <Sparkles className="size-4 text-white" />
            </span>
          ))}
        </div>
        <div className="relative grid items-center gap-6 sm:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-white/80">Welcome back ✨</p>
            <h1 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-5xl">
              {greet()}, {user?.name?.split(" ")[0] ?? "friend"} 👋
            </h1>
            <p className="mt-3 max-w-md text-white/85">Your magical library has new pages waiting. Pick up where you left off or start a brand-new adventure.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/stories" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-magic-purple shadow-soft transition hover:-translate-y-0.5">
                <Play className="size-4 fill-current" /> Continue Reading
              </Link>
              <Link to="/generator" className="inline-flex items-center gap-2 rounded-full border-2 border-white/60 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/10">
                <Wand2 className="size-4" /> New Story
              </Link>
            </div>
          </div>
          <div className="relative hidden justify-center sm:flex">
            <div className="absolute inset-6 rounded-full bg-white/20 blur-2xl" />
            <img src={dashHero} alt="" width={1024} height={1024} loading="lazy" className="relative size-64 object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.25)] animate-float-y" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="group relative overflow-hidden rounded-3xl bg-white p-5 shadow-card transition hover:-translate-y-1 hover:shadow-float">
            <div className={`absolute -right-6 -top-6 size-20 rounded-full bg-gradient-to-br ${s.color} opacity-20 transition group-hover:scale-150`} />
            <div className={`relative inline-grid size-10 place-items-center rounded-2xl bg-gradient-to-br ${s.color} text-white shadow-soft`}>
              <s.icon className="size-5" />
            </div>
            <p className="relative mt-3 font-display text-3xl font-bold">
              <CountUp to={s.value} suffix={s.suffix ?? ""} />
            </p>
            <p className="relative text-xs font-semibold text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </section>

      {/* Continue reading */}
      <section className="rounded-3xl bg-white p-6 shadow-card">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Continue reading</h2>
          <Link to="/stories" className="text-sm font-bold text-magic-purple hover:underline">View all →</Link>
        </div>
        {continueReading.length === 0 ? (
          <p className="text-sm text-muted-foreground">No stories in progress. <Link to="/generator" className="font-bold text-magic-purple">Start a new one →</Link></p>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {continueReading.map((s) => (
              <motion.div whileHover={{ y: -6 }} key={s.id} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                <div className={`relative grid h-36 place-items-center bg-gradient-to-br ${s.cover} text-white`}>
                  <BookOpen className="size-14 drop-shadow opacity-90" />
                  <span className="absolute right-3 top-3 rounded-full bg-white/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur">{s.theme}</span>
                </div>
                <div className="p-4">
                  <p className="font-display font-bold">{s.title}</p>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${s.progress}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-gradient-magic" />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{s.progress}% complete</span>
                    <button className="inline-flex items-center gap-1 font-bold text-magic-purple hover:underline">
                      Resume <ArrowRight className="size-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Quick links */}
      <section className="grid gap-4 md:grid-cols-3">
        <Link to="/generator" className="group flex items-center gap-4 rounded-3xl bg-gradient-primary p-6 text-white shadow-card transition hover:-translate-y-1 hover:shadow-glow">
          <span className="grid size-12 place-items-center rounded-2xl bg-white/20"><Wand2 className="size-6" /></span>
          <div>
            <p className="font-display text-lg font-bold">AI Story Generator</p>
            <p className="text-xs text-white/80">Create something new in seconds</p>
          </div>
          <ArrowRight className="ml-auto size-5 transition group-hover:translate-x-1" />
        </Link>
        <Link to="/profiles" className="group flex items-center gap-4 rounded-3xl bg-gradient-sunset p-6 text-white shadow-card transition hover:-translate-y-1 hover:shadow-glow">
          <span className="grid size-12 place-items-center rounded-2xl bg-white/20 text-2xl">👶</span>
          <div>
            <p className="font-display text-lg font-bold">Child Profiles</p>
            <p className="text-xs text-white/80">Personalize every adventure</p>
          </div>
          <ArrowRight className="ml-auto size-5 transition group-hover:translate-x-1" />
        </Link>
        <Link to="/achievements" className="group flex items-center gap-4 rounded-3xl bg-gradient-mint p-6 text-foreground shadow-card transition hover:-translate-y-1 hover:shadow-glow">
          <span className="grid size-12 place-items-center rounded-2xl bg-white/60"><Trophy className="size-6 text-magic-orange" /></span>
          <div>
            <p className="font-display text-lg font-bold">Achievements</p>
            <p className="text-xs text-foreground/70">Badges your hero unlocked</p>
          </div>
          <ArrowRight className="ml-auto size-5 transition group-hover:translate-x-1" />
        </Link>
      </section>
    </div>
  );
}
