'use client';
import { Button } from '@/components/ui/button';
import { CakeCard } from '@/components/CakeCard';
import { cakes } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero-bg');
  const featuredCakes = cakes.slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] w-full flex items-center justify-center text-center text-white">
        <div className="absolute inset-0">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 p-4">
          <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl drop-shadow-md">
            Sweet Queen
          </h1>
          <p className="mt-4 text-xl md:text-2xl font-body drop-shadow-md">
            Pastelería Artesanal que Enamora
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/cakes">Explora Nuestros Pasteles</Link>
          </Button>
        </div>
      </section>

      {/* Featured Cakes Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-4xl md:text-5xl">Nuestras Creaciones Destacadas</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Una selección de los pasteles más queridos por nuestros clientes.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCakes.map((cake) => (
              <CakeCard key={cake.id} cake={cake} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="outline">
              <Link href="/cakes">Ver Todo el Catálogo</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
