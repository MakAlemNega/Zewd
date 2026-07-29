import "./globals.css";
import Link from "next/link";
import { Bodoni_Moda, Manrope } from "next/font/google";
import Navbar from "@/components/layout/navbar";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Zewd | Premium Digital Wedding Invitations",
  description:
    "Share your beautiful Ethiopian love story with modern digital invitations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bodoni.variable} ${manrope.variable}`}>
      <body className="flex flex-col min-h-screen bg-ink">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <footer className="border-t border-ink-line bg-ink py-8 text-center text-xs tracking-wide text-ivory/40">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href="/contact" className="transition-colors hover:text-ivory/70">
              Contact
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-ivory/70">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-ivory/70">
              Terms of Service
            </Link>
          </div>
          <p className="mt-4">
            © {new Date().getFullYear()} Zewd. Made with care, for every
            Habesha love story.
          </p>
        </footer>
      </body>
    </html>
  );
}
