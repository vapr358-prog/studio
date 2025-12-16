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
import { orders } from "@/lib/data"
import type { Metadata } from 'next';
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: 'Admin - Pedidos',
  description: 'Vista de todos los pedidos de clientes.',
};

export default function AdminOrdersPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="mb-8">
        <h1 className="font-headline text-4xl md:text-5xl">Administración de Pedidos</h1>
        <p className="text-lg text-muted-foreground">Vista de todos los pedidos de clientes.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Todos los Pedidos</CardTitle>
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
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.clientName}</TableCell>
                  <TableCell>{order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}</TableCell>
                  <TableCell>
                    <Badge variant={order.status === 'Entregado' ? 'default' : 'secondary'} 
                      className={cn({
                        'bg-green-100 text-green-800': order.status === 'Entregado',
                        'bg-blue-100 text-blue-800': order.status === 'En Proceso',
                        'bg-red-100 text-red-800': order.status === 'Cancelado'
                      })}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
