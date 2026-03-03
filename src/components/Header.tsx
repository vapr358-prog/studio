"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, User, Menu, X, LogIn, LogOut, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/context/LanguageContext';
import { Language } from '@/lib/translations';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { language, setLanguage, t } = useI18n();
  const router = useRouter();

  const baseNavLinks = [
    { href: '/', label: t('nav_home') },
    { href: '/cakes', label: t('nav_cakes') },
    { href: '/pedidos', label: t('nav_booking_mgmt') },
    { href: '/blog', label: t('nav_blog') },
    { href: '/book', label: t('nav_book') },
    { href: '/tracking', label: t('nav_tracking') },
    { href: '/contact', label: t('nav_contact') },
  ];

  useEffect(() => {
    const checkLoginStatus = () => {
      const user = localStorage.getItem('user');
      setIsLoggedIn(!!user);
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);
    window.addEventListener('local-storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('local-storage', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('local-storage'));
    router.push('/login');
    if (isOpen) setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <Image src="/LOGO2_VALENTINA_PRIETO.png" alt="Sweet Queen Logo" width={40} height={40} priority className="object-contain" />
          <span className="font-handwriting text-2xl text-primary whitespace-nowrap">Sweet Queen</span>
        </Link>
        
        <div className="flex flex-1 items-center justify-end">
          <nav className="hidden lg:flex gap-6 text-sm font-medium items-center mr-6">
            {baseNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-primary whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-2 mr-4 border-l pl-4">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <select 
                className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
              >
                <option value="es">Castellano</option>
                <option value="ca">Català</option>
              </select>
            </div>

            <div className="hidden lg:flex items-center gap-2">
              <Button variant="ghost" size="icon" aria-label="Carrito de compras">
                <ShoppingBag className="h-5 w-5" />
              </Button>

              {isLoggedIn ? (
                <>
                  <Separator orientation="vertical" className="h-6" />
                  <Button variant="ghost" size="icon" asChild aria-label="Cuenta de usuario">
                    <Link href="/account">
                      <User className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4"/>
                    {t('nav_logout')}
                  </Button>
                </>
              ) : (
                <>
                  <Separator orientation="vertical" className="h-6" />
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">
                      <LogIn className="mr-2 h-4 w-4"/>
                      {t('nav_login')}
                    </Link>
                  </Button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <div className="flex items-center gap-1 mr-2 bg-secondary/50 px-2 py-1 rounded-md">
                <Globe className="h-3 w-3 text-primary" />
                <select 
                  className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                >
                  <option value="es">ES</option>
                  <option value="ca">CA</option>
                </select>
              </div>

              {isLoggedIn ? (
                <Button variant="ghost" size="icon" asChild aria-label="Cuenta de usuario">
                  <Link href="/account">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <Button variant="ghost" size="icon" asChild aria-label="Acceder">
                  <Link href="/login">
                    <LogIn className="h-5 w-5" />
                  </Link>
                </Button>
              )}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Abrir menú</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <SheetTitle className="sr-only">Menú</SheetTitle>
                  <SheetDescription className="sr-only">Navegación principal del sitio.</SheetDescription>
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center border-b pb-4">
                        <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                            <Image src="/LOGO2_VALENTINA_PRIETO.png" alt="Sweet Queen Logo" width={32} height={32} />
                            <span className="font-handwriting text-2xl text-primary whitespace-nowrap">Sweet Queen</span>
                        </Link>
                        <SheetClose asChild>
                            <Button variant="ghost" size="icon">
                                <X className="h-6 w-6" />
                                <span className="sr-only">Cerrar menú</span>
                            </Button>
                        </SheetClose>
                    </div>
                    <nav className="flex flex-col gap-4 mt-8">
                      {baseNavLinks.map((link) => (
                        <SheetClose key={link.href} asChild>
                          <Link
                            href={link.href}
                            className="text-lg font-medium transition-colors hover:text-primary"
                          >
                            {link.label}
                          </Link>
                        </SheetClose>
                      ))}
                    </nav>
                    <div className="mt-auto border-t pt-4 flex flex-col gap-4">
                      {isLoggedIn ? (
                        <>
                          <div className="flex items-center justify-center gap-4">
                            <Button variant="ghost" size="icon" asChild aria-label="Carrito de compras">
                              <Link href="#" onClick={() => setIsOpen(false)}>
                                <ShoppingBag className="h-5 w-5" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon" asChild aria-label="Cuenta de usuario">
                              <Link href="/account" onClick={() => setIsOpen(false)}>
                                <User className="h-5 w-5" />
                              </Link>
                            </Button>
                          </div>
                          <SheetClose asChild>
                            <Button onClick={handleLogout} variant="ghost" className="w-full text-lg">
                                <LogOut className="mr-2 h-5 w-5" />
                                {t('nav_logout')}
                            </Button>
                          </SheetClose>
                        </>
                      ) : (
                        <SheetClose asChild>
                          <Link
                              href="/login"
                              className="flex items-center justify-center w-full text-lg font-medium transition-colors hover:text-primary"
                            >
                              <LogIn className="mr-2 h-5 w-5" />
                              {t('nav_login')}
                            </Link>
                        </SheetClose>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
