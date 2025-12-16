"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Search, MapPin, Calendar, Warehouse, Truck, CheckCircle } from 'lucide-react';
import type { Shipment } from '@/lib/types';

const statusConfig = {
  'En almacén': {
    progress: 10,
    color: 'bg-yellow-500',
    icon: <Warehouse className="h-5 w-5 text-yellow-500" />,
    label: 'En Almacén'
  },
  'En tránsito': {
    progress: 50,
    color: 'bg-blue-500',
    icon: <Truck className="h-5 w-5 text-blue-500" />,
    label: 'En Tránsito'
  },
  'Librado': {
    progress: 100,
    color: 'bg-green-500',
    icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    label: 'Entregado'
  }
};

export default function TrackingClient() {
  const [trackingCode, setTrackingCode] = useState('');
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!trackingCode) {
      setError('Por favor, introduce un código de seguimiento.');
      return;
    }
    setLoading(true);
    setError(null);
    setShipment(null);

    try {
      const response = await fetch(`https://sheetdb.io/api/v1/tvh7feay2rpct/search?tracking_code=${trackingCode}`);
      if (!response.ok) {
        throw new Error('Hubo un problema al contactar el servicio de seguimiento.');
      }
      const data: Shipment[] = await response.json();

      if (data.length > 0) {
        setShipment(data[0]);
      } else {
        setError('Código no encontrado. Por favor, verifica el código e inténtalo de nuevo.');
      }
    } catch (e) {
      console.error(e);
      setError('No se pudo realizar la búsqueda. Inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  const currentStatus = shipment?.status ? statusConfig[shipment.status as keyof typeof statusConfig] : null;

  return (
    <div className="space-y-8">
      <Card className="shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="text"
              placeholder="Escribe tu código de seguimiento..."
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
              className="text-base"
            />
            <Button onClick={handleSearch} disabled={loading} className="w-full sm:w-auto">
              <Search className="mr-2 h-4 w-4" />
              {loading ? 'Buscando...' : 'Buscar'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {shipment && currentStatus && (
        <Card className="shadow-lg animate-in fade-in-50">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <span>Resultado para:</span>
              <span className="font-mono text-primary bg-muted px-2 py-1 rounded-md">{shipment.tracking_code}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Estado del envío:</h3>
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                {currentStatus.icon}
                <span className="text-xl font-semibold text-foreground">{currentStatus.label}</span>
              </div>
              <Progress value={currentStatus.progress} className={`h-2 ${currentStatus.color}`} />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>En almacén</span>
                <span>En tránsito</span>
                <span>Entregado</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t">
              <div className="flex items-start gap-4">
                 <MapPin className="h-6 w-6 mt-1 text-primary" />
                 <div>
                    <h4 className="font-bold">Origen</h4>
                    <p className="text-muted-foreground">{shipment.origin}</p>
                 </div>
              </div>
               <div className="flex items-start gap-4">
                 <MapPin className="h-6 w-6 mt-1 text-primary" />
                 <div>
                    <h4 className="font-bold">Destino</h4>
                    <p className="text-muted-foreground">{shipment.destination}</p>
                 </div>
              </div>
               <div className="flex items-start gap-4">
                 <Calendar className="h-6 w-6 mt-1 text-primary" />
                 <div>
                    <h4 className="font-bold">Fecha prevista (ETA)</h4>
                    <p className="text-muted-foreground">{shipment.eta}</p>
                 </div>
              </div>
               <div className="flex items-start gap-4">
                 <Warehouse className="h-6 w-6 mt-1 text-primary" />
                 <div>
                    <h4 className="font-bold">Ubicación actual</h4>
                    <p className="text-muted-foreground">{shipment.current_location}</p>
                 </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
