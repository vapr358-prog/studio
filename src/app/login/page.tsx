'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogIn, ArrowLeft } from 'lucide-react';
import { SHEETDB_API_URL } from '@/lib/config';
import { useI18n } from '@/context/LanguageContext';

export default function LoginPage() {
  const { t } = useI18n();
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${SHEETDB_API_URL}/search?usuari=${encodeURIComponent(
          usuario
        )}&password=${encodeURIComponent(contrasena)}&sheet=usuaris`
      );

      if (!response.ok) {
        throw new Error('Error al conectar con el servidor.');
      }

      const data = await response.json();

      if (data.length > 0) {
        const user = data[0];
        // Guardar datos en localStorage
        localStorage.setItem(
          'user',
          JSON.stringify({ username: user.usuari, name: user.nom, company: user.empresa, role: user.rol })
        );
        // Dispatch event to update header in the same tab
        window.dispatchEvent(new Event('local-storage'));
        
        if (user.rol === 'admin' || user.rol === 'administrador') {
          router.push('/admin/orders');
        } else {
          router.push('/account');
        }

      } else {
        setError('Datos incorrectos. Por favor, inténtalo de nuevo.');
      }
    } catch (e: any) {
      setError(e.message || 'Ha ocurrido un error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex flex-col min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm mb-6 text-left">
        <Button variant="ghost" asChild className="text-primary hover:text-primary/80 p-0 hover:bg-transparent">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t('back_to_start')}
          </Link>
        </Button>
      </div>

      <Card className="w-full max-w-sm shadow-xl bg-white/90 backdrop-blur-sm">
        <form onSubmit={handleLogin}>
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl text-primary">{t('nav_login')}</CardTitle>
            <CardDescription>
              Introduce tus credenciales para continuar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="usuario">Usuario</Label>
              <Input
                id="usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                placeholder="Tu nombre de usuario"
                className="border-primary/20 focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contrasena">Contraseña</Label>
              <Input
                id="contrasena"
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
                placeholder="Tu contraseña"
                className="border-primary/20 focus-visible:ring-primary"
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
              <LogIn className="mr-2" />
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
