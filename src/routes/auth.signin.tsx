import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import authIllustration from "@/assets/auth-illustration.png";

export const Route = createFileRoute("/auth/signin")({
  head: () => ({
    meta: [
      { title: "Sign In — StoryMagic" },
      { name: "description", content: "Sign in to continue your magical storytelling journey." },
    ],
  }),
  component: SignInPage,
});

function SignInPage() {
  const { signIn } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pwd) { toast.error("Please fill in both fields"); return; }
    setBusy(true);
    try {
      await signIn(email, pwd);
      toast.success("Welcome back! ✨");
      nav({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  };

  const social = async () => {
    toast("Social sign-in coming soon — please use email for now.");
  };


  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-hero">
      <FloatingDecor />
      <div className="relative mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-8 px-4 py-8 lg:grid-cols-2 lg:gap-12 lg:px-10">
        {/* Left */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="relative hidden lg:block">
          <div className="relative mx-auto aspect-square w-full max-w-lg">
            <div className="absolute inset-8 rounded-full bg-gradient-magic opacity-30 blur-3xl animate-float-y" />
            <img src={authIllustration} alt="Smiling child reading a magical book" width={1024} height={1280} className="relative z-10 size-full object-contain drop-shadow-[0_30px_60px_rgba(120,80,200,0.35)] animate-float-y" />
          </div>
          <div className="mt-6 text-center">
            <h2 className="font-display text-3xl font-bold">
              Where every child is the <span className="text-gradient-magic">hero</span>.
            </h2>
            <p className="mt-2 text-muted-foreground">Continue your magical storytelling journey.</p>
          </div>
        </motion.div>

        {/* Right card */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="mx-auto w-full max-w-md">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">← Back to home</Link>
          <div className="rounded-[2rem] glass p-8 shadow-float">
            <div className="mb-6 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-magic-purple"><Sparkles className="size-3" /> Welcome back</span>
              <h1 className="mt-3 font-display text-3xl font-bold">Welcome Back!</h1>
              <p className="mt-1 text-sm text-muted-foreground">Continue your magical storytelling journey.</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <Field icon={Mail} type="email" value={email} onChange={setEmail} placeholder="Email address" />
              <Field icon={Lock} type={show ? "text" : "password"} value={pwd} onChange={setPwd} placeholder="Password" trailing={
                <button type="button" onClick={() => setShow((s) => !s)} className="text-muted-foreground hover:text-foreground" aria-label="Toggle password">
                  {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              } />
              <div className="flex items-center justify-between text-sm">
                <label className="flex cursor-pointer items-center gap-2 font-semibold text-foreground/70">
                  <input type="checkbox" className="size-4 rounded border-input accent-magic-purple" /> Remember me
                </label>
                <a href="#" className="font-semibold text-magic-purple hover:underline">Forgot password?</a>
              </div>

              <RippleButton disabled={busy} className="w-full bg-gradient-primary text-white shadow-glow">
                {busy ? "Signing you in…" : <>Sign In <ArrowRight className="size-4" /></>}
              </RippleButton>

              <div className="relative my-2 flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
              </div>

              <button type="button" onClick={() => social("google")} className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-5 py-3 text-sm font-bold shadow-soft transition hover:-translate-y-0.5 hover:shadow-card">
                <GoogleIcon /> Continue with Google
              </button>
              <button type="button" onClick={() => social("microsoft")} className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-5 py-3 text-sm font-bold shadow-soft transition hover:-translate-y-0.5 hover:shadow-card">
                <MicrosoftIcon /> Continue with Microsoft
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/auth/signup" className="font-bold text-magic-purple hover:underline">Create Account</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

export function Field({
  icon: Icon, type = "text", value, onChange, placeholder, trailing,
}: {
  icon: React.ComponentType<{ className?: string }>;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  trailing?: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/80 px-4 py-3 shadow-soft transition focus-within:border-magic-purple focus-within:shadow-glow">
      <Icon className="size-4 text-magic-purple" />
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
      {trailing}
    </label>
  );
}

export function RippleButton({
  children, className = "", disabled, type = "submit", onClick,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
}) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const handle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples((rs) => [...rs, { x: e.clientX - r.left, y: e.clientY - r.top, id }]);
    setTimeout(() => setRipples((rs) => rs.filter((x) => x.id !== id)), 600);
    onClick?.();
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={handle}
      className={`relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl px-6 py-3.5 text-sm font-bold transition hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 ${className}`}
    >
      {ripples.map((r) => (
        <span key={r.id} className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 animate-[ripple_600ms_ease-out] rounded-full bg-white/50" style={{ left: r.x, top: r.y }} />
      ))}
      <span className="relative flex items-center gap-2">{children}</span>
      <style>{`@keyframes ripple { to { transform: translate(-50%,-50%) scale(40); opacity: 0; } }`}</style>
    </button>
  );
}

export function FloatingDecor() {
  return (
    <>
      <div className="pointer-events-none absolute -left-20 top-20 size-72 rounded-full bg-magic-pink/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 size-80 rounded-full bg-magic-sky/30 blur-3xl" />
      {[...Array(14)].map((_, i) => (
        <span key={i} className="pointer-events-none absolute animate-twinkle" style={{
          left: `${(i * 7.3) % 100}%`,
          top: `${(i * 13.1) % 100}%`,
          animationDelay: `${(i % 5) * 0.4}s`,
        }} aria-hidden>
          <Sparkles className="size-4 text-magic-yellow opacity-80" />
        </span>
      ))}
    </>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.3 29.1 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5c10.7 0 19.3-7.7 19.3-19.5 0-1.2-.1-2.4-.3-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.3 29.1 4.5 24 4.5c-7.4 0-13.8 4.2-17.7 10.2z"/>
      <path fill="#4CAF50" d="M24 43.5c5 0 9.6-1.9 13-5l-6-5.1c-1.9 1.3-4.4 2.1-7 2.1-5.2 0-9.6-3.1-11.3-7.4l-6.5 5C9.9 39.2 16.4 43.5 24 43.5z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.4l6 5.1c-.4.4 6.5-4.7 6.5-14.5 0-1.2-.1-2.4-.3-3.5z"/>
    </svg>
  );
}
function MicrosoftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 23 23" aria-hidden>
      <rect width="10" height="10" x="1" y="1" fill="#F25022" />
      <rect width="10" height="10" x="12" y="1" fill="#7FBA00" />
      <rect width="10" height="10" x="1" y="12" fill="#00A4EF" />
      <rect width="10" height="10" x="12" y="12" fill="#FFB900" />
    </svg>
  );
}
