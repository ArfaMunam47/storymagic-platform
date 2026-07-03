import { supabase } from "@/integrations/supabase/client";

// Shape kept compatible with existing UI components (id, title, theme, cover, progress, favorite).
export type Story = {
  id: string;
  title: string;
  theme: string;
  cover: string;
  progress: number;
  favorite: boolean;
  description?: string;
  min_age?: number;
  max_age?: number;
  featured?: boolean;
  view_count?: number;
  created_at?: string;
};

export type Category = { id: string; slug: string; name: string; emoji: string | null };

type StoryRow = {
  id: string;
  title: string;
  description: string;
  cover_gradient: string;
  min_age: number;
  max_age: number;
  featured: boolean;
  view_count: number;
  created_at: string;
  categories: { name: string } | { name: string }[] | null;
};

function catName(cat: StoryRow["categories"]): string {
  if (!cat) return "Story";
  if (Array.isArray(cat)) return cat[0]?.name ?? "Story";
  return cat.name;
}

function toStory(row: StoryRow, favSet: Set<string>, progressMap: Map<string, number>): Story {
  return {
    id: row.id,
    title: row.title,
    theme: catName(row.categories),
    cover: row.cover_gradient,
    progress: progressMap.get(row.id) ?? 0,
    favorite: favSet.has(row.id),
    description: row.description,
    min_age: row.min_age,
    max_age: row.max_age,
    featured: row.featured,
    view_count: row.view_count,
    created_at: row.created_at,
  };
}

async function loadUserState(userId: string | null) {
  const favSet = new Set<string>();
  const progressMap = new Map<string, number>();
  if (!userId) return { favSet, progressMap };
  const [{ data: favs }, { data: hist }] = await Promise.all([
    supabase.from("favorites").select("story_id").eq("user_id", userId),
    supabase.from("reading_history").select("story_id, progress").eq("user_id", userId),
  ]);
  favs?.forEach((f) => favSet.add(f.story_id));
  hist?.forEach((h) => progressMap.set(h.story_id, h.progress));
  return { favSet, progressMap };
}

export async function fetchStories(userId: string | null): Promise<Story[]> {
  const { data, error } = await supabase
    .from("stories")
    .select("id, title, description, cover_gradient, min_age, max_age, featured, view_count, created_at, categories(name)")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  const { favSet, progressMap } = await loadUserState(userId);
  return (data as StoryRow[] | null)?.map((r) => toStory(r, favSet, progressMap)) ?? [];
}

export async function fetchFeatured(userId: string | null, limit = 6): Promise<Story[]> {
  const { data, error } = await supabase
    .from("stories")
    .select("id, title, description, cover_gradient, min_age, max_age, featured, view_count, created_at, categories(name)")
    .eq("featured", true)
    .limit(limit);
  if (error) throw new Error(error.message);
  const { favSet, progressMap } = await loadUserState(userId);
  return (data as StoryRow[] | null)?.map((r) => toStory(r, favSet, progressMap)) ?? [];
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from("categories").select("id, slug, name, emoji").order("name");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function toggleFavorite(userId: string, storyId: string, currentlyFav: boolean) {
  if (currentlyFav) {
    const { error } = await supabase.from("favorites").delete().eq("user_id", userId).eq("story_id", storyId);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("favorites").insert({ user_id: userId, story_id: storyId });
    if (error) throw new Error(error.message);
  }
}

export async function upsertProgress(userId: string, storyId: string, progress: number) {
  const { error } = await supabase
    .from("reading_history")
    .upsert(
      { user_id: userId, story_id: storyId, progress, last_read_at: new Date().toISOString() },
      { onConflict: "user_id,story_id" },
    );
  if (error) throw new Error(error.message);
}

export async function searchStories(query: string, userId: string | null): Promise<Story[]> {
  const { data, error } = await supabase
    .from("stories")
    .select("id, title, description, cover_gradient, min_age, max_age, featured, view_count, created_at, categories(name)")
    .ilike("title", `%${query}%`)
    .limit(50);
  if (error) throw new Error(error.message);
  const { favSet, progressMap } = await loadUserState(userId);
  return (data as StoryRow[] | null)?.map((r) => toStory(r, favSet, progressMap)) ?? [];
}
