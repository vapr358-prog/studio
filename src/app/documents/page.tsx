'use client';
import { useState, useEffect } from 'react';
import { FileText, ArrowLeft, Printer, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// --- Interfaces para una estructura de datos clara ---
interface UserData {
  usuari: string;
  rol: string;
  empresa: string;
  fiscalid: string;
  adreca: string;
  telefon: string;
}

interface DocumentLine {
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
  estat: 'Pagat' | 'Pendent';
}

interface Invoice {
  invoiceNumber: string;
  date: string;
  paymentMethod: string;
  status: 'Pagat' | 'Pendent';
  clientData: {
    name: string;
    fiscalId: string;
    address: string;
    phone: string;
    email: string;
  };
  items: {
    concept: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    netTotal: number;
    vatRate: number;
  }[];
  subtotal: number;
  vatBreakdown: { [rate: string]: { base: number; amount: number } };
  total: number;
}

// --- Componente Principal de Facturación ---
export default function DocumentsPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: string; role: string } | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    async function loadInvoiceData() {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const idBuscado = (storedUser.email || storedUser.username || storedUser.name || "").toLowerCase().trim();

        if (!idBuscado) {
          setError("No se pudo identificar al usuario. Por favor, inicie sesión de nuevo.");
          setLoading(false);
          return;
        }

        const [docsRes, usersRes] = await Promise.all([
          fetch('https://sheetdb.io/api/v1/tvh7feay2rpct?sheet=documents'),
          fetch('https://sheetdb.io/api/v1/tvh7feay2rpct?sheet=usuaris'),
        ]);

        if (!docsRes.ok || !usersRes.ok) {
          throw new Error('Error al conectar con la base de datos.');
        }

        const docLines: DocumentLine[] = await docsRes.json();
        const users: UserData[] = await usersRes.json();

        const userProfile = users.find(u => u.usuari.toLowerCase().trim() === idBuscado);
        const userRole = userProfile?.rol.toLowerCase().trim() || 'client';
        setCurrentUser({ id: idBuscado, role: userRole });

        let filteredLines: DocumentLine[];
        if (['admin', 'administrador', 'treballador'].includes(userRole)) {
          filteredLines = docLines;
        } else {
          filteredLines = docLines.filter(line => line.usuari.toLowerCase().trim() === idBuscado);
        }

        if (filteredLines.length === 0) {
          setInvoices([]);
        } else {
           const processedInvoices = processInvoices(filteredLines, users);
           setInvoices(processedInvoices);
        }

      } catch (e: any) {
        setError(e.message || "Ocurrió un error inesperado al cargar los datos.");
      } finally {
        setLoading(false);
      }
    }

    loadInvoiceData();
  }, []);

  const handlePrint = () => window.print();
  
  // --- Funciones auxiliares de procesamiento ---
  const safeParseFloat = (str: string) => parseFloat(String(str).replace(',', '.')) || 0;

  const processInvoices = (lines: DocumentLine[], users: UserData[]): Invoice[] => {
    const groupedByInvoiceNumber = lines.reduce((acc, line) => {
      if (!line.num_factura) return acc;
      (acc[line.num_factura] = acc[line.num_factura] || []).push(line);
      return acc;
    }, {} as { [key: string]: DocumentLine[] });

    return Object.values(groupedByInvoiceNumber).map(linesForInvoice => {
      const firstLine = linesForInvoice[0];
      const clientEmail = firstLine.usuari.toLowerCase().trim();
      const clientInfo = users.find(u => u.usuari.toLowerCase().trim() === clientEmail) || {} as UserData;

      const items = linesForInvoice.map(line => {
        const unitPrice = safeParseFloat(line.preu_unitari);
        const quantity = safeParseFloat(line.unitats);
        const discount = safeParseFloat(line.dte);
        const lineTotal = (unitPrice * quantity) * (1 - discount / 100);
        return {
          concept: line.concepte,
          quantity,
          unitPrice,
          discount,
          netTotal: lineTotal,
          vatRate: safeParseFloat(line.iva),
        };
      });

      const subtotal = items.reduce((sum, item) => sum + item.netTotal, 0);

      const vatBreakdown = items.reduce((acc, item) => {
        const rateStr = item.vatRate.toString();
        if (!acc[rateStr]) acc[rateStr] = { base: 0, amount: 0 };
        acc[rateStr].base += item.netTotal;
        acc[rateStr].amount += item.netTotal * (item.vatRate / 100);
        return acc;
      }, {} as Invoice['vatBreakdown']);

      const totalVat = Object.values(vatBreakdown).reduce((sum, { amount }) => sum + amount, 0);
      const total = subtotal + totalVat;

      return {
        invoiceNumber: firstLine.num_factura,
        date: firstLine.data,
        paymentMethod: firstLine.fpagament,
        status: firstLine.estat,
        clientData: {
          name: clientInfo.empresa || clientInfo.usuari,
          fiscalId: clientInfo.fiscalid,
          address: clientInfo.adreca,
          phone: clientInfo.telefon,
          email: clientInfo.usuari,
        },
        items,
        subtotal,
        vatBreakdown,
        total,
      };
    });
  };

  // --- Renderizado ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // --- Vista de Detalle de Factura (Imprimible) ---
  if (selectedInvoice) {
    return (
      <div className="bg-muted/30 min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="print-hidden mb-8 flex justify-between items-center">
            <Button variant="ghost" onClick={() => setSelectedInvoice(null)}>
              <ArrowLeft className="mr-2" /> Volver a la lista
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="mr-2" /> Imprimir / Guardar PDF
            </Button>
          </div>

          <Card id="zona-factura" className="bg-white shadow-lg print:shadow-none print:border-none rounded-none sm:rounded-lg">
             <CardHeader className="bg-pink-50/50 p-8 rounded-t-none sm:rounded-t-lg">
              <div className="grid grid-cols-2 gap-8 items-start">
                <div>
                  <h1 className="font-headline text-4xl text-primary">Sweet Queen</h1>
                  <p className="text-muted-foreground">Carrer Alt de Sant Pere 17, Reus, 43201</p>
                  <p className="text-muted-foreground">(+34) 664 477 944</p>
                  <p className="text-muted-foreground">prietoerazovalentina8@gmail.com</p>
                  <p className="text-muted-foreground mt-1">NIF: Y1234567Z</p>
                </div>
                <div className="text-right">
                  <h2 className="text-3xl font-semibold text-foreground uppercase tracking-wider">Factura</h2>
                  <p className="text-lg text-primary font-mono">{selectedInvoice.invoiceNumber}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
                <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                    <p className="text-sm text-muted-foreground font-bold">FACTURAR A:</p>
                    <p className="font-semibold text-lg">{selectedInvoice.clientData.name}</p>
                    <p>{selectedInvoice.clientData.address}</p>
                    <p>NIF: {selectedInvoice.clientData.fiscalId}</p>
                    <p>{selectedInvoice.clientData.email}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-muted-foreground"><span className="font-bold">Fecha:</span> {selectedInvoice.date}</p>
                    <p className="text-sm text-muted-foreground"><span className="font-bold">Método de pago:</span> {selectedInvoice.paymentMethod}</p>
                </div>
                </div>

                <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                    <TableHead>Concepto</TableHead>
                    <TableHead className="text-right">Cant.</TableHead>
                    <TableHead className="text-right">P. Unit.</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {selectedInvoice.items.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell className="font-medium">{item.concept}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{item.unitPrice.toFixed(2)} €</TableCell>
                        <TableCell className="text-right">{item.netTotal.toFixed(2)} €</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>

                <Separator className="my-8" />

                <div className="flex justify-end">
                  <div className="w-full max-w-sm space-y-4">
                      <div className="flex justify-between">
                          <span className="text-muted-foreground">Base Imponible:</span>
                          <span className="font-medium">{selectedInvoice.subtotal.toFixed(2)} €</span>
                      </div>
                      {Object.entries(selectedInvoice.vatBreakdown).map(([rate, {base, amount}]) => (
                         <div key={rate} className="flex justify-between">
                            <span className="text-muted-foreground">IVA ({rate}% sobre {base.toFixed(2)} €):</span>
                            <span className="font-medium">{amount.toFixed(2)} €</span>
                        </div>
                      ))}
                      <Separator />
                      <div className="flex justify-between text-xl font-bold text-primary">
                          <span>TOTAL:</span>
                          <span>{selectedInvoice.total.toFixed(2)} €</span>
                      </div>
                  </div>
                </div>
            </CardContent>
            <CardContent className="px-8 pt-4 pb-8 text-xs text-muted-foreground">
              <h3 className="font-bold mb-2 text-foreground">Información Legal</h3>
              <p>De conformidad con lo dispuesto en el RGPD, le informamos que sus datos personales han sido incorporados en un fichero bajo la responsabilidad de Sweet Queen con la finalidad de gestionar la relación comercial.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // --- Vista de Lista de Facturas ---
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-2">Mis Documentos</h1>
        <p className="text-gray-600 mb-8 font-medium">Aquí puedes consultar y gestionar tus facturas.</p>

        {invoices.length === 0 ? (
          <Alert>
             <AlertCircle className="h-4 w-4" />
             <AlertTitle>No se encontraron facturas</AlertTitle>
             <AlertDescription>
              {currentUser ? `Buscando correspondencia para el ID: ${currentUser.id}` : 'No se pudo identificar al usuario.'}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid gap-6">
            {invoices.map((invoice, index) => (
              <Card 
                key={index} 
                className="hover:border-primary transition-all group overflow-hidden cursor-pointer"
                onClick={() => setSelectedInvoice(invoice)}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 uppercase tracking-tight">Factura {invoice.invoiceNumber}</h2>
                      <p className="text-gray-400 text-sm mt-1 font-medium">{invoice.date}</p>
                       <p className="text-gray-500 text-sm mt-1 font-medium">{invoice.clientData.name}</p>
                      <div className="mt-3">
                         <Badge className={cn(
                           'text-xs font-bold uppercase tracking-widest',
                           invoice.status === 'Pagat' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                         )}>
                          {invoice.status}
                        </Badge>
                      </div>
                    </div>
                     <div className="bg-pink-50 p-3 rounded-full group-hover:bg-primary transition-colors">
                      <FileText className="text-primary group-hover:text-white" size={24} />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end mt-8">
                     <Button variant="link" className="p-0 h-auto text-primary">Ver Factura</Button>
                    <div className="text-right">
                      <p className="text-3xl font-black text-primary">{invoice.total.toFixed(2)} €</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
