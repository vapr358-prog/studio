'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { SHEETDB_API_URL } from '@/lib/config';
import { cakes } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingBag, 
  ArrowLeft, 
  RefreshCw, 
  Calendar, 
  CreditCard, 
  Store, 
  ChevronRight, 
  Loader2,
  AlertTriangle,
  History
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';

type OrderItem = {
  name: string;
  quantity: number;
  id?: string;
};

type OrderData = {
  id: string;
  fecha: string;
  usuario: string;
  estado: string;
  detalles: string;
  metodo_pago?: string;
  total?: string;
};

export default function MisPedidosPage() {
  const { t, language } = useI18n();
  const { addToCart } = useCart();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [pedidos, setPedidos] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    fetchPedidos(parsedUser.username);
  }, [router]);

  async function fetchPedidos(username: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${SHEETDB_API_URL}/search?usuario=${encodeURIComponent(username)}&sheet=solicitudes`, {
        cache: 'no-store'
      });
      
      if (!res.ok) throw new Error("Error conectando con la base de datos");
      
      const data = await res.json();
      setPedidos(Array.isArray(data) ? [...data].reverse() : []);
    } catch (err: any) {
      setError("No hemos podido cargar tu historial dulce.");
    } finally {
      setLoading(false);
    }
  }

  const getStatusConfig = (status: string) => {
    const s = (status || '').toLowerCase().trim();
    if (['pendiente', 'pendente'].includes(s)) return { label: t('status_pending'), color: "bg-pink-100 text-pink-500" };
    if (['en proceso', 'preparacion'].includes(s)) return { label: t('orders_status_prep'), color: "bg-amber-100 text-amber-600" };
    if (['listo', 'enviado'].includes(s)) return { label: t('orders_status_ready'), color: "bg-blue-100 text-blue-600" };
    if (['entregado', 'finalizado', 'aceptada', 'acceptada'].includes(s)) return { label: t('track_delivered'), color: "bg-green-100 text-green-600" };
    return { label: status, color: "bg-gray-100 text-gray-500" };
  };

  const parseItems = (detalles: string): OrderItem[] => {
    if (!detalles) return [];
    
    const parts = detalles.split('|');
    let name = "Pedido Especial";
    let qty = 1;

    parts.forEach(p => {
      if (p.includes('Producto:')) name = p.replace('Producto:', '').trim();
      if (p.includes('Cantidad:')) qty = parseInt(p.replace('Cantidad:', '').trim()) || 1;
    });

    return [{ name, quantity: qty }];
  };

  const handleRepeatOrder = (order: OrderData) => {
    const items = parseItems(order.detalles);
    items.forEach(item => {
      const cake = cakes.find(c => 
        c.name.es.toLowerCase() === item.name.toLowerCase() || 
        c.id.toLowerCase().includes(item.name.toLowerCase())
      );
      
      if (cake) {
        addToCart(cake);
      }
    });
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground italic">Buscando tus momentos más dulces...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-2">
          <Button variant="ghost" asChild className="p-0 h-auto text-muted-foreground hover:text-primary mb-2">
            <Link href="/account" className="flex items-center gap-2">
              <ArrowLeft size={16} /> {t('back_to_profile')}
            </Link>
          </Button>
          <h1 className="font-headline text-5xl text-primary flex items-center gap-4">
            <History className="h-10 w-10" />
            {t('orders_title')}
          </h1>
          <p className="text-lg text-muted-foreground italic">{t('orders_sub')}</p>
        </div>
        <Button onClick={() => fetchPedidos(user?.username)} variant="outline" className="rounded-full px-6">
          <RefreshCw className="mr-2 h-4 w-4" /> {t('booking_refresh')}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-8 rounded-2xl">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {pedidos.length === 0 ? (
        <Card className="border-dashed border-2 py-20 text-center rounded-[3rem] bg-white/50">
          <CardContent className="space-y-6">
            <div className="bg-primary/5 p-8 rounded-full w-24 h-24 flex items-center justify-center mx-auto">
              <ShoppingBag className="h-12 w-12 text-primary/40" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-700">{t('orders_empty')}</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">{t('orders_empty_sub')}</p>
            </div>
            <Button asChild className="rounded-full px-10 py-6 text-lg font-bold">
              <Link href="/cakes">{t('orders_btn_catalog')}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-8">
          {pedidos.map((pedido) => {
            const status = getStatusConfig(pedido.estado);
            const items = parseItems(pedido.detalles);
            
            return (
              <Card key={pedido.id} className="overflow-hidden border-none shadow-xl bg-white/80 backdrop-blur-sm rounded-[2.5rem] transition-all hover:translate-x-1">
                <CardHeader className="bg-primary/5 px-8 py-6 flex flex-row flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-lg font-bold text-primary">{pedido.id}</span>
                      <Badge className={cn("px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", status.color)}>
                        {status.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar size={14} />
                      {pedido.fecha}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">{t('orders_payment')}</p>
                    <div className="flex items-center justify-end gap-2 text-primary font-medium">
                      {pedido.metodo_pago === 'card' ? <CreditCard size={16} /> : <Store size={16} />}
                      {pedido.metodo_pago === 'card' ? t('checkout_payment_card') : t('checkout_payment_person')}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="px-8 py-8">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                      {items.map((item, idx) => {
                        const cake = cakes.find(c => c.name.es === item.name || c.id === item.name);
                        return (
                          <div key={idx} className="flex items-center gap-6">
                            <div className="relative h-20 w-20 rounded-[1.5rem] overflow-hidden bg-pink-50 flex-shrink-0 shadow-sm">
                              <Image 
                                src={cake?.image.url || '/pasteles.jpg'} 
                                alt={item.name} 
                                fill 
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-bold text-lg text-gray-800 leading-tight">{item.name}</h4>
                              <p className="text-sm text-muted-foreground">{item.quantity} {item.quantity > 1 ? 'unidades' : 'unidad'}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="bg-primary/5 p-6 rounded-[2rem] flex flex-col items-center justify-center text-center space-y-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground uppercase font-bold tracking-widest">Total Pedido</p>
                        <p className="text-4xl font-black text-primary">{pedido.total || '30.00'}€</p>
                      </div>
                      <Button 
                        onClick={() => handleRepeatOrder(pedido)}
                        className="w-full rounded-full py-6 bg-primary text-white font-bold shadow-lg hover:shadow-primary/20"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        {t('orders_btn_repeat')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="px-8 py-4 border-t border-primary/5 flex justify-end">
                   <Link href={`/tracking?code=${pedido.id}`} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                      Ver seguimiento detallado <ChevronRight size={14} />
                   </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
