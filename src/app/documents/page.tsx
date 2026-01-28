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

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="p-10 text-center text-pink-600 font-bold">Cargando tus facturas...</div>;

  // VISTA DE LA FACTURA INDIVIDUAL (Lo que se ve al dar clic)
  if (facturaSeleccionada) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-8">
        {/* Botones de control (No se imprimen) */}
        <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center print:hidden">
          <button 
            onClick={() => setFacturaSeleccionada(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-[#d23669] transition-colors"
          >
            <ArrowLeft size={20} /> Volver a la lista
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-[#d23669] text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors shadow-lg"
          >
            <Printer size={20} /> Imprimir PDF
          </button>
        </div>

        {/* FACTURA REAL (Formato A4) */}
        <div className="max-w-4xl mx-auto border-2 border-gray-100 p-8 md:p-16 rounded-sm shadow-sm print:border-0 print:shadow-none">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-4xl font-bold text-[#d23669] mb-2 uppercase">Factura</h1>
              <p className="text-gray-500 font-mono text-lg">{facturaSeleccionada.num_factura}</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold">Sweet Queen</h2>
              <p className="text-gray-500 italic">Pastelería Artesanal</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-12">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Facturado a:</p>
              <p className="font-bold text-lg">{userEmail}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Fecha de emisión:</p>
              <p className="font-bold">{facturaSeleccionada.data}</p>
            </div>
          </div>

          <table className="w-full mb-12">
            <thead>
              <tr className="border-b-2 border-[#d23669] text-left">
                <th className="py-3 text-gray-400 uppercase text-xs tracking-wider">Concepto</th>
                <th className="py-3 text-gray-400 uppercase text-xs tracking-wider text-right">Precio</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-6 text-lg text-gray-800">{facturaSeleccionada.concepte || 'Servicio de repostería'}</td>
                <td className="py-6 text-lg text-gray-800 text-right font-semibold">{facturaSeleccionada.preu_unitari} €</td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-full md:w-64 bg-pink-50 p-6 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-bold uppercase text-sm">Total</span>
                <span className="text-2xl font-black text-[#d23669]">{facturaSeleccionada.preu_unitari} €</span>
              </div>
            </div>
          </div>

          <div className="mt-24 text-center text-gray-300 text-xs border-t pt-8">
            <p>Gracias por confiar en Sweet Queen</p>
          </div>
        </div>
      </div>
    );
  }

  // LISTA PRINCIPAL (Diseño Rosa)
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#d23669] mb-2">Mis Facturas</h1>
        <p className="text-gray-600 mb-8 font-medium">Aquí puedes consultar y gestionar tus pedidos.</p>

        {facturas.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm border-2 border-dashed border-pink-100 text-center">
            <p className="text-gray-400 text-lg">No hemos encontrado facturas para: <span className="text-[#d23669] font-bold">{userEmail || "Usuario"}</span></p>
          </div>
        ) : (
          <div className="grid gap-6">
            {facturas.map((fac, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:border-[#d23669] transition-all group overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 uppercase tracking-tight">Factura {fac.num_factura}</h2>
                      <p className="text-gray-400 text-sm mt-1 font-medium">{fac.data}</p>
                      <div className="mt-3">
                        <span className="px-3 py-1 bg-pink-50 text-[#d23669] text-xs font-bold rounded-full uppercase tracking-widest">
                          {fac.estat || 'Pagada'}
                        </span>
                      </div>
                    </div>
                    <div className="bg-pink-50 p-3 rounded-full group-hover:bg-[#d23669] transition-colors">
                      <FileText className="text-[#d23669] group-hover:text-white" size={24} />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end mt-8">
                    <button 
                      onClick={() => setFacturaSeleccionada(fac)}
                      className="bg-[#d23669] text-white px-8 py-3 rounded-xl font-bold hover:bg-pink-700 hover:shadow-lg transition-all"
                    >
                      Ver Factura
                    </button>
                    <div className="text-right">
                      <p className="text-3xl font-black text-[#d23669]">{fac.preu_unitari} €</p>
                    </div>
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
