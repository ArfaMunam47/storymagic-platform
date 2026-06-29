import { createFileRoute } from "@tanstack/react-router";
import { Gamepad2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/games")({
  head: () => ({ meta: [{ title: "Learning Games — StoryMagic" }] }),
  component: GamesPage,
});

const games = [
  { name: "Word Wizard", desc: "Match words to magical pictures", color: "from-magic-purple to-magic-pink", emoji: "🪄" },
  { name: "Story Maze", desc: "Pick paths and shape the tale", color: "from-magic-sky to-magic-purple", emoji: "🗺️" },
  { name: "Rhyme Time", desc: "Find the pair that rhymes", color: "from-magic-orange to-magic-yellow", emoji: "🎵" },
  { name: "Dragon Math", desc: "Solve puzzles to feed dragons", color: "from-magic-mint to-magic-sky", emoji: "🐉" },
];

function GamesPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-white p-6 shadow-card">
        <h1 className="font-display text-3xl font-bold">Learning Games</h1>
        <p className="mt-1 text-sm text-muted-foreground">Tiny quests that grow big minds.</p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {games.map((g, i) => (
          <motion.button onClick={() => toast(`Launching ${g.name}…`)} key={g.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} whileHover={{ y: -6, scale: 1.03 }}
            className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${g.color} p-6 text-left text-white shadow-card transition hover:shadow-glow`}>
            <span className="absolute right-3 top-3"><Sparkles className="size-4 animate-twinkle" /></span>
            <div className="grid size-16 place-items-center rounded-2xl bg-white/25 text-4xl backdrop-blur">{g.emoji}</div>
            <p className="mt-4 font-display text-lg font-bold">{g.name}</p>
            <p className="text-xs text-white/85">{g.desc}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/25 px-3 py-1 text-[11px] font-bold backdrop-blur">
              <Gamepad2 className="size-3" /> Play
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
