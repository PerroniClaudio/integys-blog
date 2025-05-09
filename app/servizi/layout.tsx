import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="pb-44">
        <Navbar shouldChangeColor={false} />
        {children}
        <Footer />
    </div>
  );
}
