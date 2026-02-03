'use client';

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Order } from "@/lib/types";
import { cn } from "@/lib/utils"
import { orders as allOrders } from '@/lib/data';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      setOrders(allOrders);
    } catch (e: any) {
      console.error("Failed to load mock orders", e);
      setError(e.message || "Ocurrió un error al cargar los pedidos.");
    } finally {
      setLoading(false);
    }
  }, []);

  const getStatusBadgeClass = (status?: string) => {
      const normalizedStatus = status?.toUpperCase() || '';
      if (normalizedStatus === 'ENTREGADO') return 'bg-green-100 text-green-800';
      if (normalizedStatus === 'EN PROCESO') return 'bg-blue-100 text-blue-800';
      if (normalizedStatus === 'CANCELADO') return 'bg-red-100 text-red-800';
      return 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="mb-8">
          <h1 className="font-headline text-4xl md:text-5xl">Administración de Pedidos</h1>
          <p className="text-lg text-muted-foreground">Vista de todos los pedidos de clientes.</p>
        </div>
        <p>Cargando pedidos...</p>
      </div>
    );
  }

  if (error) {
     return (
      <div className="container mx-auto px-4 py-12 md:py-16">
         <div className="mb-8">
            <h1 className="font-headline text-4xl md:text-5xl">Administración de Pedidos</h1>
            <p className="text-lg text-muted-foreground">Vista de todos los pedidos de clientes.</p>
        </div>
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="mb-8">
        <h1 className="font-headline text-4xl md:text-5xl">Administración de Pedidos</h1>
        <p className="text-lg text-muted-foreground">Vista de todos los pedidos de clientes.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Todos los Pedidos</CardTitle>
          <CardDescription>
            {`Mostrando ${orders.length} pedido(s) en total.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">No se encontraron pedidos.</TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.clientName}</TableCell>
                    <TableCell>{order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}</TableCell>
                    <TableCell>
                      <Badge variant={order.status === 'Entregado' ? 'default' : 'secondary'} 
                        className={cn(getStatusBadgeClass(order.status))}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
