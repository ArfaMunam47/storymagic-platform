import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { store, type ChildProfile } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/profiles")({
  head: () => ({ meta: [{ title: "Child Profiles — StoryMagic" }] }),
  component: ProfilesPage,
});

const palette = ["from-magic-purple to-magic-pink", "from-magic-sky to-magic-purple", "from-magic-orange to-magic-yellow", "from-magic-mint to-magic-sky"];

function ProfilesPage() {
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState(""); const [age, setAge] = useState(""); const [genre, setGenre] = useState("Fantasy");
  useEffect(() => { setProfiles(store.profiles()); }, []);

  const add = () => {
    if (!name) return toast.error("Please add a name");
    const p: ChildProfile = { id: crypto.randomUUID(), name, age: Number(age) || 5, genre, emoji: "✨", progress: 0 };
    setProfiles(store.addProfile(p)); setAdding(false); setName(""); setAge("");
    toast.success("Profile added");
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white p-6 shadow-card">
        <div>
          <h1 className="font-display text-3xl font-bold">Child Profiles</h1>
          <p className="mt-1 text-sm text-muted-foreground">Tailor stories to every little hero in your family.</p>
        </div>
        <button onClick={() => setAdding(true)} className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5">
          <Plus className="size-4" /> Add child
        </button>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {profiles.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }} whileHover={{ y: -5 }}
            className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${palette[i % palette.length]} p-6 text-white shadow-card`}>
            <div className="grid size-20 place-items-center rounded-3xl bg-white/25 text-5xl backdrop-blur">{p.emoji}</div>
            <p className="mt-4 font-display text-2xl font-bold">{p.name}</p>
            <p className="text-sm text-white/85">Age {p.age} · Loves {p.genre}</p>
            <div className="mt-4">
              <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-white/80">Reading progress</p>
              <div className="h-2 overflow-hidden rounded-full bg-white/25">
                <motion.div initial={{ width: 0 }} animate={{ width: `${p.progress}%` }} transition={{ duration: 0.9 }} className="h-full rounded-full bg-white" />
              </div>
            </div>
            <button onClick={() => toast("Edit coming soon")} className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold backdrop-blur transition hover:bg-white/30">
              <Pencil className="size-3" /> Edit profile
            </button>
          </motion.div>
        ))}
        <button onClick={() => setAdding(true)} className="grid place-items-center rounded-3xl border-2 border-dashed border-magic-purple/30 bg-white/40 p-10 text-magic-purple transition hover:bg-white/70">
          <Plus className="size-8" /> <span className="mt-2 font-bold">Add another child</span>
        </button>
      </div>

      {adding && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4 backdrop-blur-sm" onClick={() => setAdding(false)}>
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-float">
            <h3 className="font-display text-xl font-bold">New child profile</h3>
            <div className="mt-4 space-y-3">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full rounded-2xl border bg-muted/40 px-4 py-3 text-sm outline-none focus:border-magic-purple" />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" className="rounded-2xl border bg-muted/40 px-4 py-3 text-sm outline-none focus:border-magic-purple" />
                <select value={genre} onChange={(e) => setGenre(e.target.value)} className="rounded-2xl border bg-muted/40 px-4 py-3 text-sm font-semibold outline-none">
                  {["Fantasy", "Space", "Ocean", "Dinosaurs", "Animals"].map((g) => <option key={g}>{g}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setAdding(false)} className="rounded-full px-4 py-2 text-sm font-bold text-muted-foreground hover:bg-muted">Cancel</button>
              <button onClick={add} className="rounded-full bg-gradient-primary px-5 py-2 text-sm font-bold text-white shadow-soft">Save</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
