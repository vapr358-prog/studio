'use client'; // Añadimos esto para poder usar el idioma

import { cakes } from '@/lib/data';
import { CakeCard } from '@/components/CakeCard';
import { useI18n } from '@/context/LanguageContext';

export default function CakesPage() {
  const { language } = useI18n(); // Obtenemos el idioma actual (es o ca)

  // Filtramos para NO mostrar la galería como un producto comercial
  const commercialCakes = cakes.filter(cake => cake.id !== 'tarta-cumpleanos-especial');

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl text-primary uppercase">
          {language === 'es' ? 'Nuestro Catálogo de Pasteles' : 'El nostre Catàleg de Pastissos'}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto italic">
          {language === 'es' 
            ? 'Cada uno de nuestros pasteles es una obra de arte, creada con pasión.' 
            : 'Cada un dels nostres pastissos és una obra d’art, creada amb passió.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {commercialCakes.map((cake) => (
          // Pasamos el pastel al componente CakeCard
          <CakeCard key={cake.id} cake={cake} />
        ))}
      </div>
    </div>
  );
}