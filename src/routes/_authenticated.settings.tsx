import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useTheme, type Theme } from "@/lib/theme";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — StoryMagic" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user, update, signOut, updatePassword } = useAuth();
  const { theme, setTheme } = useTheme();
  const nav = useNavigate();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [newPwd, setNewPwd] = useState("");
  const [saving, setSaving] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      if (name !== user?.name) await update({ name });
      if (email && email !== user?.email) {
        const { supabase } = await import("@/integrations/supabase/client");
        const { error } = await supabase.auth.updateUser({ email });
        if (error) throw error;
        toast.success("Check your inbox to confirm the new email");
      } else {
        toast.success("Profile saved");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (newPwd.length < 6) return toast.error("Password must be at least 6 characters");
    setPwdSaving(true);
    try {
      await updatePassword(newPwd);
      setNewPwd("");
      toast.success("Password updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update password");
    } finally {
      setPwdSaving(false);
    }
  };

  const remove = async () => {
    if (!confirm("Delete your account? This cannot be undone.")) return;
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      if (user) await supabase.from("profiles").delete().eq("id", user.id);
      await signOut();
      nav({ to: "/" });
      toast.success("Account signed out. Contact support to fully delete your login.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  };

  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-white p-6 shadow-card">
        <h1 className="font-display text-3xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your profile, notifications, and plan.</p>
      </header>

      <Card title="Profile">
        <Row label="Name"><Input value={name} onChange={setName} /></Row>
        <Row label="Email"><Input value={email} onChange={setEmail} /></Row>
        <button onClick={save} disabled={saving} className="rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-bold text-white shadow-soft hover:-translate-y-0.5 transition disabled:opacity-60">{saving ? "Saving…" : "Save changes"}</button>
      </Card>

      <Card title="Password">
        <Row label="New password"><Input type="password" value={newPwd} onChange={setNewPwd} placeholder="••••••••" /></Row>
        <button onClick={changePassword} disabled={pwdSaving} className="rounded-full bg-magic-purple/10 px-5 py-2.5 text-sm font-bold text-magic-purple hover:bg-magic-purple/20 transition disabled:opacity-60">{pwdSaving ? "Updating…" : "Update password"}</button>
      </Card>


      <Card title="Notifications">
        {["New stories ready", "Achievements unlocked", "Weekly reading goals", "Product updates"].map((l) => (
          <label key={l} className="flex cursor-pointer items-center justify-between border-b border-border py-3 last:border-0">
            <span className="text-sm font-semibold">{l}</span>
            <input type="checkbox" defaultChecked className="size-5 accent-magic-purple" />
          </label>
        ))}
      </Card>

      <Card title="Language & Theme">
        <Row label="Language">
          <select className="rounded-2xl border bg-muted/40 px-4 py-2.5 text-sm font-semibold">
            {["English", "Spanish", "French", "German", "Hindi"].map((l) => <option key={l}>{l}</option>)}
          </select>
        </Row>
        <Row label="Theme">
          <select
            value={theme}
            onChange={(e) => { const t = e.target.value as Theme; setTheme(t); toast.success(`Switched to ${t} theme`); }}
            className="rounded-2xl border bg-muted/40 px-4 py-2.5 text-sm font-semibold"
          >
            <option value="light">Light</option>
            <option value="dark">Dark — Bedtime Magic</option>
            <option value="system">System</option>
          </select>
        </Row>
      </Card>

      <Card title="Subscription">
        <p className="text-sm text-muted-foreground">You're on the <span className="font-bold text-magic-purple">Family</span> plan. Renews monthly.</p>
        <button onClick={() => toast("Opening billing portal…")} className="mt-3 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5">Manage plan</button>
      </Card>

      <Card title="Danger zone">
        <p className="text-sm text-muted-foreground">Permanently delete your account and all stored stories.</p>
        <button onClick={remove} className="mt-3 rounded-full bg-magic-pink/10 px-5 py-2.5 text-sm font-bold text-magic-pink hover:bg-magic-pink/20 transition">Delete account</button>
      </Card>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 rounded-3xl bg-white p-6 shadow-card">
      <h2 className="font-display text-lg font-bold">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid items-center gap-2 sm:grid-cols-[160px_1fr]">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <div>{children}</div>
    </div>
  );
}
function Input({ value, onChange, type = "text", placeholder }: { value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return <input value={value} type={type} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="w-full rounded-2xl border bg-muted/40 px-4 py-2.5 text-sm outline-none focus:border-magic-purple" />;
}
