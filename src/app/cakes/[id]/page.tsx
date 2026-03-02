import Image from 'next/image';
import { cakes } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { ArrowLeft, Camera } from 'lucide-react';
import Link from 'next/link';
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
      title: 'Contenido no encontrado',
    }
  }
 
  return {
    title: cake.id === 'tarta-cumpleanos-especial' ? 'Celebraciones Mágicas - Galería' : cake.name,
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

  const isGalleryOnly = cake.id === 'tarta-cumpleanos-especial';
  const isUnitBased = cake.id === 'galletas-artesanales';

  // Si es solo galería, mostramos una interfaz de portafolio
  if (isGalleryOnly) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="mb-12 flex flex-col items-center text-center gap-4">
          <Link href="/" className="text-primary flex items-center gap-2 hover:underline mb-4">
            <ArrowLeft className="h-4 w-4" /> Volver al inicio
          </Link>
          <h1 className="font-headline text-6xl md:text-8xl text-primary uppercase tracking-tighter">
            Celebraciones Mágicas
          </h1>
          <p className="text-2xl text-muted-foreground italic max-w-2xl">
            Un vistazo a la alegría de nuestros clientes. Momentos únicos capturados en cada detalle.
          </p>
          <div className="w-24 h-1 bg-primary/20 rounded-full mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cake.gallery?.map((img, idx) => (
            <div 
              key={idx} 
              className={cn(
                "relative rounded-[2rem] overflow-hidden shadow-2xl group aspect-[4/5]",
                idx % 4 === 0 && "sm:col-span-2 sm:row-span-2 aspect-square"
              )}
            >
              <Image
                src={img.url}
                alt={`Celebración - ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                data-ai-hint={img.hint}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                <Camera className="text-white h-8 w-8" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center bg-secondary/30 p-12 rounded-[3rem]">
          <h2 className="font-headline text-4xl mb-6">¿Quieres que tu próxima fiesta sea así de mágica?</h2>
          <Button size="lg" asChild className="rounded-full px-12 py-8 text-xl shadow-xl">
             <Link href="/contact">¡Hagámoslo realidad!</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Interfaz de producto comercial normal
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="grid gap-8 lg:gap-16 items-start mb-16 md:grid-cols-2">
        <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-[10px] border-white">
          <Image
            src={cake.image.url}
            alt={cake.name}
            width={600}
            height={600}
            className="w-full object-cover aspect-square"
            data-ai-hint={cake.image.hint}
          />
        </div>
        
        <div className="flex flex-col gap-6">
          <h1 className="font-headline text-5xl md:text-7xl text-primary uppercase leading-none">
            {cake.name}
          </h1>
          <p className="text-4xl font-semibold text-primary">
            Desde {cake.price.toFixed(2)}€{isUnitBased ? ' und' : ''}
          </p>
          <Separator className="bg-primary/20" />
          <p className="text-xl text-muted-foreground leading-relaxed">{cake.description}</p>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">Perfil de Sabor:</h2>
            <div className="flex flex-wrap gap-2">
              {cake.flavorProfile.map((flavor) => (
                <Badge key={flavor} variant="secondary" className="text-md px-4 py-1 rounded-full">
                  {flavor}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="mt-6">
            <Button size="lg" className="w-full sm:w-auto text-xl py-8 px-12 rounded-full shadow-lg">
              Encargar este Pastel
            </Button>
          </div>
        </div>
      </div>

      {cake.gallery && cake.gallery.length > 0 && (
        <section className="mt-16">
          <h2 className="font-headline text-4xl text-center mb-12 text-primary uppercase tracking-widest">Galería de Detalles</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cake.gallery.map((img, idx) => (
              <div key={idx} className="relative rounded-2xl overflow-hidden shadow-md aspect-square group">
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
        </section>
      )}
    </div>
  );
}
