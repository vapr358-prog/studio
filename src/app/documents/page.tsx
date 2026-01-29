'use client';
import { useState, useEffect } from 'react';
import { FileText, ArrowLeft, Printer, AlertTriangle } from 'lucide-react';
import { SHEETDB_API_URL } from '@/lib/config';

export default function MisDocumentos() {
  const [facturasFiltradas, setFacturasFiltradas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<any>(null);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const email = (storedUser.email || storedUser.username || "").toLowerCase().trim();

        if (!email) {
          setError("No se pudo identificar al usuario. Por favor, inicia sesión de nuevo.");
          setLoading(false);
          return;
        }
        setUserEmail(email);

        const [resDocs, resUsers] = await Promise.all([
          fetch(`${SHEETDB_API_URL}?sheet=documents`, { cache: 'no-store' }),
          fetch(`${SHEETDB_API_URL}?sheet=usuaris`, { cache: 'no-store' })
        ]);

        if (!resDocs.ok || !resUsers.ok) {
            throw new Error("No se pudo conectar con la base de datos. Inténtalo más tarde.");
        }

        const docsData = await resDocs.json();
        const usersData = await resUsers.json();
        
        const sanitizeKeys = (data: any[]): any[] => {
          if (!Array.isArray(data)) return [];
          return data.map(item => {
            const sanitizedItem: { [key: string]: any } = {};
            for (const key in item) {
              if (Object.prototype.hasOwnProperty.call(item, key)) {
                sanitizedItem[key.trim()] = item[key];
              }
            }
            return sanitizedItem;
          });
        };
        
        const docs = sanitizeKeys(docsData);
        const users = sanitizeKeys(usersData);
        
        if (!Array.isArray(docs) || !Array.isArray(users)) {
            throw new Error("Los datos recibidos no tienen el formato esperado.");
        }

        const misDatos = users.find(u => (u.usuari || "").toLowerCase().trim() === email);
        const userRole = misDatos?.rol?.toLowerCase() || 'client';

        const facturasDelUsuario = docs
          .filter(doc => {
            if (!doc.num_factura) return false;
            if (userRole === 'admin' || userRole === 'administrador' || userRole === 'treballador') {
              return true; 
            }
            return (doc.usuari || "").toLowerCase().trim() === email;
          })
          .map(doc => {
            const datosCliente = users.find(u => (u.usuari || "").toLowerCase().trim() === (doc.usuari || "").toLowerCase().trim());
            return {
              ...doc,
              nom_cli: datosCliente?.nom || "Cliente no identificado",
              nif_cli: datosCliente?.fiscalid || "--",
              dir_cli: datosCliente?.adreca || "--",
            };
          });

        if (facturasDelUsuario.length === 0) {
           setError(`No hemos podido encontrar ninguna factura para el identificador de usuario: ${email}.`);
        }
        
        setFacturasFiltradas(facturasDelUsuario);

      } catch (e: any) {
        console.error(e);
        setError(e.message || "Ocurrió un error inesperado al cargar las facturas.");
      } finally {
        setLoading(false);
      }
    }
    cargarDatos();
  }, []);

  const calcIva = (item: any) => {
    const base = parseFloat(String(item.preu_unitari).replace(',', '.')) || 0;
    const ivaRate = parseFloat(String(item.iva).replace(',', '.')) || 21;
    const ivaAmount = base * (ivaRate / 100);
    const total = base + ivaAmount;
    return {
      base: base.toFixed(2),
      iva: ivaAmount.toFixed(2),
      ivaRate: ivaRate,
      total: total.toFixed(2),
    };
  };

  if (loading) return <div className="p-20 text-center text-[#d23669] font-bold">Cargando facturas...</div>;
  
  if (error && facturasFiltradas.length === 0) {
    return (
        <div className="container mx-auto p-12 text-center">
            <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-2xl p-8">
                <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
                <h2 className="mt-4 text-2xl font-bold text-red-800">No se encontraron facturas</h2>
                <p className="mt-2 text-sm text-red-700">{error}</p>
                <div className="mt-4 text-left text-xs text-red-600 bg-red-100 p-3 rounded-lg">
                    <p className="font-bold">Por favor, comprueba lo siguiente:</p>
                    <ul className="list-disc list-inside mt-1">
                        <li>Has iniciado sesión con el usuario correcto.</li>
                        <li>La columna "usuari" en tu hoja de cálculo "documents" contiene exactamente este identificador para tus facturas (sin espacios extra ni errores de tipeo).</li>
                    </ul>
                </div>
            </div>
        </div>
    );
  }


  if (facturaSeleccionada) {
    const p = calcIva(facturaSeleccionada);
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto mb-8 flex justify-between no-print">
          <button onClick={() => setFacturaSeleccionada(null)} className="flex items-center gap-2 text-gray-500 font-bold hover:text-[#d23669]">
            <ArrowLeft size={20} /> VOLVER AL LISTADO
          </button>
          <button onClick={() => window.print()} className="bg-[#d23669] text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg">
            <Printer size={18} /> IMPRIMIR PDF
          </button>
        </div>

        <div id="zona-factura" className="max-w-4xl mx-auto border bg-white p-16 rounded-xl shadow-sm print:border-0 print:shadow-none print:p-0">
          <div className="flex justify-between mb-12">
            <div>
              <h1 className="text-4xl font-black text-[#d23669]">FACTURA</h1>
              <p className="text-gray-400 font-mono">Nº {facturaSeleccionada.num_factura || 'FAC-001'}</p>
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
              <p className="font-bold uppercase text-gray-800 text-lg">{facturaSeleccionada.nom_cli || 'Cliente no disponible'}</p>
              <p className="text-gray-600 text-sm">{facturaSeleccionada.dir_cli || 'Dirección no disponible'}</p>
              <p className="text-gray-600 text-sm font-mono mt-1">NIF: {facturaSeleccionada.nif_cli || 'NIF no disponible'}</p>
            </div>
            <div className="text-right">
               <p className="text-[10px] font-bold text-gray-400 uppercase">Fecha de Emisión:</p>
               <p className="font-bold text-gray-800">{facturaSeleccionada.data || 'Fecha no disp.'}</p>
            </div>
          </div>

          <table className="w-full mb-10">
            <thead className="border-b-2 border-[#d23669] text-[10px] text-gray-400 uppercase font-black">
              <tr><th className="py-4 text-left">Concepto / Descripción</th><th className="py-4 text-right">Importe</th></tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-10 font-medium text-gray-800">{facturaSeleccionada.concepte || 'Pedido Sweet Queen'}</td>
                <td className="py-10 text-right font-bold text-xl">{p.total} €</td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-end border-t border-gray-100 pt-8">
            <div className="w-72 space-y-3">
              <div className="flex justify-between text-sm text-gray-500 font-medium"><span>Base Imponible:</span><span>{p.base} €</span></div>
              <div className="flex justify-between text-sm text-gray-500 font-medium"><span>Cuota IVA ({p.ivaRate}%):</span><span>{p.iva} €</span></div>
              <div className="flex justify-between font-black text-[#d23669] text-2xl pt-4 border-t-2 border-pink-100 mt-2">
                <span>TOTAL:</span><span>{p.total} €</span>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center text-xs text-gray-400 space-y-2">
              <p>Forma de pago: Transferencia Bancaria o Tarjeta</p>
              <div className="pt-4 border-t border-gray-100 mt-4 text-[9px] uppercase tracking-[0.2em] leading-loose">
                  <p className="font-bold">Sweet Queen S.L. • NIF B12345678</p>
                  <p>Inscrita en el Registro Mercantil de Barcelona, Tomo 12345, Folio 67, Hoja B-8910</p>
              </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffcfd] p-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-black text-gray-900 mb-8 tracking-tighter">Mis Facturas</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facturasFiltradas.map((factura, i) => {
            const p = calcIva(factura);
            return (
              <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-pink-50 hover:border-[#d23669] transition-all cursor-pointer group" onClick={() => setFacturaSeleccionada(factura)}>
                <div className="flex justify-between mb-4">
                  <div className="p-2 bg-pink-50 text-[#d23669] rounded-xl group-hover:bg-[#d23669] group-hover:text-white transition-colors">
                    <FileText size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded uppercase italic">PAGADA</span>
                </div>
                <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Nº {factura.num_factura || 'FAC-001'}</p>
                <h3 className="text-lg font-bold text-gray-800 mb-4 truncate">{factura.concepte || 'Concepto no especificado'}</h3>
                <div className="flex justify-between items-end border-t border-gray-50 pt-4">
                  <p className="text-2xl font-black text-[#d23669]">{p.total} €</p>
                  <p className="text-[10px] text-gray-400 font-bold">{factura.data || '--'}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
