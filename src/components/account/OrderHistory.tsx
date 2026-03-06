
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Order } from "@/lib/types"
import { cn } from "@/lib/utils"

interface OrderHistoryProps {
  orders: Order[];
}

export function OrderHistory({ orders }: OrderHistoryProps) {

  const getStatusBadgeClass = (status?: string) => {
      const s = (status || '').toLowerCase().trim();
      if (s === 'entregado' || s === 'aprobado' || s === 'aceptada' || s === 'acceptada' || s === 'aprovat') 
        return 'bg-green-100 text-green-800 border-none';
      if (s === 'en proceso' || s === 'pendente' || s === 'pendiente') 
        return 'bg-yellow-100 text-yellow-800 border-none';
      if (s === 'cancelado') 
        return 'bg-red-100 text-red-800 border-none';
      return 'bg-gray-100 text-gray-800 border-none';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Tu Historial de Pedidos</CardTitle>
        <CardDescription>Aquí puedes ver todos los pedidos realizados y su estado actual.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          {orders.length === 0 && <TableCaption>Aún no tienes pedidos en tu historial.</TableCaption>}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Pedido</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Items</TableHead>
              <TableHead className="text-right">Importe</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-mono text-xs font-bold text-primary">{order.id}</TableCell>
                <TableCell className="text-sm">{order.date}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={cn("font-bold uppercase text-[10px] px-2", getStatusBadgeClass(order.status))}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm italic text-muted-foreground max-w-[200px] truncate">
                  {order.items.map(i => i.name).join(', ')}
                </TableCell>
                <TableCell className="text-right font-bold">{order.total.toFixed(2)}€</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
