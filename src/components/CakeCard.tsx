'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Cake } from '@/lib/types';
import { useI18n } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Eye, Sparkles, Heart } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface CakeCardProps {
  cake: Cake;
}

export function CakeCard({ cake }: CakeCardProps) {
  const { language, t } = useI18n();
  const { addToCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const isUnitBased = cake.id === 'cupcakes-artesanales';
  const cakeName = cake.name[language] || cake.name['es'];
  const cakeDescription = cake.description[language] || cake.description['es'];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(cake);
  };

  return (
    <>
      <Card 
        className="flex flex-col overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full border-none bg-white/60 backdrop-blur-sm group rounded-[2.5rem] cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <CardHeader className="p-0 relative overflow-hidden">
          <div className="block relative w-full aspect-[4/3] overflow-hidden">
            <Image
              src={cake.image.url}
              alt={cakeName}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              priority={false}
            />
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
               <div className="bg-white/90 p-4 rounded-full shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <Eye className="text-primary h-6 w-6" />
               </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-grow p-8 flex flex-col justify-between">
          <div>
            <CardTitle className="font-headline text-3xl mb-3 text-primary leading-tight hover:opacity-70 transition-opacity">
              {cakeName}
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
            onClick={handleAddToCart}
            className="w-full py-7 rounded-full bg-primary hover:bg-primary/90 text-white font-bold tracking-widest text-base shadow-lg shadow-primary/20 active:scale-95 transition-all"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {language === 'es' ? 'AÑADIR AL CARRITO' : 'AFEGIR AL CARRET'}
          </Button>
          <p className="text-[10px] text-center font-bold uppercase tracking-widest text-muted-foreground/60 group-hover:text-primary transition-colors">
            {language === 'es' ? 'Toca para ver detalles' : 'Toca per veure detalls'}
          </p>
        </CardFooter>
      </Card>

      {/* MODAL DE DETALLES */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden border-none rounded-[3rem] bg-white/95 backdrop-blur-xl sm:rounded-[3rem]">
          <div className="grid md:grid-cols-2 gap-0 h-full max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Imagen del Modal */}
            <div className="relative h-64 md:h-full min-h-[300px] bg-pink-50">
              <Image
                src={cake.image.url}
                alt={cakeName}
                fill
                className="object-cover"
              />
              <div className="absolute top-6 left-6">
                 <Badge className="bg-white/80 backdrop-blur-md text-primary border-none px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                   Artesanía Pura
                 </Badge>
              </div>
            </div>

            {/* Contenido del Modal */}
            <div className="p-8 md:p-12 flex flex-col gap-6">
              <DialogHeader className="text-left">
                <DialogTitle className="font-headline text-4xl md:text-5xl text-primary leading-tight uppercase tracking-tighter">
                  {cakeName}
                </DialogTitle>
                <DialogDescription className="text-lg italic text-muted-foreground mt-2">
                  {cakeDescription}
                </DialogDescription>
              </DialogHeader>

              <Separator className="bg-primary/10" />

              <div className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-muted-foreground font-body text-lg italic">Desde</span>
                  <span className="text-4xl font-black text-primary/90">
                    {cake.price.toFixed(2)}€
                  </span>
                  {isUnitBased && <span className="text-lg font-normal text-muted-foreground">/ unidad</span>}
                </div>

                {cake.flavorProfile && (
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-primary/40 uppercase tracking-[0.3em] flex items-center gap-2">
                      <Sparkles className="h-3 w-3" />
                      Notas de Sabor
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {cake.flavorProfile.map((flavor) => (
                        <Badge key={flavor} variant="outline" className="text-[9px] px-4 py-1.5 rounded-full border-primary/20 text-primary font-bold uppercase bg-white/50">
                          {flavor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-auto pt-6 flex flex-col gap-4">
                <Button 
                  size="lg" 
                  onClick={() => {
                    addToCart(cake);
                    setIsModalOpen(false);
                  }}
                  className="w-full text-lg py-8 rounded-full shadow-xl bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
                >
                  <ShoppingCart className="mr-3 h-6 w-6" />
                  {language === 'es' ? 'Añadir a mi cesta' : 'Afegir a la meva cesta'}
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                >
                  {language === 'es' ? 'Seguir explorando' : 'Seguir explorant'}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
