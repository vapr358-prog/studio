import type { Metadata } from 'next';
import TrackingClient from '@/components/tracking/TrackingClient';

export const metadata: Metadata = {
  title: 'Seguimiento de Envíos',
  description: 'Localiza tu envío en tiempo real.',
};

export default function TrackingPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-headline text-4xl md:text-5xl">Localiza tu envío</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Introduce tu código de seguimiento para ver el estado de tu pedido.
          </p>
        </div>
        <TrackingClient />
      </div>
    </div>
  );
}
