import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/noto-sans-georgian";
import "./globals.css";

export const metadata: Metadata = {
  title: "SimStay OS",
  description: "The AI-native frontline operating system for hospitality",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B0C0E",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ka">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
