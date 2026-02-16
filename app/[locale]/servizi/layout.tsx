import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
        <Navbar shouldChangeColor={false} />
        {children}
        <Footer />
    </div>
  );
}
