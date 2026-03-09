'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Cake } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

type CartItem = Cake & { quantity: number };

type CartContextType = {
  cart: CartItem[];
  addToCart: (cake: Cake) => void;
  removeFromCart: (cakeId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('sq-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error al cargar el carrito", e);
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('sq-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (cake: Cake) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === cake.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === cake.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...cake, quantity: 1 }];
    });

    toast({
      title: "Añadido al carrito",
      description: `${cake.name.es} se ha añadido correctamente.`,
    });
  };

  const removeFromCart = (cakeId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== cakeId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
