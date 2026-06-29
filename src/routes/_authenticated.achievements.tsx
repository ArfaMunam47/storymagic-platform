import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { achievementsSeed } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/achievements")({
  head: () => ({ meta: [{ title: "Achievements — StoryMagic" }] }),
  component: AchievementsPage,
});

function AchievementsPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-white p-6 shadow-card">
        <h1 className="font-display text-3xl font-bold">Achievements</h1>
        <p className="mt-1 text-sm text-muted-foreground">Badges your little hero has earned along the way.</p>
      </header>

      <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {achievementsSeed.map((a, i) => (
          <motion.div key={a.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06, type: "spring" }} whileHover={{ y: -6, scale: 1.04 }}
            className={`group relative grid place-items-center rounded-3xl bg-gradient-to-br ${a.color} p-5 text-center text-white shadow-card transition hover:shadow-glow ${a.unlocked ? "" : "grayscale opacity-60"}`}>
            <div className="absolute inset-0 rounded-3xl bg-white/0 transition group-hover:bg-white/10" />
            <div className={`grid size-20 place-items-center rounded-full bg-white/25 text-4xl backdrop-blur ${a.unlocked ? "animate-float-y" : ""}`}>
              {a.unlocked ? a.emoji : <Lock className="size-8" />}
            </div>
            <p className="mt-3 font-display font-bold">{a.name}</p>
            <p className="text-[11px] font-bold uppercase tracking-wider text-white/80">{a.unlocked ? "Unlocked" : "Locked"}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
