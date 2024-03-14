import "~/styles/globals.css";

import { Inter } from "next/font/google";
import HomeNav from "~/components/Nav/HomeNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} bg-background text-text`}>
      <nav className="sticky top-0 z-20"><HomeNav></HomeNav></nav>
        {children}
        </body>
    </html>
  );
}
