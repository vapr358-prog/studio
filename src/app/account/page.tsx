import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrderHistory } from "@/components/account/OrderHistory"
import CakeRecommendationForm from "@/components/account/CakeRecommendationForm"
import { orders, mockUser } from "@/lib/data"
import { allFlavors } from "@/lib/types"
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mi Cuenta',
  description: 'Gestiona tu cuenta, ve tu historial de pedidos y obtén recomendaciones personalizadas.',
};

export default function AccountPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="mb-8">
        <h1 className="font-headline text-4xl md:text-5xl">Mi Cuenta</h1>
        <p className="text-lg text-muted-foreground">Bienvenida de nuevo, {mockUser.name}.</p>
      </div>

      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="history">Historial de Pedidos</TabsTrigger>
          <TabsTrigger value="recommendations">Para Ti</TabsTrigger>
        </TabsList>
        <TabsContent value="history" className="mt-6">
          <OrderHistory orders={orders} />
        </TabsContent>
        <TabsContent value="recommendations" className="mt-6">
          <CakeRecommendationForm flavors={allFlavors} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
