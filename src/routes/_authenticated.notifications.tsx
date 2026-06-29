import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Sparkles, Trophy, Target, Check } from "lucide-react";
import { store, type AppNotif } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => ({ meta: [{ title: "Notifications — StoryMagic" }] }),
  component: NotificationsPage,
});

const icons = { story: Sparkles, achievement: Trophy, goal: Target };
const colors = {
  story: "from-magic-purple to-magic-pink",
  achievement: "from-magic-orange to-magic-yellow",
  goal: "from-magic-sky to-magic-mint",
};

function NotificationsPage() {
  const [notifs, setNotifs] = useState<AppNotif[]>([]);
  useEffect(() => { setNotifs(store.notifs()); }, []);
  const markAll = () => { setNotifs(store.markAllRead()); toast.success("All marked as read"); };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between rounded-3xl bg-white p-6 shadow-card">
        <div>
          <h1 className="font-display text-3xl font-bold">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">Stay on top of new stories, badges, and weekly goals.</p>
        </div>
        <button onClick={markAll} className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-4 py-2 text-sm font-bold text-white shadow-soft hover:-translate-y-0.5 transition">
          <Check className="size-4" /> Mark all read
        </button>
      </header>

      <div className="space-y-3">
        {notifs.map((n, i) => {
          const Icon = icons[n.kind];
          return (
            <motion.div key={n.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} whileHover={{ x: 4 }}
              className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-card transition hover:shadow-float">
              <div className={`grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${colors[n.kind]} text-white shadow-soft`}>
                <Icon className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display font-bold">{n.title}</p>
                <p className="truncate text-sm text-muted-foreground">{n.body}</p>
              </div>
              {!n.read && <span className="size-2.5 shrink-0 rounded-full bg-magic-pink" />}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
