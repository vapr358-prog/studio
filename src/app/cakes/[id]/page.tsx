'use client';

import Image from 'next/image';
import { cakes } from '@/lib/data';
import { notFound, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Camera, Heart, Sparkles, ChefHat } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/context/LanguageContext';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function CakeDetailPage() {
  const { language, t } = useI18n();
  const params = useParams();
  const id = params?.id as string;
  
  // Buscamos el pastel por ID
  const cake = cakes.find((c) => c.id === id);

  if (!cake) {
    notFound();
  }

  // Verificamos si es la galería o cupcakes
  const isGalleryOnly = cake.id === 'tarta-cumpleanos-especial';
  const isUnitBased = cake.id === 'cupcakes-artesanales';

  // Helper para obtener el texto según el idioma actual (ca o es)
  const getLabel = (obj: any) => {
    return obj[language] || obj['es'] || '';
  };

  // --- VISTA DE GALERÍA (CELEBRACIONES MÁGICAS) ---
  if (isGalleryOnly) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-7xl">
        <div className="mb-16 flex flex-col items-center text-center gap-6">
          <Button variant="secondary" asChild className="shadow-md border border-white/30 px-6 bg-white/95 hover:bg-white text-primary font-bold mb-4">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> {t('back_to_start')}
            </Link>
          </Button>
          <h1 className="font-headline text-5xl md:text-8xl text-primary uppercase tracking-tighter">
            {getLabel(cake.name)}
          </h1>
          <p className="text-2xl text-muted-foreground italic max-w-4xl font-body">
            {getLabel(cake.description)}
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto mb-24 px-12">
          <Carousel opts={{ align: "center", loop: true }} className="w-full">
            <CarouselContent>
              {cake.gallery?.map((img, idx) => (
                <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/1">
                  <div className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-square bg-muted">
                    <Image
                      src={img.url}
                      alt={`Celebración - ${idx + 1}`}
                      fill
                      className="object-cover"
                      priority={idx < 2}
                    />
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-3 rounded-full pointer-events-none">
                      <Camera className="text-white h-6 w-6" />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-4 top-1/2 h-12 w-12 bg-white text-primary shadow-xl" />
            <CarouselNext className="absolute -right-4 top-1/2 h-12 w-12 bg-white text-primary shadow-xl" />
          </Carousel>
        </div>
      </div>
    );
  }

  // --- VISTA DE PRODUCTO NORMAL (CATÁLOGO) ---
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-6xl">
      <div className="mb-8">
        <Button variant="secondary" asChild className="shadow-md border border-white/30 px-6 bg-white/95 hover:bg-white text-primary font-bold">
          <Link href="/cakes" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> {language === 'es' ? 'Volver al catálogo' : 'Tornar al catàleg'}
          </Link>
        </Button>
      </div>

      <div className="bg-white/90 backdrop-blur-md rounded-[3.5rem] shadow-2xl overflow-hidden border border-white/20 p-8 md:p-12">
        <div className="grid gap-12 lg:gap-20 items-center md:grid-cols-2">
          
          {/* IMAGEN DEL PRODUCTO - Usamos cake.image.url según tu data.ts */}
          <div className="rounded-[2.5rem] overflow-hidden shadow-xl aspect-square relative bg-pink-50">
            <Image
              src={cake.image.url}
              alt={getLabel(cake.name)}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              priority
            />
          </div>
          
          <div className="flex flex-col gap-8">
            <div className="space-y-4">
              <h1 className="font-headline text-5xl md:text-7xl text-primary uppercase leading-tight tracking-tighter">
                {getLabel(cake.name)}
              </h1>
              <p className="text-4xl font-bold text-primary/90 flex items-baseline gap-1">
                Desde {cake.price.toFixed(2)}€
                {isUnitBased && <span className="text-lg font-normal text-muted-foreground ml-2">/ und</span>}
              </p>
            </div>

            <Separator className="bg-primary/10" />
            
            <p className="text-xl text-muted-foreground leading-relaxed italic font-body">
            {getLabel(cake.description)}
            </p>
            
            {cake.flavorProfile && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  {language === 'es' ? 'Perfil de Sabor' : 'Perfil de Sabor'}
                </h2>
                <div className="flex flex-wrap gap-3">
                  {cake.flavorProfile.map((flavor) => (
                    <Badge key={flavor} variant="secondary" className="text-sm px-5 py-2 rounded-full bg-primary/5 text-primary border-primary/10 font-bold uppercase">
                      {flavor}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="pt-6">
              <Button size="lg" className="w-full sm:w-auto text-xl py-8 px-14 rounded-full shadow-xl bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest">
                {language === 'es' ? 'Pedir este pastel' : 'Demanar aquest pastís'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}