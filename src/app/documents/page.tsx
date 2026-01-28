'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Printer, ArrowLeft, AlertCircle } from 'lucide-react';

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
  estat: 'Pagat' | 'Pendent';
};

type User = {
  usuari: string;
  rol: 'admin' | 'administrador' | 'treballador' | 'client';
  empresa: string;
  fiscalid: string;
  adreca: string;
  telefon: string;
  nom: string;
};

type Shipment = {
  num_factura: string;
  status: string;
};

type Invoice = {
  num_factura: string;
  data: string;
  fpagament: string;
  estat: 'Pagat' | 'Pendent';
  clientData: User | null;
  shipmentStatus: string;
  lines: {
    concepte: string;
    preu_unitari: number;
    unitats: number;
    iva: number;
    dte: number;
    total: number;
  }[];
  baseImposable: number;
  ivaDesglose: { [key: number]: { base: number; quota: number } };
  total: number;
};

// Helper Functions
const safeParseFloat = (str: string | number) => {
  if (typeof str === 'number') return str;
  if (typeof str !== 'string') return 0;
  return parseFloat(str.replace(',', '.')) || 0;
};

const formatDate = (dateStr: string) => {
  if (!dateStr || !/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return dateStr || '';
  const [day, month, year] = dateStr.split('/');
  try {
    return new Date(`${year}-${month}-${day}`).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (e) {
    return dateStr;
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
};

export default function DocumentsPage() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: string; role: string } | null>(null);

  useEffect(() => {
    async function loadInvoices() {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = (storedUser.email || storedUser.username || storedUser.name || '').toLowerCase().trim();
        
        if (!userId) {
          setError("No s'ha pogut identificar l'usuari. Si us plau, inicia sessió de nou.");
          setLoading(false);
          return;
        }

        const [docsRes, usersRes, shipmentsRes] = await Promise.all([
          fetch('https://sheetdb.io/api/v1/tvh7feay2rpct?sheet=documents'),
          fetch('https://sheetdb.io/api/v1/tvh7feay2rpct?sheet=usuaris'),
          fetch('https://sheetdb.io/api/v1/tvh7feay2rpct?sheet=seguimiento'),
        ]);

        if (!docsRes.ok || !usersRes.ok || !shipmentsRes.ok) {
          throw new Error('Error en la connexió amb la base de dades.');
        }

        const allDocs: DocumentLine[] = await docsRes.json();
        const allUsers: User[] = await usersRes.json();
        const allShipments: Shipment[] = await shipmentsRes.json();

        const userAccount = allUsers.find(u => (u.usuari || '').toLowerCase().trim() === userId);
        const userRole = userAccount?.rol?.toLowerCase().trim() || 'client';
        setCurrentUser({ id: userId, role: userRole });

        const isAdmin = ['admin', 'administrador', 'treballador'].includes(userRole);
        const filteredDocs = isAdmin
          ? allDocs
          : allDocs.filter(d => (d.usuari || '').toLowerCase().trim().startsWith(userId));

        if (filteredDocs.length === 0) {
          setError(`No s'han trobat factures. Buscant correspondència per a l'ID: ${userId}`);
          setInvoices([]);
          setLoading(false);
          return;
        }
        
        const groupedInvoices = filteredDocs.reduce((acc, doc) => {
          if (!doc.num_factura) return acc;
          acc[doc.num_factura] = acc[doc.num_factura] || [];
          acc[doc.num_factura].push(doc);
          return acc;
        }, {} as Record<string, DocumentLine[]>);

        const processedInvoices: Invoice[] = Object.values(groupedInvoices).map(group => {
          const firstLine = group[0];
          const clientData = allUsers.find(u => (u.usuari || '').toLowerCase().trim().startsWith((firstLine.usuari || '').toLowerCase().trim())) || null;
          const shipment = allShipments.find(s => s.num_factura === firstLine.num_factura);

          const lines = group.map(line => {
            const preu = safeParseFloat(line.preu_unitari);
            const unitats = safeParseFloat(line.unitats);
            const dte = safeParseFloat(line.dte);
            const total = (preu * unitats) * (1 - dte / 100);
            return {
              concepte: line.concepte,
              preu_unitari: preu,
              unitats: unitats,
              iva: safeParseFloat(line.iva),
              dte: dte,
              total: total,
            };
          });

          const baseImposable = lines.reduce((sum, line) => sum + line.total, 0);
          
          const ivaDesglose = lines.reduce((acc, line) => {
            const ivaType = line.iva;
            if (!acc[ivaType]) acc[ivaType] = { base: 0, quota: 0 };
            acc[ivaType].base += line.total;
            acc[ivaType].quota += line.total * (ivaType / 100);
            return acc;
          }, {} as Invoice['ivaDesglose']);

          const totalIva = Object.values(ivaDesglose).reduce((sum, iva) => sum + iva.quota, 0);
          const total = baseImposable + totalIva;

          return {
            num_factura: firstLine.num_factura,
            data: firstLine.data,
            fpagament: firstLine.fpagament,
            estat: firstLine.estat,
            clientData,
            shipmentStatus: shipment?.status || 'Sense informació',
            lines,
            baseImposable,
            ivaDesglose,
            total,
          };
        }).sort((a, b) => {
            try {
                const dateA = new Date(a.data.split('/').reverse().join('-')).getTime();
                const dateB = new Date(b.data.split('/').reverse().join('-')).getTime();
                return dateB - dateA;
            } catch (e) {
                return 0;
            }
        });

        setInvoices(processedInvoices);

      } catch (e) {
        console.error(e);
        setError('Ha ocorregut un error en carregar les dades. Intenta-ho de nou més tard.');
      } finally {
        setLoading(false);
      }
    }

    loadInvoices();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error && invoices.length === 0) {
    return (
       <div className="container mx-auto px-4 py-12 md:py-16">
         <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
       </div>
    );
  }

  if (selectedInvoice) {
    return (
      <div className="bg-gray-100 p-4 sm:p-8 print:bg-white print:p-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6 print:hidden">
            <Button variant="outline" onClick={() => setSelectedInvoice(null)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tornar al llistat
            </Button>
            <Button onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimir PDF
            </Button>
          </div>
          <div id="zona-factura" className="bg-white p-8 sm:p-12 rounded-lg shadow-lg print:shadow-none print:rounded-none">
            <header className="flex justify-between items-start pb-8 border-b-2 border-gray-100">
              <div>
                <Image src="/LOGO2_VALENTINA_PRIETO.png" alt="Sweet Queen Logo" width={80} height={80} className="mb-4" />
                <h2 className="text-xl font-bold text-gray-800">Sweet Queen</h2>
                <p className="text-sm text-gray-500">Carrer Alt de Sant Pere 17, Reus, 43201</p>
                <p className="text-sm text-gray-500">prietoerazovalentina8@gmail.com</p>
              </div>
              <div className="text-right">
                <h1 className="text-3xl font-bold text-primary">FACTURA</h1>
                <p className="text-gray-600">Nº: {selectedInvoice.num_factura}</p>
                <p className="text-gray-600">Data: {formatDate(selectedInvoice.data)}</p>
              </div>
            </header>
            
            <section className="grid grid-cols-2 gap-8 my-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Facturar a:</h3>
                <p className="font-bold text-gray-800">{selectedInvoice.clientData?.empresa || selectedInvoice.clientData?.nom}</p>
                <p className="text-gray-600">{selectedInvoice.clientData?.adreca}</p>
                <p className="text-gray-600">NIF: {selectedInvoice.clientData?.fiscalid}</p>
                <p className="text-gray-600">Tel: {selectedInvoice.clientData?.telefon}</p>
              </div>
              <div className="text-right">
                 <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Mètode de Pagament:</h3>
                 <p className="font-medium text-gray-700">{selectedInvoice.fpagament}</p>
              </div>
            </section>

            <section>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-1/2">Concepte</TableHead>
                    <TableHead className="text-right">Preu</TableHead>
                    <TableHead className="text-right">Unitats</TableHead>
                    <TableHead className="text-right">Desc. %</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedInvoice.lines.map((line, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{line.concepte}</TableCell>
                      <TableCell className="text-right">{formatCurrency(line.preu_unitari)}</TableCell>
                      <TableCell className="text-right">{line.unitats}</TableCell>
                      <TableCell className="text-right">{line.dte}%</TableCell>
                      <TableCell className="text-right">{formatCurrency(line.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </section>

            <section className="flex justify-end mt-8">
              <div className="w-full max-w-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Base Imposable:</span>
                  <span className="font-medium">{formatCurrency(selectedInvoice.baseImposable)}</span>
                </div>
                {Object.entries(selectedInvoice.ivaDesglose).map(([iva, { quota }]) => (
                  <div key={iva} className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">IVA ({iva}%):</span>
                    <span className="font-medium">{formatCurrency(quota)}</span>
                  </div>
                ))}
                <div className="flex justify-between py-3 bg-primary/10 px-4 mt-4 rounded-md">
                  <span className="text-lg font-bold text-primary">TOTAL:</span>
                  <span className="text-lg font-bold text-primary">{formatCurrency(selectedInvoice.total)}</span>
                </div>
              </div>
            </section>

            <footer className="mt-12 pt-8 border-t text-xs text-gray-500 text-center">
              <p>Gràcies per la seva confiança.</p>
              <p className="mt-2">Sweet Queen | NIF: Y1234567Z | Registre Mercantil de Tarragona, Tom XXX, Foli XX, Full T-XXXXX.</p>
              <p>De conformitat amb el que estableix la Llei Orgànica 15/1999 de Protecció de Dades de Caràcter Personal, l'informem que les seves dades han estat incorporades a un fitxer sota la nostra responsabilitat, amb la finalitat de gestionar aquesta transacció comercial.</p>
            </footer>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="mb-8">
        <h1 className="font-headline text-4xl md:text-5xl">Les meves Factures</h1>
        <p className="text-lg text-muted-foreground">Consulta i gestiona les teves factures.</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Historial de Factures</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Factura</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Estat Pagament</TableHead>
                <TableHead className="text-center">Estat Enviament</TableHead>
                <TableHead className="text-right">Accions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.num_factura}>
                  <TableCell className="font-medium">{invoice.num_factura}</TableCell>
                  <TableCell>{formatDate(invoice.data)}</TableCell>
                  <TableCell>{invoice.clientData?.empresa || invoice.clientData?.nom || invoice.clientData?.usuari}</TableCell>
                  <TableCell className="text-right">{formatCurrency(invoice.total)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={invoice.estat === 'Pagat' ? 'default' : 'secondary'} className={invoice.estat === 'Pagat' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                        {invoice.estat}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{invoice.shipmentStatus}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => setSelectedInvoice(invoice)}>
                      Veure
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}