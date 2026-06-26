import "./globals.css";

export const metadata = {
  title: "Zewd (ዘውድ)",
  description: "Project Title",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
