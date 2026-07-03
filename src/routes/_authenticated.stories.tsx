import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Heart, BookOpen, Share2, Play, Search } from "lucide-react";
import { fetchStories, toggleFavorite, type Story } from "@/lib/stories";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/stories")({
  head: () => ({ meta: [{ title: "My Stories — StoryMagic" }] }),
  component: StoriesPage,
});

function StoriesPage() {
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!user) return;
    fetchStories(user.id)
      .then(setStories)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [user]);

  const toggle = async (s: Story) => {
    if (!user) return;
    setStories((cur) => cur.map((x) => (x.id === s.id ? { ...x, favorite: !x.favorite } : x)));
    try {
      await toggleFavorite(user.id, s.id, s.favorite);
    } catch (e) {
      setStories((cur) => cur.map((x) => (x.id === s.id ? { ...x, favorite: s.favorite } : x)));
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  };

  const share = (s: Story) => {
    if (navigator.share) navigator.share({ title: s.title, text: `Read "${s.title}" on StoryMagic` }).catch(() => {});
    else { navigator.clipboard?.writeText(s.title); toast.success("Link copied"); }
  };

  const filtered = q ? stories.filter((s) => s.title.toLowerCase().includes(q.toLowerCase()) || s.theme.toLowerCase().includes(q.toLowerCase())) : stories;

  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-white p-6 shadow-card">
        <h1 className="font-display text-3xl font-bold">My Stories</h1>
        <p className="mt-1 text-sm text-muted-foreground">All your magical adventures in one cozy library.</p>
        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-border bg-muted/40 px-4 py-2.5">
          <Search className="size-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title or category…" className="flex-1 bg-transparent text-sm outline-none" />
        </div>
      </header>

      {loading ? (
        <div className="rounded-3xl bg-white p-10 text-center text-muted-foreground shadow-card">Loading your stories…</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center text-muted-foreground shadow-card">No stories found.</div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s, i) => (
            <motion.article key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -6 }}
              className="group overflow-hidden rounded-3xl bg-white shadow-card transition hover:shadow-float">
              <div className={`relative grid h-44 place-items-center bg-gradient-to-br ${s.cover} text-white`}>
                <BookOpen className="size-16 opacity-90 transition group-hover:scale-110" />
                <span className="absolute right-3 top-3 rounded-full bg-white/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur">{s.theme}</span>
                <button onClick={() => toggle(s)} aria-label="Favorite" className="absolute left-3 top-3 grid size-9 place-items-center rounded-2xl bg-white/30 backdrop-blur transition hover:scale-110">
                  <Heart className={`size-4 ${s.favorite ? "fill-current text-magic-pink" : "text-white"}`} />
                </button>
              </div>
              <div className="p-4">
                <p className="font-display font-bold">{s.title}</p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-gradient-magic" style={{ width: `${s.progress}%` }} />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <button onClick={() => toast("Resuming story…")} className="inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-3 py-1.5 text-xs font-bold text-white shadow-soft">
                    <Play className="size-3 fill-current" /> Read again
                  </button>
                  <button onClick={() => share(s)} aria-label="Share" className="grid size-8 place-items-center rounded-xl text-muted-foreground hover:bg-muted"><Share2 className="size-4" /></button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}
