'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Cake } from '@/lib/types';
import { useI18n } from '@/context/LanguageContext';

interface CakeCardProps {
  cake: Cake;
}

export function CakeCard({ cake }: CakeCardProps) {
  const { language } = useI18n();
  const isUnitBased = cake.id === 'cupcakes-artesanales';
  
  // Obtenemos el nombre según el idioma con un respaldo por seguridad
  const cakeName = cake.name[language] || cake.name['es'];

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full border-none bg-white/50 backdrop-blur-sm">
      <CardHeader className="p-0">
        <Link href={`/cakes/${cake.id}`} className="block relative w-full aspect-[4/3] overflow-hidden">
          <Image
            src={cake.image.url}
            alt={cakeName}
            fill // Usamos fill para que ocupe todo el contenedor aspect-ratio
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 hover:scale-110"
            priority={false}
          />
        </Link>
      </CardHeader>
      
      <CardContent className="flex-grow p-6 flex flex-col justify-between">
        <div>
          <CardTitle className="font-headline text-2xl mb-2 text-primary">
            <Link href={`/cakes/${cake.id}`} className="hover:opacity-80 transition-opacity">
              {cakeName}
            </Link>
          </CardTitle>
          <p className="text-muted-foreground text-lg font-medium">
            {language === 'es' ? 'Desde' : 'Des de'} {cake.price.toFixed(2)}€
            {isUnitBased ? ' / ud' : ''}
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full rounded-full bg-primary hover:bg-primary/90 text-white font-bold tracking-wide">
          <Link href={`/cakes/${cake.id}`}>
            {language === 'es' ? 'VER DETALLES' : 'VEURE DETALLS'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}