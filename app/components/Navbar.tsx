import Link from "next/link";
import ModeToggle from "./ModeToggle";

function Navbar() {
  return (
    <nav className="w-full relative flex items-center justify-between max-w-3xl mx-auto px-4 py-5">
      <Link href="/" className="font-bold text-3xl text-primary">
        INTEGYS
      </Link>

      <ModeToggle />
    </nav>
  );
}
export default Navbar;
