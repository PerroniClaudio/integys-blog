import { getServerSession } from "next-auth";
import AdminNavbarClient from "./AdminNavbarClient";

async function AdminNavbar() {
  
  const session = await getServerSession();

  return (
    <AdminNavbarClient session={session} />
  );
}
export default AdminNavbar;
