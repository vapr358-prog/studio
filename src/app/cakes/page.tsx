import { cakes } from '@/lib/data';
import { CakeCard } from '@/components/CakeCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nuestros Pasteles',
  description: 'Explora nuestro catálogo de pasteles artesanales, hechos con los mejores ingredientes.',
};

export default function CakesPage() {
  // Filtramos para NO mostrar la galería como un producto comercial
  const commercialCakes = cakes.filter(cake => cake.id !== 'tarta-cumpleanos-especial');

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl">Nuestro Catálogo de Pasteles</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Cada uno de nuestros pasteles es una obra de arte, creada con pasión y los ingredientes más frescos.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {commercialCakes.map((cake) => (
          <CakeCard key={cake.id} cake={cake} />
        ))}
      </div>
    </div>
  );
}
