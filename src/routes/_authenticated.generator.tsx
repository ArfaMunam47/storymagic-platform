import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { store, type Story } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/generator")({
  head: () => ({ meta: [{ title: "AI Story Generator — StoryMagic" }] }),
  component: GeneratorPage,
});

const themes = ["Fantasy", "Space", "Ocean", "Dinosaurs", "Animals", "Mystery"];
const lengths = ["Short (5 min)", "Medium (10 min)", "Long (20 min)"];
const covers = ["from-magic-purple to-magic-pink", "from-magic-sky to-magic-purple", "from-magic-orange to-magic-pink", "from-magic-mint to-magic-sky"];

function GeneratorPage() {
  const nav = useNavigate();
  const [theme, setTheme] = useState("Fantasy");
  const [character, setCharacter] = useState("Mira");
  const [adventure, setAdventure] = useState("A glowing forest");
  const [length, setLength] = useState(lengths[1]);
  const [busy, setBusy] = useState(false);

  const generate = async () => {
    if (!character || !adventure) return toast.error("Please describe a character and adventure");
    setBusy(true);
    await new Promise((r) => setTimeout(r, 1600));
    const s: Story = {
      id: crypto.randomUUID(),
      title: `${character} and ${adventure}`,
      theme,
      cover: covers[Math.floor(Math.random() * covers.length)],
      progress: 0,
      favorite: false,
      createdAt: Date.now(),
    };
    store.addStory(s);
    toast.success("Story ready! ✨");
    setBusy(false);
    nav({ to: "/stories" });
  };

  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-white p-6 shadow-card">
        <h1 className="font-display text-3xl font-bold">AI Story Generator</h1>
        <p className="mt-1 text-sm text-muted-foreground">Tell us the spark, we'll write the magic.</p>
      </header>

      <div className="relative overflow-hidden rounded-3xl bg-gradient-magic p-6 text-white shadow-float sm:p-10">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4">
            <Picker label="Story Theme" value={theme} options={themes} onChange={setTheme} />
            <Input label="Character" value={character} onChange={setCharacter} placeholder="e.g. Mira the brave" />
            <Input label="Adventure" value={adventure} onChange={setAdventure} placeholder="e.g. searching for a lost dragon" />
            <Picker label="Length" value={length} options={lengths} onChange={setLength} />
            <button onClick={generate} disabled={busy}
              className="relative mt-2 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-white px-6 py-4 font-bold text-magic-purple shadow-glow transition hover:-translate-y-0.5 disabled:opacity-70 sm:w-auto">
              {busy ? <><Sparkles className="size-5 animate-spin-slow" /> Sprinkling magic…</> : <><Wand2 className="size-5" /> Generate Story</>}
            </button>
          </div>

          <motion.div animate={busy ? { rotate: [0, 4, -4, 0] } : {}} transition={{ repeat: Infinity, duration: 1.4 }}
            className="relative grid place-items-center rounded-3xl bg-white/15 p-8 backdrop-blur">
            <div className="absolute inset-6 rounded-full bg-white/20 blur-2xl" />
            <div className="relative text-center">
              <div className="mx-auto grid size-28 place-items-center rounded-full bg-white/25 text-6xl">📖</div>
              <p className="mt-4 font-display text-xl font-bold">Magical Preview</p>
              <p className="mt-1 text-sm text-white/80">"{character} and {adventure}"</p>
            </div>
            {busy && [...Array(12)].map((_, i) => (
              <motion.span key={i}
                initial={{ x: 0, y: 0, opacity: 0 }}
                animate={{ x: Math.cos(i) * 80, y: Math.sin(i) * 80, opacity: [0, 1, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.08 }}
                className="absolute top-1/2 left-1/2"><Sparkles className="size-4 text-magic-yellow" /></motion.span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Picker({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-white/80">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button key={o} onClick={() => onChange(o)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${value === o ? "bg-white text-magic-purple shadow-soft" : "bg-white/15 text-white hover:bg-white/25"}`}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
function Input({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-white/80">{label}</p>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded-2xl bg-white/15 px-4 py-3 text-sm font-semibold text-white placeholder:text-white/60 outline-none ring-white/30 focus:ring-2 backdrop-blur" />
    </div>
  );
}
