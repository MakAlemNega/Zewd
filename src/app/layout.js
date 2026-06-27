import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { InvitationProvider } from "@/context/InvitationContext"; // 👈 Import the provider

export const metadata = {
  title: "Zewd | Premium Digital Wedding Invitations",
  description:
    "Share your beautiful Ethiopian love story with modern digital invitations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        {/* Wrap everything inside the provider */}
        <InvitationProvider>
          {/* <Navbar /> */}
          <main className="flex-grow">{children}</main>
          <footer className="border-t border-stone-200 bg-stone-50 py-6 text-center text-xs text-stone-500">
            © {new Date().getFullYear()} Zewd. Made with care.
          </footer>
        </InvitationProvider>
      </body>
    </html>
  );
}
