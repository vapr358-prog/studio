'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Truck, MapPin, Loader2, CheckCircle, ShoppingBag, AlertTriangle } from 'lucide-react';
import { processOrder } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

export default function CheckoutPage() {
  const { t, language } = useI18n();
  const { cart, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Si no hay éxito y el carrito está vacío, volvemos a la tienda
    if (cart.length === 0 && !success) {
      router.push('/cakes');
    }
  }, [cart, success, router]);

  const handleFinishOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await processOrder(cart);
      
      if (result.success) {
        setSuccess(true);
        clearCart();
        // Redirigir al inicio tras 5 segundos
        setTimeout(() => {
          router.push('/');
        }, 5000);
      } else {
        toast({
          variant: "destructive",
          title: "Error en el pedido",
          description: result.message || "No hemos podido procesar tu solicitud.",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error de conexión",
        description: "Ha ocurrido un problema al conectar con el servidor.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center">
        <div className="bg-green-100 text-green-600 p-6 rounded-full mb-8 animate-in zoom-in duration-500">
          <CheckCircle size={80} />
        </div>
        <h1 className="font-headline text-5xl text-primary mb-4">¡Gracias por tu pedido!</h1>
        <p className="text-xl text-muted-foreground max-w-lg mb-8">
          Hemos recibido tu solicitud artesanal. En breve recibirás un correo de confirmación y podrás hacer el seguimiento de tu envío.
        </p>
        <Button asChild className="rounded-full px-10 py-6" variant="outline">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    );
  }

  // Prevención de renderizado si el carrito se vacía durante la transición
  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primary h-12 w-12" />
        <p className="mt-4 text-muted-foreground italic">Redirigiendo a la tienda...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl text-primary uppercase">{t('checkout_title')}</h1>
        <p className="text-lg text-muted-foreground mt-4">{t('checkout_sub')}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
        {/* Formulario de Envío */}
        <div className="lg:col-span-2 space-y-8">
          <form id="checkout-form" onSubmit={handleFinishOrder}>
            <Card className="shadow-lg border-none bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="text-primary" />
                  {t('checkout_address')}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('form_name')}</Label>
                    <Input id="name" defaultValue={user?.name || ''} required placeholder="Tu nombre" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('form_email')}</Label>
                    <Input id="email" type="email" defaultValue={user?.username || ''} required placeholder="tu@email.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">{t('checkout_address')}</Label>
                  <Input id="address" placeholder="Carrer de..." required />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">{t('checkout_city')}</Label>
                    <Input id="city" defaultValue="Reus" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">{t('checkout_zip')}</Label>
                    <Input id="zip" placeholder="43201" required />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-none bg-white/80 backdrop-blur-sm mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="text-primary" />
                  {t('checkout_payment')}
                </CardTitle>
                <CardDescription>Esta es una simulación de pago seguro para Sweet Queen.</CardDescription>
              </CardHeader>
              <CardContent>
                 <div className="bg-muted/30 p-4 rounded-xl border-dashed border-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <CreditCard className="text-muted-foreground" />
                        <span className="font-medium">Tarjeta de Crédito / Débito</span>
                    </div>
                    <span className="text-xs text-primary font-bold">MÉTODO ACTIVO</span>
                 </div>
              </CardContent>
            </Card>
          </form>
        </div>

        {/* Resumen del Pedido */}
        <div className="space-y-8">
          <Card className="shadow-xl border-none bg-primary text-primary-foreground overflow-hidden">
            <CardHeader className="bg-white/10">
              <CardTitle className="text-2xl flex items-center gap-2">
                <ShoppingBag />
                Resumen del Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="opacity-90">{item.quantity}x {item.name[language]}</span>
                  <span className="font-bold">{(item.price * item.quantity).toFixed(2)}€</span>
                </div>
              ))}
              <Separator className="bg-white/20" />
              <div className="flex justify-between items-center text-2xl font-bold pt-2">
                <span>Total</span>
                <span>{totalPrice.toFixed(2)}€</span>
              </div>
            </CardContent>
            <CardFooter className="pb-8">
              <Button 
                form="checkout-form"
                type="submit"
                className="w-full py-8 rounded-full bg-white text-primary hover:bg-white/90 text-xl font-bold shadow-2xl transition-all active:scale-95"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Truck className="mr-2" />
                    {t('checkout_confirm')}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
            <AlertTriangle size={14} className="text-amber-500" />
            <span>Pago seguro garantizado por Sweet Queen</span>
          </div>
        </div>
      </div>
    </div>
  );
}
