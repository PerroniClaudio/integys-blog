import { locales, type Locale } from '@/lib/i18n';
import { notFound } from 'next/navigation';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  
  // Valida che il locale sia supportato
  if (!locales.includes(locale as Locale)) {
    notFound();
  }
  
  return (
    <div lang={locale}  className="pb-44"> {/* pb-44 is the padding-bottom of the footer */}
      {children}
    </div>
  );
}