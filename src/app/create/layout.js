import { InvitationProvider } from "@/context/InvitationContext";

// Scoped to /create on purpose: its bootstrap effect calls the
// authenticated /api/invitations endpoint, which would throw on every other
// page (landing, /login, the public /i/[slug] guest view, etc.) if mounted
// app-wide.
export default function CreateLayout({ children }) {
  return <InvitationProvider>{children}</InvitationProvider>;
}
