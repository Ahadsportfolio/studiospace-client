import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { AuthProvider } from "@/providers/auth-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "sonner";
import "./globals.css";

const studioSans = DM_Sans({
  variable: "--font-studio-sans",
  subsets: ["latin"],
});

const studioDisplay = DM_Serif_Display({
  variable: "--font-studio-display",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "StudioSpace | Find your creative space",
    template: "%s | StudioSpace",
  },
  description:
    "Discover inspiring photo studios, film stages, podcast lounges, music suites, and workshops.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${studioSans.variable} ${studioDisplay.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <SiteHeader />
              <div className="flex-1">{children}</div>
              <SiteFooter />
            </div>
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
