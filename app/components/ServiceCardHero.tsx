import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { fullService } from '../lib/interface';

interface ServiceCardProps {
  service: fullService;
  onClick: () => void;
}

export function ServiceCardHero({ service, onClick }: ServiceCardProps) {
  return (
    <Card
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 shadow-lg w-full md:w-[300px]"
      onClick={onClick}
    >
      <div className="p-2 space-y-4">
        <h3 className="text-lg font-semibold">{service.title}</h3>
        <p className="text-sm text-muted-foreground">{service.short}</p>
        <div className="flex items-center text-primary text-sm font-medium">
          Scopri di più
          <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Card>
  );
}