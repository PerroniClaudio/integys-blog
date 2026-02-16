"use client";


import { useTranslation } from '@/lib/useTranslation';
import { useRouter, usePathname } from 'next/navigation';


type Params =  {
  categories: { name: string, slug: string }[], 
  selected: string, 
  limited?: boolean
}

function CategorySelector({ categories, selected, limited = false }: Params) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  
  // Estrai il locale dal pathname
  const segments = pathname.split('/').filter(Boolean);
  const localeFromPath = segments[0];
  const locale = ['it', 'en'].includes(localeFromPath) ? localeFromPath : 'it';
  
  // Verifica se lo slug selezionato esiste nelle categorie disponibili
  const categoryExists = categories.some((cat: any) => cat.slug === selected);
  const currentValue = categoryExists ? selected : "tutte";

  return (
    <select 
      className='min-w-fit border border-gray-200 bg-gray-100 rounded-md px-2 py-2 w-1/2 md:w-1/4'
      style={{ borderColor: 'hsl(var(--border))', backgroundColor: 'hsl(var(--input))' }}
      value={currentValue}
      onChange={(e)=>e.target.value == "tutte" ? router.push(limited ? `/${locale}/riservata` : `/${locale}`) : router.push(limited ? `/${locale}/riservata/categorie/${e.target.value}` : `/${locale}/categories/${e.target.value}`)}
    >
      <option value="tutte">{t('all')}</option>
      {categories.map((category, idx) => (
        <option value={category.slug} key={idx}>{category.name}</option>
      ))}
    </select>
  )
}

export default CategorySelector