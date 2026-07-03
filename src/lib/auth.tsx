import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

type AuthCtx = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (name: string, email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
  update: (patch: Partial<Pick<User, "name" | "avatar">>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

async function loadProfile(session: Session | null): Promise<User | null> {
  if (!session?.user) return null;
  const { data } = await supabase
    .from("profiles")
    .select("id, name, avatar_url")
    .eq("id", session.user.id)
    .maybeSingle();
  return {
    id: session.user.id,
    email: session.user.email ?? "",
    name: data?.name || session.user.user_metadata?.name || (session.user.email?.split("@")[0] ?? "Friend"),
    avatar: data?.avatar_url ?? undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Register listener first — fires synchronously with the current session
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      // Defer any awaits to avoid deadlocking the callback
      setTimeout(() => {
        loadProfile(session).then((u) => {
          setUser(u);
          setLoading(false);
        });
      }, 0);
    });

    supabase.auth.getSession().then(({ data }) => {
      loadProfile(data.session).then((u) => {
        setUser(u);
        setLoading(false);
      });
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    const u = await loadProfile(data.session);
    if (!u) throw new Error("Sign-in failed");
    setUser(u);
    return u;
  };

  const signUp = async (name: string, email: string, password: string) => {
    const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/dashboard` : undefined;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name }, emailRedirectTo: redirectTo },
    });
    if (error) throw new Error(error.message);
    // If email confirmation is required, session will be null — return a placeholder user.
    const u: User = {
      id: data.user?.id ?? "",
      email,
      name,
    };
    if (data.session) setUser(u);
    return u;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const update = async (patch: Partial<Pick<User, "name" | "avatar">>) => {
    if (!user) return;
    const dbPatch: { name?: string; avatar_url?: string | null } = {};
    if (patch.name !== undefined) dbPatch.name = patch.name;
    if (patch.avatar !== undefined) dbPatch.avatar_url = patch.avatar ?? null;
    if (Object.keys(dbPatch).length > 0) {
      const { error } = await supabase.from("profiles").update(dbPatch).eq("id", user.id);
      if (error) throw new Error(error.message);
    }
    setUser({ ...user, ...patch });
  };

  const resetPassword = async (email: string) => {
    const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/auth/reset-password` : undefined;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) throw new Error(error.message);
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw new Error(error.message);
  };

  return (
    <Ctx.Provider value={{ user, loading, signIn, signUp, signOut, update, resetPassword, updatePassword }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside AuthProvider");
  return v;
}
