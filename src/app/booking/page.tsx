'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SHEETDB_API_URL } from '@/lib/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, PlusCircle, History, FileText, RefreshCcw, AlertCircle } from 'lucide-react';
import { useI18n } from '@/context/LanguageContext';
import { jsPDF } from 'jspdf';

type Solicitud = {
  id: string;
  fecha: string;
  usuario: string;
  estado: string;
  detalles: string;
};

export default function BookingPage() {
  const { t, language } = useI18n();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orders, setOrders] = useState<Solicitud[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Estados del formulario
  const [tipo, setTipo] = useState('');
  const [sabor, setSabor] = useState('');
  const [cantidad, setCantidad] = useState('');
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

  // LEER DATOS DEL EXCEL
  async function fetchUserOrders(username: string) {
    if (!username) return;
    try {
      setLoading(true);
      const res = await fetch(`${SHEETDB_API_URL}/search?usuario=${encodeURIComponent(username)}&sheet=solicitudes`, {
        cache: 'no-store'
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? [...data].reverse() : []);
    } catch (err) {
      setError('No se ha podido cargar el historial.');
    } finally {
      setLoading(false);
    }
  }

  // GENERAR PDF
  const generatePDF = (order: Solicitud) => {
    const doc = new jsPDF();
    
    // Diseño Sweet Queen
    doc.setFillColor(255, 241, 242);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setFont("helvetica", "bold");
    doc.setTextColor(219, 39, 119);
    doc.setFontSize(24);
    doc.text("SWEET QUEEN", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text("Resumen de tu Reserva", 105, 30, { align: "center" });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(`Nº PEDIDO: ${order.id}`, 20, 60);
    doc.text(`FECHA: ${order.fecha}`, 20, 70);
    doc.text(`CLIENTE: ${order.usuario}`, 20, 80);
    doc.text(`ESTADO: ${order.estado.toUpperCase()}`, 20, 90);

    doc.setFont("helvetica", "bold");
    doc.text("DETALLES DEL ENCARGO:", 20, 110);
    doc.setFont("helvetica", "normal");
    const splitDetails = doc.splitTextToSize(order.detalles, 170);
    doc.text(splitDetails, 20, 120);

    doc.save(`Reserva_SweetQueen_${order.id}.pdf`);
  };

  // ENVIAR AL EXCEL
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipo || !sabor) {
      setError('Por favor, indica producto y sabor.');
      return;
    }

    setSubmitting(true);
    const newId = `SQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const fechaHoy = new Date().toLocaleDateString('es-ES');
    
    // CONCATENACIÓN PARA EXCEL (Columna detalles)
    const infoConcatenada = `Producto: ${tipo} | Cantidad: ${cantidad || '1'} | Sabor: ${sabor} | Notas: ${notas || 'Ninguna'}`;

    const payload = {
      data: [{
        id: newId,
        fecha: fechaHoy,
        usuario: user.username,
        estado: 'pendiente',
        detalles: infoConcatenada
      }]
    };

    try {
      const res = await fetch(`${SHEETDB_API_URL}?sheet=solicitudes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setTipo(''); setSabor(''); setCantidad(''); setNotas('');
        fetchUserOrders(user.username);
        alert("¡Solicitud enviada con éxito!");
      }
    } catch (err) {
      setError('Error al enviar.');
    } finally {
      setSubmitting(false);
    }
  };

  // FUNCIÓN CRÍTICA: Detectar si el estado es "aceptada"
  const esAceptada = (estado: string) => {
    if (!estado) return false;
    const e = estado.toLowerCase().trim();
    return e === 'aceptada';
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-pink-600 mb-2">Reservas Sweet Queen</h1>
        <p className="text-muted-foreground italic">Personaliza tu momento más dulce</p>
      </header>

      <div className="grid lg:grid-cols-5 gap-10">
        <section className="lg:col-span-2">
          <Card className="border-pink-200 shadow-xl">
            <CardHeader className="bg-pink-50/50 text-pink-700">
              <CardTitle className="flex items-center gap-2"><PlusCircle size={20} /> Nuevo Encargo</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>¿Qué producto quieres?</Label>
                  <Select onValueChange={setTipo} value={tipo}>
                    <SelectTrigger><SelectValue placeholder="Selecciona..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tarta">Tarta Personalizada</SelectItem>
                      <SelectItem value="Cupcakes">Pack de Cupcakes</SelectItem>
                      <SelectItem value="Galletas">Galletas Decoradas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Cantidad / Personas</Label>
                  <Input placeholder="Ej: 12 unidades" value={cantidad} onChange={(e)=>setCantidad(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Sabor preferido</Label>
                  <Input placeholder="Ej: Chocolate" value={sabor} onChange={(e)=>setSabor(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Notas adicionales</Label>
                  <Textarea placeholder="Alérgenos, colores..." value={notas} onChange={(e)=>setNotas(e.target.value)} />
                </div>
                {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
                <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600" disabled={submitting}>
                  {submitting ? "Enviando..." : "Enviar Solicitud"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        <section className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-700"><History className="text-pink-500" /> Historial</h2>
            <Button variant="ghost" size="sm" onClick={() => fetchUserOrders(user?.username)}><RefreshCcw size={16} className="mr-2"/>Actualizar</Button>
          </div>

          {loading ? (
             <div className="flex justify-center"><Loader2 className="animate-spin text-pink-300" /></div>
          ) : orders.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed rounded-xl text-muted-foreground">No hay pedidos registrados.</div>
          ) : (
            <div className="grid gap-4">
              {orders.map((order) => (
                <Card key={order.id} className="border-l-4 border-l-pink-400">
                  <CardHeader className="py-3 flex flex-row items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">{order.fecha}</p>
                      <CardTitle className="text-md font-mono text-pink-700">{order.id}</CardTitle>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={esAceptada(order.estado) ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-800"}>
                        {order.estado || 'pendiente'}
                      </Badge>
                      
                      {/* ESTO ES LO QUE ESTABAS BUSCANDO */}
                      {esAceptada(order.estado) && (
                        <Button 
                          size="sm" 
                          onClick={() => generatePDF(order)}
                          className="bg-pink-100 text-pink-700 hover:bg-pink-200 border-none font-bold text-xs"
                        >
                          <FileText size={14} className="mr-1" /> DESCARGAR PDF
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="py-3">
                    <p className="text-sm text-gray-600 italic leading-relaxed">{order.detalles}</p>
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