'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Printer, ArrowLeft, Loader2 } from 'lucide-react';
import Image from 'next/image';

type Invoice = {
  id: string;
  num_factura: string;
  data: string;
  usuari: string;
  fpagament: string;
  concepte: string;
  preu_unitari: string;
  unitats: string;
  iva: string;
  dte: string;
  albara: string;
  estat: string;
  nombre_cliente: string;
  nif_cliente: string;
  direccion_cliente: string;
};

type AppUser = {
  username: string;
  name: string;
};

const calculateInvoiceTotals = (invoice: Invoice) => {
    const baseImponible = parseFloat(invoice.preu_unitari) || 0; // Assuming units=1, dte=0
    const ivaPercentage = parseFloat(invoice.iva) || 21; // Default to 21%
    const ivaAmount = baseImponible * (ivaPercentage / 100);
    const totalPrice = baseImponible + ivaAmount;
    return { baseImponible, ivaPercentage, ivaAmount, totalPrice };
}

export default function DocumentsPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setError("No has iniciado sesión.");
        setLoading(false);
      }
    } catch (e) {
      setError("Error al obtener la información del usuario.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user?.username) return;

    const fetchInvoices = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://sheetdb.io/api/v1/tvh7feay2rpct?sheet=documents&_cb=${new Date().getTime()}`);
        if (!response.ok) {
          throw new Error('No se pudieron cargar las facturas desde el servidor.');
        }
        const allInvoices: Invoice[] = await response.json();
        
        const userInvoices = allInvoices.filter(
          (invoice) => invoice.usuari && user.username && invoice.usuari.trim().toLowerCase() === user.username.trim().toLowerCase()
        );

        if (userInvoices.length === 0) {
            setError(`No se encontraron facturas para el usuario ${user.username}.`);
        } else {
            setInvoices(userInvoices);
        }

      } catch (err: any) {
        setError(err.message || 'Ocurrió un error inesperado.');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [user]);

  if (loading) {
    return (
        <div className="container mx-auto px-4 py-12 text-center flex flex-col items-center justify-center min-h-[50vh]">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">Cargando tus facturas...</p>
        </div>
    );
  }

  // --- Detail View ---
  if (selectedInvoice) {
    const { baseImponible, ivaPercentage, ivaAmount, totalPrice } = calculateInvoiceTotals(selectedInvoice);
    
    return (
      <div className="container mx-auto px-4 py-12 bg-gray-50 flex flex-col items-center">
        <div className="w-full max-w-4xl flex justify-between items-center mb-6 print:hidden">
          <Button variant="outline" onClick={() => setSelectedInvoice(null)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver al listado
          </Button>
          <Button onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" /> Imprimir PDF
          </Button>
        </div>

        <div id="zona-factura" className="w-full max-w-4xl bg-white p-8 md:p-12 shadow-lg border">
          <header className="flex justify-between items-start pb-8 border-b">
            <div>
              <Image src="/LOGO2_VALENTINA_PRIETO.png" alt="Sweet Queen Logo" width={80} height={80} />
              <h1 className="font-headline text-4xl text-primary mt-2">Sweet Queen</h1>
              <p className="text-muted-foreground">Carrer del Roser, 5, 08004 Barcelona</p>
              <p className="text-muted-foreground">NIF: B12345678</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-semibold">FACTURA</h2>
              <p className="text-lg font-mono text-primary">{selectedInvoice.num_factura || 'N/A'}</p>
              <p className="mt-2"><strong>Fecha:</strong> {selectedInvoice.data || 'N/A'}</p>
            </div>
          </header>

          <section className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Factura a:</h3>
            <p className="font-bold">{selectedInvoice.nombre_cliente || 'Nombre no disponible'}</p>
            <p>{selectedInvoice.direccion_cliente || 'Dirección no disponible'}</p>
            <p>NIF: {selectedInvoice.nif_cliente || 'NIF no disponible'}</p>
          </section>

          <section className="mt-8">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-muted">
                  <th className="p-3 font-semibold">Concepto</th>
                  <th className="p-3 font-semibold text-right">Importe</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3">{selectedInvoice.concepte || 'Concepto no especificado'}</td>
                  <td className="p-3 text-right">{baseImponible.toFixed(2)} €</td>
                </tr>
              </tbody>
            </table>
          </section>
          
          <footer className="mt-8 pt-8 border-t">
             <div className="flex justify-end">
                <div className="w-full max-w-sm space-y-2 text-right">
                    <div className="flex justify-between">
                        <span>Base Imponible:</span>
                        <span>{baseImponible.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                        <span>IVA ({ivaPercentage}%):</span>
                        <span>{ivaAmount.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2 text-primary">
                        <span>TOTAL:</span>
                        <span>{totalPrice.toFixed(2)} €</span>
                    </div>
                </div>
            </div>
            <div className="mt-12 text-sm text-muted-foreground">
                <p className="font-bold">Forma de pago: Transferencia Bancaria o Tarjeta</p>
                <p className="mt-4">
                    Sweet Queen S.L. Inscrita en el Registro Mercantil de Barcelona, Tomo 12345, Folio 67, Hoja B-8910.
                </p>
            </div>
          </footer>
        </div>
      </div>
    );
  }

  // --- List View ---
  return (
    <div className="container mx-auto px-4 py-12">
       <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl">Mis Facturas</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Aquí puedes consultar y descargar todas tus facturas.
        </p>
      </div>

      {invoices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {invoices.map((invoice) => {
            const { totalPrice } = calculateInvoiceTotals(invoice);
            return (
                <Card key={invoice.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                    <span>{invoice.num_factura || 'N/A'}</span>
                    <span className="text-sm font-normal text-muted-foreground">{invoice.data || 'N/A'}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-4xl font-bold text-primary">{totalPrice.toFixed(2)}€</p>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={() => setSelectedInvoice(invoice)}>
                    Ver Factura
                    </Button>
                </CardFooter>
                </Card>
            );
          })}
        </div>
      ) : (
         <div className="text-center text-muted-foreground mt-16">
            <p>{error || 'No tienes facturas disponibles en este momento.'}</p>
        </div>
      )}
    </div>
  );
}
