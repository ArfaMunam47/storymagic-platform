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
  const { user, update, signOut } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  const save = () => { update({ name, email }); toast.success("Profile saved"); };
  const remove = () => { if (confirm("Delete your account? This cannot be undone.")) { signOut(); nav({ to: "/" }); } };

  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-white p-6 shadow-card">
        <h1 className="font-display text-3xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your profile, notifications, and plan.</p>
      </header>

      <Card title="Profile">
        <Row label="Name"><Input value={name} onChange={setName} /></Row>
        <Row label="Email"><Input value={email} onChange={setEmail} /></Row>
        <button onClick={save} className="rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-bold text-white shadow-soft hover:-translate-y-0.5 transition">Save changes</button>
      </Card>

      <Card title="Password">
        <Row label="New password"><Input type="password" value="" onChange={() => {}} placeholder="••••••••" /></Row>
        <button onClick={() => toast.success("Password updated")} className="rounded-full bg-magic-purple/10 px-5 py-2.5 text-sm font-bold text-magic-purple hover:bg-magic-purple/20 transition">Update password</button>
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
          <select className="rounded-2xl border bg-muted/40 px-4 py-2.5 text-sm font-semibold">
            {["Light", "Dark", "System"].map((l) => <option key={l}>{l}</option>)}
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
