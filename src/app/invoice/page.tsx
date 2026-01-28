'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Printer } from 'lucide-react';

// Simulación de datos que vendrían de Firestore
const companyData = {
  name: 'Sweet Queen',
  nif: 'B12345678',
  address: 'Carrer Alt de Sant Pere 17, Reus, 43201',
  phone: '(+34) 664 477 944',
  email: 'prietoerazovalentina8@gmail.com',
};

const clientData = {
  name: 'Cliente de Ejemplo S.L.',
  nif: 'A87654321',
  address: 'Avenida de la Imaginación 42, 08001 Barcelona',
};

const invoiceData = {
  number: '2024-001',
  date: '2024-07-29',
  dueDate: '2024-08-28',
  items: [
    {
      description: 'Pastel de Boda Personalizado, 3 pisos, sabor Red Velvet',
      quantity: 1,
      unitPrice: 350.0,
    },
    {
      description: 'Docena de Cupcakes Temáticos',
      quantity: 5,
      unitPrice: 25.0,
    },
    {
      description: 'Servicio de entrega y montaje',
      quantity: 1,
      unitPrice: 50.0,
    },
  ],
  vatRate: 0.21, // 21% de IVA
};

const registroMercantil = {
  tomo: '1234',
  libro: '56',
  folio: '78',
  hoja: 'B-91011',
  inscripcion: '1ª',
};

export default function InvoicePage() {
  const subtotal = invoiceData.items.reduce(
    (acc, item) => acc + item.quantity * item.unitPrice,
    0
  );
  const vatAmount = subtotal * invoiceData.vatRate;
  const total = subtotal + vatAmount;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-muted/30 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="print-hidden mb-8 flex justify-end">
          <Button onClick={handlePrint}>
            <Printer className="mr-2" />
            Imprimir / Guardar PDF
          </Button>
        </div>

        <Card id="zona-factura" className="bg-white shadow-none print:shadow-none print:border-none">
          <CardHeader className="bg-pink-50/50 p-8 rounded-t-lg">
            <div className="grid grid-cols-2 gap-8 items-start">
              <div>
                <h1 className="font-headline text-4xl text-primary">{companyData.name}</h1>
                <p className="text-muted-foreground">{companyData.address}</p>
                <p className="text-muted-foreground">{companyData.phone}</p>
                <p className="text-muted-foreground">{companyData.email}</p>
                <p className="text-muted-foreground mt-1">NIF: {companyData.nif}</p>
              </div>
              <div className="text-right">
                <h2 className="text-3xl font-semibold text-foreground uppercase tracking-wider">Factura</h2>
                <p className="text-lg text-primary font-mono">{invoiceData.number}</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-sm text-muted-foreground font-bold">FACTURAR A:</p>
                <p className="font-semibold text-lg">{clientData.name}</p>
                <p>{clientData.address}</p>
                <p>NIF: {clientData.nif}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  <span className="font-bold">Fecha de la factura:</span> {invoiceData.date}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-bold">Fecha de vencimiento:</span> {invoiceData.dueDate}
                </p>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-1/2">Descripción</TableHead>
                  <TableHead className="text-right">Cant.</TableHead>
                  <TableHead className="text-right">Precio Unit.</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceData.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.description}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{item.unitPrice.toFixed(2)} €</TableCell>
                    <TableCell className="text-right">{(item.quantity * item.unitPrice).toFixed(2)} €</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Separator className="my-8" />

            <div className="flex justify-end">
              <div className="w-full max-w-sm space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Imponible:</span>
                  <span className="font-medium">{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IVA ({invoiceData.vatRate * 100}%):</span>
                  <span className="font-medium">{vatAmount.toFixed(2)} €</span>
                </div>
                <Separator />
                <div className="flex justify-between text-xl font-bold text-primary">
                  <span>TOTAL:</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-muted/30 p-8 rounded-b-lg text-xs text-muted-foreground">
             <div className="w-full">
              <h3 className="font-bold mb-2 text-foreground">Términos y Condiciones</h3>
              <p>El pago se debe realizar antes de la fecha de vencimiento. Agradecemos su confianza.</p>
              <Separator className="my-4" />
              <h3 className="font-bold mb-2 text-foreground">Información Legal</h3>
               <p>
                Inscrita en el Registro Mercantil de Tarragona, Tomo {registroMercantil.tomo}, 
                Libro {registroMercantil.libro}, Folio {registroMercantil.folio}, 
                Hoja {registroMercantil.hoja}, Inscripción {registroMercantil.inscripcion}.
              </p>
               <p className="mt-2">
                De conformidad con lo dispuesto en el RGPD, le informamos que sus datos personales
                han sido incorporados en un fichero bajo la responsabilidad de {companyData.name} con
                la finalidad de gestionar la relación comercial.
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
