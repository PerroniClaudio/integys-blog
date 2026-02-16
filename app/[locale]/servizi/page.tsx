import Link from 'next/link';
import { getServicesDataI18n } from '@/app/actions-i18n';
import { fullService } from '@/lib/interface';
import ServicesComponent from '@/app/components/ServicesComponent';
import ContactUs from "@/components/ui/contact-us";
import NavbarServizi from '@/app/components/NavbarServizi';
import ContactUsLink from '@/app/components/ContactUsLink';
import ServicesPageTitle from '@/app/components/ServicesPageTitle';
import ServicesPageSubtitle from '@/app/components/ServicesPageSubtitle';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {

  const { locale } = await params;
  const data = await getServicesDataI18n(locale); 

  return (
    <div className="bg-background">
      <NavbarServizi />
      {/* Hero Section */}
      <section className="relative w-full h-fit mt-16 xl:mt-24 py-12 md:py-24 lg:py-32 xl:py-36  flex items-center justify-center overflow-hidden bg-[url('/servizi/index.png')] bg-cover">
        {/* <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 z-10" /> */}
        <div className="absolute inset-0 bg-primary/50 brightness-50 dark:bg-secondary/70 dark:brightness-100 z-10" />
        <div className="container px-4 relative z-10 flex flex-col gap-6">
          <div className="text-center max-w-3xl mx-auto">
            <ServicesPageTitle key={locale} />
            <ServicesPageSubtitle key={locale} />

            <div className="space-x-4">
              <ContactUsLink
                className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-10 py-6 text-lg font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-primary dark:text-secondary-foreground dark:hover:bg-primary/90 dark:focus-visible:ring-gray-300"
                href="/contattaci" />
            </div>
          </div>

        </div>
      </section>

      <ServicesComponent key={locale} services={data} locale={locale} />
      <ContactUs />
    </div>
  );
}
