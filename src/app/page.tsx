'use client';
import { Button } from '@/components/ui/button';
import { CakeCard } from '@/components/CakeCard';
import { cakes } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Mail, Image as ImageIcon, Camera } from 'lucide-react';

export default function HomePage() {
  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero-bg');
  // Solo mostrar productos reales en el carrusel de inicio
  const featuredCakes = cakes.filter(c => c.id !== 'tarta-cumpleanos-especial').slice(0, 3);
  const birthdayGallery = cakes.find(c => c.id === 'tarta-cumpleanos-especial');
  const chocolateCake = cakes.find(c => c.id === 'tarta-de-chocolate');
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
        <div className="relative z-10 p-8 inline-block mx-4">
          <h1 className="font-display text-7xl md:text-9xl text-primary drop-shadow-2xl tracking-tight uppercase leading-none">
            Sweet Queen
          </h1>
          <p className="mt-8 text-xl md:text-3xl font-body text-primary font-bold drop-shadow-md max-w-2xl mx-auto italic">
            Pastelería Artesanal que Enamora
          </p>
          <Button asChild size="lg" className="mt-12 px-14 py-9 text-2xl rounded-full shadow-2xl hover:scale-105 transition-transform bg-primary hover:bg-primary/90">
            <Link href="/cakes">Ver productos</Link>
          </Button>
        </div>
      </section>

      {/* Featured Cakes Section */}
      <section className="py-20 md:py-32 bg-background border-b border-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-headline text-5xl md:text-6xl text-primary uppercase tracking-tight">Nuestras Creaciones</h2>
            <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto italic">
              Una selección de los pasteles más dulces para tus pedidos.
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

      {/* Gallery Section - CELEBRACIONES MÁGICAS (APARTADO VISUAL) */}
      <section className="py-24 bg-secondary/40 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-[0.3em] uppercase mb-4 block text-sm">Portafolio Fotográfico</span>
            <h2 className="font-headline text-6xl md:text-8xl text-primary leading-tight">CELEBRACIONES MÁGICAS</h2>
            <p className="text-xl text-muted-foreground mt-4 italic max-w-3xl mx-auto">
              No son solo pasteles, son recuerdos capturados en fotos. Inspírate con nuestra galería de momentos especiales.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {birthdayGallery?.gallery?.slice(0, 4).map((img, idx) => (
              <div key={idx} className={`relative rounded-3xl overflow-hidden shadow-2xl aspect-square group ${idx === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                <Image 
                  src={img.url} 
                  alt="Galería de celebración" 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  data-ai-hint={img.hint}
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <Camera className="text-white h-12 w-12" />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="rounded-full px-14 py-9 text-2xl shadow-xl hover:scale-105 transition-all">
              <Link href="/cakes/tarta-cumpleanos-especial">
                <ImageIcon className="mr-3 h-7 w-7" />
                Explorar Galería Completa
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Category Sections - Chocolate */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 text-right flex flex-col items-end gap-6">
            <h2 className="font-headline text-6xl md:text-8xl text-primary leading-tight">Puro Chocolate</h2>
            <p className="text-xl text-muted-foreground leading-relaxed italic">
              Intenso, cremoso y adictivo. Nuestras tartas de chocolate son el paraíso para los amantes del buen cacao.
            </p>
            <Button asChild size="lg" className="rounded-full px-12 py-8 text-xl shadow-lg">
              <Link href="/cakes/tarta-de-chocolate">Ver Opciones</Link>
            </Button>
          </div>
          <div className="order-1 md:order-2 relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white">
            {chocolateCake && (
              <Image 
                src={chocolateCake.image.url} 
                alt="Tartas de Chocolate" 
                fill 
                className="object-cover"
                data-ai-hint="luxury chocolate cake"
              />
            )}
          </div>
        </div>
      </section>

      {/* Category Sections - Tartas Especiales */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white">
            {specialCake && (
              <Image 
                src={specialCake.image.url} 
                alt="Tartas Especiales" 
                fill 
                className="object-cover"
                data-ai-hint="wedding cake gold"
              />
            )}
          </div>
          <div className="flex flex-col items-start gap-6">
            <h2 className="font-headline text-6xl md:text-8xl text-primary leading-tight">Tus Sueños en Tarta</h2>
            <p className="text-xl text-muted-foreground leading-relaxed italic">
              ¿Buscas algo único? Creamos diseños personalizados que cuentan tu historia. El límite es tu imaginación.
            </p>
            <Button asChild size="lg" className="rounded-full px-12 py-8 text-xl shadow-lg">
              <Link href="/cakes/tarta-personalizada">Crear mi Diseño</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-headline text-5xl md:text-6xl text-white uppercase tracking-widest">Endulcemos tu Momento</h2>
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
              <p className="text-lg opacity-90 text-sm">prietoerazovalentina8@gmail.com</p>
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
