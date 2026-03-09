'use client';

import { useRouter } from 'next/navigation';
import { useI18n } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, UserPlus, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutGatewayPage() {
  const { t } = useI18n();
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]">
      <div className="w-full max-w-4xl mb-8">
        <Button variant="ghost" asChild className="text-muted-foreground hover:text-primary">
          <Link href="/cakes" className="flex items-center gap-2">
            <ArrowLeft size={18} />
            {t('back_to_shop')}
          </Link>
        </Button>
      </div>

      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl text-primary">{t('gateway_title')}</h1>
        <p className="text-lg text-muted-foreground mt-4">{t('gateway_sub')}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Opción Invitado */}
        <Card className="border-2 border-transparent hover:border-primary/20 transition-all shadow-xl bg-white/80 backdrop-blur-sm group">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-muted p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <ShoppingBag size={32} />
            </div>
            <CardTitle className="text-2xl">{t('gateway_guest')}</CardTitle>
            <CardDescription>{t('gateway_guest_sub')}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Button 
              className="w-full py-6 rounded-full text-lg font-bold" 
              variant="outline"
              onClick={() => router.push('/checkout')}
            >
              {t('gateway_guest')}
            </Button>
          </CardContent>
        </Card>

        {/* Opción Login/Registro */}
        <Card className="border-2 border-primary/20 shadow-xl bg-white/80 backdrop-blur-sm group relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-bl-xl"> Recomendado </div>
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
              <User size={32} />
            </div>
            <CardTitle className="text-2xl">{t('gateway_login')}</CardTitle>
            <CardDescription>{t('gateway_login_sub')}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Button 
              className="w-full py-6 rounded-full text-lg font-bold bg-primary hover:bg-primary/90"
              onClick={() => router.push('/login')}
            >
              {t('nav_login')} / {t('nav_account')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
