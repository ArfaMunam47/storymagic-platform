import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Copy,
  Download,
  Heart,
  RefreshCw,
  Save,
  Share2,
  Sparkles,
  Volume2,
  VolumeX,
  Wand2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { generateStory, type GeneratedStory } from "@/lib/generate-story.functions";
import { store, type Story } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/generator")({
  head: () => ({ meta: [{ title: "AI Story Generator — WonderNest" }] }),
  component: GeneratorPage,
});

const CATEGORIES = [
  { name: "Adventure", emoji: "🗺️", cover: "from-magic-orange to-magic-pink" },
  { name: "Fairy Tale", emoji: "🏰", cover: "from-magic-purple to-magic-pink" },
  { name: "Animals", emoji: "🦊", cover: "from-magic-mint to-magic-sky" },
  { name: "Dinosaurs", emoji: "🦕", cover: "from-magic-orange to-magic-yellow" },
  { name: "Space", emoji: "🚀", cover: "from-magic-sky to-magic-purple" },
  { name: "Magic", emoji: "✨", cover: "from-magic-purple to-magic-yellow" },
  { name: "Friendship", emoji: "🤝", cover: "from-magic-pink to-magic-orange" },
  { name: "Bedtime", emoji: "🌙", cover: "from-magic-sky to-magic-purple" },
  { name: "Princess", emoji: "👑", cover: "from-magic-pink to-magic-purple" },
  { name: "Superheroes", emoji: "🦸", cover: "from-magic-sky to-magic-pink" },
  { name: "Educational", emoji: "🧠", cover: "from-magic-mint to-magic-purple" },
  { name: "Mystery", emoji: "🔍", cover: "from-magic-purple to-magic-sky" },
] as const;

const LENGTHS = [2, 5, 10] as const;
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"] as const;
const LANGUAGES = ["English", "Spanish", "French", "German", "Hindi", "Arabic", "Portuguese", "Chinese"];

type Step = "pick" | "customize" | "result";

