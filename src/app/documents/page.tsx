'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Printer } from 'lucide-react';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// Types based on user description
type Document = {
  num_factura: string;
  data: string;
  usuari: string;
  fpagament: string;
  concepte: string;
  preu_unitari: string;
  unitats: string;
  iva: string;
  dte: string;
  albara?: string;
};

type User = {
  usuari: string;
  rol: string;
  empresa?: string;
  fiscalid?: string;
  adreca?: string;
  telefon?: string;
  nom?: string; // from localStorage
};

type Invoice = {
  num_factura: string;
  data: string;
  usuari: string;
  fpagament: string;
  albara?: string;
  clientData?: User;
  items: {
    concepte: string;
    preu_unitari: number;
    unitats: number;
    iva: number;
    dte: number;
    net: number;
  }[];
  baseImposable: number;
  ivaBreakdown: {
    rate: number;
    base: number;
    quota: number;
  }[];
  total: number;
};

const SHELL_COMPANY_INFO = {
    name: 'Sweet Queen',
    fiscalId: 'B-12345678',
    address: 'Carrer Alt de Sant Pere 17, Reus, 43201',
    phone: '(+34) 664 477 944',
    email: 'prietoerazovalentina8@gmail.com'
}

const LEGAL_NOTICE = 'Inscrita en el Registre Mercantil de Tarragona, Tom 123, Foli 45, Full T-6789. En compliment de la LOPD, les seves dades seran incloses en un fitxer propietat de Sweet Queen amb la finalitat de gestionar la facturació. Pot exercir els seus drets a prietoerazovalentina8@gmail.com.';

