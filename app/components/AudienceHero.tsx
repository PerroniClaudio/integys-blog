import Link from "next/link";

type AudienceHeroProps = {
  contactLabel: string;
  description: string;
  imagePath: string;
  locale: string;
  sectionLabel: string;
  title: string;
};

export default function AudienceHero({
  contactLabel,
  description,
  imagePath,
  locale,
  sectionLabel,
  title,
}: AudienceHeroProps) {
  return (
    <div
      className="relative"
      style={{
        backgroundImage: `url('${imagePath}')`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/95 via-black/30 via-40% to-transparent" />
      <section className="relative z-20 mt-16 w-full pt-12 md:py-24 lg:py-32 xl:py-36">
        <div className="container max-w-7xl px-4 md:px-6">
          <div className="flex flex-col items-center gap-8 text-center">
            <div className="space-y-6">
              <p
                className="text-sm font-semibold uppercase tracking-[0.22em] text-primary-foreground/80"
                style={{ textShadow: "0 0 6px rgba(0,0,0,0.5)" }}
              >
                {sectionLabel}
              </p>
              <h1
                className="text-3xl font-bold tracking-tighter text-primary-foreground sm:text-4xl md:text-5xl lg:text-6xl/none"
                style={{ textShadow: "0 0 6px rgba(0,0,0,0.5)" }}
              >
                {title}
              </h1>
              <p
                className="mx-auto max-w-[700px] font-bold text-gray-100 md:text-xl"
                style={{ textShadow: "0 0 6px rgba(0,0,0,0.5)" }}
              >
                {description}
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                className="inline-flex w-[200px] items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary sm:w-[220px] sm:text-lg"
                href={`/${locale}/contattaci`}
              >
                {contactLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
