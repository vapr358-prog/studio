'use client';
import { Button } from '@/components/ui/button';
import { CakeCard } from '@/components/CakeCard';
import { cakes } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function HomePage() {
  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero-bg');
  const featuredCakes = cakes.slice(0, 3);

  const chocolateCake = cakes.find(c => c.id === 'tarta-de-chocolate');
  const carrotCake = cakes.find(c => c.id === 'carrot-cake');
  const specialCake = cakes.find(c => c.id === 'tarta-personalizada');

  return (
    <div className="flex flex-col gap-0">
      {/* Hero Section */}
      <section className="relative h-[90vh] w-full flex items-center justify-center text-center overflow-hidden">
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
        </div>
        <div className="relative z-10 p-6 bg-background/20 backdrop-blur-sm rounded-3xl inline-block mx-4">
          <h1 className="font-handwriting text-7xl md:text-9xl text-primary drop-shadow-2xl -rotate-2">
            Sweet Queen
          </h1>
          <p className="mt-6 text-2xl md:text-4xl font-body text-primary font-bold drop-shadow-md max-w-2xl mx-auto">
            Pastelería Artesanal que Enamora
          </p>
          <Button asChild size="lg" className="mt-10 px-10 py-8 text-xl rounded-full shadow-xl hover:scale-105 transition-transform">
            <Link href="/cakes">Ver productos</Link>
          </Button>
        </div>
      </section>

      {/* Featured Cakes Section */}
      <section className="py-20 md:py-32 bg-background border-b border-primary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-headline text-5xl md:text-6xl text-primary">Nuestras Creaciones Destacadas</h2>
            <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
              Una selección de los pasteles más queridos por nuestros clientes.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {featuredCakes.map((cake) => (
              <CakeCard key={cake.id} cake={cake} />
            ))}
          </div>
          <div className="text-center mt-16">
            <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white rounded-full px-8 py-6">
              <Link href="/cakes">Ver Todo el Catálogo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Category Sections - Tartas de Chocolate */}
      <section className="relative min-h-screen flex items-center bg-card py-20 overflow-hidden">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
            {chocolateCake && (
              <Image 
                src={chocolateCake.image.url} 
                alt="Tartas de Chocolate" 
                fill 
                className="object-cover"
                data-ai-hint="chocolate cake"
              />
            )}
          </div>
          <div className="flex flex-col items-start gap-6">
            <h2 className="font-headline text-6xl md:text-8xl text-primary leading-tight">Tartas de Chocolate</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Descubre nuestra selección premium de tartas de chocolate. Desde el cacao más intenso hasta las combinaciones más dulces y cremosas. Un paraíso para los amantes del chocolate.
            </p>
            <Button asChild size="lg" className="rounded-full px-10 py-7 text-lg">
              <Link href="/cakes/tarta-de-chocolate">Ver más</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Category Sections - Tartas de Zanahoria */}
      <section className="relative min-h-screen flex items-center bg-background py-20 overflow-hidden">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 flex flex-col items-end text-right gap-6">
            <h2 className="font-headline text-6xl md:text-8xl text-primary leading-tight">Tartas de Zanahoria</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Nuestra Carrot Cake es famosa por su jugosidad y el equilibrio perfecto entre especias, nueces y nuestro suave frosting de queso crema. Una experiencia única y artesanal.
            </p>
            <Button asChild size="lg" className="rounded-full px-10 py-7 text-lg">
              <Link href="/cakes/carrot-cake">Ver más</Link>
            </Button>
          </div>
          <div className="order-1 md:order-2 relative aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
            {carrotCake && (
              <Image 
                src={carrotCake.image.url} 
                alt="Tartas de Zanahoria" 
                fill 
                className="object-cover"
                data-ai-hint="carrot cake"
              />
            )}
          </div>
        </div>
      </section>

      {/* Category Sections - Tartas Especiales */}
      <section className="relative min-h-screen flex items-center bg-secondary/30 py-20 overflow-hidden">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
            {specialCake && (
              <Image 
                src={specialCake.image.url} 
                alt="Tartas Especiales" 
                fill 
                className="object-cover"
                data-ai-hint="special custom cake"
              />
            )}
          </div>
          <div className="flex flex-col items-start gap-6">
            <h2 className="font-headline text-6xl md:text-8xl text-primary leading-tight">Tartas Especiales</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Hacemos realidad el pastel de tus sueños. Diseños personalizados para bodas, cumpleaños y cualquier evento que merezca una celebración inolvidable.
            </p>
            <Button asChild size="lg" className="rounded-full px-10 py-7 text-lg">
              <Link href="/cakes/tarta-personalizada">Ver más</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-headline text-5xl md:text-6xl">Contacto</h2>
            <p className="mt-4 text-xl opacity-80 max-w-2xl mx-auto font-body italic">
              Estamos deseando endulzar tu próximo gran momento.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-background/10 rounded-full">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold">Ubicación</h3>
              <p className="text-lg opacity-90">Carrer Alt de Sant Pere 17, Reus</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-background/10 rounded-full">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold">Teléfono</h3>
              <p className="text-lg opacity-90">(+34) 664 477 944</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-background/10 rounded-full">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold">Email</h3>
              <p className="text-lg opacity-90">prietoerazovalentina8@gmail.com</p>
            </div>
          </div>
          <div className="text-center mt-16">
            <Button asChild size="lg" variant="secondary" className="rounded-full px-12 py-8 text-xl">
              <Link href="/contact">Habla con nosotros</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}