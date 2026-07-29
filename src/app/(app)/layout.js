import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export const dynamic = "force-dynamic";

// Shared shell for every authenticated page (dashboard + the invitation
// editor) — a route group, so it doesn't affect any URL. Its whole purpose
// is making the main sidebar persistent everywhere a signed-in user
// navigates, instead of /create being an isolated full-page experience.
export default async function AppShellLayout({ children }) {
  const user = await getCurrentUser();
  // The proxy already guards /dashboard/:path* and /create/:path*; this
  // keeps every page under this shell correct on its own if that ever
  // changes.
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-ink">
      <DashboardSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
