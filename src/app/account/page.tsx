
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrderHistory } from "@/components/account/OrderHistory"
import CakeRecommendationForm from "@/components/account/CakeRecommendationForm"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { allFlavors } from "@/lib/types"
import type { Order } from '@/lib/types';
import { orders as mockOrders } from '@/lib/data';
import { FileText, AlertTriangle, ShoppingBag, Loader2, ChevronRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useI18n } from '@/context/LanguageContext';
import { SHEETDB_API_URL } from '@/lib/config';

type AppUser = {
  username: string;
  name: string;
  company: string;
  role: string;
  email?: string;
}

export default function AccountPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [user, setUser] = useState<AppUser | null>(null);
  const [combinedOrders, setCombinedOrders] = useState<Order[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
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

        // Identificador para filtrar (email o username)
        const userId = (parsedUser.email || parsedUser.username || "").toLowerCase().trim();

        // 1. Cargar Pedidos (Mock + Dinámicos)
        const filteredMock = mockOrders.filter((order) => order.clientName === parsedUser.name);
        
        // 2. Cargar Facturas y Pedidos de SheetDB en paralelo
        try {
          const [resSolicitudes, resDocs] = await Promise.all([
            fetch(`${SHEETDB_API_URL}/search?usuario=${encodeURIComponent(parsedUser.username)}&sheet=solicitudes`, { cache: 'no-store' }),
            fetch(`${SHEETDB_API_URL}?sheet=documents`, { cache: 'no-store' })
          ]);
          
          if (resSolicitudes.ok) {
            const dynamicOrders = await resSolicitudes.json();
            if (Array.isArray(dynamicOrders)) {
              const mappedDynamic: Order[] = dynamicOrders.map((item: any) => ({
                id: item.id,
                clientName: parsedUser.name,
                date: item.fecha,
                items: [{ name: item.detalles.split('|')[0].replace('Producto: ', '').trim() || 'Pedido Especial', quantity: 1 }],
                total: 30.00,
                status: item.estado as any
              }));
              setCombinedOrders([...mappedDynamic, ...filteredMock].sort((a, b) => b.id.localeCompare(a.id)));
            } else {
              setCombinedOrders(filteredMock);
            }
          }

          if (resDocs.ok) {
            const docsData = await resDocs.json();
            if (Array.isArray(docsData)) {
              const filteredDocs = docsData.filter(doc => 
                (doc.usuari || "").toLowerCase().trim() === userId
              );
              setInvoices(filteredDocs.reverse());
            }
          }
        } catch (e) {
          console.warn("Error cargando datos dinámicos", e);
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

  const InvoicesTabContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Buscando tus facturas...</p>
        </div>
      );
    }

    if (invoices.length === 0) {
      return (
        <Card className="border-dashed border-2">
          <CardHeader className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <CardTitle className="text-muted-foreground">No hay facturas disponibles</CardTitle>
            <CardDescription>Cuando realices pedidos oficiales, aquí aparecerán tus documentos de facturación.</CardDescription>
          </CardHeader>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        <h3 className="font-headline text-2xl mb-4 text-primary">Tus Facturas Recientes</h3>
        <div className="grid gap-4">
          {invoices.map((factura, idx) => (
            <Card key={idx} className="hover:border-primary transition-all cursor-pointer group" onClick={() => router.push('/documents')}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-mono text-sm font-bold text-primary">{factura.num_factura || 'FAC-000'}</p>
                    <p className="text-xs text-muted-foreground">{factura.data || 'Sin fecha'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-bold text-lg">{factura.preu_unitari || '0.00'} €</p>
                    <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Pagada</p>
                  </div>
                  <ChevronRight className="text-muted-foreground h-5 w-5 group-hover:text-primary transition-colors" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="pt-4 text-center">
          <Button asChild variant="outline" className="rounded-full px-8">
            <Link href="/documents">Ver todos los documentos</Link>
          </Button>
        </div>
      </div>
    );
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
           <InvoicesTabContent />
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
