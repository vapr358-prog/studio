import Image from 'next/image';
import { cakes } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: { id: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const cake = cakes.find((c) => c.id === params.id);

  if (!cake) {
    return {
      title: 'Pastel no encontrado',
    }
  }
 
  return {
    title: cake.name,
    description: cake.description,
  }
}

export function generateStaticParams() {
  return cakes.map((cake) => ({
    id: cake.id,
  }));
}

export default function CakeDetailPage({ params }: Props) {
  const cake = cakes.find((c) => c.id === params.id);

  if (!cake) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
        <div className="rounded-lg overflow-hidden shadow-lg">
          <Image
            src={cake.image.url}
            alt={cake.name}
            width={600}
            height={600}
            className="w-full object-cover"
            data-ai-hint={cake.image.hint}
          />
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="font-headline text-4xl md:text-5xl">{cake.name}</h1>
          <p className="text-3xl font-semibold text-primary">${cake.price.toFixed(2)}</p>
          <Separator />
          <p className="text-lg text-muted-foreground">{cake.description}</p>
          <div>
            <h2 className="text-xl font-bold mb-2">Perfil de Sabor:</h2>
            <div className="flex flex-wrap gap-2">
              {cake.flavorProfile.map((flavor) => (
                <Badge key={flavor} variant="secondary" className="text-sm">
                  {flavor}
                </Badge>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <Button size="lg" className="w-full sm:w-auto">Añadir al Carrito (UI)</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
