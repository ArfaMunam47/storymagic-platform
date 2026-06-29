// Lightweight localStorage-backed store for dashboard demo data.
export type Story = {
  id: string;
  title: string;
  theme: string;
  cover: string; // tailwind gradient class
  progress: number; // 0..100
  favorite: boolean;
  createdAt: number;
};

export type ChildProfile = {
  id: string;
  name: string;
  age: number;
  genre: string;
  emoji: string;
  progress: number;
};

export type AppNotif = {
  id: string;
  title: string;
  body: string;
  kind: "story" | "achievement" | "goal";
  read: boolean;
  at: number;
};

const K = {
  stories: "sm.stories",
  profiles: "sm.profiles",
  notifs: "sm.notifs",
  favs: "sm.favs",
  prefs: "sm.prefs",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, v: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(v));
}

const seedStories: Story[] = [
  { id: "s1", title: "Mira and the Glowing Forest", theme: "Fantasy", cover: "from-magic-purple to-magic-pink", progress: 64, favorite: true, createdAt: Date.now() - 86400000 },
  { id: "s2", title: "Captain Leo's Space Quest", theme: "Space", cover: "from-magic-sky to-magic-purple", progress: 22, favorite: false, createdAt: Date.now() - 2 * 86400000 },
  { id: "s3", title: "The Tiny Dragon's Tea Party", theme: "Adventure", cover: "from-magic-orange to-magic-pink", progress: 100, favorite: true, createdAt: Date.now() - 3 * 86400000 },
  { id: "s4", title: "Coral the Mermaid", theme: "Ocean", cover: "from-magic-sky to-magic-mint", progress: 48, favorite: false, createdAt: Date.now() - 5 * 86400000 },
];

const seedProfiles: ChildProfile[] = [
  { id: "c1", name: "Mira", age: 6, genre: "Fantasy", emoji: "🧚", progress: 78 },
  { id: "c2", name: "Leo", age: 8, genre: "Space", emoji: "🚀", progress: 42 },
];

const seedNotifs: AppNotif[] = [
  { id: "n1", title: "New story ready!", body: "Mira's next chapter is waiting.", kind: "story", read: false, at: Date.now() - 1000 * 60 * 20 },
  { id: "n2", title: "Achievement unlocked", body: "Dragon Rider badge earned 🏅", kind: "achievement", read: false, at: Date.now() - 1000 * 60 * 60 * 2 },
  { id: "n3", title: "Weekly goal complete", body: "You read 5 days in a row!", kind: "goal", read: true, at: Date.now() - 1000 * 60 * 60 * 26 },
];

export const store = {
  stories(): Story[] {
    const s = read<Story[] | null>(K.stories, null);
    if (s) return s;
    write(K.stories, seedStories);
    return seedStories;
  },
  saveStories(s: Story[]) { write(K.stories, s); },
  addStory(s: Story) {
    const all = [s, ...store.stories()];
    write(K.stories, all);
    return all;
  },
  toggleFav(id: string) {
    const all = store.stories().map((s) => (s.id === id ? { ...s, favorite: !s.favorite } : s));
    write(K.stories, all);
    return all;
  },
  removeStory(id: string) {
    const all = store.stories().filter((s) => s.id !== id);
    write(K.stories, all);
    return all;
  },
  profiles(): ChildProfile[] {
    const p = read<ChildProfile[] | null>(K.profiles, null);
    if (p) return p;
    write(K.profiles, seedProfiles);
    return seedProfiles;
  },
  saveProfiles(p: ChildProfile[]) { write(K.profiles, p); },
  addProfile(p: ChildProfile) {
    const all = [...store.profiles(), p];
    write(K.profiles, all);
    return all;
  },
  notifs(): AppNotif[] {
    const n = read<AppNotif[] | null>(K.notifs, null);
    if (n) return n;
    write(K.notifs, seedNotifs);
    return seedNotifs;
  },
  markAllRead() {
    const all = store.notifs().map((n) => ({ ...n, read: true }));
    write(K.notifs, all);
    return all;
  },
};

export const achievementsSeed = [
  { id: "explorer", name: "Explorer", emoji: "🧭", color: "from-magic-sky to-magic-purple", unlocked: true },
  { id: "master", name: "Master Reader", emoji: "📚", color: "from-magic-purple to-magic-pink", unlocked: true },
  { id: "dragon", name: "Dragon Rider", emoji: "🐉", color: "from-magic-orange to-magic-pink", unlocked: true },
  { id: "space", name: "Space Hero", emoji: "🚀", color: "from-magic-sky to-magic-mint", unlocked: false },
  { id: "wizard", name: "Magic Wizard", emoji: "🧙", color: "from-magic-purple to-magic-yellow", unlocked: true },
  { id: "treasure", name: "Treasure Hunter", emoji: "💎", color: "from-magic-yellow to-magic-orange", unlocked: false },
];

export const weeklyReading = [
  { day: "Mon", minutes: 18 },
  { day: "Tue", minutes: 25 },
  { day: "Wed", minutes: 12 },
  { day: "Thu", minutes: 32 },
  { day: "Fri", minutes: 22 },
  { day: "Sat", minutes: 41 },
  { day: "Sun", minutes: 28 },
];
