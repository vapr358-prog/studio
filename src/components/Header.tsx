
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, User, Menu, X, LogIn, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/cakes', label: 'Nuestros Pasteles' },
  { href: '/blog', label: 'Blog' },
  { href: '/book', label: 'Reservar' },
  { href: '/tracking', label: 'Seguimiento' },
  { href: '/assistent', label: 'Asistente' },
  { href: '/contact', label: 'Contacto' },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/LOGO2_VALENTINA_PRIETO.png" alt="Sweet Queen Logo" width={40} height={40} />
          <span className="font-headline text-2xl font-bold text-primary whitespace-nowrap">Sweet Queen</span>
        </Link>
        
        <div className="flex items-center gap-2 md:gap-4">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium transition-colors hover:text-primary">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <Separator orientation="vertical" className="h-6 mx-2" />
              <Button variant="ghost" size="icon" aria-label="Carrito de compras">
                <ShoppingBag className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" asChild aria-label="Cuenta de usuario">
                <Link href="/account">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4"/>
                  Acceder
                </Link>
              </Button>
            </div>

            {/* Mobile Navigation */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center border-b pb-4">
                      <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                          <Image src="/LOGO2_VALENTINA_PRIETO.png" alt="Sweet Queen Logo" width={32} height={32} />
                          <span className="font-headline text-xl font-bold text-primary">Sweet Queen</span>
                      </Link>
                      <SheetClose asChild>
                           <Button variant="ghost" size="icon">
                              <X className="h-6 w-6" />
                              <span className="sr-only">Cerrar menú</span>
                          </Button>
                      </SheetClose>
                  </div>
                  <nav className="flex flex-col gap-4 mt-8">
                    {navLinks.map((link) => (
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
                      <SheetClose asChild>
                        <Link
                            href="/login"
                            className="flex items-center justify-center w-full text-lg font-medium transition-colors hover:text-primary"
                          >
                            <LogIn className="mr-2 h-5 w-5" />
                            Acceder
                          </Link>
                      </SheetClose>
                      <div className="flex items-center justify-center gap-2">
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
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
