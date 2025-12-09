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
import type { Order } from "@/lib/types"
import { cn } from "@/lib/utils"

interface OrderHistoryProps {
  orders: Order[];
}

export function OrderHistory({ orders }: OrderHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Tu Historial de Pedidos</CardTitle>
        <CardDescription>Aquí puedes ver todos los pedidos que has realizado.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Pedido</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Items</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.date}</TableCell>
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
                <TableCell>{order.items.map(i => i.name).join(', ')}</TableCell>
                <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
