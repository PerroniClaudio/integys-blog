"use client";

import { ServiceSection } from '@/app/components/ServiceSection';
import { fullService } from '../lib/interface';

type Params = {
  services: fullService[];
};

function ServicesComponent({ services }: Params) {

  return (
    <div>
      {/* Services Navigation */}

      {/* Service Sections */}
      <section className="w[100dvw] bg-background">
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
                // <div className="border-b border-gray-200/50 mt-20" />
                <div className="border-b border-gray-200/50" style={{ borderColor: 'hsl(var(--border) / 0.5)' }} />
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default ServicesComponent