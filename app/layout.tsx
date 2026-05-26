import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageTracker from "@/components/tracker/PageTracker";
import LanguageSync from "./components/LanguageSync";
import { Suspense } from "react";
import { CookiesContextProvider } from "@/components/cookies/cookiesContextProvider";
import { ThemeProvider } from "@/app/components/theme-provider";

export const metadata: Metadata = {
  title: "Integys",
  description: "Integys - Dedicato alle ultime tendenze e approfondimenti nel mondo della tecnologia",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.integys.it"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative min-h-screen">
            <CookiesContextProvider>
              <Suspense fallback={null}>
                <LanguageSync />
              </Suspense>
              {children}
              <Toaster />
              {/* <ToastContainer className="z-50" /> */}
              <Analytics />
              <Suspense fallback={<div>Loading...</div>}>
                <PageTracker />
              </Suspense>
            </CookiesContextProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
