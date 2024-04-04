import type { Metadata } from "next";
import { Inter,  Roboto } from "next/font/google";
import "./globals.scss";

const font = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Stripe Metrics Dashboard",
  description: "Dashboard to view various Stripe metrics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>{children}</body>
    </html>
  );
}
