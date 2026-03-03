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
  const isUnitBased = cake.id === 'galletas-artesanales';
  
  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <Link href={`/cakes/${cake.id}`} className="block aspect-w-4 aspect-h-3">
          <Image
            src={cake.image.url}
            alt={cake.name[language]}
            width={400}
            height={300}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            data-ai-hint={cake.image.hint}
          />
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-6">
        <CardTitle className="font-headline text-2xl mb-2">
          <Link href={`/cakes/${cake.id}`} className="hover:text-primary transition-colors">
            {cake.name[language]}
          </Link>
        </CardTitle>
        <p className="text-muted-foreground text-lg font-semibold">
          Desde {cake.price.toFixed(2)}€{isUnitBased ? ' und' : ''}
        </p>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full">
          <Link href={`/cakes/${cake.id}`}>
            {language === 'es' ? 'Ver detalles' : 'Veure detalls'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
