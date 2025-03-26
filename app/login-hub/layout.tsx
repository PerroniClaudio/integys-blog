import Footer from "../components/Footer";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="pb-44">
        {children}
        <Footer />
    </div>
  );
}
