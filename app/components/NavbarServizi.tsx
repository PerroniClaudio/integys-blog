import { fullService } from "../lib/interface";
import { getServicesData } from "../actions";
import ServiziNav from "./ServiziNav";

type Props = {
  isGlobal?: boolean,
}

async function NavbarServizi({isGlobal = true} : Props) {

  const services: fullService[] = await getServicesData(); 
  
  return (
    <ServiziNav services={services} isGlobal={isGlobal} />
  );
}
export default NavbarServizi;
