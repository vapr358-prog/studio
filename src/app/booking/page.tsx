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
import { jsPDF } from 'jspdf'; // 1. IMPORTACIÓN <--- AQUÍ

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
    setUser(JSON.parse(storedUser));
    fetchUserOrders(JSON.parse(storedUser).username);
  }, [router]);

  // 2. FUNCIÓN PARA GENERAR EL PDF <--- AQUÍ (Dentro del componente)
  const generatePDF = (order: Solicitud) => {
    const doc = new jsPDF();
    doc.setFillColor(255, 241, 242);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setFont("helvetica", "bold");
    doc.setTextColor(219, 39, 119);
    doc.setFontSize(26);
    doc.text("SWEET QUEEN", 105, 22, { align: "center" });
    doc.setFontSize(12);
    doc.text("Resum de la teva comanda", 105, 30, { align: "center" });
    doc.setDrawColor(219, 39, 119);
    doc.line(20, 45, 190, 45);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`ID COMANDA: ${order.id}`, 20, 60);
    doc.text(`DATA: ${order.fecha}`, 20, 70);
    doc.text(`ESTAT: ${order.estado}`, 20, 80);
    doc.setFont("helvetica", "bold");
    doc.text("DETALLS DE L'ENCÀRREC:", 20, 100);
    doc.setFont("helvetica", "normal");
    const splitDetails = doc.splitTextToSize(order.detalles, 170);
    doc.text(splitDetails, 20, 110);
    doc.save(`Comanda_${order.id}.pdf`);
  };

  async function fetchUserOrders(username: string) {
    try {
      setLoading(true);
      const res = await fetch(`${SHEETDB_API_URL}/search?usuario=${encodeURIComponent(username)}&sheet=solicitudes`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? [...data].reverse() : []);
    } catch (err) {
      setError('Error al cargar historial.');
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const newId = `SQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const fechaHoy = new Date().toLocaleDateString('ca-ES');
    
    // CONCATENACIÓN: Aquí unimos todo para la columna 'detalles' del Excel
    const infoDetalles = `Producte: ${tipo} | Quantitat: ${cantidad} | Sabor: ${sabor} | Notes: ${notas || 'Cap'}`;

    const payload = {
      data: [{
        id: newId,
        fecha: fechaHoy,
        usuario: user.username,
        estado: 'Pendente',
        detalles: infoDetalles // <--- ENVÍO AL EXCEL CORREGIDO
      }]
    };

    try {
      await fetch(`${SHEETDB_API_URL}?sheet=solicitudes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setTipo(''); setSabor(''); setCantidad(''); setNotas('');
      fetchUserOrders(user.username);
    } catch (err) {
      setError('Error enviando.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-4xl font-bold text-pink-600 text-center mb-10 italic">Sweet Queen</h1>
      <div className="grid lg:grid-cols-5 gap-10">
        <section className="lg:col-span-2">
          <Card className="border-pink-100 shadow-md">
            <CardHeader><CardTitle className="text-pink-700">Nou Encàrrec</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Label>Producte</Label>
                <Select onValueChange={setTipo} value={tipo}>
                  <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tarta">Tarta</SelectItem>
                    <SelectItem value="Cupcakes">Cupcakes</SelectItem>
                  </SelectContent>
                </Select>
                <Label>Quantitat</Label>
                <Input placeholder="Ex: 12u" value={cantidad} onChange={(e)=>setCantidad(e.target.value)} />
                <Label>Sabor</Label>
                <Input placeholder="Ex: Xocolata" value={sabor} onChange={(e)=>setSabor(e.target.value)} />
                <Label>Notes adicionales</Label>
                <Textarea value={notas} onChange={(e)=>setNotas(e.target.value)} />
                <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600" disabled={submitting}>
                  {submitting ? "Enviant..." : "Confirmar Reserva"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        <section className="lg:col-span-3 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">Historial</h2>
          {orders.map((order) => (
            <Card key={order.id} className="border-l-4 border-pink-400">
              <CardHeader className="py-3 flex flex-row justify-between items-center">
                <div>
                  <p className="text-xs text-gray-400">{order.fecha}</p>
                  <CardTitle className="text-pink-700 text-lg">{order.id}</CardTitle>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={order.estado.toLowerCase() !== 'pendente' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                    {order.estado}
                  </Badge>

                  {/* 3. BOTÓN DE PDF CONDICIONAL <--- AQUÍ */}
                  {order.estado.toLowerCase() !== 'pendente' && (
                    <Button 
                      variant="outline" size="sm" 
                      onClick={() => generatePDF(order)}
                      className="text-xs flex gap-1 border-pink-200 text-pink-600"
                    >
                      <FileText size={14} /> PDF Pedido
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 italic">{order.detalles}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </div>
  );
}