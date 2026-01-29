'use client';
import { useState, useEffect } from 'react';
import { FileText, ArrowLeft, Printer, CheckCircle } from 'lucide-react';

export default function MisDocumentos() {
  const [facturas, setFacturas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<any>(null);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const email = (storedUser.email || storedUser.username || "").toLowerCase().trim();
        setUserEmail(email);

        // Llamada a las dos pestañas de tu Excel
        const [resDocs, resUsers] = await Promise.all([
          fetch('https://sheetdb.io/api/v1/tvh7feay2rpct?sheet=documents'),
          fetch('https://sheetdb.io/api/v1/tvh7feay2rpct?sheet=usuaris')
        ]);

        const docs = await resDocs.json();
        const users = await resUsers.json();

        if (Array.isArray(docs) && Array.isArray(users)) {
          // Buscamos los datos fiscales en la pestaña "usuaris" usando tu email
          const misDatos = users.find(u => (u.usuari || "").toLowerCase().trim() === email);
          
          const filtradas = docs
            .filter(f => (f.usuari || "").toLowerCase().trim() === email)
            .map(f => ({
              ...f,
              // Usamos tus nombres de columna: nom, fiscalid, adreca
              nom_cli: misDatos?.nom || "Cliente Sweet Queen",
              nif_cli: misDatos?.fiscalid || "NIF no disp.",
              dir_cli: misDatos?.adreca || "Dirección no disp.",
              estado: (f.estat || "PAGAT").toUpperCase(),
              pago: f.fpagament || "Efectiu / Tarjeta"
            }));
          setFacturas(filtradas);
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    }
    cargarDatos();
  }, []);

  // Función para desglose de IVA 21%
  const calc = (totalStr: any) => {
    const t = parseFloat(String(totalStr).replace(',', '.')) || 0;
    const b = t / 1.21;
    return { b: b.toFixed(2), i: (t - b).toFixed(2), t: t.toFixed(2) };
  };

  if (loading) return <div className="p-20 text-center text-[#d23669] font-bold">Cargando facturas oficiales...</div>;

  if (facturaSeleccionada) {
    const p = calc(facturaSeleccionada.preu_unitari);
    return (
      <div className="min-h-screen bg-white p-8">
        {/* Botones - Se ocultan al imprimir */}
        <div className="max-w-4xl mx-auto mb-8 flex justify-between print:hidden">
          <button onClick={() => setFacturaSeleccionada(null)} className="flex items-center gap-2 text-gray-500 font-bold hover:text-[#d23669]">
            <ArrowLeft size={20} /> VOLVER AL LISTADO
          </button>
          <button onClick={() => window.print()} className="bg-[#d23669] text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg">
            <Printer size={18} /> IMPRIMIR PDF
          </button>
        </div>

        {/* FACTURA FORMATO A4 */}
        <div className="max-w-4xl mx-auto border p-16 rounded-xl shadow-sm print:border-0 print:shadow-none print:p-0">
          <div className="flex justify-between mb-12">
            <div>
              <h1 className="text-4xl font-black text-[#d23669]">FACTURA</h1>
              <p className="text-gray-400 font-mono">Nº {facturaSeleccionada.num_factura || 'FAC-001'}</p>
              <span className="bg-green-50 text-green-600 px-3 py-1 rounded text-[10px] font-bold uppercase border border-green-100 mt-2 inline-block italic">
                {facturaSeleccionada.estado}
              </span>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold italic text-gray-800">Sweet Queen</h2>
              <p className="text-gray-500 text-xs mt-1">NIF: B12345678</p>
              <p className="text-gray-500 text-xs">Carrer del Roser, 5, 08004 Barcelona</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 py-10 border-y border-gray-50 mb-10">
            <div>
              <p className="text-[10px] font-black text-[#d23669] mb-3 uppercase tracking-widest">Factura a:</p>
              <p className="font-bold uppercase text-gray-800 text-lg">{facturaSeleccionada.nom_cli}</p>
              <p className="text-gray-600 text-sm">{facturaSeleccionada.dir_cli}</p>
              <p className="text-gray-600 text-sm font-mono mt-1">NIF: {facturaSeleccionada.nif_cli}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Fecha de Emisión:</p>
              <p className="font-bold text-gray-800">{facturaSeleccionada.data || '22/01/2026'}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase mt-6">Forma de pago:</p>
              <p className="text-sm font-bold italic text-gray-700">{facturaSeleccionada.pago}</p>
            </div>
          </div>

          <table className="w-full mb-10">
            <thead className="border-b-2 border-[#d23669] text-[10px] text-gray-400 uppercase font-black">
              <tr><th className="py-4 text-left">Concepto / Descripción</th><th className="py-4 text-right">Importe Neto</th></tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-10 font-medium text-gray-800">{facturaSeleccionada.concepte || 'Pedido Sweet Queen'}</td>
                <td className="py-10 text-right font-bold text-xl">{p.t} €</td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-end border-t border-gray-100 pt-8">
            <div className="w-72 space-y-3">
              <div className="flex justify-between text-sm text-gray-500 font-medium"><span>Base Imponible (21%):</span><span>{p.b} €</span></div>
              <div className="flex justify-between text-sm text-gray-500 font-medium"><span>Cuota IVA (21%):</span><span>{p.i} €</span></div>
              <div className="flex justify-between font-black text-[#d23669] text-2xl pt-4 border-t-2 border-pink-100 mt-2">
                <span>TOTAL:</span><span>{p.t} €</span>
              </div>
            </div>
          </div>

          <div className="mt-24 pt-8 border-t border-gray-100 text-[9px] text-gray-400 text-center uppercase tracking-[0.2em] leading-loose">
            <p className="font-bold">Sweet Queen S.L. • NIF B12345678</p>
            <p>Inscrita en el Registro Mercantil de Barcelona, Tomo 12345, Folio 67, Hoja B-8910</p>
          </div>
        </div>
      </div>
    );
  }

  // LISTADO DE FACTURAS (Tarjetas rosas)
  return (
    <div className="min-h-screen bg-[#fffcfd] p-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-black text-gray-900 mb-8 tracking-tighter">Mis Facturas</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facturas.map((f, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-pink-50 hover:border-[#d23669] transition-all cursor-pointer group" onClick={() => setFacturaSeleccionada(f)}>
              <div className="flex justify-between mb-4">
                <div className="p-2 bg-pink-50 text-[#d23669] rounded-xl group-hover:bg-[#d23669] group-hover:text-white transition-colors">
                  <FileText size={20} />
                </div>
                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded uppercase italic">{f.estado}</span>
              </div>
              <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Nº {f.num_factura || 'FAC-001'}</p>
              <h3 className="text-lg font-bold text-gray-800 mb-4 truncate">{f.concepte}</h3>
              <div className="flex justify-between items-end border-t border-gray-50 pt-4">
                <p className="text-2xl font-black text-[#d23669]">{f.preu_unitari} €</p>
                <p className="text-[10px] text-gray-400 font-bold">{f.data}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}