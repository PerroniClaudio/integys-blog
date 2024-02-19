import Link from "next/link";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-6 border-t border-primary ">
      <div className="container flex items-center justify-between gap-4 px-4 text-sm md:gap-6 min-h-32">
        <div className="flex flex-col gap-2">
          <Link href="/" className={`font-bold text-3xl text-primary`}>
            <div className="flex items-center gap-1 ">
              <div className={`p-1 rounded dark:bg-primary`}>
                <img src="/integy.png" alt="Integys" className="h-8 w-auto" />
              </div>

              <span>INTEGYS</span>
            </div>
          </Link>
        </div>
        <nav className="flex flex-col items-center gap-2">
          <p>INTEGYS™ è una divisione di iFortech SRL</p>
          <p>VIA SEMPIONE 11 - MONZA - 20900 (MB)</p>
          <p>Copyright © {currentYear}. All Rights Reserved.</p>
        </nav>
        <div className="flex flex-col items-right ">
          <Link
            className="text-right"
            href="https://integys.com/privacy-policy/">
            Privacy Policy
          </Link>
          <Link
            className="text-right"
            href="https://integys.com/cookie-policy/">
            Cookie Policy
          </Link>
          <Link className="text-right" href="https://integys.com/note-legali/">
            Note Legali
          </Link>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
