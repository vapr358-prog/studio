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
import { SHEETDB_API_URL } from "@/lib/config";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
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
    async function fetchOrders() {
      setLoading(true);
      setError(null);
      try {
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

        setOrders(allOrders);

      } catch (e: any) {
         console.error("Failed to load orders", e);
        setError(e.message || "Ocurrió un error al cargar los pedidos.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
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
