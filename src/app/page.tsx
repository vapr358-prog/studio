'use client';
import { useState, useEffect } from 'react';
import { FileText, ArrowLeft, Printer } from 'lucide-react';

export default function MisFacturas() {
  const [facturas, setFacturas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<any>(null);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const email = storedUser.email || storedUser.username || "";
        setUserEmail(email);

        const res = await fetch('https://sheetdb.io/api/v1/tvh7feay2rpct?sheet=documents');
        const data = await res.json();

        if (Array.isArray(data)) {
          const filtradas = data.filter(f => 
            f.usuari?.toLowerCase().trim() === email.toLowerCase().trim()
          );
          setFacturas(filtradas);
        }
      } catch (error) {
        console.error("Error cargando facturas");
      } finally {
        setLoading(false);
      }
    }
    cargarDatos();
  }, []);

  if (loading) return <div className="p-10 text-center text-[#d23669] font-bold">Cargando tus facturas...</div>;

  // VISTA DETALLE DE FACTURA (PARA IMPRIMIR)
  if (facturaSeleccionada) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center print:hidden">
          <button onClick={() => setFacturaSeleccionada(null)} className="flex items-center gap-2 text-gray-600 hover:text-[#d23669]">
            <ArrowLeft size={20} /> Volver
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 bg-[#d23669] text-white px-4 py-2 rounded-lg shadow-md hover:bg-pink-700">
            <Printer size={20} /> Imprimir PDF
          </button>
        </div>

        <div className="max-w-4xl mx-auto border border-gray-200 p-10 rounded shadow-sm print:border-0 print:shadow-none">
          <div className="flex justify-between mb-12">
            <div>
              <h1 className="text-4xl font-bold text-[#d23669] uppercase">Factura</h1>
              <p className="text-gray-500 font-mono italic">{facturaSeleccionada.num_factura}</p>
            </div>
            <div className="text-right text-gray-600">
              <h2 className="text-xl font-bold text-black">Sweet Queen</h2>
              <p>NIF: B12345678</p>
              <p>Calle Ficticia 123, Barcelona</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-12">
            <div className="bg-pink-50/50 p-4 rounded-lg border border-pink-100">
              <p className="text-[10px] uppercase text-gray-400 font-bold mb-2">Datos del Cliente</p>
              <p className="font-bold text-gray-800">{facturaSeleccionada.nombre_cliente || 'Cliente'}</p>
              <p className="text-sm text-gray-600">{userEmail}</p>
              <p className="text-sm text-gray-600">{facturaSeleccionada.direccion_cliente}</p>
              <p className="text-sm text-gray-600">{facturaSeleccionada.nif_cliente}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">Fecha Emisión</p>
              <p className="font-medium text-gray-800">{facturaSeleccionada.data}</p>
              <p className="text-[10px] uppercase text-gray-400 font-bold mt-4 mb-1">Forma de Pago</p>
              <p className="text-sm text-gray-700 font-medium">Transferencia Bancaria / Tarjeta</p>
            </div>
          </div>

          <table className="w-full mb-8">
            <thead>
              <tr className="border-b-2 border-[#d23669] text-left">
                <th className="py-2 text-gray-500 text-xs uppercase">Concepto</th>
                <th className="py-2 text-gray-500 text-xs uppercase text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-6 text-gray-800 font-medium">{facturaSeleccionada.concepte || 'Pedido Sweet Queen'}</td>
                <td className="py-6 text-xl font-bold text-[#d23669] text-right">{facturaSeleccionada.preu_unitari} €</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-20 border-t border-gray-100 pt-6 text-[10px] text-gray-400 leading-relaxed italic">
            <p className="font-bold mb-1">Registro Mercantil:</p>
            <p>Sweet Queen S.L. Inscrita en el Registro Mercantil de Barcelona, Tomo 12345, Folio 67, Hoja B-8910, Inscripción 1ª.</p>
          </div>
        </div>
      </div>
    );
  }

  // LISTADO PRINCIPAL
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#d23669] mb-8">Mis Facturas</h1>
        {facturas.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow-sm text-center border-2 border-dashed border-pink-100">
            <p className="text-gray-400">No hay facturas para: <b>{userEmail || "Usuario"}</b></p>
          </div>
        ) : (
          <div className="grid gap-6">
            {facturas.map((fac, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-[#d23669] transition-all">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800 uppercase">Factura {fac.num_factura}</h2>
                    <p className="text-sm text-gray-400">{fac.data}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-[#d23669] mb-2">{fac.preu_unitari} €</p>
                    <button onClick={() => setFacturaSeleccionada(fac)} className="bg-[#d23669] text-white px-6 py-2 rounded-lg font-bold hover:bg-pink-700 transition-colors">
                      Ver Factura
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}