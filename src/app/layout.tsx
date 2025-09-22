import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import VideoPreloader from "@/components/VideoPreloader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CalmRush",
  description: "A mood-improving website with calming, therapeutic design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${inter.variable} font-sans antialiased bg-[#0a0a0a]`}
      >
        <AuthProvider>
          <VideoPreloader />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
