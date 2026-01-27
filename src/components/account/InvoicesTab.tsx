'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Printer } from 'lucide-react';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

// Types
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
  company: string;
  role: string;
}

type ProcessedDocument = {
  id: string;
  data: string;
  usuari: string;
  fpagament: string;
  num_factura?: string;
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

interface InvoicesTabProps {
  user: AppUser | null;
}

const SHELL_COMPANY_INFO = {
    name: 'Sweet Queen',
    fiscalId: 'B-12345678',
    address: 'Carrer Alt de Sant Pere 17, Reus, 43201',
    phone: '(+34) 664 477 944',
    email: 'prietoerazovalentina8@gmail.com'
}

const LEGAL_NOTICE = 'Inscrita en el Registre Mercantil de Tarragona, Tom 123, Foli 45, Full T-6789. En compliment de la LOPD, les seves dades seran incloses en un fitxer propietat de Sweet Queen amb la finalitat de gestionar la facturació. Pot exercir els seus drets a prietoerazovalentina8@gmail.com.';

export function InvoicesTab({ user }: InvoicesTabProps) {
  const [documents, setDocuments] = useState<ProcessedDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<ProcessedDocument | null>(null);

  const groupingKey = 'num_factura';
  const docName = 'Factura';
  const docNamePlural = 'Factures';

  useEffect(() => {
    const processDocuments = (docs: Document[], users: UserData[], authUser: AppUser | null) => {
        const userRole = (authUser?.role)?.toLowerCase();
        
        let visibleDocs: Document[];
        if (userRole === 'admin' || userRole === 'administrador' || userRole === 'treballador') {
            visibleDocs = docs;
        } else if (authUser) {
            visibleDocs = docs.filter(doc => doc.usuari === authUser.username);
        } else {
            visibleDocs = [];
        }

        const relevantDocs = visibleDocs.filter(doc => doc[groupingKey]);

        const groupedByKey = relevantDocs.reduce((acc, doc) => {
          const key = doc[groupingKey];
          if (key) {
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push(doc);
          }
          return acc;
        }, {} as Record<string, Document[]>);

        const processedDocs: ProcessedDocument[] = Object.values(groupedByKey).map(docs => {
          const firstDoc = docs[0];
          const clientData = users.find(u => u.usuari === firstDoc.usuari);

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
            id: firstDoc[groupingKey]!,
            data: firstDoc.data,
            usuari: firstDoc.usuari,
            fpagament: firstDoc.fpagament,
            num_factura: firstDoc.num_factura,
            albara: firstDoc.albara,
            estat: firstDoc.estat,
            clientData: clientData || { usuari: firstDoc.usuari, nom: firstDoc.usuari, rol: 'client' },
            items,
            baseImposable,
            ivaBreakdown,
            total,
          };
        }).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

        setDocuments(processedDocs);
    }
    
    const fetchAndProcessData = async () => {
      if (!user) {
        setIsLoading(false);
        setError("Carregant dades d'usuari...");
        return;
      }
      setIsLoading(true);
      setError(null);
      
      try {
        const [docsRes, usersRes] = await Promise.all([
          fetch('https://sheetdb.io/api/v1/tvh7feay2rpct?sheet=documents'),
          fetch('https://sheetdb.io/api/v1/tvh7feay2rpct?sheet=usuaris'),
        ]);

        if (!docsRes.ok || !usersRes.ok) {
          throw new Error('Error en la connexió amb la base de dades.');
        }

        const allDocs: Document[] = await docsRes.json();
        if (allDocs.length === 0) {
          throw new Error("No s'han trobat dades a la fulla de càlcul 'documents'.");
        }
        
        const allUsers: UserData[] = await usersRes.json();
        processDocuments(allDocs, allUsers, user);

      } catch (e: any) {
        setError("Error de connexió o no s'han trobat dades. Mostrant dades d'exemple.");
        const mockDocs: Document[] = [
          { num_factura: 'FRA-001', data: '2026-01-22', usuari: 'angel', fpagament: 'Efectiu', concepte: 'Tarta red velvet', preu_unitari: '45', unitats: '1', iva: '21', dte: '0', albara: 'ALB-001', estat: 'Pagada' },
          { num_factura: 'FRA-002', data: '2026-01-23', usuari: 'nicol', fpagament: 'Efectiu', concepte: 'Tarta tres leches', preu_unitari: '50', unitats: '1', iva: '21', dte: '0', albara: 'ALB-002', estat: 'Pendent' },
        ];
        const mockUsers: UserData[] = [
            { usuari: 'angel', rol: 'client', nom: 'angel', empresa: 'Angel Inc.', fiscalid: 'A12345678', adreca: 'Carrer Fals 123', telefon: '600111222' },
            { usuari: 'nicol', rol: 'client', nom: 'nicol', empresa: 'Nicol Co.', fiscalid: 'B87654321', adreca: 'Avinguda Veritat 321', telefon: '600333444' },
            { usuari: 'admin', rol: 'admin', nom: 'admin', empresa: 'Sweet Queen' },
        ];
        processDocuments(mockDocs, mockUsers, user);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndProcessData();
  }, [user]);
  
  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
        <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
        </div>
    );
  }

  if (selectedDocument) {
    const { id, data, clientData, items, baseImposable, ivaBreakdown, total, fpagament, estat, albara } = selectedDocument;
    return (
      <div className="bg-background">
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8 print:hidden">
                <Button variant="ghost" onClick={() => setSelectedDocument(null)}>
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
                        <h1 className="font-headline text-4xl text-primary mb-2">{docName}</h1>
                        <div className="space-y-1">
                            <p><span className="font-bold">Nº {docName}:</span> {id}</p>
                            {albara && <p><span className="font-bold">Albarà associat:</span> {albara}</p>}
                            <p><span className="font-bold">Data:</span> {new Date(data).toLocaleDateString('ca-ES')}</p>
                            {estat && (
                                <Badge className={cn('print:hidden', {
                                    'bg-green-100 text-green-800': estat.toLowerCase() === 'pagada',
                                    'bg-red-100 text-red-800': estat.toLowerCase() === 'pendent'
                                })}>{estat}</Badge>
                            )}
                        </div>
                    </div>
                </header>

                <section className="grid grid-cols-2 gap-8 py-8">
                     <div>
                        <h3 className="font-bold mb-2 text-muted-foreground">CLIENT:</h3>
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
    <div className="mt-6">
        {error && (
             <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {documents.length > 0 ? (
            <div className="space-y-4">
                {documents.map((doc, index) => (
                    <Card 
                        key={`${doc.id}-${index}`}
                        className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedDocument(doc)}
                    >
                        <CardContent className="flex items-center justify-between p-6">
                            <div className="flex items-center gap-4">
                                <Badge variant="secondary">{doc.id}</Badge>
                                <div>
                                    <p className="font-medium">{doc.clientData?.nom || doc.usuari}</p>
                                    <p className="text-sm text-muted-foreground">{new Date(doc.data).toLocaleDateString('ca-ES')}</p>
                                </div>
                            </div>
                            <div className="text-right">
                               <p className="font-bold text-lg">{doc.total.toFixed(2)} €</p>
                               {doc.estat && (
                                <Badge className={cn('mt-1', {
                                    'bg-green-100 text-green-800': doc.estat.toLowerCase() === 'pagada',
                                    'bg-red-100 text-red-800': doc.estat.toLowerCase() === 'pendent'
                                })}>{doc.estat}</Badge>
                               )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        ) : (
            <Card>
                <CardContent className="p-10 text-center">
                    <p>No s'han trobat {docNamePlural.toLowerCase()}.</p>
                </CardContent>
            </Card>
        )}
    </div>
  );
}
