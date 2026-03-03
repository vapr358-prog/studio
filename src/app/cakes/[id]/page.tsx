'use client';

import Image from 'next/image';
import { cakes } from '@/lib/data';
import { notFound, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { ArrowLeft, Camera } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/context/LanguageContext';

export default function CakeDetailPage() {
  const { language, t } = useI18n();
  const params = useParams();
  const id = params.id as string;
  const cake = cakes.find((c) => c.id === id);

  if (!cake) {
    notFound();
  }

  const isGalleryOnly = cake.id === 'tarta-cumpleanos-especial';
  const isUnitBased = cake.id === 'cupcakes-artesanales';

  if (isGalleryOnly) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="mb-12 flex flex-col items-center text-center gap-4">
          <Link href="/" className="text-primary flex items-center gap-2 hover:underline mb-4">
            <ArrowLeft className="h-4 w-4" /> {t('back_to_start')}
          </Link>
          <h1 className="font-headline text-5xl md:text-7xl text-primary uppercase tracking-tighter">
            {cake.name[language]}
          </h1>
          <div className="w-24 h-1 bg-primary/20 rounded-full mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cake.gallery?.map((img, idx) => (
            <div 
              key={idx} 
              className="relative rounded-2xl overflow-hidden shadow-lg group aspect-square bg-white border-4 border-white"
            >
              <Image
                src={img.url}
                alt={`Celebración - ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                data-ai-hint={img.hint}
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
                  <Camera className="text-white h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center bg-secondary/30 p-12 rounded-[3rem] max-w-4xl mx-auto">
          <h2 className="font-headline text-4xl mb-6">
            {t('gallery_magic_sub')}
          </h2>
          <Button size="lg" asChild className="rounded-full px-12 py-8 text-xl shadow-xl bg-primary hover:bg-primary/90">
             <Link href="/contact">{t('gallery_magic_button')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="grid gap-8 lg:gap-16 items-start mb-16 md:grid-cols-2">
        <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-[10px] border-white bg-white">
          <Image
            src={cake.image.url}
            alt={cake.name[language]}
            width={600}
            height={600}
            className="w-full object-cover aspect-square"
            data-ai-hint={cake.image.hint}
          />
        </div>
        
        <div className="flex flex-col gap-6">
          <h1 className="font-headline text-5xl md:text-7xl text-primary uppercase leading-none">
            {cake.name[language]}
          </h1>
          <p className="text-4xl font-semibold text-primary">
            Desde {cake.price.toFixed(2)}€{isUnitBased ? ' und' : ''}
          </p>
          <Separator className="bg-primary/20" />
          <p className="text-xl text-muted-foreground leading-relaxed italic">
            {cake.description[language]}
          </p>
          
          <div>
            <h2 className="text-2xl font-bold mb-4 text-primary/80">{t('flavor_profile')}</h2>
            <div className="flex flex-wrap gap-2">
              {cake.flavorProfile.map((flavor) => (
                <Badge key={flavor} variant="secondary" className="text-md px-4 py-1 rounded-full bg-secondary text-primary border-primary/10">
                  {flavor}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="mt-6">
            <Button size="lg" className="w-full sm:w-auto text-xl py-8 px-12 rounded-full shadow-lg bg-primary hover:bg-primary/90">
              {t('order_this_cake')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
