import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Live Crypto",
  description: "Live Crypto Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
<body
  className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex justify-center px-[10px]`}
>
  <div className="w-full max-w-screen-xl">
    {children}
  </div>
</body>
    </html>
  );
}
