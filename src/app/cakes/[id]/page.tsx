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
  const id = params.id as string;
  const cake = cakes.find((c) => c.id === id);

  if (!cake) {
    notFound();
  }

  const isGalleryOnly = cake.id === 'tarta-cumpleanos-especial';
  const isUnitBased = cake.id === 'pack-mini-cakes';

  if (isGalleryOnly) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-7xl">
        {/* Header Section */}
        <div className="mb-16 flex flex-col items-center text-center gap-6">
          <Button variant="secondary" asChild className="shadow-md border border-white/30 px-6 bg-white/95 hover:bg-white text-primary font-bold mb-4">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> {t('back_to_start')}
            </Link>
          </Button>
          <h1 className="font-headline text-5xl md:text-8xl text-primary uppercase tracking-tighter leading-none">
            {typeof cake.name === 'string' ? cake.name : cake.name[language]}
          </h1>
          <p className="text-2xl text-muted-foreground italic max-w-4xl font-body">
            {t('section_gallery_sub')}
          </p>
          <div className="w-32 h-1 bg-primary/20 rounded-full mt-4" />
        </div>

        {/* Introduction Text */}
        <div className="max-w-4xl mx-auto mb-20 text-center space-y-8 bg-white/40 p-10 rounded-[3rem] border border-white/20 backdrop-blur-sm">
          <h2 className="font-headline text-4xl md:text-5xl text-primary">{t('gallery_intro_title')}</h2>
          <div className="space-y-6 text-xl text-muted-foreground leading-relaxed">
            <p>{t('gallery_intro_text')}</p>
            <p className="font-bold text-primary italic text-2xl">{t('gallery_mission')}</p>
          </div>
        </div>

        {/* Carousel Images */}
        <div className="relative max-w-5xl mx-auto mb-24 px-12">
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {cake.gallery?.map((img, idx) => (
                <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/1">
                  <div className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/5] md:aspect-square bg-muted">
                    <Image
                      src={img.url}
                      alt={`Celebración - ${idx + 1}`}
                      fill
                      className="object-cover transition-transform duration-1000"
                      priority={idx < 2}
                    />
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-3 rounded-full pointer-events-none">
                      <Camera className="text-white h-6 w-6" />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-white text-primary border-primary/20 hover:bg-primary hover:text-white transition-all shadow-xl" />
            <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-white text-primary border-primary/20 hover:bg-primary hover:text-white transition-all shadow-xl" />
          </Carousel>
          <p className="text-center text-muted-foreground mt-8 italic">
            {language === 'es' ? 'Desliza para ver más momentos mágicos' : 'Llisca per veure més moments màgics'}
          </p>
        </div>

        {/* Commitment Section */}
        <section className="mb-24 py-16 px-8 bg-primary/5 rounded-[3.5rem] border border-primary/10">
          <h2 className="font-headline text-4xl md:text-6xl text-primary text-center mb-16 uppercase tracking-tight">
            {t('commitment_title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-primary">
                <Sparkles size={32} />
              </div>
              <h3 className="text-2xl font-bold text-primary">{t('commitment_designs_title')}</h3>
              <p className="text-lg text-muted-foreground italic">{t('commitment_designs_text')}</p>
            </div>
            <div className="text-center space-y-4">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-primary">
                <Heart size={32} />
              </div>
              <h3 className="text-2xl font-bold text-primary">{t('commitment_flavor_title')}</h3>
              <p className="text-lg text-muted-foreground italic">{t('commitment_flavor_text')}</p>
            </div>
            <div className="text-center space-y-4">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-primary">
                <ChefHat size={32} />
              </div>
              <h3 className="text-2xl font-bold text-primary">{t('commitment_attention_title')}</h3>
              <p className="text-lg text-muted-foreground italic">{t('commitment_attention_text')}</p>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <div className="text-center space-y-10 max-w-4xl mx-auto">
          <p className="text-2xl italic text-muted-foreground leading-relaxed px-4">
            {t('gallery_footer_prompt')}
          </p>
          <div className="py-12 bg-secondary/30 rounded-[3rem] border border-primary/5 shadow-xl">
            <p className="text-3xl font-headline text-primary mb-8 leading-tight px-8">
              "{t('closing_phrase')}"
            </p>
            <Button size="lg" asChild className="rounded-full px-12 py-9 text-2xl shadow-xl hover:scale-105 transition-all bg-primary hover:bg-primary/90">
               <Link href="/contact">{t('gallery_magic_button')}</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="rounded-[2.5rem] overflow-hidden shadow-xl aspect-square relative bg-pink-50/50">
            <Image
              src={cake.image.url}
              alt={typeof cake.name === 'string' ? cake.name : cake.name[language]}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              priority
            />
          </div>
          
          <div className="flex flex-col gap-8">
            <div className="space-y-4">
              <h1 className="font-headline text-5xl md:text-7xl text-primary uppercase leading-tight tracking-tighter">
                {typeof cake.name === 'string' ? cake.name : cake.name[language]}
              </h1>
              <p className="text-4xl font-bold text-primary/90 flex items-baseline gap-1">
                Desde {cake.price.toFixed(2)}€
                {isUnitBased && <span className="text-lg font-normal text-muted-foreground">/ und</span>}
              </p>
            </div>

            <Separator className="bg-primary/10" />
            
            <p className="text-xl text-muted-foreground leading-relaxed italic font-body">
              {typeof cake.description === 'string' ? cake.description : cake.description[language]}
            </p>
            
            {cake.flavorProfile && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  {t('flavor_profile')}
                </h2>
                <div className="flex flex-wrap gap-3">
                  {cake.flavorProfile.map((flavor) => (
                    <Badge key={flavor} variant="secondary" className="text-sm px-5 py-2 rounded-full bg-primary/5 text-primary border-primary/10 font-bold uppercase tracking-wide">
                      {flavor}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="pt-6">
              <Button size="lg" className="w-full sm:w-auto text-xl py-8 px-14 rounded-full shadow-xl hover:scale-105 transition-all bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest">
                {t('order_this_cake')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
