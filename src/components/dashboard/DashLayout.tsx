import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, BookMarked, Sparkles, Baby, Trophy, Gamepad2, BarChart3,
  Heart, Bell, Settings, LogOut, Search, Menu, X, Wand2, Moon, Sun,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/stories", label: "My Stories", icon: BookMarked },
  { to: "/generator", label: "AI Story Generator", icon: Sparkles },
  { to: "/profiles", label: "Child Profiles", icon: Baby },
  { to: "/achievements", label: "Achievements", icon: Trophy },
  { to: "/games", label: "Learning Games", icon: Gamepad2 },
  { to: "/progress", label: "Reading Progress", icon: BarChart3 },
  { to: "/favorites", label: "Favorites", icon: Heart },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function DashLayout({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const nav2 = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const unread = typeof window !== "undefined" ? store.notifs().filter((n) => !n.read).length : 0;

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const handleSignOut = () => {
    signOut();
    nav2({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-white/40 bg-white/70 px-4 py-3 backdrop-blur lg:hidden">
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="grid size-10 place-items-center rounded-2xl bg-white shadow-soft">
          <Menu className="size-5" />
        </button>
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-xl bg-gradient-primary text-white shadow-soft"><Wand2 className="size-4" /></span>
          <span className="font-display text-lg font-bold">StoryMagic</span>
        </Link>
        <Link to="/notifications" className="relative grid size-10 place-items-center rounded-2xl bg-white shadow-soft" aria-label="Notifications">
          <Bell className="size-5" />
          {unread > 0 && <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-magic-pink text-[10px] font-bold text-white">{unread}</span>}
        </Link>
      </div>

      <div className="mx-auto flex max-w-[1500px] gap-6 p-4 lg:p-6">
        {/* Sidebar (desktop) */}
        <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-64 shrink-0 flex-col rounded-3xl bg-white/80 p-4 shadow-float backdrop-blur lg:flex">
          <Link to="/dashboard" className="mb-6 flex items-center gap-2 px-2">
            <span className="grid size-10 place-items-center rounded-2xl bg-gradient-primary text-white shadow-soft"><Wand2 className="size-5" /></span>
            <span className="font-display text-xl font-bold">StoryMagic</span>
          </Link>
          <SideNav pathname={pathname} />
          <button onClick={handleSignOut} className="mt-3 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-foreground/70 transition hover:bg-magic-pink/10 hover:text-magic-pink">
            <LogOut className="size-5" /> Logout
          </button>
        </aside>

        {/* Sidebar (mobile drawer) */}
        <AnimatePresence>
          {open && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm lg:hidden" />
              <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 220 }} className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col rounded-r-3xl bg-white p-4 shadow-float lg:hidden">
                <div className="mb-4 flex items-center justify-between">
                  <Link to="/dashboard" className="flex items-center gap-2">
                    <span className="grid size-9 place-items-center rounded-2xl bg-gradient-primary text-white"><Wand2 className="size-5" /></span>
                    <span className="font-display text-lg font-bold">StoryMagic</span>
                  </Link>
                  <button onClick={() => setOpen(false)} className="grid size-9 place-items-center rounded-xl bg-muted"><X className="size-4" /></button>
                </div>
                <SideNav pathname={pathname} />
                <button onClick={handleSignOut} className="mt-3 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-magic-pink">
                  <LogOut className="size-5" /> Logout
                </button>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          {/* Top bar (desktop) */}
          <div className="hidden items-center gap-3 rounded-3xl bg-white/80 px-5 py-3 shadow-card backdrop-blur lg:flex">
            <div className="flex flex-1 items-center gap-2 rounded-2xl bg-muted/50 px-4 py-2.5">
              <Search className="size-4 text-muted-foreground" />
              <input placeholder="Search stories, heroes, worlds…" className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            </div>
            <button onClick={() => setDark((d) => !d)} aria-label="Toggle dark mode" className="grid size-10 place-items-center rounded-2xl bg-muted transition hover:bg-magic-purple/15">
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <Link to="/notifications" className="relative grid size-10 place-items-center rounded-2xl bg-muted transition hover:bg-magic-pink/15">
              <Bell className="size-4" />
              {unread > 0 && <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-magic-pink text-[10px] font-bold text-white">{unread}</span>}
            </Link>
            <Link to="/settings" className="flex items-center gap-3 rounded-2xl bg-gradient-primary px-3 py-1.5 text-white shadow-soft transition hover:-translate-y-0.5">
              <span className="grid size-8 place-items-center rounded-xl bg-white/25 font-display font-bold">{user?.name?.[0] ?? "?"}</span>
              <span className="pr-1 text-sm font-bold">{user?.name ?? "Guest"}</span>
            </Link>
          </div>

          <motion.main key={pathname} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: "easeOut" }} className="min-w-0">
            {children}
          </motion.main>
        </div>
      </div>
    </div>
  );
}

function SideNav({ pathname }: { pathname: string }) {
  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
      {nav.map((item) => {
        const active = pathname === item.to || pathname.startsWith(item.to + "/");
        return (
          <Link key={item.to} to={item.to} className={`group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${active ? "bg-gradient-primary text-white shadow-glow" : "text-foreground/70 hover:bg-magic-purple/10 hover:text-foreground"}`}>
            <item.icon className="size-5" />
            <span>{item.label}</span>
            {active && <motion.span layoutId="dot" className="ml-auto size-2 rounded-full bg-white" />}
          </Link>
        );
      })}
    </nav>
  );
}
