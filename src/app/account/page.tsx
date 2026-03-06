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
import { orders as allOrders } from '@/lib/data';
import { FileText, AlertTriangle, ShoppingBag } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useI18n } from '@/context/LanguageContext';

type AppUser = {
  username: string;
  name: string;
  company: string;
  role: string;
}

export default function AccountPage() {
  const { t } = useI18n();
  const [user, setUser] = useState<AppUser | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function loadUserAndOrders() {
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

        const filteredOrders = allOrders.filter((order) => {
            return order.clientName === parsedUser.name;
        });

        setUserOrders(filteredOrders);

      } catch (e: any) {
        console.error("Failed to load mock orders", e);
        setError(e.message || "Ocurrió un error al cargar el historial de pedidos.");
      } finally {
        setLoading(false);
      }
    }
    
    loadUserAndOrders();
  }, []);

  const HistoryTabContent = () => {
    if (loading) {
      return <p className="text-center">Cargando historial de pedidos...</p>;
    }
    if (error) {
      return (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }
    return <OrderHistory orders={userOrders} />;
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
