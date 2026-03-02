
import Image from 'next/image';
import { cakes } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
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
    title: cake.id === 'tarta-cumpleanos-especial' ? 'Celebraciones Mágicas' : cake.name,
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

  const isCelebration = cake.id === 'tarta-cumpleanos-especial';
  const isUnitBased = cake.id === 'galletas-artesanales';

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className={cn("grid gap-8 lg:gap-16 items-start mb-16", !isCelebration ? "md:grid-cols-2" : "grid-cols-1")}>
        {!isCelebration && (
          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={cake.image.url}
              alt={cake.name}
              width={600}
              height={600}
              className="w-full object-cover aspect-square"
              data-ai-hint={cake.image.hint}
            />
          </div>
        )}
        
        <div className={cn("flex flex-col gap-6", isCelebration && "text-center items-center")}>
          <h1 className="font-headline text-5xl md:text-7xl text-primary uppercase">
            {cake.name}
          </h1>
          
          {/* Ocultar precio y descripción si es Celebración Mágica */}
          {!isCelebration ? (
            <>
              <p className="text-4xl font-semibold text-primary">
                Desde {cake.price.toFixed(2)}€{isUnitBased ? ' und' : ''}
              </p>
              <Separator className="bg-primary/20" />
              <p className="text-xl text-muted-foreground leading-relaxed">{cake.description}</p>
              <div>
                <h2 className="text-2xl font-bold mb-4">Perfil de Sabor:</h2>
                <div className="flex flex-wrap gap-2">
                  {cake.flavorProfile.map((flavor) => (
                    <Badge key={flavor} variant="secondary" className="text-md px-4 py-1">
                      {flavor}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <Button size="lg" className="w-full sm:w-auto text-xl py-8 px-12 rounded-full">
                  Solicitar Pedido
                </Button>
              </div>
            </>
          ) : (
            <p className="text-2xl text-muted-foreground italic max-w-3xl">
              Nuestra pasión es crear sonrisas. Echa un vistazo a nuestra galería de momentos inolvidables.
            </p>
          )}
        </div>
      </div>

      {/* Collage de imágenes (Galería) siempre visible y más espectacular si es celebración */}
      {cake.gallery && cake.gallery.length > 0 && (
        <section className="mt-16">
          {isCelebration && (
            <h2 className="font-headline text-4xl text-center mb-12 text-primary">Nuestra Galería de Alegría</h2>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cake.gallery.map((img, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "relative rounded-2xl overflow-hidden shadow-md group",
                  idx === 0 && "md:col-span-2 md:row-span-2 aspect-square",
                  idx !== 0 && "aspect-square"
                )}
              >
                <Image
                  src={img.url}
                  alt={`${cake.name} - detalle ${idx + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  data-ai-hint={img.hint}
                />
              </div>
            ))}
          </div>
          {isCelebration && (
            <div className="mt-16 text-center">
               <Button size="lg" className="text-xl py-8 px-12 rounded-full">
                  ¡Quiero mi Fiesta Mágica!
                </Button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
