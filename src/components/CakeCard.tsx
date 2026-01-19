import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Cake } from '@/lib/types';

interface CakeCardProps {
  cake: Cake;
}

export function CakeCard({ cake }: CakeCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <Link href={`/cakes/${cake.id}`} className="block aspect-w-4 aspect-h-3">
          <Image
            src={cake.image.url}
            alt={cake.name}
            width={400}
            height={300}
            className="object-cover object-top w-full h-full transition-transform duration-300 hover:scale-105"
            data-ai-hint={cake.image.hint}
          />
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-6">
        <CardTitle className="font-headline text-2xl mb-2">
          <Link href={`/cakes/${cake.id}`} className="hover:text-primary transition-colors">
            {cake.name}
          </Link>
        </CardTitle>
        <p className="text-muted-foreground text-lg font-semibold">
          ${cake.price.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full">
          <Link href={`/cakes/${cake.id}`}>Ver detalles</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
