import Footer from "@/app/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
        {children}
        <Footer />
    </div>
  );
}
