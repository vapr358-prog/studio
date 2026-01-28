
'use client';
import { useState, useEffect } from 'react';

export default function DiagnosticPage() {
  const [data, setData] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function diagnostic() {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(storedUser);

        // Intentamos leer la hoja de documentos
        const res = await fetch('https://sheetdb.io/api/v1/tvh7feay2rpct?sheet=documents');
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error("Error de conexión");
      } finally {
        setLoading(false);
      }
    }
    diagnostic();
  }, []);

  if (loading) return <div className="p-10">Cargando diagnóstico...</div>;

  return (
    <div className="p-10 font-mono text-xs">
      <h1 className="text-xl font-bold mb-4 text-red-600">MODO DIAGNÓSTICO</h1>
      
      <section className="mb-8 p-4 bg-gray-100 border">
        <h2 className="font-bold">1. ¿QUIÉN ERES SEGÚN LA WEB?</h2>
        <pre>{JSON.stringify(user, null, 2)}</pre>
        <p className="mt-2 text-blue-600">El código buscará: <strong>{user?.email || user?.username}</strong></p>
      </section>

      <section className="p-4 bg-yellow-50 border">
        <h2 className="font-bold">2. ¿QUÉ VE EL CÓDIGO EN TU EXCEL?</h2>
        {data.length === 0 ? (
          <p className="text-red-500 font-bold">¡ERROR! No recibo nada de SheetDB. Revisa el nombre de la hoja.</p>
        ) : (
          <table className="w-full border-collapse border mt-2">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-1">num_factura</th>
                <th className="border p-1">usuari (Email en Excel)</th>
                <th className="border p-1">¿COINCIDE?</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row: any, i: number) => {
                const myId = (user?.email || user?.username || "").toLowerCase().trim();
                const excelId = (row.usuari || "").toLowerCase().trim();
                const match = myId === excelId;
                return (
                  <tr key={i} className={match ? "bg-green-200" : "bg-white"}>
                    <td className="border p-1">{row.num_factura}</td>
                    <td className="border p-1">"{row.usuari}"</td>
                    <td className="border p-1 font-bold">{match ? "SÍ ✅" : "NO ❌"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
