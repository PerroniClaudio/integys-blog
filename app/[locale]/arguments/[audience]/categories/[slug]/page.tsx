import FixedCategoryPage, { fixedAudiences } from '@/app/components/FixedCategoryPage';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AudienceCategoryPage({ params }: { params: Promise<{ locale: string; audience: string; slug: string }> }) {
  const { locale, audience, slug } = await params;
  if (!(audience in fixedAudiences)) notFound();

  return <FixedCategoryPage audience={audience as keyof typeof fixedAudiences} locale={locale} selectedCategory={slug} />;
}
