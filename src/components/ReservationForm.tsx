'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';

export default function ReservationForm() {
  const [date, setDate] = React.useState<Date | undefined>();

  return (
    <Card className="shadow-lg">
      <form action="https://formspree.io/f/your_form_id" method="POST">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Detalles de la Reserva</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre Completo</Label>
            <Input id="name" name="name" placeholder="Tu nombre" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="tu@email.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input id="phone" name="phone" placeholder="Tu número de teléfono" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guests">Número de Invitados</Label>
            <Input id="guests" name="guests" type="number" placeholder="Ej: 50" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="event-date">Fecha del Evento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP', { locale: es }) : <span>Selecciona una fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(day) => day < new Date()}
                />
              </PopoverContent>
            </Popover>
            <input type="hidden" name="event-date" value={date ? date.toISOString() : ''} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="flavors">Sabores Deseados</Label>
            <Textarea
              id="flavors"
              name="flavors"
              placeholder="Ej: Chocolate con relleno de frambuesa, vainilla con crema de limón..."
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="design">Descripción del Diseño</Label>
            <Textarea
              id="design"
              name="design"
              placeholder="Describe el estilo, colores, o si tienes alguna imagen de referencia (puedes enviar el enlace)."
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" size="lg">
            Enviar Solicitud
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
