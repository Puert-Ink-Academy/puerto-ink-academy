import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Pirata_One } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pirataOne = Pirata_One({
  variable: "--font-pirata-one",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Puerto Ink Academy",
  description: "The Next Evolution in Tattoo Education",
  applicationName: "Puerto Ink",
  appleWebApp: {
    capable: true,
    title: "Puerto Ink",
    statusBarStyle: "black-translucent",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#09090b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} ${pirataOne.variable}`}
    >
      <body className="antialiased">
        {children}
        <Toaster
          theme="dark"
          position="top-center"
          mobileOffset={{ top: "calc(env(safe-area-inset-top) + 16px)" }}
        />
      </body>
    </html>
  );
}
