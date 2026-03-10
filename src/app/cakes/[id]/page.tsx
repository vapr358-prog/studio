'use client';

import Image from 'next/image';
import { cakes } from '@/lib/data';
import { notFound, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Camera, Sparkles, ShoppingCart, Heart } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function CakeDetailPage() {
  const { language, t } = useI18n();
  const { addToCart } = useCart();
  const params = useParams();
  const id = params?.id as string;
  
  const cake = cakes.find((c) => c.id === id);

  if (!cake) {
    notFound();
  }

  const isGalleryOnly = cake.id === 'tarta-cumpleanos-especial';
  const isUnitBased = cake.id === 'cupcakes-artesanales';

  const getLabel = (obj: any) => {
    return obj[language] || obj['es'] || '';
  };

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
                  <div className="relative rounded-[3rem] overflow-hidden shadow-2xl aspect-square bg-muted">
                    <Image
                      src={img.url}
                      alt={`Celebración - ${idx + 1}`}
                      fill
                      className="object-cover"
                      priority={idx < 2}
                    />
                    <div className="absolute top-6 right-6 bg-white/30 backdrop-blur-md p-4 rounded-full pointer-events-none">
                      <Camera className="text-white h-7 w-7" />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-4 top-1/2 h-12 w-12 bg-white text-primary shadow-xl hover:bg-primary hover:text-white transition-colors border-none" />
            <CarouselNext className="absolute -right-4 top-1/2 h-12 w-12 bg-white text-primary shadow-xl hover:bg-primary hover:text-white transition-colors border-none" />
          </Carousel>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-6xl">
      <div className="mb-8">
        <Button variant="secondary" asChild className="shadow-md border border-white/30 px-6 bg-white/95 hover:bg-white text-primary font-bold rounded-full">
          <Link href="/cakes" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> {language === 'es' ? 'Volver al catálogo' : 'Tornar al catàleg'}
          </Link>
        </Button>
      </div>

      <div className="bg-white/80 backdrop-blur-lg rounded-[4rem] shadow-2xl overflow-hidden border border-white/40 p-8 md:p-16">
        <div className="grid gap-12 lg:gap-24 items-center md:grid-cols-2">
          
          <div className="rounded-[3rem] overflow-hidden shadow-2xl aspect-square relative bg-pink-50/50 group">
            <Image
              src={cake.image.url}
              alt={getLabel(cake.name)}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
              priority
            />
            <div className="absolute bottom-6 right-6">
               <div className="bg-white/80 backdrop-blur-md p-3 rounded-full text-primary shadow-lg">
                  <Heart className="h-6 w-6 fill-primary" />
               </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-none px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                Creación Artesanal
              </Badge>
              <h1 className="font-headline text-5xl md:text-7xl text-primary uppercase leading-[0.9] tracking-tighter">
                {getLabel(cake.name)}
              </h1>
              <div className="flex items-baseline gap-2 pt-2">
                <span className="text-muted-foreground font-body text-xl italic">Desde</span>
                <span className="text-5xl font-black text-primary/90">
                  {cake.price.toFixed(2)}€
                </span>
                {isUnitBased && <span className="text-xl font-normal text-muted-foreground">/ und</span>}
              </div>
            </div>

            <Separator className="bg-primary/10" />
            
            <p className="text-xl text-muted-foreground leading-relaxed italic font-body">
              {getLabel(cake.description)}
            </p>
            
            {cake.flavorProfile && (
              <div className="space-y-5">
                <h2 className="text-xs font-black text-primary/40 uppercase tracking-[0.4em] flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Perfil de Sabor
                </h2>
                <div className="flex flex-wrap gap-2">
                  {cake.flavorProfile.map((flavor) => (
                    <Badge key={flavor} variant="outline" className="text-[10px] px-6 py-2 rounded-full border-primary/20 text-primary font-bold uppercase tracking-widest bg-white/50">
                      {flavor}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="pt-8">
              <Button 
                size="lg" 
                onClick={() => addToCart(cake)}
                className="w-full sm:w-auto text-xl py-10 px-16 rounded-full shadow-2xl bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
              >
                <ShoppingCart className="mr-4 h-7 w-7" />
                {language === 'es' ? 'Añadir al carrito' : 'Afegir al carret'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
