import { locales, type Locale } from '@/lib/i18n';
import { notFound } from 'next/navigation';

type Props = {
  children: React.ReactNode;
  params: { locale: string } | Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const resolvedParams = await Promise.resolve(params);
  const locale = (resolvedParams?.locale || '').trim().toLowerCase();
  if (typeof console !== 'undefined') {
    // eslint-disable-next-line no-console
    console.log('Locale ricevuto in layout:', locale);
  }
  // Valida che il locale sia supportato
  if (!locale || !locales.includes(locale as Locale)) {
    console.log(`Locale "${locale}" non supportato. I locali supportati sono: ${locales.join(', ')}.`);
    notFound();
  }
  return (
    <div lang={locale} className="pb-44"> {/* pb-44 is the padding-bottom of the footer */}
      {children}
    </div>
  );
}