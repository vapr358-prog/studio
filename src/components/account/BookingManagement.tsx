'use client';

import { useState, useEffect } from 'react';
import { SHEETDB_API_URL } from '@/lib/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, PlusCircle, History, CheckCircle2, Clock, AlertCircle, FileText } from 'lucide-react';
import { useI18n } from '@/context/LanguageContext';
import { jsPDF } from 'jspdf';

type Solicitud = {
  id: string;
  fecha: string;
  usuario: string;
  estado: string;
  detalles: string;
};

export default function BookingManagement() {
  const { t, language } = useI18n();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orders, setOrders] = useState<Solicitud[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [tipo, setTipo] = useState('');
  const [sabor, setSabor] = useState('');
  const [notas, setNotas] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchUserOrders(parsedUser.username);
    }
  }, []);

  async function fetchUserOrders(username: string) {
    if (!username) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${SHEETDB_API_URL}/search?usuario=${encodeURIComponent(username)}&sheet=solicitudes`, {
        cache: 'no-store'
      });
      
      if (!res.ok) {
        setOrders([]);
        return;
      }
      
      const data = await res.json();
      const sortedData = Array.isArray(data) ? [...data].reverse() : [];
      setOrders(sortedData);
    } catch (err: any) {
      console.error("Error cargando historial:", err);
      setError('No se pudo cargar el historial.');
    } finally {
      setLoading(false);
    }
  }

  const generatePDF = (order: Solicitud) => {
    const doc = new jsPDF();
    
    doc.setFillColor(255, 241, 242);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(219, 39, 119);
    doc.setFontSize(28);
    doc.text("SWEET QUEEN", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.setTextColor(150, 150, 150);
    doc.text("Resumen de tu Pedido Especial", 105, 30, { align: "center" });

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(11);
    
    let y = 60;
    doc.setFont("helvetica", "bold");
    doc.text(`Nº DE PEDIDO:`, 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(order.id, 60, y);
    
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text(`FECHA:`, 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(order.fecha, 60, y);
    
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text(`CLIENTE:`, 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(order.usuario, 60, y);
    
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text(`ESTADO:`, 20, y);
    doc.setTextColor(22, 163, 74);
    doc.text(order.estado.toUpperCase(), 60, y);

    y += 15;
    doc.setDrawColor(244, 114, 182);
    doc.line(20, y, 190, y);

    y += 15;
    doc.setTextColor(60, 60, 60);
    doc.setFont("helvetica", "bold");
    doc.text("DETALLES DEL ENCARGO:", 20, y);
    
    y += 10;
    doc.setFont("helvetica", "normal");
    const splitDetails = doc.splitTextToSize(order.detalles, 170);
    doc.text(splitDetails, 20, y);

    doc.setFontSize(10);
    doc.setTextColor(180, 180, 180);
    doc.text("Gracias por confiar en Sweet Queen Reus.", 105, 280, { align: "center" });

    doc.save(`Pedido_SweetQueen_${order.id}.pdf`);
  };

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
      data: [{ id: newId, fecha, usuario: user.username, estado: 'Pendente', detalles: detallesStr }]
    };

    try {
      const res = await fetch(`${SHEETDB_API_URL}?sheet=solicitudes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Error al enviar');
      setTipo(''); setSabor(''); setNotas('');
      fetchUserOrders(user.username);
    } catch (err: any) {
      setError('Error al enviar tu pedido.');
    } finally {
      setSubmitting(false);
    }
  };

  const isAccepted = (status: string) => {
    const s = (status || '').toLowerCase().trim();
    return ['aprobado', 'entregado', 'acceptada', 'aceptada', 'aprovat'].includes(s);
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
    if (isAccepted(s)) {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none flex items-center gap-1">
          <CheckCircle2 size={12}/> {t('status_accepted')}
        </Badge>
      );
    }
    return <Badge variant="secondary">{status}</Badge>;
  };

  return (
    <div className="grid lg:grid-cols-5 gap-8 items-start">
      <section className="lg:col-span-2 space-y-6">
        <Card className="border-primary/10 shadow-lg">
          <CardHeader className="bg-primary/5">
            <CardTitle className="flex items-center gap-2 text-xl">
              <PlusCircle className="text-primary h-5 w-5" />
              {t('booking_new_req')}
            </CardTitle>
            <CardDescription>{t('booking_mgmt_sub')}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">{t('booking_type')} *</Label>
                <Select onValueChange={setTipo} value={tipo}>
                  <SelectTrigger><SelectValue placeholder={t('form_select_date')} /></SelectTrigger>
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
                <Input id="sabor" placeholder="Ej: Chocolate" value={sabor} onChange={(e) => setSabor(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notas">{t('booking_notes')}</Label>
                <Textarea id="notas" placeholder="Ej: 2 unidades, sin gluten..." className="min-h-[100px]" value={notas} onChange={(e) => setNotas(e.target.value)} />
              </div>
              {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={submitting}>
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t('booking_send')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="lg:col-span-3 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-headline text-2xl text-gray-800 flex items-center gap-2">
            <History className="text-primary h-5 w-5" />
            {t('booking_history')}
          </h2>
          <Button variant="ghost" size="sm" onClick={() => fetchUserOrders(user?.username || '')} className="text-xs">
            {t('booking_refresh')}
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-muted/20 rounded-2xl border-2 border-dashed border-muted text-muted-foreground">
            {t('booking_no_orders')}
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden border-l-4 border-l-primary hover:shadow-md transition-shadow">
                <CardHeader className="py-3 flex flex-row items-center justify-between bg-muted/30">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{order.fecha}</p>
                    <CardTitle className="text-md font-mono text-primary">{order.id}</CardTitle>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(order.estado)}
                    {isAccepted(order.estado) && (
                      <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold text-primary gap-1" onClick={() => generatePDF(order)}>
                        <FileText size={12} /> PDF
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="py-3">
                  <p className="text-sm text-gray-700 leading-relaxed italic">{order.detalles}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}