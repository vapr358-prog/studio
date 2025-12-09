import { Mail, Phone, MapPin } from 'lucide-react';
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Ponte en contacto con Sweet Queen. Encuentra nuestra dirección, teléfono, email y visítanos.',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl">Ponte en Contacto</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Nos encantaría saber de ti. Visítanos, llámanos o envíanos un email.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Nuestra Información</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-lg">
            <div className="flex items-start gap-4">
              <MapPin className="h-6 w-6 mt-1 text-primary" />
              <div>
                <h3 className="font-bold">Dirección</h3>
                <p className="text-muted-foreground">Calle Ficticia 123, Ciudad Dulce, 08001</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="h-6 w-6 mt-1 text-primary" />
              <div>
                <h3 className="font-bold">Teléfono</h3>
                <p className="text-muted-foreground">(+34) 912 345 678</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="h-6 w-6 mt-1 text-primary" />
              <div>
                <h3 className="font-bold">Email</h3>
                <p className="text-muted-foreground">hola@sweetqueen.com</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="rounded-lg overflow-hidden shadow-lg aspect-w-16 aspect-h-9">
           <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.297059483808!2d-122.41941552372436!3d37.7749295121324!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808580795c6b4545%3A0x28a1c97a8e8e3963!2sSan%20Francisco%20City%20Hall!5e0!3m2!1sen!2sus!4v1700000000000"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación de Sweet Queen"
            className='min-h-[400px]'
          ></iframe>
        </div>
      </div>
    </div>
  );
}
