
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrderHistory } from "@/components/account/OrderHistory"
import CakeRecommendationForm from "@/components/account/CakeRecommendationForm"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { allFlavors } from "@/lib/types"
import type { Order } from '@/lib/types';
import { orders as mockOrders } from '@/lib/data';
import { FileText, AlertTriangle, ShoppingBag, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useI18n } from '@/context/LanguageContext';
import { SHEETDB_API_URL } from '@/lib/config';

type AppUser = {
  username: string;
  name: string;
  company: string;
  role: string;
}

export default function AccountPage() {
  const { t } = useI18n();
  const [user, setUser] = useState<AppUser | null>(null);
  const [combinedOrders, setCombinedOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          setError("No se ha iniciado sesión. Por favor, accede a tu cuenta.");
          setLoading(false);
          return;
        }

        const parsedUser: AppUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // 1. Filtrar pedidos mock (estáticos)
        const filteredMock = mockOrders.filter((order) => order.clientName === parsedUser.name);

        // 2. Intentar cargar pedidos dinámicos desde SheetDB (solicitudes)
        try {
          const res = await fetch(`${SHEETDB_API_URL}/search?usuario=${encodeURIComponent(parsedUser.username)}&sheet=solicitudes`, {
            cache: 'no-store'
          });
          
          if (res.ok) {
            const dynamicData = await res.json();
            if (Array.isArray(dynamicData)) {
              const mappedDynamic: Order[] = dynamicData.map((item: any) => ({
                id: item.id,
                clientName: parsedUser.name,
                date: item.fecha,
                items: [{ name: item.detalles.split('|')[0].replace('Producto: ', '').trim() || 'Pedido Especial', quantity: 1 }],
                total: 30.00, // Precio base orientativo para el historial
                status: item.estado as any // El componente OrderHistory ya maneja colores por string
              }));
              
              // Combinamos y mostramos los más recientes primero
              setCombinedOrders([...mappedDynamic, ...filteredMock].sort((a, b) => b.id.localeCompare(a.id)));
            } else {
              setCombinedOrders(filteredMock);
            }
          } else {
            setCombinedOrders(filteredMock);
          }
        } catch (e) {
          console.warn("No se pudieron cargar los pedidos de SheetDB en el historial", e);
          setCombinedOrders(filteredMock);
        }

      } catch (e: any) {
        console.error("Failed to load account data", e);
        setError(e.message || "Ocurrió un error al cargar la información.");
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  const HistoryTabContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando tu historial dulce...</p>
        </div>
      );
    }
    if (error) {
      return (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }
    return <OrderHistory orders={combinedOrders} />;
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="mb-8 text-center md:text-left">
        <h1 className="font-headline text-4xl md:text-5xl">Mi Cuenta</h1>
        <p className="text-lg text-muted-foreground">
          {user ? `Bienvenida de nuevo, ${user.name}.` : 'Cargando tu información...'}
        </p>
      </div>

      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 max-w-2xl mx-auto md:mx-0 h-auto gap-2">
          <TabsTrigger value="history" className="py-3">Historial</TabsTrigger>
          <TabsTrigger value="recommendations" className="py-3">Para Ti</TabsTrigger>
          <TabsTrigger value="invoices" className="py-3">Facturas</TabsTrigger>
          <TabsTrigger value="booking" className="py-3">{t('nav_booking_mgmt')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="history" className="mt-6">
          <HistoryTabContent />
        </TabsContent>
        
        <TabsContent value="recommendations" className="mt-6">
          <CakeRecommendationForm flavors={allFlavors} />
        </TabsContent>
        
        <TabsContent value="invoices" className="mt-6">
           <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center gap-2">
                <FileText className="h-6 w-6"/>
                Tus Facturas
              </CardTitle>
              <CardDescription>
                Accede a tu historial de facturas, visualízalas e imprímelas en formato PDF.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Toda tu información de facturación está centralizada y disponible para tu comodidad. Haz clic en el botón de abajo para gestionar tus facturas.</p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/documents">Ir a Facturas</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="booking" className="mt-6">
           <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center gap-2">
                <ShoppingBag className="h-6 w-6 text-primary"/>
                {t('booking_mgmt_title')}
              </CardTitle>
              <CardDescription>
                {t('booking_mgmt_sub')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Gestiona tus solicitudes especiales de forma dinámica. Podrás ver en tiempo real si tus pedidos han sido aceptados y añadir nuevas peticiones personalizadas.</p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/pedidos">Entrar a Mis Pedidos</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
