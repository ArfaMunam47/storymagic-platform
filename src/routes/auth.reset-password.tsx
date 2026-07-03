import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Lock, ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Field, RippleButton, FloatingDecor } from "./auth.signin";

export const Route = createFileRoute("/auth/reset-password")({
  head: () => ({ meta: [{ title: "New Password — StoryMagic" }] }),
  component: ResetPage,
});

function ResetPage() {
  const { updatePassword } = useAuth();
  const nav = useNavigate();
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase drops a recovery session in the URL hash — the client picks it up automatically.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => { if (data.session) setReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd.length < 6) return toast.error("Password must be at least 6 characters");
    if (pwd !== pwd2) return toast.error("Passwords don't match");
    setBusy(true);
    try {
      await updatePassword(pwd);
      toast.success("Password updated ✨");
      nav({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-hero">
      <FloatingDecor />
      <div className="relative mx-auto grid min-h-screen max-w-md items-center px-4 py-8">
        <div className="w-full">
          <Link to="/auth/signin" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">← Back to sign in</Link>
          <div className="rounded-[2rem] glass p-8 shadow-float">
            <div className="mb-6 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-magic-purple"><Sparkles className="size-3" /> New password</span>
              <h1 className="mt-3 font-display text-3xl font-bold">Set a new password</h1>
              <p className="mt-1 text-sm text-muted-foreground">Make it something magical you'll remember.</p>
            </div>
            {!ready ? (
              <p className="rounded-2xl bg-white/70 p-4 text-center text-sm text-muted-foreground">Verifying reset link…</p>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <Field icon={Lock} type="password" value={pwd} onChange={setPwd} placeholder="New password" />
                <Field icon={Lock} type="password" value={pwd2} onChange={setPwd2} placeholder="Confirm password" />
                <RippleButton disabled={busy} className="w-full bg-gradient-primary text-white shadow-glow">
                  {busy ? "Updating…" : <>Update password <ArrowRight className="size-4" /></>}
                </RippleButton>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
