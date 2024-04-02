import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Footer from "./components/Footer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange>
          {children}
          <Toaster />
          <ToastContainer className="z-50" />
          <Footer />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
