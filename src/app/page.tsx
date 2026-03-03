'use client';
import { Button } from '@/components/ui/button';
import { CakeCard } from '@/components/CakeCard';
import { cakes } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Mail, Image as ImageIcon, Camera } from 'lucide-react';
import { useI18n } from '@/context/LanguageContext';

export default function HomePage() {
  const { t } = useI18n();
  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero-bg');
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
          <h1 className="font-headline text-5xl md:text-7xl text-primary drop-shadow-sm tracking-widest uppercase leading-tight">
            {t('hero_title')}
          </h1>
          <p className="mt-4 text-lg md:text-xl font-body text-primary/80 font-medium max-w-2xl mx-auto italic">
            {t('hero_subtitle')}
          </p>
          <Button asChild size="lg" className="mt-10 px-10 py-7 text-xl rounded-full shadow-lg hover:scale-105 transition-transform bg-primary hover:bg-primary/90">
            <Link href="/cakes">{t('hero_button')}</Link>
          </Button>
        </div>
      </section>

      {/* Featured Cakes Section */}
      <section className="py-20 md:py-32 bg-background border-b border-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-headline text-5xl md:text-6xl text-primary uppercase tracking-tight">{t('section_creations')}</h2>
            <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto italic">
              {t('section_creations_sub')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {featuredCakes.map((cake) => (
              <CakeCard key={cake.id} cake={cake} />
            ))}
          </div>
          <div className="text-center mt-16">
            <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white rounded-full px-10 py-7 text-lg">
              <Link href="/cakes">{t('section_all_catalog')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Gallery Section - CELEBRACIONES MÁGICAS */}
      <section className="py-24 bg-secondary/40 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-[0.3em] uppercase mb-4 block text-sm">{t('section_gallery_tag')}</span>
            <h2 className="font-headline text-6xl md:text-8xl text-primary leading-tight uppercase">{t('section_gallery_title')}</h2>
            <p className="text-xl text-muted-foreground mt-4 italic max-w-3xl mx-auto">
              {t('section_gallery_sub')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {birthdayGallery?.gallery?.slice(0, 6).map((img, idx) => (
              <div 
                key={idx} 
                className="relative rounded-2xl overflow-hidden shadow-xl group aspect-square bg-white border-4 border-white"
              >
                <Image 
                  src={img.url} 
                  alt={`Celebración ${idx + 1}`} 
                  fill 
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  data-ai-hint={img.hint}
                />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <div className="bg-white/20 backdrop-blur-md p-4 rounded-full">
                      <Camera className="text-white h-8 w-8" />
                   </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="rounded-full px-14 py-9 text-2xl shadow-xl hover:scale-105 transition-all bg-primary hover:bg-primary/90">
              <Link href="/cakes/tarta-cumpleanos-especial">
                <ImageIcon className="mr-3 h-7 w-7" />
                {t('section_gallery_button')}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Category Sections - Chocolate */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 text-right flex flex-col items-end gap-6">
            <h2 className="font-headline text-6xl md:text-8xl text-primary leading-tight uppercase">{t('section_chocolate_title')}</h2>
            <p className="text-xl text-muted-foreground leading-relaxed italic">
              {t('section_chocolate_sub')}
            </p>
            <Button asChild size="lg" className="rounded-full px-12 py-8 text-xl shadow-lg">
              <Link href="/cakes/tarta-de-chocolate">{t('section_chocolate_button')}</Link>
            </Button>
          </div>
          <div className="order-1 md:order-2 relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white">
            {chocolateCake && (
              <Image 
                src={chocolateCake.image.url} 
                alt="Chocolate" 
                fill 
                className="object-cover"
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
                alt="Especiales" 
                fill 
                className="object-cover"
              />
            )}
          </div>
          <div className="flex flex-col items-start gap-6">
            <h2 className="font-headline text-6xl md:text-8xl text-primary leading-tight uppercase">{t('section_special_title')}</h2>
            <p className="text-xl text-muted-foreground leading-relaxed italic">
              {t('section_special_sub')}
            </p>
            <Button asChild size="lg" className="rounded-full px-12 py-8 text-xl shadow-lg">
              <Link href="/cakes/tarta-personalizada">{t('section_special_button')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-headline text-5xl md:text-6xl text-white uppercase tracking-widest">{t('section_contact_title')}</h2>
            <p className="mt-4 text-xl opacity-90 max-w-2xl mx-auto font-body italic">
              {t('section_contact_sub')}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-5 bg-white/20 rounded-full">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold">{t('contact_location')}</h3>
              <p className="text-lg opacity-90">Carrer Alt de Sant Pere 17, Reus</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="p-5 bg-white/20 rounded-full">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold">{t('contact_whatsapp')}</h3>
              <p className="text-lg opacity-90">(+34) 664 477 944</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="p-5 bg-white/20 rounded-full">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold">{t('contact_email')}</h3>
              <p className="text-lg opacity-90 text-sm">prietoerazovalentina8@gmail.com</p>
            </div>
          </div>
          <div className="text-center mt-16">
            <Button asChild size="lg" variant="secondary" className="rounded-full px-14 py-9 text-2xl shadow-xl hover:scale-105 transition-transform">
              <Link href="/contact">{t('contact_button')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
