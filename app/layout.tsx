import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Footer from "./components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CookiesContextProvider } from "@/components/cookies/cookiesContextProvider";
import PageTracker from "@/components/tracker/PageTracker";
import { Suspense } from "react";
export const metadata: Metadata = {
  title: {
    default: "Integys",
    template: "%s - Integys",
  },
  description:
    "Integys - Dedicato alle ultime tendenze e approfondimenti nel mondo della tecnologia",
  openGraph: {
    images: [
      {
        url: "opengraph-integys.png",
        alt: "Integys",
      },
    ],
  },
  other: {
    "google-site-verification": "TtG6b53ZlYddcxjiJSGy9uNaJ8SiK-ojw5DyVkgYsfs",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        {/* <div className="relative min-h-screen pb-44"> Per gestire il footer */}
        <div className="relative min-h-screen">
          {" "}
          {/* senza il footer. Lo si aggiunge nei singoli layout/pagine */}
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange>
            <CookiesContextProvider>
              {children}
              <Toaster />
              <ToastContainer className="z-50" />
              {/* <Footer /> */}
              {/* Cookies */}
              <Analytics />
              <Suspense fallback={<div>Loading...</div>}>
                <PageTracker />
              </Suspense>
            </CookiesContextProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
