import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CakeCard } from '@/components/CakeCard';
import { cakes } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function HomePage() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-bg');

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center text-center text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover object-center"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 p-4">
          <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl drop-shadow-lg">
            Donde los Sueños se Vuelven Pasteles
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
            Artesanía dulce que enamora. Descubre nuestras creaciones únicas hechas con amor y los mejores ingredientes.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/cakes">Explorar Catálogo</Link>
          </Button>
        </div>
      </section>

      {/* Featured Cakes Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-4xl md:text-5xl">Nuestras Creaciones Destacadas</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Una muestra de nuestros pasteles más queridos, esperando para endulzar tu próxima celebración.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {cakes.slice(0, 3).map((cake) => (
              <CakeCard key={cake.id} cake={cake} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="outline">
              <Link href="/cakes">Ver Todos los Pasteles</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
