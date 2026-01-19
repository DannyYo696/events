import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NIGHTFLIX",
  description: "Buy Nightflix tickets for Lagos, Ibadan, and other cities.",
  keywords: ["Nightflix", "Nightflix Lagos", "Nightflix Ibadan", "Nightflix Event", "Buy Nightflix Tickets"],
  icons: {
    icon: "https://raw.githubusercontent.com/DannyYo696/svillage/1e09662e759a683b296438749046aa1d674d8b3c/Nightflix%20L.png",
  },
  openGraph: {
    title: "",
    description: "",
    url: "",
    siteName: "NIGHTFLIX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NIGHTFLIX",
    description: "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
