"use client";

import { ServiceCard } from '@/app/components/ServiceCard';
import { ServiceSection } from '@/app/components/ServiceSection';
import { fullService } from '../lib/interface';
import { ServiceCardHero } from './ServiceCardHero';

type Params = {
  services: fullService[];
};

function ServicesNavigationComponent({ services }: Params) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(`service-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      {/* Services Navigation */}
      <section className="py-6">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6">I Nostri Servizi</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {services.map((service) => (
              <ServiceCardHero
                key={service.id}
                service={service}
                onClick={() => scrollToSection(service.id)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default ServicesNavigationComponent