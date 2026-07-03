import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { Field, RippleButton, FloatingDecor } from "./auth.signin";

export const Route = createFileRoute("/auth/forgot-password")({
  head: () => ({ meta: [{ title: "Reset Password — StoryMagic" }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Enter your email");
    setBusy(true);
    try {
      await resetPassword(email);
      setSent(true);
      toast.success("Check your inbox for a reset link");
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
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-magic-purple"><Sparkles className="size-3" /> Forgot password</span>
              <h1 className="mt-3 font-display text-3xl font-bold">Reset your password</h1>
              <p className="mt-1 text-sm text-muted-foreground">We'll email you a magic link to set a new one.</p>
            </div>
            {sent ? (
              <p className="rounded-2xl bg-white/70 p-4 text-center text-sm">If an account exists for <b>{email}</b>, a reset link is on its way ✨</p>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <Field icon={Mail} type="email" value={email} onChange={setEmail} placeholder="Email address" />
                <RippleButton disabled={busy} className="w-full bg-gradient-primary text-white shadow-glow">
                  {busy ? "Sending…" : <>Send reset link <ArrowRight className="size-4" /></>}
                </RippleButton>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
