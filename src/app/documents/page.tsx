'use client';
import { useState, useEffect } from 'react';
import { ArrowLeft, Printer, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// --- Interfaces for clear data structure ---
interface UserData {
  usuari: string;
  rol: string;
  nom: string;
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

// --- Main Invoicing Component ---
export default function DocumentsPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: string; role: string } | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    async function loadInvoiceData() {
      setLoading(true);
      setError(null);
      
      try {
        // 1. Identify Logged-in User from localStorage
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const idBuscado = (storedUser.username || "").toLowerCase().trim();

        if (!idBuscado) {
          setError("No se pudo identificar al usuario. Por favor, inicie sesión de nuevo.");
          setLoading(false);
          return;
        }

        // 2. Fetch ALL necessary data concurrently for robustness
        const [usersRes, docsRes] = await Promise.all([
          fetch('https://sheetdb.io/api/v1/tvh7feay2rpct?sheet=usuaris'),
          fetch('https://sheetdb.io/api/v1/tvh7feay2rpct?sheet=documents')
        ]);

        if (!usersRes.ok || !docsRes.ok) {
          throw new Error('No se pudo conectar con la base de datos. Por favor, inténtelo de nuevo más tarde.');
        }

        const allUsers: UserData[] = await usersRes.json();
        const allDocLines: DocumentLine[] = await docsRes.json();

        // 3. Determine User Role from the fetched user list
        const userProfile = allUsers.find(u => (u.usuari || "").toLowerCase().trim() === idBuscado);
        const userRole = (userProfile?.rol || 'client').toLowerCase().trim();
        setCurrentUser({ id: idBuscado, role: userRole });

        // 4. Filter documents based on role (CLIENT-SIDE)
        let relevantDocLines: DocumentLine[];
        const isAdmin = ['admin', 'administrador', 'treballador'].includes(userRole);
        
        if (isAdmin) {
          relevantDocLines = allDocLines;
        } else {
          // Robust client-side filtering is more reliable than API search
          relevantDocLines = allDocLines.filter(line => (line.usuari || "").toLowerCase().trim() === idBuscado);
        }

        // 5. Process the relevant lines into structured invoices
        if (relevantDocLines.length > 0) {
           const processedInvoices = processInvoices(relevantDocLines, allUsers);
           setInvoices(processedInvoices);
        } else {
          setInvoices([]); // Clear invoices if no documents are found for the user
        }

      } catch (e: any) {
        console.error("Error detallado en loadInvoiceData:", e);
        setError(e.message || "Ocurrió un error inesperado al cargar los datos.");
      } finally {
        setLoading(false);
      }
    }

    loadInvoiceData();
  }, []);

  const handlePrint = () => window.print();
  
  // --- Helper functions for data processing ---
  const safeParseFloat = (str: any) => {
    if (typeof str !== 'string' && typeof str !== 'number') return 0;
    const cleanedStr = String(str).replace(',', '.');
    const num = parseFloat(cleanedStr);
    return isNaN(num) ? 0 : num;
  }

  const processInvoices = (lines: DocumentLine[], users: UserData[]): Invoice[] => {
    const groupedByInvoiceNumber = lines.reduce((acc, line) => {
      if (!line.num_factura) return acc;
      (acc[line.num_factura] = acc[line.num_factura] || []).push(line);
      return acc;
    }, {} as { [key: string]: DocumentLine[] });

    return Object.values(groupedByInvoiceNumber).map(linesForInvoice => {
      const firstLine = linesForInvoice[0];
      const clientEmail = (firstLine.usuari || "").toLowerCase().trim();
      const clientInfo = users.find(u => (u.usuari || "").toLowerCase().trim() === clientEmail) || {} as UserData;

      const items = linesForInvoice.map(line => {
        const unitPrice = safeParseFloat(line.preu_unitari);
        const quantity = safeParseFloat(line.unitats) || 1;
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
        status: firstLine.estat || 'Pendent',
        clientData: {
          name: clientInfo.empresa || clientInfo.nom || clientInfo.usuari,
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
    }).sort((a, b) => b.invoiceNumber.localeCompare(a.invoiceNumber));
  };

  // --- Rendering Logic ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Cargando tus documentos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error de Carga</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // --- Detailed Invoice View (Printable) ---
  if (selectedInvoice) {
    return (
      <div className="bg-muted/30 min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="print-hidden mb-8 flex justify-between items-center gap-4">
            <Button variant="ghost" onClick={() => setSelectedInvoice(null)}>
              <ArrowLeft className="mr-2" /> Volver al listado
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
                  <p className="text-lg text-primary font-mono font-bold">{selectedInvoice.invoiceNumber}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
                <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                    <p className="text-sm text-muted-foreground font-bold">FACTURAR A:</p>
                    <p className="font-semibold text-lg">{selectedInvoice.clientData.name}</p>
                    <p className="text-muted-foreground">{selectedInvoice.clientData.address}</p>
                    <p className="text-muted-foreground">NIF: {selectedInvoice.clientData.fiscalId}</p>
                    <p className="text-muted-foreground">{selectedInvoice.clientData.email}</p>
                </div>
                <div className="text-right">
                    <p><span className="font-bold">Fecha:</span> {selectedInvoice.date}</p>
                    <p><span className="font-bold">Método pago:</span> {selectedInvoice.paymentMethod}</p>
                    <Badge className={cn(
                        'mt-2 text-xs font-bold uppercase tracking-widest',
                        selectedInvoice.status === 'Pagat' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                    )}>
                        {selectedInvoice.status}
                    </Badge>
                </div>
                </div>

                <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                    <TableHead>Concepto</TableHead>
                    <TableHead className="text-right">Cant.</TableHead>
                    <TableHead className="text-right">P. Unitario</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {selectedInvoice.items.map((item, index) => (
                    <TableRow key={index} className="[&_td]:py-3">
                        <TableCell className="font-medium">{item.concept}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{item.unitPrice.toFixed(2)} €</TableCell>
                        <TableCell className="text-right font-medium">{item.netTotal.toFixed(2)} €</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>

                <Separator className="my-8" />

                <div className="flex justify-end">
                  <div className="w-full max-w-sm space-y-3">
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
                          <span>TOTAL A PAGAR:</span>
                          <span>{selectedInvoice.total.toFixed(2)} €</span>
                      </div>
                  </div>
                </div>
            </CardContent>
            <CardContent className="px-8 pt-8 pb-8 text-xs text-muted-foreground border-t">
              <h3 className="font-bold mb-2 text-foreground">Información Legal</h3>
              <p>De conformidad con lo dispuesto en el RGPD, le informamos que sus datos personales han sido incorporados en un fichero bajo la responsabilidad de Sweet Queen con la finalidad de gestionar la relación comercial. Registro Mercantil de Tarragona, Tomo 1234, Libro 0, Folio 56, Hoja T-7890, Inscripción 1ª.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // --- Invoice List View ---
  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Mis Documentos</h1>
            <p className="text-gray-500 mt-1">Consulta y gestiona tus facturas.</p>
        </div>

        {invoices.length === 0 ? (
          <Alert variant="default" className="bg-amber-50 border-amber-200">
             <AlertCircle className="h-4 w-4 !text-amber-600" />
             <AlertTitle className="!text-amber-800">No se encontraron facturas</AlertTitle>
             <AlertDescription className="!text-amber-700">
              {currentUser ? `Estamos buscando documentos para el usuario: "${currentUser.id}". Si crees que esto es un error, por favor, contacta con nosotros.` : 'No se pudo identificar al usuario.'}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <Card 
                key={invoice.invoiceNumber} 
                className="hover:border-primary/80 transition-all group overflow-hidden cursor-pointer shadow-sm hover:shadow-md"
                onClick={() => setSelectedInvoice(invoice)}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
                    <div className="font-medium">
                      <p className="text-sm text-muted-foreground">Factura</p>
                      <p className="text-gray-800 font-bold tracking-wide">{invoice.invoiceNumber}</p>
                    </div>
                     <div>
                      <p className="text-sm text-muted-foreground">Fecha</p>
                      <p className="text-gray-600">{invoice.date}</p>
                    </div>
                     <div className="flex justify-start sm:justify-center">
                        <Badge className={cn(
                           'text-xs font-bold uppercase tracking-widest',
                           invoice.status === 'Pagat' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                         )}>
                          {invoice.status}
                        </Badge>
                      </div>
                     <div className="text-left sm:text-right col-span-2 sm:col-span-1">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-2xl font-black text-primary">{invoice.total.toFixed(2)} €</p>
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

    