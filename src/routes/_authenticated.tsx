import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { DashLayout } from "@/components/dashboard/DashLayout";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: ProtectedLayout,
});

function ProtectedLayout() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    if (!loading && !user) nav({ to: "/auth/signin" });
  }, [loading, user, nav]);

  if (loading || !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-gradient-hero">
        <div className="flex items-center gap-3 rounded-2xl bg-white/80 px-5 py-3 shadow-card backdrop-blur">
          <span className="size-3 animate-pulse rounded-full bg-magic-purple" />
          <span className="font-display font-bold">Loading magic…</span>
        </div>
      </div>
    );
  }

  return (
    <DashLayout>
      <Outlet />
    </DashLayout>
  );
}
