"use client";

import { useTranslation } from '@/lib/useTranslation';
import { usePathname } from 'next/navigation';


type Params =  {
  categories: { name: string, slug: string }[], 
  selected: string, 
  limited?: boolean,
  filtersPath?: string
}

function CategorySelector({ categories, selected, limited = false, filtersPath }: Params) {
  const { t } = useTranslation();
  const rawPathname = usePathname();
  const pathname = rawPathname || '';
  // Estrai il locale dal pathname
  const segments = pathname.split('/').filter(Boolean);
  const localeFromPath = segments[0];
  const locale = ['it', 'en'].includes(localeFromPath) ? localeFromPath : 'it';
  
  // Verifica se lo slug selezionato esiste nelle categorie disponibili
  const categoryExists = categories.some((cat: any) => cat.slug === selected);
  const currentValue = categoryExists ? selected : "tutte";
  const basePath = filtersPath ? `/${locale}/${filtersPath}` : limited ? `/${locale}/riservata` : `/${locale}`;
  const categorySegment = locale === 'en' ? 'categories' : 'categorie';

  const handleChange = (value: string) => {
    const nextPath =
      value === "tutte"
        ? basePath
        : filtersPath
          ? `${basePath}/${categorySegment}/${value}`
          : limited
          ? `${basePath}/${categorySegment}/${value}`
          : `/${locale}/categories/${value}`;

    window.location.href = nextPath;
  };

  return (
    <select 
      className='min-w-fit border border-gray-200 bg-gray-100 rounded-md px-2 py-2 w-1/2 md:w-1/4'
      style={{ borderColor: 'hsl(var(--border))', backgroundColor: 'hsl(var(--input))' }}
      value={currentValue}
      onChange={(e) => handleChange(e.target.value)}
    >
      <option value="tutte">{t('all')}</option>
      {categories.map((category) => (
        <option value={category.slug} key={category.slug}>{category.name}</option>
      ))}
    </select>
  )
}

export default CategorySelector
