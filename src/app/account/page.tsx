'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrderHistory } from "@/components/account/OrderHistory"
import CakeRecommendationForm from "@/components/account/CakeRecommendationForm"
import { InvoicesTab } from '@/components/account/InvoicesTab';
import { orders as allOrders } from "@/lib/data"
import { allFlavors } from "@/lib/types"
import type { Order } from '@/lib/types';

type AppUser = {
  username: string;
  name: string;
  company: string;
  role: string;
}

export default function AccountPage() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser: AppUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        const filteredOrders = allOrders.filter(order => order.clientName === parsedUser.name);
        setUserOrders(filteredOrders);
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        localStorage.removeItem('user');
      }
    }
  }, []);

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
          <OrderHistory orders={userOrders} />
        </TabsContent>
        <TabsContent value="recommendations" className="mt-6">
          <CakeRecommendationForm flavors={allFlavors} />
        </TabsContent>
        <TabsContent value="invoices" className="mt-6">
          <InvoicesTab user={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
