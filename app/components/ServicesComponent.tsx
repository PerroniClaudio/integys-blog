"use client";

import { ServiceSection } from '@/app/components/ServiceSection';
import { fullService } from '../lib/interface';

type Params = {
  services: fullService[];
};

function ServicesComponent({ services }: Params) {
  // const scrollToSection = (id: string) => {
  //   const element = document.getElementById(`service-${id}`);
  //   if (element) {
  //     element.scrollIntoView({ behavior: 'smooth' });
  //   }
  // };

  return (
    <div>
      {/* Services Navigation */}
      {/* <section className="py-12 bg-gray-200 dark:bg-gray-600">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">I Nostri Servizi</h2>
          <div className="flex flex-wrap gap-6 justify-center">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onClick={() => scrollToSection(service.id)}
              />
            ))}
          </div>
        </div>
      </section> */}

      {/* Service Sections */}
      <section className="w[100dvw] bg-gray-100 dark:bg-background/80">
        <div className="container px-4 mx-auto">
          {services.map((service, index) => (
            <div 
              key={service.id} 
              className='relative'
              // className={index !== services.length - 1 ? 'mb-20' : ''}
            >
              <div id={`service-${service.id}`} className='absolute -top-28' />
              <ServiceSection
                service={service}
                reverse={index % 2 === 1}
              />
              {index !== services.length - 1 && (
                // <div className="border-b border-border/50 mt-20" />
                <div className="border-b border-border/50" />
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default ServicesComponent