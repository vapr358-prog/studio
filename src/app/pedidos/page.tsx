'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SHEETDB_API_URL } from '@/lib/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, PlusCircle, History, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useI18n } from '@/context/LanguageContext';

type Solicitud = {
  id: string;
  fecha: string;
  usuario: string;
  estado: string;
  detalles: string;
};

export default function PedidosPage() {
  const { t, language } = useI18n();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orders, setOrders] = useState<Solicitud[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Form State
  const [tipo, setTipo] = useState('');
  const [sabor, setSabor] = useState('');
  const [notas, setNotas] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    fetchUserOrders(parsedUser.username);
  }, [router]);

  async function fetchUserOrders(username: string) {
    if (!username) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${SHEETDB_API_URL}/search?usuario=${encodeURIComponent(username)}&sheet=solicitudes`, {
        cache: 'no-store'
      });
      
      if (!res.ok) {
        console.warn("La hoja 'solicitudes' no existe o no es accesible aún.");
        setOrders([]);
        return;
      }
      
      const data = await res.json();
      const sortedData = Array.isArray(data) ? [...data].reverse() : [];
      setOrders(sortedData);
    } catch (err: any) {
      console.error("Error cargando historial:", err);
      setError('No se pudo cargar el historial. Asegúrate de que la hoja "solicitudes" existe en tu Excel.');
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipo || !sabor) {
      setError('Por favor, rellena los campos obligatorios.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const newId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const fecha = new Date().toLocaleDateString(language === 'ca' ? 'ca-ES' : 'es-ES');
    
    const detallesStr = `Producto: ${tipo} | Sabor: ${sabor} | Notas: ${notas || '---'}`;

    const payload = {
      data: [
        {
          id: newId,
          fecha: fecha,
          usuario: user.username,
          estado: 'Pendente',
          detalles: detallesStr,
        }
      ]
    };

    try {
      const res = await fetch(`${SHEETDB_API_URL}?sheet=solicitudes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Error al enviar la solicitud');

      setTipo('');
      setSabor('');
      setNotas('');
      fetchUserOrders(user.username);
    } catch (err: any) {
      setError('Hubo un problema al enviar tu pedido. Verifica que la pestaña "solicitudes" existe en el Excel.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase().trim();
    if (s === 'pendente' || s === 'pendiente') {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-none flex items-center gap-1">
          <Clock size={12}/> {t('status_pending')}
        </Badge>
      );
    }
    if (['aprobado', 'entregado', 'acceptada', 'aceptada', 'aprovat'].includes(s)) {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none flex items-center gap-1">
          <CheckCircle2 size={12}/> {t('status_accepted')}
        </Badge>
      );
    }
    return <Badge variant="secondary">{status}</Badge>;
  };

  if (loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <header className="mb-10 text-center">
        <h1 className="font-headline text-4xl md:text-5xl text-primary mb-2">{t('booking_mgmt_title')}</h1>
        <p className="text-muted-foreground italic">{t('booking_mgmt_sub')}</p>
      </header>

      <div className="grid lg:grid-cols-5 gap-10 items-start">
        <section className="lg:col-span-2 space-y-6">
          <Card className="border-primary/10 shadow-lg">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="text-primary h-5 w-5" />
                {t('booking_new_req')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo">{t('booking_type')} *</Label>
                  <Select onValueChange={setTipo} value={tipo}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('form_select_date')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={t('booking_prod_cake')}>{t('booking_prod_cake')}</SelectItem>
                      <SelectItem value={t('booking_prod_cupcake')}>{t('booking_prod_cupcake')}</SelectItem>
                      <SelectItem value={t('booking_prod_cookie')}>{t('booking_prod_cookie')}</SelectItem>
                      <SelectItem value={t('booking_prod_special')}>{t('booking_prod_special')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sabor">{t('booking_flavor')} *</Label>
                  <Input 
                    id="sabor" 
                    placeholder="Ej: Chocolate & Vainilla" 
                    value={sabor}
                    onChange={(e) => setSabor(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notas">{t('booking_notes')}</Label>
                  <Textarea 
                    id="notas" 
                    placeholder="Ej: 2 unidades, sin gluten..." 
                    className="min-h-[100px]"
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                  />
                </div>

                {error && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('booking_sending')}
                    </>
                  ) : t('booking_send')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        <section className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline text-3xl text-gray-800 flex items-center gap-2">
              <History className="text-primary h-6 w-6" />
              {t('booking_history')}
            </h2>
            <Button variant="ghost" size="sm" onClick={() => fetchUserOrders(user?.username || '')} className="text-xs">
              {t('booking_refresh')}
            </Button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 w-full bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-muted">
              <p className="text-muted-foreground">{t('booking_no_orders')}</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {orders.map((order) => (
                <Card key={order.id} className="overflow-hidden border-l-4 border-l-primary hover:shadow-md transition-shadow">
                  <CardHeader className="py-4 flex flex-row items-center justify-between bg-muted/30">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{order.fecha}</p>
                      <CardTitle className="text-lg font-mono text-primary">{order.id}</CardTitle>
                    </div>
                    {getStatusBadge(order.estado)}
                  </CardHeader>
                  <CardContent className="py-4">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {order.detalles}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
