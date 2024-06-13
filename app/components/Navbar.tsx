import { getServerSession } from "next-auth";
import NavbarClient from "./NavbarClient";

async function Navbar({ shouldChangeColor }: { shouldChangeColor: boolean }) {
  
  const session = await getServerSession();

  return (
    <NavbarClient shouldChangeColor={shouldChangeColor} session={session} />
  );
}
export default Navbar;
