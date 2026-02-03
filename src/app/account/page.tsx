'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrderHistory } from "@/components/account/OrderHistory"
import CakeRecommendationForm from "@/components/account/CakeRecommendationForm"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SHEETDB_API_URL } from '@/lib/config';
import { allFlavors } from "@/lib/types"
import type { Order } from '@/lib/types';
import { FileText, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type AppUser = {
  username: string;
  name: string;
  company: string;
  role: string;
}

export default function AccountPage() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sanitizeKeys = (data: any[]): any[] => {
    if (!Array.isArray(data)) return [];
    return data.map(item => {
      const sanitizedItem: { [key: string]: any } = {};
      for (const key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          sanitizedItem[key.trim()] = item[key];
        }
      }
      return sanitizedItem;
    });
  };

  useEffect(() => {
    async function loadUserAndOrders() {
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

        const res = await fetch(`${SHEETDB_API_URL}?sheet=orders`, { cache: 'no-store' });
        if (!res.ok) {
          throw new Error("No se pudo conectar con el servicio de pedidos.");
        }

        let ordersData = await res.json();
        if (!Array.isArray(ordersData)) {
           throw new Error("Los datos de pedidos recibidos no tienen el formato esperado.");
        }

        const allOrders: Order[] = sanitizeKeys(ordersData).map((order: any) => {
          let items = [];
          try {
            if (typeof order.items === 'string' && order.items.trim().startsWith('[')) {
              items = JSON.parse(order.items);
            } else {
              items = [{ name: order.items || 'Item no especificado', quantity: 1 }];
            }
          } catch(e) {
            console.error("Failed to parse order items:", e);
            items = [{ name: order.items || 'Error al leer items', quantity: 1 }];
          }

          return {
            ...order,
            id: order.id || `ord-${Math.random()}`,
            items: items,
            total: parseFloat(String(order.total).replace(',', '.')) || 0,
          } as Order;
        });

        const currentUserIdentifier = (parsedUser.username || "").toLowerCase().trim();
        const userRole = (parsedUser.role || '').toLowerCase();

        if (!currentUserIdentifier) {
           throw new Error("No se pudo identificar al usuario.");
        }

        const filteredOrders = allOrders.filter((order: any) => {
            if (userRole === 'admin' || userRole === 'administrador' || userRole === 'treballador') {
                return true;
            }
            return (order.usuari || "").toLowerCase().trim() === currentUserIdentifier;
        });

        setUserOrders(filteredOrders);

      } catch (e: any) {
        console.error("Failed to load orders", e);
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
      <div className="mb-8">
        <h1 className="font-headline text-4xl md:text-5xl">Mi Cuenta</h1>
        <p className="text-lg text-muted-foreground">
          {user ? `Bienvenida de nuevo, ${user.name}.` : 'Cargando tu información...'}
        </p>
      </div>

      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-lg">
          <TabsTrigger value="history">Historial de Pedidos</TabsTrigger>
          <TabsTrigger value="recommendations">Para Ti</TabsTrigger>
          <TabsTrigger value="invoices">Facturas</TabsTrigger>
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
      </Tabs>
    </div>
  );
}
