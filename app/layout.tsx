import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Integys",
    template: "%s - Integys",
  },
  description:
    "Integys - Dedicato alle ultime tendenze e approfondimenti nel mondo della tecnologia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          {children}
          <Footer />
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
