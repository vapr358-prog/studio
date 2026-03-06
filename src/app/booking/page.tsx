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

  // Función para leer datos del Excel
  async function fetchUserOrders(username: string) {
    if (!username) return;
    try {
      setLoading(true);
      // Buscamos en la hoja 'solicitudes' filtrando por el nombre de usuario
      const res = await fetch(`${SHEETDB_API_URL}/search?usuario=${encodeURIComponent(username)}&sheet=solicitudes`, {
        cache: 'no-store'
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? [...data].reverse() : []);
    } catch (err) {
      setError('No s\'ha pogut carregar l\'historial.');
    } finally {
      setLoading(false);
    }
  }

  // Función para generar el PDF (Solo cuando está Aceptada)
  const generatePDF = (order: Solicitud) => {
    const doc = new jsPDF();
    
    // Cabecera rosa Sweet Queen
    doc.setFillColor(255, 241, 242);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setFont("helvetica", "bold");
    doc.setTextColor(219, 39, 119);
    doc.setFontSize(24);
    doc.text("SWEET QUEEN", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text("Resum de la teva reserva", 105, 30, { align: "center" });

    // Línea de separación
    doc.setDrawColor(219, 39, 119);
    doc.line(20, 45, 190, 45);

    // Datos del pedido
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(`ID COMANDA: ${order.id}`, 20, 60);
    doc.text(`DATA: ${order.fecha}`, 20, 70);
    doc.text(`CLIENT: ${order.usuario}`, 20, 80);
    doc.text(`ESTAT: ${order.estado.toUpperCase()}`, 20, 90);

    // Detalles del dulce
    doc.setFont("helvetica", "bold");
    doc.text("DETALLS DE L'ENCÀRREC:", 20, 110);
    doc.setFont("helvetica", "normal");
    const splitDetails = doc.splitTextToSize(order.detalles, 170);
    doc.text(splitDetails, 20, 120);

    doc.setFontSize(10);
    doc.text("Gràcies per confiar en Sweet Queen!", 105, 280, { align: "center" });

    doc.save(`Comanda_${order.id}_SweetQueen.pdf`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipo || !sabor) {
      setError('Siusplau, indica el producte i el sabor.');
      return;
    }

    setSubmitting(true);
    const newId = `SQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const fechaAvui = new Date().toLocaleDateString('ca-ES');
    
    // CONCATENACIÓN: Guardamos todo en la columna 'detalles'
    const infoDetalles = `Producte: ${tipo} | Quantitat: ${cantidad || '1'} | Sabor: ${sabor} | Notes: ${notas || 'Cap'}`;

    const payload = {
      data: [{
        id: newId,
        fecha: fechaAvui,
        usuario: user.username,
        estado: 'pendiente', // Estado inicial
        detalles: infoDetalles
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
        alert("Sol·licitud enviada!");
      }
    } catch (err) {
      setError('Error en enviar la sol·licitud.');
    } finally {
      setSubmitting(false);
    }
  };

  // Función para verificar si el estado es exactamente "aceptada" (ignorando mayúsculas y espacios)
  const esAceptada = (estado: string) => {
    return estado?.toLowerCase().trim() === 'aceptada';
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-pink-600 mb-2">Reserves Sweet Queen</h1>
        <p className="text-muted-foreground italic">Fes la teva comanda personalitzada</p>
      </header>

      <div className="grid lg:grid-cols-5 gap-10">
        {/* FORMULARIO DE ENTRADA */}
        <section className="lg:col-span-2">
          <Card className="border-pink-200 shadow-xl">
            <CardHeader className="bg-pink-50/50">
              <CardTitle className="text-pink-700 flex items-center gap-2">
                <PlusCircle size={20} /> Nou Encàrrec
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Quin producte vols? *</Label>
                  <Select onValueChange={setTipo} value={tipo}>
                    <SelectTrigger><SelectValue placeholder="Selecciona..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tarta">Tarta Personalitzada</SelectItem>
                      <SelectItem value="Cupcakes">Pack de Cupcakes</SelectItem>
                      <SelectItem value="Galetes">Galetes Decorades</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Quantitat / Persones</Label>
                  <Input placeholder="Ex: 12 unitats / 10 persones" value={cantidad} onChange={(e)=>setCantidad(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>Sabor preferit *</Label>
                  <Input placeholder="Ex: Xocolata i maduixa" value={sabor} onChange={(e)=>setSabor(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>Notes adicionals (al·lèrgies, colors...)</Label>
                  <Textarea placeholder="Explica'ns més detalls..." value={notas} onChange={(e)=>setNotas(e.target.value)} />
                </div>

                {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

                <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold" disabled={submitting}>
                  {submitting ? <Loader2 className="animate-spin" /> : 'Enviar Sol·licitud'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* HISTORIAL DE PEDIDOS */}
        <section className="lg:col-span-3 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-700">
              <History className="text-pink-500" /> Les meves comandes
            </h2>
            <Button variant="ghost" size="sm" onClick={() => fetchUserOrders(user?.username)}>
              Actualitzar
            </Button>
          </div>

          {loading ? (
             <div className="flex justify-center py-10"><Loader2 className="animate-spin text-pink-300" /></div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-pink-100 rounded-2xl bg-white text-muted-foreground">
              Encara no has fet cap comanda.
            </div>
          ) : (
            <div className="grid gap-4">
              {orders.map((order) => (
                <Card key={order.id} className="border-l-4 border-l-pink-400 hover:shadow-md transition-all">
                  <CardHeader className="py-3 flex flex-row items-center justify-between bg-pink-50/10">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">{order.fecha}</p>
                      <CardTitle className="text-md font-mono text-pink-700">{order.id}</CardTitle>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={esAceptada(order.estado) ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-800"}>
                        {order.estado || 'pendiente'}
                      </Badge>

                      {/* EL BOTÓN: Solo aparece si el estado en el Excel es "aceptada" */}
                      {esAceptada(order.estado) && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => generatePDF(order)}
                          className="text-xs flex gap-1 border-pink-300 text-pink-600 hover:bg-pink-50 font-bold"
                        >
                          <FileText size={14} /> PDF Comanda
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="py-3">
                    <p className="text-sm text-gray-700 leading-relaxed italic">
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