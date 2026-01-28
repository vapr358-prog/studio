'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Printer, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

// --- Types ---
type Document = {
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
  albara?: string;
  estat?: string;
};

type UserData = {
  usuari: string;
  rol: string;
  empresa?: string;
  fiscalid?: string;
  adreca?: string;
  telefon?: string;
  nom?: string;
};

type AppUser = {
  username: string;
  name: string;
  email?: string;
  company: string;
  role: string;
}

type ProcessedDocument = {
  id: string;
  data: string;
  usuari: string;
  fpagament: string;
  albara?: string;
  estat?: string;
  clientData?: UserData;
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

// --- Constants & Configuration ---
const API_URL_DOCUMENTS = 'https://sheetdb.io/api/v1/tvh7feay2rpct?sheet=documents';
const API_URL_USUARIS = 'https://sheetdb.io/api/v1/tvh7feay2rpct?sheet=usuaris';

const SHELL_COMPANY_INFO = {
    name: 'Sweet Queen',
    fiscalId: 'B-12345678',
    address: 'Carrer Alt de Sant Pere 17, Reus, 43201',
    phone: '(+34) 664 477 944',
    email: 'prietoerazovalentina8@gmail.com'
};

const LEGAL_NOTICE = 'Inscrita en el Registre Mercantil de Tarragona, Tom 123, Foli 45, Full T-6789. En compliment de la LOPD, les seves dades seran incloses en un fitxer propietat de Sweet Queen amb la finalitat de gestionar la facturació. Pot exercir els seus drets a prietoerazovalentina8@gmail.com.';

// Helper to parse numbers that may come with a comma
const parseFloatWithComma = (value: string): number => {
    if (typeof value !== 'string') return Number(value) || 0;
    return parseFloat(value.replace(',', '.')) || 0;
}

// Helper to parse dates in DD/MM/YYYY or DD/MM/YY format
const parseDMY = (dateString: string): Date => {
    if (!dateString) return new Date(0);
    
    const dmyRegex = /^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/;
    const match = dateString.match(dmyRegex);

    if (match) {
        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1;
        let year = parseInt(match[3], 10);
        if (year < 100) year += 2000;
        
        const newDate = new Date(Date.UTC(year, month, day)); // Use UTC to avoid timezone issues
        if (!isNaN(newDate.getTime())) return newDate;
    }
    
    // Fallback for other formats, assuming UTC
    const fallbackDate = new Date(dateString);
    return !isNaN(fallbackDate.getTime()) ? fallbackDate : new Date(0);
};


export default function DocumentsPage() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [invoices, setInvoices] = useState<ProcessedDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<ProcessedDocument | null>(null);
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser: AppUser = JSON.parse(storedUser);
        if (!parsedUser.email) {
            parsedUser.email = parsedUser.username;
        }
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        localStorage.removeItem('user');
        setError("Error en la sessió d'usuari. Si us plau, torna a iniciar sessió.");
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
        if (!isLoading) {
            setError("Has d'iniciar sessió per veure les teves factures.");
        }
        return;
    };

    const processDocuments = (docs: Document[], usersData: UserData[], idBuscado: string) => {
        const idBuscadoLower = idBuscado.toLowerCase().trim();

        const currentUserData = usersData.find(u => 
            (u.usuari || "").trim().toLowerCase() === idBuscadoLower
        );
        const userRole = (currentUserData?.rol || "client").trim().toLowerCase();
        
        let visibleDocs: Document[];
        
        if (userRole === 'admin' || userRole === 'administrador' || userRole === 'treballador') {
            visibleDocs = docs;
        } else {
            visibleDocs = docs.filter(doc => {
                const excelDocUser = (doc.usuari || "").trim().toLowerCase();
                return excelDocUser === idBuscadoLower;
            });
        }

        if (visibleDocs.length === 0) {
           setError(`No se han encontrado facturas. Buscando correspondencia para el ID: ${idBuscado}`);
           console.log(`DEBUG: No s'han trobat factures per a l'ID '${idBuscado}'. Dades rebudes de SheetDB:`, {docs, usersData});
           setInvoices([]);
           return;
        }

        const groupedByKey = visibleDocs.reduce((acc, doc) => {
          const key = (doc.num_factura || "").trim();
          if (!key) return acc;
          if (!acc[key]) acc[key] = [];
          acc[key].push(doc);
          return acc;
        }, {} as Record<string, Document[]>);

        const processedDocs: ProcessedDocument[] = Object.values(groupedByKey).map(docs => {
          const firstDoc = docs[0];
          
          const clientIdentifierInDoc = (firstDoc.usuari || "").trim().toLowerCase();
          const clientData = usersData.find(u => {
              const excelUser = (u.usuari || "").trim().toLowerCase();
              return excelUser === clientIdentifierInDoc;
          });

          let baseImposable = 0;
          const ivaMap: Record<string, { base: number; quota: number }> = {};

          const items = docs.map(d => {
            const preu_unitari = parseFloatWithComma(d.preu_unitari);
            const unitats = parseFloatWithComma(d.unitats);
            const dte = parseFloatWithComma(d.dte);
            const iva = parseFloatWithComma(d.iva);

            const net = (preu_unitari * unitats) * (1 - dte / 100);
            baseImposable += net;
            
            if (!ivaMap[iva]) ivaMap[iva] = { base: 0, quota: 0 };
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
            id: firstDoc.num_factura.trim(),
            data: firstDoc.data,
            usuari: firstDoc.usuari,
            fpagament: firstDoc.fpagament,
            albara: firstDoc.albara,
            estat: firstDoc.estat,
            clientData: clientData || { usuari: firstDoc.usuari, nom: firstDoc.usuari, rol: 'client' },
            items,
            baseImposable,
            ivaBreakdown,
            total,
          };
        }).sort((a, b) => parseDMY(b.data).getTime() - parseDMY(a.data).getTime());
        
        setInvoices(processedDocs);
    }
    
    const fetchAndProcessData = async () => {
      setIsLoading(true);
      setError(null);
      
      const idBuscado = (user.email || user.username || user.name || "").trim();
      if (!idBuscado) {
          setError("No es pot identificar l'usuari. Si us plau, revisa la teva sessió.");
          setIsLoading(false);
          return;
      }
      
      try {
        const [docsRes, usersRes] = await Promise.all([
          fetch(API_URL_DOCUMENTS),
          fetch(API_URL_USUARIS),
        ]);

        if (!docsRes.ok || !usersRes.ok) {
            throw new Error(`Error en la connexió amb la base de dades. Documents: ${docsRes.statusText}, Usuaris: ${usersRes.statusText}`);
        }

        const allDocs: Document[] = await docsRes.json();
        const allUsers: UserData[] = await usersRes.json();
        
        if (!Array.isArray(allDocs)) {
            throw new Error("No s'han trobat dades a la fulla 'documents' o el format és incorrecte.");
        }
        if (!Array.isArray(allUsers)) {
            throw new Error("No s'han trobat dades a la fulla 'usuaris' o el format és incorrecte.");
        }
        
        processDocuments(allDocs, allUsers, idBuscado);

      } catch (e: any) {
        console.error("Error fetching data:", e);
        setError(e.message || "Hi ha hagut un error en carregar les dades de facturació.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndProcessData();
  }, [user]);
  
  const handlePrint = () => window.print();

  const renderContent = () => {
    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
            </div>
        );
    }

    if (selectedInvoice) {
        const { id, data, clientData, items, baseImposable, ivaBreakdown, total, fpagament, estat, albara } = selectedInvoice;
        return (
          <div className="bg-background">
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
    
            <Card id="zona-factura" className="p-8 shadow-lg bg-white text-black max-w-[800px] mx-auto">
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
                        <div className="space-y-1">
                            <p><span className="font-bold">Nº Factura:</span> {id}</p>
                            {albara && <p><span className="font-bold">Albarà associat:</span> {albara}</p>}
                            <p><span className="font-bold">Data:</span> {parseDMY(data).toLocaleDateString('ca-ES')}</p>
                            {estat && (
                                <Badge className={cn('print-hidden', {
                                    'bg-green-100 text-green-800': estat.toLowerCase().includes('pagat'),
                                    'bg-orange-100 text-orange-800': estat.toLowerCase().includes('pendent'),
                                })}>{estat}</Badge>
                            )}
                        </div>
                    </div>
                </header>
    
                <section className="grid grid-cols-2 gap-8 py-8">
                     <div>
                        <h3 className="font-bold mb-2 text-muted-foreground">CLIENT:</h3>
                        <p className="font-bold">{clientData?.empresa || clientData?.nom || clientData?.usuari}</p>
                        {clientData?.fiscalid && <p>NIF/CIF: {clientData.fiscalid}</p>}
                        {clientData?.adreca && <p>{clientData.adreca}</p>}
                        {clientData?.telefon && <p>{clientData.telefon}</p>}
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
        );
      }
      
      // List View or Error/Empty state
      return (
        <>
            {error && (
                 <Alert variant="destructive" className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Avís</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {!error && invoices.length > 0 ? (
                 <Card>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nº Factura</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Estat</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {invoices.map((invoice) => (
                            <TableRow key={invoice.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedInvoice(invoice)}>
                              <TableCell className="font-medium">{invoice.id}</TableCell>
                              <TableCell>{parseDMY(invoice.data).toLocaleDateString('ca-ES')}</TableCell>
                              <TableCell>{invoice.clientData?.nom || invoice.usuari}</TableCell>
                              <TableCell>
                                {invoice.estat && (
                                  <Badge className={cn({
                                    'bg-green-100 text-green-800 border-green-200': invoice.estat.toLowerCase().includes('pagat'),
                                    'bg-orange-100 text-orange-800 border-orange-200': invoice.estat.toLowerCase().includes('pendent'),
                                  })} variant="outline">{invoice.estat}</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right font-bold">{invoice.total.toFixed(2)} €</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                 </Card>
            ) : (
                !isLoading && !error && (
                  <Card>
                      <CardContent className="p-10 text-center text-muted-foreground">
                          <p>No s'ha trobat cap factura.</p>
                      </CardContent>
                  </Card>
                )
            )}
        </>
      );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="mb-8 print:hidden">
            <h1 className="font-headline text-4xl md:text-5xl">Les teves factures</h1>
            <p className="text-lg text-muted-foreground">Consulta i gestiona les teves factures.</p>
        </div>
        {renderContent()}
    </div>
  )
}
