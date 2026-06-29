import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

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
  signOut: () => void;
  update: (patch: Partial<User>) => void;
};

const Ctx = createContext<AuthCtx | null>(null);
const KEY = "sm.user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setLoading(false);
  }, []);

  const persist = (u: User | null) => {
    setUser(u);
    if (typeof window !== "undefined") {
      if (u) localStorage.setItem(KEY, JSON.stringify(u));
      else localStorage.removeItem(KEY);
    }
  };

  const signIn = async (email: string, _password: string) => {
    const u: User = {
      id: crypto.randomUUID(),
      name: email.split("@")[0].replace(/^./, (c) => c.toUpperCase()),
      email,
    };
    persist(u);
    return u;
  };

  const signUp = async (name: string, email: string, _password: string) => {
    const u: User = { id: crypto.randomUUID(), name, email };
    persist(u);
    return u;
  };

  const signOut = () => persist(null);
  const update = (patch: Partial<User>) => user && persist({ ...user, ...patch });

  return (
    <Ctx.Provider value={{ user, loading, signIn, signUp, signOut, update }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside AuthProvider");
  return v;
}
