import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from "next/link";
import type { Service } from '@/app/lib/types';
import { fullService } from '../lib/interface';
import { urlFor } from '../lib/sanity';
import { PortableText } from '@portabletext/react';

interface ServiceSectionProps {
  service: fullService;
  reverse?: boolean;
}

export function ServiceSection({ service, reverse = false }: ServiceSectionProps) {
  return (
    // <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 py-12`}>
    <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 items-center gap-8 md:gap-12 py-12`}>
      {/* <div className="flex-1"> */}
      <div className={`xl:col-span-2 ${reverse ? 'md:order-2' : 'md:order-1'} `}>
        <div className="relative group shadow-xl shadow-black/60 rounded-2xl">
          {/* <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl transform group-hover:scale-105 transition-transform duration-300" /> */}
          <img
            // src={service.titleImage}
            src={urlFor(service.titleImage).url()}
            alt={service.title}
            className="rounded-2xl shadow-xl relative z-10 w-full h-[400px] xl:h-[500px] object-cover"
          />
        </div>
      </div>
      {/* <div className="flex-1 space-y-6"> */}
      <div className={`space-y-6 ${reverse ? 'md:order-1' : 'md:order-2'} `}>
        <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight">{service.title}</h2>
        <div className="text-lg md:text-xl lg:text-2xl">
          <PortableText value={service.smallDescription} />
        </div>
        {/* <p className="text-lg md:text-xl lg:text-2xl">{service.smallDescription}</p> */}
        <Button variant="outline" className="group" asChild>
          <Link href={`/servizi/${service.currentSlug}`}>
            Leggi tutto <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </div>
  );
}