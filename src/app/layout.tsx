import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CGT AI Call Intelligence",
  description: "Call scoring, coaching and content intelligence for sales teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-screen overflow-hidden">
      <body className="h-screen overflow-hidden flex">{children}</body>
    </html>
  );
}