export default function DocumentsPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    const fetchAndProcessData = async () => {
      setIsLoading(true);
      setError(null);
      
      let userFromStorage: User | null = null;
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            userFromStorage = {
                usuari: parsed.name,
                nom: parsed.name,
                rol: parsed.role,
                empresa: parsed.company
            };
        }
        setCurrentUser(userFromStorage);
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        setError("No s'ha pogut verificar la sessió d'usuari.");
        setIsLoading(false);
        return;
      }

      if (!userFromStorage) {
        setError("Necessites iniciar sessió per veure les teves factures.");
        setIsLoading(false);
        return;
      }

      try {
        const [docsRes, usersRes] = await Promise.all([
          fetch('https://sheetdb.io/api/v1/tvh7feay2rpct?sheet=documents'),
          fetch('https://sheetdb.io/api/v1/tvh7feay2rpct?sheet=usuaris'),
        ]);

        if (!docsRes.ok || !usersRes.ok) {
          throw new Error('Error en la connexió amb la base de dades.');
        }

        const allDocs: Document[] = await docsRes.json();
        const allUsers: User[] = await usersRes.json();
        
        const userDetails = allUsers.find(u => u.usuari === userFromStorage!.nom) || userFromStorage;
        const userRole = userDetails.rol?.toLowerCase();
        
        let visibleDocs: Document[];
        if (userRole === 'admin' || userRole === 'administrador' || userRole === 'treballador') {
            visibleDocs = allDocs;
        } else {
            visibleDocs = allDocs.filter(doc => doc.usuari === userFromStorage!.nom);
        }

        const groupedByNumFactura = visibleDocs.reduce((acc, doc) => {
          const key = doc.num_factura;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(doc);
          return acc;
        }, {} as Record<string, Document[]>);

        const processedInvoices: Invoice[] = Object.values(groupedByNumFactura).map(docs => {
          const firstDoc = docs[0];
          const clientData = allUsers.find(u => u.usuari === firstDoc.usuari);

          let baseImposable = 0;
          const ivaMap: Record<string, { base: number; quota: number }> = {};

          const items = docs.map(d => {
            const preu_unitari = parseFloat(d.preu_unitari) || 0;
            const unitats = parseFloat(d.unitats) || 0;
            const dte = parseFloat(d.dte) || 0;
            const iva = parseFloat(d.iva) || 0;

            const net = (preu_unitari * unitats) * (1 - dte / 100);
            baseImposable += net;
            
            if (!ivaMap[iva]) {
                ivaMap[iva] = { base: 0, quota: 0 };
            }
            ivaMap[iva].base += net;
            ivaMap[iva].quota += net * (iva / 100);
            
            return { concepte: d.concepte, preu_unitari, unitats, iva, dte, net };
          });

          const ivaBreakdown = Object.entries(ivaMap).map(([rate, values]) => ({
            rate: parseFloat(rate),
            ...values
          }));
          
          const totalIva = ivaBreakdown.reduce((sum, item) => sum + item.quota, 0);
          const total = baseImposable + totalIva;

          return {
            num_factura: firstDoc.num_factura,
            data: firstDoc.data,
            usuari: firstDoc.usuari,
            fpagament: firstDoc.fpagament,
            albara: firstDoc.albara,
            clientData,
            items,
            baseImposable,
            ivaBreakdown,
            total,
          };
        }).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

        setInvoices(processedInvoices);
      } catch (e: any) {
        setError(e.message || 'Ha ocorregut un error inesperat.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndProcessData();
  }, []);
  
  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-16">
        <h1 className="font-headline text-4xl md:text-5xl mb-8">Les Meves Factures</h1>
        <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }
  
  if (error) {
      return (
          <div className="container mx-auto px-4 py-12 md:py-16">
            <h1 className="font-headline text-4xl md:text-5xl mb-8">Error</h1>
            <Card>
                <CardContent className="p-6">
                    <p className="text-destructive">{error}</p>
                </CardContent>
            </Card>
          </div>
      )
  }

  if (selectedInvoice) {
    const { num_factura, data, clientData, items, baseImposable, ivaBreakdown, total, fpagament } = selectedInvoice;
    return (
      <div className="container mx-auto px-4 py-12 md:py-16 bg-background">
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8 print:hidden">
                <Button variant="ghost" onClick={() => setSelectedInvoice(null)}>
                    <ArrowLeft className="mr-2"/>
                    Tornar al llistat
                </Button>
                <Button onClick={handlePrint}>
                    <Printer className="mr-2"/>
                    Imprimir PDF
                </Button>
            </div>

            <Card id="zona-factura" className="p-8 shadow-lg bg-white text-black">
                <header className="grid grid-cols-2 gap-8 items-start pb-8 border-b">
                    <div>
                         <Image src="/LOGO2_VALENTINA_PRIETO.png" alt="Sweet Queen Logo" width={60} height={60} className="mb-4"/>
                         <h2 className="font-bold text-lg">{SHELL_COMPANY_INFO.name}</h2>
                         <p className="text-sm">{SHELL_COMPANY_INFO.address}</p>
                         <p className="text-sm">NIF: {SHELL_COMPANY_INFO.fiscalId}</p>
                         <p className="text-sm">{SHELL_COMPANY_INFO.phone} | {SHELL_COMPANY_INFO.email}</p>
                    </div>
                    <div className="text-right">
                        <h1 className="font-headline text-4xl text-primary mb-2">Factura</h1>
                        <p><span className="font-bold">Nº Factura:</span> {num_factura}</p>
                        <p><span className="font-bold">Data:</span> {new Date(data).toLocaleDateString('ca-ES')}</p>
                    </div>
                </header>

                <section className="grid grid-cols-2 gap-8 py-8">
                     <div>
                        <h3 className="font-bold mb-2 text-muted-foreground">FACTURAT A:</h3>
                        <p className="font-bold">{clientData?.empresa || clientData?.nom}</p>
                        <p>{clientData?.fiscalid}</p>
                        <p>{clientData?.adreca}</p>
                        <p>{clientData?.telefon}</p>
                    </div>
                </section>

                <section>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted">
                                <TableHead className="w-1/2">Concepte</TableHead>
                                <TableHead className="text-right">P. Unitari</TableHead>
                                <TableHead className="text-right">Unitats</TableHead>
                                <TableHead className="text-right">Dte. %</TableHead>
                                <TableHead className="text-right">IVA %</TableHead>
                                <TableHead className="text-right">Total Net</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.concepte}</TableCell>
                                    <TableCell className="text-right">{item.preu_unitari.toFixed(2)} €</TableCell>
                                    <TableCell className="text-right">{item.unitats}</TableCell>
                                    <TableCell className="text-right">{item.dte.toFixed(2)} %</TableCell>
                                    <TableCell className="text-right">{item.iva.toFixed(0)} %</TableCell>
                                    <TableCell className="text-right font-medium">{item.net.toFixed(2)} €</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </section>

                <section className="flex justify-end mt-8">
                    <div className="w-full md:w-1/2 lg:w-2/5 space-y-4">
                        <div className="flex justify-between">
                            <span>Base Imposable</span>
                            <span>{baseImposable.toFixed(2)} €</span>
                        </div>
                        <Separator />
                        {ivaBreakdown.map(iva => (
                            <div key={iva.rate} className="flex justify-between">
                                <span>Quota IVA ({iva.rate}%) s/ {iva.base.toFixed(2)}€</span>
                                <span>{iva.quota.toFixed(2)} €</span>
                            </div>
                        ))}
                        <Separator className="bg-primary h-0.5"/>
                         <div className="flex justify-between font-bold text-lg">
                            <span>TOTAL</span>
                            <span>{total.toFixed(2)} €</span>
                        </div>
                    </div>
                </section>
                
                <section className="border-t pt-8 mt-8">
                    <h3 className="font-bold mb-2">Forma de Pagament:</h3>
                    <p>{fpagament}</p>
                </section>

                <footer className="text-xs text-muted-foreground mt-12 pt-4 border-t">
                    <p>{LEGAL_NOTICE}</p>
                </footer>
            </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
        <h1 className="font-headline text-4xl md:text-5xl mb-8">Les Meves Factures</h1>
        {invoices.length > 0 ? (
            <div className="space-y-4">
                {invoices.map(invoice => (
                    <Card 
                        key={invoice.num_factura} 
                        className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedInvoice(invoice)}
                    >
                        <CardContent className="flex items-center justify-between p-6">
                            <div className="flex items-center gap-4">
                                <Badge variant="secondary">{invoice.num_factura}</Badge>
                                <div>
                                    <p className="font-medium">{invoice.usuari}</p>
                                    <p className="text-sm text-muted-foreground">{new Date(invoice.data).toLocaleDateString('ca-ES')}</p>
                                </div>
                            </div>
                            <div className="text-right">
                               <p className="font-bold text-lg">{invoice.total.toFixed(2)} €</p>
                               <p className="text-sm text-muted-foreground">{invoice.items.length} concepte(s)</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        ) : (
            <Card>
                <CardContent className="p-10 text-center">
                    <p>No s'han trobat factures.</p>
                </CardContent>
            </Card>
        )}
    </div>
  );
}

    