
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cakes as allCakes } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const featuredCakes = allCakes.slice(0, 3);
const heroImage = PlaceHolderImages.find(p => p.id === 'hero-bg');

export default function Home() {
  return (
    <div>
      <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center text-center">
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
        <div className="absolute inset-0 bg-white/20" />
        <div className="relative z-10 p-8 bg-secondary rounded-xl shadow-lg">
          <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl text-foreground">
            Sweet Queen
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-foreground">
            El arte de la pastelería hecho con amor, para tus momentos más dulces.
          </p>
          <Button asChild className="mt-8" size="lg">
            <Link href="/cakes">Ver nuestros pasteles</Link>
          </Button>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-4xl md:text-5xl text-center mb-12">
            Nuestros Destacados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCakes.map((cake) => (
              <Card key={cake.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="p-0">
                  <div className="aspect-w-4 aspect-h-3">
                    <Image
                      src={cake.image.url}
                      alt={cake.name}
                      width={400}
                      height={300}
                      className="object-cover w-full h-full"
                      data-ai-hint={cake.image.hint}
                    />
                  </div>
                </CardHeader>
                <CardContent className="flex-grow p-6">
                  <CardTitle className="font-headline text-2xl mb-2">{cake.name}</CardTitle>
                  <p className="text-muted-foreground text-lg font-semibold">
                    ${cake.price.toFixed(2)}
                  </p>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button asChild className="w-full">
                    <Link href={`/cakes/${cake.id}`}>Ver detalles</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
