import type { Metadata } from 'next';
import DynamicReservationForm from '@/components/DynamicReservationForm';

export const metadata: Metadata = {
  title: 'Reservar un Pastel',
  description: 'Solicita un pastel personalizado para tu evento especial. Completa nuestro formulario y nos pondremos en contacto contigo.',
};


export default function BookPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl">Reserva tu Pastel Personalizado</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Cuéntanos sobre el pastel de tus sueños y lo haremos realidad. Rellena el formulario y nuestro equipo se pondrá en contacto para afinar los detalles.
          </p>
        </div>
        <DynamicReservationForm />
      </div>
    </div>
  );
}
