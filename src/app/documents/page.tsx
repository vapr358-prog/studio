'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader, Printer, ArrowLeft, AlertCircle, FileText } from 'lucide-react';

// Helper types
type DocumentLine = {
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
};

type UserData = {
  usuari: string;
  rol: string;
  empresa: string;
  fiscalid: string;
  adreca: string;
  telefon: string;
};

type Invoice = {
  id: string;
  date: string;
  clientName: string;
  paymentMethod: string;
  lines: {
    concept: string;
    unitPrice: number;
    quantity: number;
    discount: number;
    total: number;
    vatRate: number;
  }[];
  clientData: Partial<UserData>;
  subtotal: number;
  vatTotals: { rate: number; base: number; amount: number }[];
  grandTotal: number;
};

const SHEETS_URL = 'https://sheetdb.io/api/v1/tvh7feay2rpct';

// Helper to safely parse numbers that might have commas
const parseNumber = (str: string | number | undefined): number => {
  if (typeof str === 'number') return str;
  if (typeof str !== 'string' || !str) return 0;
  return parseFloat(str.replace(',', '.')) || 0;
};

// Helper to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
};

export default function DocumentsPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserIdentifier, setCurrentUserIdentifier] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      let storedUser;
      try {
        storedUser = JSON.parse(localStorage.getItem('user') || 'null');
      } catch (e) {
        setError("No se pudo leer la información del usuario. Por favor, inicia sesión de nuevo.");
        setLoading(false);
        return;
      }
      
      if (!storedUser || !storedUser.username) {
        setError("No se ha encontrado un usuario activo. Por favor, inicia sesión.");
        setLoading(false);
        return;
      }

      const userIdentifier = (storedUser.username || '').toLowerCase().trim();
      setCurrentUserIdentifier(userIdentifier);

      try {
        const [usersRes, documentsRes] = await Promise.all([
          fetch(`${SHEETS_URL}?sheet=usuaris`),
          fetch(`${SHEETS_URL}?sheet=documents`),
        ]);

        if (!usersRes.ok || !documentsRes.ok) {
          throw new Error('Error al conectar con la base de datos.');
        }

        const usersData: UserData[] = await usersRes.json();
        const documentsData: DocumentLine[] = await documentsRes.json();

        const currentUserData = usersData.find(u => (u.usuari || '').toLowerCase().trim() === userIdentifier);
        const currentUserRole = (currentUserData?.rol || 'client').toLowerCase().trim();

        let visibleDocuments: DocumentLine[];
        const isAdmin = ['admin', 'administrador', 'treballador'].includes(currentUserRole);

        if (isAdmin) {
          visibleDocuments = documentsData;
        } else {
          visibleDocuments = documentsData.filter(doc => (doc.usuari || '').toLowerCase().trim() === userIdentifier);
        }

        // Group by invoice number, filtering out lines without an invoice number
        const groupedInvoices: Record<string, DocumentLine[]> = visibleDocuments.reduce((acc, doc) => {
          const key = doc.num_factura;
          if (key && String(key).trim() !== '') {
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push(doc);
          }
          return acc;
        }, {} as Record<string, DocumentLine[]>);

        if (Object.keys(groupedInvoices).length === 0) {
            setInvoices([]);
            setLoading(false);
            return;
        }

        const processedInvoices: Invoice[] = Object.values(groupedInvoices).map(lines => {
          const firstLine = lines[0];
          // Provide a fallback empty object for clientData to prevent crashes
          const clientData = usersData.find(u => (u.usuari || '').toLowerCase().trim() === (firstLine.usuari || '').toLowerCase().trim()) || { usuari: firstLine.usuari };
          
          let subtotal = 0;
          const vatBreakdown: Record<number, { base: number; amount: number }> = {};

          const invoiceLines = lines.map(line => {
            const unitPrice = parseNumber(line.preu_unitari);
            const quantity = parseNumber(line.unitats);
            const discountPercentage = parseNumber(line.dte);
            const vatRate = parseNumber(line.iva);

            const lineTotalBeforeDiscount = unitPrice * quantity;
            const discountAmount = lineTotalBeforeDiscount * (discountPercentage / 100);
            const lineNetTotal = lineTotalBeforeDiscount - discountAmount;
            const vatAmount = lineNetTotal * (vatRate / 100);

            subtotal += lineNetTotal;

            if (vatRate > 0) {
              if (!vatBreakdown[vatRate]) {
                vatBreakdown[vatRate] = { base: 0, amount: 0 };
              }
              vatBreakdown[vatRate].base += lineNetTotal;
              vatBreakdown[vatRate].amount += vatAmount;
            }
            
            return {
              concept: line.concepte || 'Concepto no disponible',
              unitPrice,
              quantity,
              total: lineNetTotal,
              vatRate,
              discount: discountPercentage,
            };
          });

          const vatTotals = Object.entries(vatBreakdown).map(([rate, values]) => ({
            rate: Number(rate),
            ...values,
          }));

          const totalVatAmount = vatTotals.reduce((acc, curr) => acc + curr.amount, 0);
          const grandTotal = subtotal + totalVatAmount;

          return {
            id: firstLine.num_factura,
            date: firstLine.data || 'Fecha no disponible',
            clientName: clientData.empresa || clientData.usuari || 'Cliente no identificado',
            paymentMethod: firstLine.fpagament || 'No especificado',
            lines: invoiceLines,
            clientData,
            subtotal,
            vatTotals,
            grandTotal,
          };
        }).sort((a, b) => (a.id || '').localeCompare(b.id || '', undefined, { numeric: true }));

        setInvoices(processedInvoices);

      } catch (e: any) {
        setError(e.message || 'Ha ocurrido un error inesperado al cargar los datos.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-12">
        <div className="flex items-center gap-4 text-muted-foreground">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <p className="text-lg">Cargando tus documentos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
       <div className="container mx-auto px-4 py-12 md:py-16">
         <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error al Cargar Documentos</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (selectedInvoice) {
    return <InvoiceDetail invoice={selectedInvoice} onBack={() => setSelectedInvoice(null)} />;
  }
  
  if (invoices.length === 0) {
     return (
       <div className="container mx-auto px-4 py-12 md:py-16">
         <div className="mb-8">
            <h1 className="font-headline text-4xl md:text-5xl">Mis Documentos</h1>
            <p className="text-lg text-muted-foreground">Aquí encontrarás todas tus facturas.</p>
         </div>
         <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No se encontraron facturas</AlertTitle>
          <AlertDescription>
            <p>No hemos podido encontrar ninguna factura para el identificador de usuario: <strong>{currentUserIdentifier || 'desconocido'}</strong>.</p>
            <p className="mt-2">Por favor, comprueba lo siguiente:</p>
            <ul className="list-disc list-inside mt-1 text-xs">
              <li>Has iniciado sesión con el usuario correcto.</li>
              <li>La columna "usuari" en tu hoja de cálculo "documents" contiene exactamente este identificador para tus facturas (sin espacios extra ni errores de tipeo).</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return <InvoiceList invoices={invoices} onSelectInvoice={setSelectedInvoice} />;
}

// Invoice List View
function InvoiceList({ invoices, onSelectInvoice }: { invoices: Invoice[], onSelectInvoice: (invoice: Invoice) => void }) {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="mb-8">
        <h1 className="font-headline text-4xl md:text-5xl">Mis Documentos</h1>
        <p className="text-lg text-muted-foreground">Aquí encontrarás todas tus facturas.</p>
      </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {invoices.map((invoice) => (
            <Card 
              key={invoice.id} 
              className="flex flex-col cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1"
              onClick={() => onSelectInvoice(invoice)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline text-2xl">{invoice.id || 'N/A'}</CardTitle>
                        <CardDescription>{invoice.date || 'Sin fecha'}</CardDescription>
                    </div>
                    <FileText className="h-6 w-6 text-primary"/>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm font-medium text-muted-foreground">Cliente</p>
                <p className="font-semibold">{invoice.clientName || 'Sin cliente'}</p>
              </CardContent>
              <div className="p-6 pt-0 font-bold text-2xl text-right text-primary">
                {formatCurrency(invoice.grandTotal)}
              </div>
            </Card>
          ))}
        </div>
    </div>
  );
}


// Invoice Detail View
function InvoiceDetail({ invoice, onBack }: { invoice: Invoice, onBack: () => void }) {
    const company = {
        name: 'Sweet Queen',
        nif: 'Y1234567Z',
        address: 'Carrer Alt de Sant Pere 17, Reus, 43201',
        phone: '(+34) 664 477 944',
        email: 'prietoerazovalentina8@gmail.com'
    };

    const legalFooter = `
        Inscrita en el Registro Mercantil de Tarragona, Tomo 1234, Libro 0, Folio 56, Hoja T-7890, Inscripción 1ª. 
        De conformidad con la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales, 
        le informamos que sus datos serán incorporados a nuestros ficheros con el fin de gestionar la relación comercial.
    `;

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
            <div className="print-hidden container mx-auto mb-8 flex justify-between items-center">
                <h1 className="font-headline text-3xl">Detalle de Factura</h1>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={onBack}><ArrowLeft className="mr-2"/> Volver</Button>
                    <Button onClick={() => window.print()}><Printer className="mr-2"/> Imprimir PDF</Button>
                </div>
            </div>

            <div id="zona-factura" className="max-w-4xl mx-auto bg-white p-8 sm:p-12 shadow-lg rounded-lg border border-gray-200 font-sans text-gray-800">
                <header className="flex justify-between items-start pb-8 border-b-2 border-primary">
                    <div>
                        <h2 className="text-3xl font-bold text-primary font-headline">{company.name}</h2>
                        <p>{company.address}</p>
                        <p>Tel: {company.phone}</p>
                        <p>Email: {company.email}</p>
                        <p>NIF: {company.nif}</p>
                    </div>
                    <div className="text-right">
                        <h1 className="text-4xl font-bold uppercase text-gray-700">Factura</h1>
                        <p className="text-gray-500">Nº: <span className="font-semibold text-gray-800">{invoice.id || '--'}</span></p>
                        <p className="text-gray-500">Fecha: <span className="font-semibold text-gray-800">{invoice.date || '--'}</span></p>
                    </div>
                </header>

                <section className="grid grid-cols-2 gap-8 my-8">
                    <div>
                        <h3 className="text-sm uppercase font-bold text-gray-500 mb-2">Facturar a:</h3>
                        <p className="font-bold text-lg">{invoice.clientData?.empresa || invoice.clientData?.usuari || 'Cliente no identificado'}</p>
                        {invoice.clientData?.adreca && <p>{invoice.clientData.adreca}</p>}
                        {invoice.clientData?.fiscalid && <p>NIF/CIF: {invoice.clientData.fiscalid}</p>}
                        {invoice.clientData?.telefon && <p>Tel: {invoice.clientData.telefon}</p>}
                        <p>{invoice.clientData?.usuari || ''}</p>
                    </div>
                </section>

                <section>
                    <Table>
                        <TableHeader className="bg-secondary">
                            <TableRow>
                                <TableHead className="w-1/2 text-secondary-foreground">Concepto</TableHead>
                                <TableHead className="text-right text-secondary-foreground">P. Unitario</TableHead>
                                <TableHead className="text-right text-secondary-foreground">Uds.</TableHead>
                                <TableHead className="text-right text-secondary-foreground">Dto. (%)</TableHead>
                                <TableHead className="text-right text-secondary-foreground">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoice.lines.map((line, index) => (
                                <TableRow key={index} className="border-b">
                                    <TableCell className="font-medium">{line.concept || '--'}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(line.unitPrice)}</TableCell>
                                    <TableCell className="text-right">{line.quantity}</TableCell>
                                    <TableCell className="text-right">{line.discount}%</TableCell>
                                    <TableCell className="text-right font-medium">{formatCurrency(line.total)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </section>

                <section className="flex justify-end mt-8">
                    <div className="w-full sm:w-1/2">
                        <div className="flex justify-between py-2">
                            <span className="font-medium">Base Imponible:</span>
                            <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
                        </div>
                        {invoice.vatTotals.map(vat => (
                            <div key={vat.rate} className="flex justify-between py-2 border-t">
                                <span>IVA ({vat.rate}% sobre {formatCurrency(vat.base)}):</span>
                                <span>{formatCurrency(vat.amount)}</span>
                            </div>
                        ))}
                        <div className="flex justify-between py-3 bg-primary text-primary-foreground rounded-md px-4 mt-2">
                            <span className="text-xl font-bold">TOTAL:</span>
                            <span className="text-xl font-bold">{formatCurrency(invoice.grandTotal)}</span>
                        </div>
                    </div>
                </section>

                <section className="mt-12">
                     {invoice.paymentMethod && invoice.paymentMethod !== 'No especificado' && (
                        <div className="mb-4">
                            <h4 className="font-bold">Forma de pago:</h4>
                            <p>{invoice.paymentMethod}</p>
                        </div>
                     )}
                </section>

                <footer className="mt-12 pt-8 border-t text-xs text-gray-500 text-center">
                    <p>{legalFooter}</p>
                </footer>
            </div>
        </div>
    );
}

    