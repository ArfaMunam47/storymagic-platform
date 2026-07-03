import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Mail, Lock, User as UserIcon, Baby, Sparkles, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { store } from "@/lib/store";
import authIllustration from "@/assets/auth-illustration.png";
import { Field, RippleButton, FloatingDecor } from "./auth.signin";

export const Route = createFileRoute("/auth/signup")({
  head: () => ({
    meta: [
      { title: "Create Account — StoryMagic" },
      { name: "description", content: "Join thousands of families lighting up bedtime with personalized AI stories." },
    ],
  }),
  component: SignUpPage,
});

const themes = ["Fantasy", "Space", "Ocean", "Dinosaurs", "Adventure", "Animals"];

function SignUpPage() {
  const { signUp } = useAuth();
  const nav = useNavigate();
  const [parent, setParent] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [child, setChild] = useState("");
  const [age, setAge] = useState("");
  const [theme, setTheme] = useState("Fantasy");
  const [agree, setAgree] = useState(false);
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parent || !email || !pwd) return toast.error("Please fill the required fields");
    if (pwd.length < 6) return toast.error("Password must be at least 6 characters");
    if (pwd !== pwd2) return toast.error("Passwords don't match");
    if (!agree) return toast.error("Please accept the terms");
    setBusy(true);
    try {
      await signUp(parent, email, pwd);
      if (child) {
        store.addProfile({
          id: crypto.randomUUID(),
          name: child,
          age: Number(age) || 5,
          genre: theme,
          emoji: theme === "Space" ? "🚀" : theme === "Ocean" ? "🐠" : theme === "Dinosaurs" ? "🦕" : "🧚",
          progress: 0,
        });
      }
      toast.success("Welcome to StoryMagic! ✨ Check your email to verify your account.");
      nav({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign-up failed");
    } finally {
      setBusy(false);
    }
  };


  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-hero">
      <FloatingDecor />
      <div className="relative mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-8 px-4 py-8 lg:grid-cols-2 lg:gap-12 lg:px-10">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="relative hidden lg:block">
          <div className="relative mx-auto aspect-square w-full max-w-lg">
            <div className="absolute inset-8 rounded-full bg-gradient-magic opacity-30 blur-3xl animate-float-y" />
            <img src={authIllustration} alt="" width={1024} height={1280} className="relative z-10 size-full object-contain drop-shadow-[0_30px_60px_rgba(120,80,200,0.35)] animate-float-y" />
          </div>
          <div className="mt-6 text-center">
            <h2 className="font-display text-3xl font-bold">Bedtime, but <span className="text-gradient-magic">magical</span>.</h2>
            <p className="mt-2 text-muted-foreground">Create an account and unlock your first story in seconds.</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="mx-auto w-full max-w-md">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">← Back to home</Link>
          <div className="rounded-[2rem] glass p-8 shadow-float">
            <div className="mb-6 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-magic-pink"><Sparkles className="size-3" /> Join the magic</span>
              <h1 className="mt-3 font-display text-3xl font-bold">Create your account</h1>
              <p className="mt-1 text-sm text-muted-foreground">Free to start. No credit card needed.</p>
            </div>

            <form onSubmit={submit} className="space-y-3.5">
              <Field icon={UserIcon} value={parent} onChange={setParent} placeholder="Parent name" />
              <Field icon={Mail} type="email" value={email} onChange={setEmail} placeholder="Email address" />
              <Field icon={Lock} type={show ? "text" : "password"} value={pwd} onChange={setPwd} placeholder="Password" trailing={
                <button type="button" onClick={() => setShow((s) => !s)} className="text-muted-foreground" aria-label="Toggle">{show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>
              } />
              <Field icon={Lock} type={show ? "text" : "password"} value={pwd2} onChange={setPwd2} placeholder="Confirm password" />

              <div className="rounded-2xl border border-dashed border-magic-purple/30 bg-white/40 p-3">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-magic-purple">Optional · Your child</p>
                <div className="space-y-3">
                  <Field icon={Baby} value={child} onChange={setChild} placeholder="Child's name" />
                  <div className="grid grid-cols-2 gap-3">
                    <Field icon={Sparkles} type="number" value={age} onChange={setAge} placeholder="Age" />
                    <select value={theme} onChange={(e) => setTheme(e.target.value)} className="rounded-2xl border border-white/60 bg-white/80 px-4 py-3 text-sm font-semibold shadow-soft outline-none">
                      {themes.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-2 text-xs text-foreground/70">
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 size-4 rounded border-input accent-magic-purple" />
                <span>I agree to StoryMagic's <a href="#" className="font-bold text-magic-purple hover:underline">Terms</a> and <a href="#" className="font-bold text-magic-purple hover:underline">Privacy Policy</a>.</span>
              </label>

              <RippleButton disabled={busy} className="bg-gradient-primary text-white shadow-glow">
                {busy ? "Creating account…" : <>Create Account <ArrowRight className="size-4" /></>}
              </RippleButton>
            </form>

            <p className="mt-5 text-center text-sm text-muted-foreground">
              Already have an account? <Link to="/auth/signin" className="font-bold text-magic-purple hover:underline">Sign in</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
