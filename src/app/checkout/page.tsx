'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, Truck, MapPin, Loader2, CheckCircle, ShoppingBag, AlertTriangle, Wallet, Store, Info } from 'lucide-react';
import { processOrder } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function CheckoutPage() {
  const { t, language } = useI18n();
  const { cart, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'person' | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    if (cart.length === 0 && !success) {
      router.push('/cakes');
    }
  }, [cart, success, router]);

  const priceBreakdown = useMemo(() => {
    const ivaRate = 10; 
    const basePrice = totalPrice / (1 + ivaRate / 100);
    const ivaAmount = totalPrice - basePrice;
    return {
      base: basePrice.toFixed(2),
      iva: ivaAmount.toFixed(2),
      ivaRate: ivaRate,
      total: totalPrice.toFixed(2),
    };
  }, [totalPrice]);

  const handleFinishOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentMethod) {
      toast({
        variant: "destructive",
        title: "Método de pago requerido",
        description: "Por favor, selecciona cómo deseas pagar tu pedido.",
      });
      return;
    }

    setLoading(true);
    
    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const email = formData.get('email') as string;
      
      const userInfo = {
        username: user?.username || email || "Invitado",
        paymentMethod: paymentMethod,
        totalPrice: totalPrice
      };

      const result = await processOrder(cart, userInfo);
      
      if (result.success) {
        setSuccess(true);
        clearCart();
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
          Hemos recibido tu solicitud artesanal y se ha registrado correctamente en nuestro sistema. En breve nos pondremos en contacto contigo.
        </p>
        <Button asChild className="rounded-full px-10 py-6" variant="outline">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    );
  }

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

      <div className="grid lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
        <div className="lg:col-span-2 space-y-8">
          <form id="checkout-form" onSubmit={handleFinishOrder}>
            <Card className="shadow-lg border-none bg-white/80 backdrop-blur-sm overflow-hidden rounded-[2rem]">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <MapPin className="h-5 w-5" />
                  {t('checkout_address')}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 pt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs uppercase font-bold text-muted-foreground tracking-widest">{t('form_name')}</Label>
                    <Input id="name" name="name" defaultValue={user?.name || ''} required placeholder="Tu nombre" className="rounded-xl border-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs uppercase font-bold text-muted-foreground tracking-widest">{t('form_email')}</Label>
                    <Input id="email" name="email" type="email" defaultValue={user?.username || ''} required placeholder="tu@email.com" className="rounded-xl border-primary/20" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-xs uppercase font-bold text-muted-foreground tracking-widest">{t('checkout_address')}</Label>
                  <Input id="address" name="address" placeholder="Carrer de..." required className="rounded-xl border-primary/20" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-xs uppercase font-bold text-muted-foreground tracking-widest">{t('checkout_city')}</Label>
                    <Input id="city" name="city" defaultValue="Reus" required className="rounded-xl border-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip" className="text-xs uppercase font-bold text-muted-foreground tracking-widest">{t('checkout_zip')}</Label>
                    <Input id="zip" name="zip" placeholder="43201" required className="rounded-xl border-primary/20" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-none bg-white/80 backdrop-blur-sm mt-8 overflow-hidden rounded-[2rem]">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Wallet className="h-5 w-5" />
                  {t('checkout_payment')}
                </CardTitle>
                <CardDescription>Selecciona cómo deseas realizar el pago de tu pedido artesanal.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <RadioGroup 
                  onValueChange={(val) => setPaymentMethod(val as 'card' | 'person')}
                  className="grid md:grid-cols-2 gap-4"
                >
                  <Label
                    htmlFor="payment-card"
                    className={cn(
                      "relative flex flex-col gap-4 p-6 rounded-[1.5rem] border-2 cursor-pointer transition-all hover:bg-primary/5",
                      paymentMethod === 'card' ? "border-primary bg-primary/5 shadow-md" : "border-muted bg-white"
                    )}
                  >
                    <RadioGroupItem value="card" id="payment-card" className="sr-only" />
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-primary/10 rounded-xl text-primary">
                        <CreditCard className="h-6 w-6" />
                      </div>
                      {paymentMethod === 'card' && <CheckCircle className="text-primary h-5 w-5" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{t('checkout_payment_card')}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{t('checkout_payment_card_sub')}</p>
                    </div>
                  </Label>

                  <Label
                    htmlFor="payment-person"
                    className={cn(
                      "relative flex flex-col gap-4 p-6 rounded-[1.5rem] border-2 cursor-pointer transition-all hover:bg-primary/5",
                      paymentMethod === 'person' ? "border-primary bg-primary/5 shadow-md" : "border-muted bg-white"
                    )}
                  >
                    <RadioGroupItem value="person" id="payment-person" className="sr-only" />
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-primary/10 rounded-xl text-primary">
                        <Store className="h-6 w-6" />
                      </div>
                      {paymentMethod === 'person' && <CheckCircle className="text-primary h-5 w-5" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{t('checkout_payment_person')}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{t('checkout_payment_person_sub')}</p>
                    </div>
                  </Label>
                </RadioGroup>

                {paymentMethod === 'card' && (
                  <div className="mt-6 p-4 bg-blue-50 text-blue-700 rounded-xl flex items-start gap-3 border border-blue-100 animate-in fade-in slide-in-from-top-2">
                    <Info className="h-5 w-5 mt-0.5 shrink-0" />
                    <p className="text-sm">Serás redirigido a una plataforma de pago 100% segura para completar la transacción con tu tarjeta.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </form>
        </div>

        <div className="space-y-8">
          <Card className="shadow-2xl border-none bg-primary text-primary-foreground overflow-hidden rounded-[2.5rem]">
            <CardHeader className="bg-white/10 pb-6 pt-8 px-8">
              <CardTitle className="text-2xl flex items-center gap-3">
                <ShoppingBag className="h-6 w-6" />
                Resumen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6 px-8">
              <div className="space-y-4 max-h-[300px] overflow-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex flex-col">
                      <span className="font-medium">{item.name[language]}</span>
                      <span className="text-[10px] opacity-70 uppercase tracking-widest">{item.quantity} {item.quantity > 1 ? 'unidades' : 'unidad'}</span>
                    </div>
                    <span className="font-bold">{(item.price * item.quantity).toFixed(2)}€</span>
                  </div>
                ))}
              </div>
              
              <Separator className="bg-white/20" />
              
              <div className="space-y-2 text-sm opacity-90">
                <div className="flex justify-between">
                  <span>Base Imponible</span>
                  <span>{priceBreakdown.base}€</span>
                </div>
                <div className="flex justify-between">
                  <span>IVA ({priceBreakdown.ivaRate}%)</span>
                  <span>{priceBreakdown.iva}€</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-3xl font-bold pt-4 border-t border-white/10 mt-2">
                <span>Total</span>
                <span>{priceBreakdown.total}€</span>
              </div>
            </CardContent>
            <CardFooter className="pb-10 px-8">
              <Button 
                form="checkout-form"
                type="submit"
                className="w-full py-8 rounded-full bg-white text-primary hover:bg-white/90 text-xl font-bold shadow-xl transition-all active:scale-95 disabled:opacity-50"
                disabled={loading || !paymentMethod}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-6 w-6" />
                    Procesando...
                  </>
                ) : (
                  <>
                    {paymentMethod === 'card' ? (
                      <>
                        <CreditCard className="mr-2 h-6 w-6" />
                        {t('checkout_go_pay')}
                      </>
                    ) : (
                      <>
                        <Truck className="mr-2 h-6 w-6" />
                        {t('checkout_confirm')}
                      </>
                    )}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
