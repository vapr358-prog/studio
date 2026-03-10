'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Cake } from '@/lib/types';
import { useI18n } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Eye } from 'lucide-react';

interface CakeCardProps {
  cake: Cake;
}

export function CakeCard({ cake }: CakeCardProps) {
  const { language } = useI18n();
  const { addToCart } = useCart();
  const isUnitBased = cake.id === 'cupcakes-artesanales';
  
  const cakeName = cake.name[language] || cake.name['es'];

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full border-none bg-white/60 backdrop-blur-sm group rounded-[2.5rem]">
      <CardHeader className="p-0 relative overflow-hidden">
        {/* Enlace envolvente en la imagen con efecto de zoom */}
        <Link href={`/cakes/${cake.id}`} className="block relative w-full aspect-[4/3] overflow-hidden">
          <Image
            src={cake.image.url}
            alt={cakeName}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            priority={false}
          />
          {/* Overlay sutil al pasar el ratón */}
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
             <div className="bg-white/90 p-4 rounded-full shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <Eye className="text-primary h-6 w-6" />
             </div>
          </div>
        </Link>
      </CardHeader>
      
      <CardContent className="flex-grow p-8 flex flex-col justify-between">
        <div>
          <CardTitle className="font-headline text-3xl mb-3 text-primary leading-tight">
            <Link href={`/cakes/${cake.id}`} className="hover:opacity-70 transition-opacity">
              {cakeName}
            </Link>
          </CardTitle>
          <div className="flex items-baseline gap-1">
            <span className="text-sm uppercase tracking-widest text-muted-foreground font-bold">Desde</span>
            <span className="text-2xl font-black text-primary/80">
              {cake.price.toFixed(2)}€
            </span>
            {isUnitBased && <span className="text-sm text-muted-foreground ml-1">/ ud</span>}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-8 pt-0 flex flex-col gap-3">
        <Button 
          onClick={() => addToCart(cake)}
          className="w-full py-7 rounded-full bg-primary hover:bg-primary/90 text-white font-bold tracking-widest text-base shadow-lg shadow-primary/20 active:scale-95 transition-all"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          {language === 'es' ? 'AÑADIR AL CARRITO' : 'AFEGIR AL CARRET'}
        </Button>
        <Button asChild variant="ghost" className="w-full rounded-full text-xs font-bold uppercase tracking-widest opacity-40 hover:opacity-100 hover:bg-primary/5 transition-all">
          <Link href={`/cakes/${cake.id}`}>
            {language === 'es' ? 'Ver detalles artesanales' : 'Veure detalls artesanals'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
