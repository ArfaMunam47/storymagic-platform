import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BookOpen, Heart, Share2, Play } from "lucide-react";
import { fetchStories, toggleFavorite, type Story } from "@/lib/stories";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/favorites")({
  head: () => ({ meta: [{ title: "Favorites — StoryMagic" }] }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchStories(user.id)
      .then((all) => setStories(all.filter((s) => s.favorite)))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [user]);

  const unfav = async (id: string) => {
    if (!user) return;
    setStories((s) => s.filter((x) => x.id !== id));
    try {
      await toggleFavorite(user.id, id, true);
      toast("Removed from favorites");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  };

  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-white p-6 shadow-card">
        <h1 className="font-display text-3xl font-bold">Favorites</h1>
        <p className="mt-1 text-sm text-muted-foreground">The stories you keep coming back to.</p>
      </header>

      {loading ? (
        <div className="rounded-3xl bg-white p-10 text-center text-muted-foreground shadow-card">Loading…</div>
      ) : stories.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center shadow-card">
          <p className="text-muted-foreground">No favorites yet. Tap the heart on any story to add it here ❤️</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((s, i) => (
            <motion.article key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -6 }}
              className="overflow-hidden rounded-3xl bg-white shadow-card hover:shadow-float">
              <div className={`grid h-40 place-items-center bg-gradient-to-br ${s.cover} text-white`}>
                <BookOpen className="size-14 opacity-90" />
              </div>
              <div className="p-4">
                <p className="font-display font-bold">{s.title}</p>
                <p className="text-xs text-muted-foreground">{s.theme}</p>
                <div className="mt-3 flex items-center justify-between">
                  <button onClick={() => toast("Resuming…")} className="inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-3 py-1.5 text-xs font-bold text-white shadow-soft">
                    <Play className="size-3 fill-current" /> Read again
                  </button>
                  <div className="flex gap-1">
                    <button onClick={() => { navigator.clipboard?.writeText(s.title); toast.success("Copied"); }} className="grid size-8 place-items-center rounded-xl text-muted-foreground hover:bg-muted"><Share2 className="size-4" /></button>
                    <button onClick={() => unfav(s.id)} className="grid size-8 place-items-center rounded-xl text-magic-pink hover:bg-magic-pink/10"><Heart className="size-4 fill-current" /></button>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}