function GeneratorPage() {
  const [step, setStep] = useState<Step>("pick");
  const [category, setCategory] = useState<string>("");
  const [title, setTitle] = useState("");
  const [character, setCharacter] = useState("");
  const [age, setAge] = useState(6);
  const [theme, setTheme] = useState("");
  const [length, setLength] = useState<2 | 5 | 10>(5);
  const [language, setLanguage] = useState("English");
  const [moralLesson, setMoralLesson] = useState("");
  const [difficulty, setDifficulty] = useState<(typeof DIFFICULTIES)[number]>("Beginner");

  const [busy, setBusy] = useState(false);
  const [story, setStory] = useState<GeneratedStory | null>(null);
  const [speaking, setSpeaking] = useState(false);

  const selectedCat = useMemo(() => CATEGORIES.find((c) => c.name === category), [category]);

  const run = async () => {
    if (!character.trim()) {
      toast.error("Please add your character's name");
      return;
    }
    setBusy(true);
    setStory(null);
    try {
      const result = await generateStory({
        data: {
          category,
          title: title.trim(),
          characterName: character.trim(),
          characterAge: age,
          theme: theme.trim(),
          lengthMinutes: length,
          language,
          moralLesson: moralLesson.trim(),
          difficulty,
        },
      });
      setStory(result);
      setStep("result");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const speak = () => {
    if (!story || typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast.error("Read Aloud isn't available in this browser");
      return;
    }
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(`${story.title}. ${story.content}. Moral: ${story.moral}`);
    u.rate = 0.95;
    u.pitch = 1.05;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
    setSpeaking(true);
  };

  const copy = async () => {
    if (!story) return;
    await navigator.clipboard.writeText(`${story.title}\n\n${story.content}\n\nMoral: ${story.moral}`);
    toast.success("Copied to clipboard ✨");
  };

  const share = async () => {
    if (!story) return;
    const text = `${story.title}\n\n${story.content}\n\nMoral: ${story.moral}`;
    if (navigator.share) {
      try { await navigator.share({ title: story.title, text }); } catch { /* ignore */ }
    } else {
      await navigator.clipboard.writeText(text);
      toast.success("Story link copied");
    }
  };

  const downloadPdf = () => {
    if (!story) return;
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(story.title)}</title>
<style>
  body{font-family:Georgia,serif;max-width:720px;margin:40px auto;padding:0 24px;color:#1f1147;line-height:1.7}
  h1{font-family:'Comic Sans MS',cursive;color:#7c3aed;font-size:32px;margin-bottom:4px}
  .meta{color:#6b7280;font-size:14px;margin-bottom:24px}
  .content{white-space:pre-wrap;font-size:18px}
  .moral{margin-top:28px;padding:16px 20px;border-left:5px solid #ec4899;background:#fdf4ff;border-radius:12px}
  @media print{.noprint{display:none}}
</style></head><body>
<h1>${escapeHtml(story.title)}</h1>
<div class="meta">${escapeHtml(story.category)} • ${escapeHtml(story.readingTime)} • ${escapeHtml(story.readingLevel)}</div>
<div class="content">${escapeHtml(story.content)}</div>
<div class="moral"><strong>Moral:</strong> ${escapeHtml(story.moral)}</div>
<button class="noprint" onclick="window.print()" style="margin-top:24px;padding:10px 18px;border:0;border-radius:12px;background:#7c3aed;color:#fff;font-weight:700;cursor:pointer">Save as PDF</button>
</body></html>`;
    const w = window.open("", "_blank");
    if (!w) return toast.error("Please allow pop-ups to download");
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 400);
  };

  const saveToDashboard = () => {
    if (!story) return;
    const s: Story = {
      id: crypto.randomUUID(),
      title: story.title,
      theme: story.category,
      cover: selectedCat?.cover ?? "from-magic-purple to-magic-pink",
      progress: 0,
      favorite: false,
      createdAt: Date.now(),
    };
    store.addStory(s);
    toast.success("Saved to your library 📚");
  };

  const reset = () => {
    setStep("pick");
    setStory(null);
    setCategory("");
    setTitle("");
    setCharacter("");
    setTheme("");
    setMoralLesson("");
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  return (
    <div className="relative space-y-6">
      <FloatingSparkles />

      <header className="relative overflow-hidden rounded-3xl bg-gradient-magic p-6 text-white shadow-float sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/80">AI Story Generator</p>
            <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">The Magical Story Library ✨</h1>
            <p className="mt-2 max-w-xl text-sm text-white/90">
              Pick a category, add a spark, and let WonderNest AI weave a brand-new tale — every time unique.
            </p>
          </div>
          <div className="hidden shrink-0 rounded-2xl bg-white/20 p-4 backdrop-blur sm:block">
            <BookOpen className="size-10" />
          </div>
        </div>
        <StepTabs step={step} setStep={(s) => (story || s === "pick" ? setStep(s) : null)} hasStory={!!story} />
      </header>

      <AnimatePresence mode="wait">
        {step === "pick" && (
          <motion.section key="pick" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="rounded-3xl bg-white p-6 shadow-card">
            <h2 className="font-display text-xl font-bold">Choose a category</h2>
            <p className="mt-1 text-sm text-muted-foreground">Tap a card to start your adventure.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {CATEGORIES.map((c, i) => (
                <motion.button
                  key={c.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setCategory(c.name); setStep("customize"); }}
                  className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${c.cover} p-5 text-left text-white shadow-card transition hover:shadow-float`}
                >
                  <div className="text-4xl">{c.emoji}</div>
                  <div className="mt-4 font-display text-lg font-bold">{c.name}</div>
                  <Sparkles className="absolute right-3 top-3 size-4 opacity-70 transition group-hover:scale-125 group-hover:opacity-100" />
                </motion.button>
              ))}
            </div>
          </motion.section>
        )}

        {step === "customize" && (
          <motion.section key="customize" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-3xl bg-white p-6 shadow-card">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-magic-purple">{category}</p>
                  <h2 className="font-display text-2xl font-bold">Customize your story</h2>
                </div>
                <button onClick={() => setStep("pick")} className="rounded-full bg-muted px-3 py-1.5 text-xs font-bold text-muted-foreground hover:bg-muted/70">Change category</button>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Story title (optional)">
                  <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Auto-magical if empty"
                    className="w-full rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm outline-none focus:border-magic-purple focus:ring-2 focus:ring-magic-purple/30" />
                </Field>
                <Field label="Main character name">
                  <input value={character} onChange={(e) => setCharacter(e.target.value)} placeholder="e.g. Luna, Max, Zara"
                    className="w-full rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm outline-none focus:border-magic-purple focus:ring-2 focus:ring-magic-purple/30" />
                </Field>
                <Field label={`Character age (${age})`}>
                  <input type="range" min={2} max={12} value={age} onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full accent-magic-purple" />
                </Field>
                <Field label="Theme / adventure idea">
                  <input value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="e.g. a talking star, a lost dragon…"
                    className="w-full rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm outline-none focus:border-magic-purple focus:ring-2 focus:ring-magic-purple/30" />
                </Field>
                <Field label="Reading length">
                  <div className="flex flex-wrap gap-2">
                    {LENGTHS.map((l) => (
                      <Chip key={l} active={length === l} onClick={() => setLength(l)}>{l} minutes</Chip>
                    ))}
                  </div>
                </Field>
                <Field label="Language">
                  <select value={language} onChange={(e) => setLanguage(e.target.value)}
                    className="w-full rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm outline-none focus:border-magic-purple focus:ring-2 focus:ring-magic-purple/30">
                    {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
                  </select>
                </Field>
                <Field label="Moral lesson (optional)">
                  <input value={moralLesson} onChange={(e) => setMoralLesson(e.target.value)} placeholder="e.g. Sharing is caring"
                    className="w-full rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm outline-none focus:border-magic-purple focus:ring-2 focus:ring-magic-purple/30" />
                </Field>
                <Field label="Difficulty">
                  <div className="flex flex-wrap gap-2">
                    {DIFFICULTIES.map((d) => (
                      <Chip key={d} active={difficulty === d} onClick={() => setDifficulty(d)}>{d}</Chip>
                    ))}
                  </div>
                </Field>
              </div>

              <motion.button
                onClick={run}
                disabled={busy}
                whileHover={{ scale: busy ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-magic px-6 py-4 font-display text-lg font-bold text-white shadow-glow transition disabled:opacity-70 sm:w-auto"
              >
                {busy ? <><Sparkles className="size-5 animate-spin-slow" /> Weaving your story…</> : <><Wand2 className="size-5" /> Generate Story</>}
              </motion.button>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-gradient-magic p-6 text-white shadow-float">
              <div className="absolute inset-6 rounded-full bg-white/15 blur-3xl" />
              <div className="relative text-center">
                <div className="mx-auto grid size-28 place-items-center rounded-full bg-white/25 text-6xl">
                  {selectedCat?.emoji ?? "📖"}
                </div>
                <p className="mt-4 font-display text-xl font-bold">Magical Preview</p>
                <p className="mt-1 text-sm text-white/85">
                  "{character || "Your hero"} in {category.toLowerCase()}"
                </p>
                <p className="mt-2 text-xs text-white/70">Length: {length} min • {difficulty} • {language}</p>
              </div>
              {busy && (
                <div className="relative mt-6 grid place-items-center">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ x: Math.cos(i) * 90, y: Math.sin(i) * 60, opacity: [0, 1, 0] }}
                      transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.07 }}
                      className="absolute"
                    >
                      <Sparkles className="size-4 text-magic-yellow" />
                    </motion.span>
                  ))}
                </div>
              )}
            </div>
          </motion.section>
        )}

        {step === "result" && story && (
          <motion.section key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="space-y-5">
            <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${selectedCat?.cover ?? "from-magic-purple to-magic-pink"} p-8 text-white shadow-float`}>
              <span className="rounded-full bg-white/25 px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur">{story.category}</span>
              <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{story.title}</h1>
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                <Badge>⏱ {story.readingTime}</Badge>
                <Badge>📚 {story.readingLevel}</Badge>
                <Badge>🌍 {language}</Badge>
              </div>
              <div className="absolute -right-6 -top-6 text-8xl opacity-25">{selectedCat?.emoji ?? "✨"}</div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
              <article className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
                <div className="prose prose-lg max-w-none whitespace-pre-wrap font-display text-lg leading-relaxed text-foreground">
                  {story.content}
                </div>
                <div className="mt-6 rounded-2xl border-l-4 border-magic-pink bg-magic-pink/10 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-magic-pink">Moral of the Story</p>
                  <p className="mt-1 font-display text-lg">{story.moral}</p>
                </div>
              </article>

              <aside className="space-y-3">
                <ActionButton onClick={speak} icon={speaking ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}>
                  {speaking ? "Stop reading" : "Read Aloud"}
                </ActionButton>
                <ActionButton onClick={downloadPdf} icon={<Download className="size-4" />}>Download as PDF</ActionButton>
                <ActionButton onClick={saveToDashboard} icon={<Save className="size-4" />}>Save to Dashboard</ActionButton>
                <ActionButton onClick={run} icon={<RefreshCw className={`size-4 ${busy ? "animate-spin" : ""}`} />} disabled={busy}>
                  {busy ? "Regenerating…" : "Regenerate"}
                </ActionButton>
                <ActionButton onClick={copy} icon={<Copy className="size-4" />}>Copy Story</ActionButton>
                <ActionButton onClick={share} icon={<Share2 className="size-4" />}>Share Story</ActionButton>
                <button onClick={reset} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-muted px-4 py-3 text-sm font-bold text-foreground hover:bg-muted/70">
                  <Heart className="size-4" /> Create another
                </button>
              </aside>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

function StepTabs({ step, setStep, hasStory }: { step: Step; setStep: (s: Step) => void; hasStory: boolean }) {
  const steps: { key: Step; label: string }[] = [
    { key: "pick", label: "1. Category" },
    { key: "customize", label: "2. Customize" },
    { key: "result", label: "3. Story" },
  ];
  return (
    <div className="mt-5 inline-flex flex-wrap gap-2 rounded-2xl bg-white/15 p-1.5 backdrop-blur">
      {steps.map((s) => {
        const disabled = s.key === "result" && !hasStory;
        const active = step === s.key;
        return (
          <button
            key={s.key}
            disabled={disabled}
            onClick={() => setStep(s.key)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${active ? "bg-white text-magic-purple shadow-soft" : "text-white/85 hover:bg-white/15"} ${disabled ? "opacity-50" : ""}`}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-bold transition ${active ? "bg-gradient-magic text-white shadow-soft" : "bg-muted text-foreground hover:bg-muted/70"}`}
    >
      {children}
    </button>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-white/25 px-3 py-1 text-xs font-bold backdrop-blur">{children}</span>;
}

function ActionButton({ onClick, icon, children, disabled }: { onClick: () => void; icon: React.ReactNode; children: React.ReactNode; disabled?: boolean }) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-foreground shadow-card transition hover:shadow-float disabled:opacity-60"
    >
      {icon}
      {children}
    </motion.button>
  );
}

function FloatingSparkles() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0.2, y: 0 }}
          animate={{ y: [-6, 6, -6], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.3 }}
          className="absolute"
          style={{ left: `${(i * 13) % 100}%`, top: `${(i * 17) % 100}%` }}
        >
          <Sparkles className="size-4 text-magic-purple/40" />
        </motion.span>
      ))}
    </div>
  );
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
