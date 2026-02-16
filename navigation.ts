import { useRouter as useNextRouter, usePathname as useNextPathname } from 'next/navigation';
import Link from 'next/link';
import { locales, defaultLocale } from './lib/i18n';

// Compatibility wrapper for navigation
export { Link };
export const usePathname = useNextPathname;
export const useRouter = () => {
  const router = useNextRouter();
  return {
    ...router,
    replace: (pathname: string, options?: { locale?: string }) => {
      if (options?.locale && options.locale !== defaultLocale) {
        router.replace(`/${options.locale}${pathname}`);
      } else {
        router.replace(pathname);
      }
    }
  };
};

export const redirect = (pathname: string) => {
  if (typeof window !== 'undefined') {
    window.location.href = pathname;
  }
};