import type { Metadata } from "next";
import "./globals.css";
import LenisProvider from "@/providers/LenisProvider";
import LoadingScreen from "@/components/ui/LoadingScreen";

export const metadata: Metadata = {
  title: "SHELBY GT500 FASTBACK — Interactive Automotive Cinema",
  description:
    "Experience the iconic 1967 Shelby GT500 Fastback in full 3D interactive assembly, 360° orbit, and physical exploded view.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#050608] text-white overflow-x-hidden selection:bg-blue-500 selection:text-white">
        <LoadingScreen />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
