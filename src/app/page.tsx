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

  const birthdayCake = cakes.find(c => c.id === 'tarta-cumpleanos-especial');
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
            />
          )}
        </div>
        <div className="relative z-10 p-6 bg-white/10 backdrop-blur-sm rounded-3xl inline-block mx-4 border border-white/20">
          <h1 className="font-handwriting text-8xl md:text-9xl text-primary drop-shadow-xl -rotate-2">
            Sweet Queen
          </h1>
          <p className="mt-6 text-2xl md:text-4xl font-body text-primary font-bold drop-shadow-md max-w-2xl mx-auto">
            Pastelería Artesanal que Enamora
          </p>
          <Button asChild size="lg" className="mt-10 px-12 py-8 text-xl rounded-full shadow-2xl hover:scale-105 transition-transform bg-primary hover:bg-primary/90">
            <Link href="/cakes">Ver productos</Link>
          </Button>
        </div>
      </section>

      {/* Featured Cakes Section */}
      <section className="py-20 md:py-32 bg-background border-b border-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-headline text-5xl md:text-6xl text-primary">Nuestras Creaciones</h2>
            <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
              Una selección de los pasteles más dulces para tus momentos especiales.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {featuredCakes.map((cake) => (
              <CakeCard key={cake.id} cake={cake} />
            ))}
          </div>
          <div className="text-center mt-16">
            <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white rounded-full px-10 py-7 text-lg">
              <Link href="/cakes">Ver Todo el Catálogo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Category Sections - Cumpleaños (NUEVO) */}
      <section className="relative min-h-screen flex items-center bg-secondary/50 py-20 overflow-hidden">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
            {birthdayCake && (
              <Image 
                src={birthdayCake.image.url} 
                alt="Tartas de Cumpleaños" 
                fill 
                className="object-cover"
                data-ai-hint="birthday cake celebration"
              />
            )}
          </div>
          <div className="flex flex-col items-start gap-6">
            <h2 className="font-headline text-6xl md:text-8xl text-primary leading-tight">Cumpleaños Mágicos</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Haz que su día sea único con nuestras tartas de cumpleaños. Diseños vibrantes, sabores irresistibles y toda la magia de Sweet Queen en cada porción. ¡Mira nuestra galería completa!
            </p>
            <Button asChild size="lg" className="rounded-full px-12 py-8 text-xl shadow-lg">
              <Link href="/cakes/tarta-cumpleanos-especial">Ver más y Galería</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Category Sections - Tartas de Chocolate */}
      <section className="relative min-h-screen flex items-center bg-background py-20 overflow-hidden">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 flex flex-col items-end text-right gap-6">
            <h2 className="font-headline text-6xl md:text-8xl text-primary leading-tight">Chocolate Intenso</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Un viaje al corazón del cacao. Nuestras tartas de chocolate son densas, cremosas y perfectas para los paladares más exigentes. El regalo ideal para los chocoadictos.
            </p>
            <Button asChild size="lg" className="rounded-full px-12 py-8 text-xl shadow-lg">
              <Link href="/cakes/tarta-de-chocolate">Explorar Chocolate</Link>
            </Button>
          </div>
          <div className="order-1 md:order-2 relative aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
            {chocolateCake && (
              <Image 
                src={chocolateCake.image.url} 
                alt="Tartas de Chocolate" 
                fill 
                className="object-cover"
                data-ai-hint="dark chocolate cake"
              />
            )}
          </div>
        </div>
      </section>

      {/* Category Sections - Tartas Especiales */}
      <section className="relative min-h-screen flex items-center bg-secondary/30 py-20 overflow-hidden">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
            {specialCake && (
              <Image 
                src={specialCake.image.url} 
                alt="Tartas Especiales" 
                fill 
                className="object-cover"
                data-ai-hint="luxury wedding cake"
              />
            )}
          </div>
          <div className="flex flex-col items-start gap-6">
            <h2 className="font-headline text-6xl md:text-8xl text-primary leading-tight">Tus Sueños en Tarta</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              ¿Tienes una idea loca? Nosotros la horneamos. Desde tartas de boda hasta diseños corporativos, cada pieza es una obra de arte personalizada.
            </p>
            <Button asChild size="lg" className="rounded-full px-12 py-8 text-xl shadow-lg">
              <Link href="/cakes/tarta-personalizada">Crear mi Tarta</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-headline text-5xl md:text-6xl text-white">Endulcemos tu Momento</h2>
            <p className="mt-4 text-xl opacity-90 max-w-2xl mx-auto font-body italic">
              Estamos en Reus deseando conocer tu idea.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-5 bg-white/20 rounded-full">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold">Ubicación</h3>
              <p className="text-lg opacity-90">Carrer Alt de Sant Pere 17, Reus</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="p-5 bg-white/20 rounded-full">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold">WhatsApp</h3>
              <p className="text-lg opacity-90">(+34) 664 477 944</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="p-5 bg-white/20 rounded-full">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold">Email</h3>
              <p className="text-lg opacity-90">prietoerazovalentina8@gmail.com</p>
            </div>
          </div>
          <div className="text-center mt-16">
            <Button asChild size="lg" variant="secondary" className="rounded-full px-14 py-9 text-2xl shadow-xl hover:scale-105 transition-transform">
              <Link href="/contact">Hablar con nosotros</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}