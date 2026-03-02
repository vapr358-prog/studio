import type { Cake, Order, User } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) => {
  const image = PlaceHolderImages.find(p => p.id === id);
  if (!image) {
    return { id: 'fallback', url: 'https://placehold.co/400x300', hint: 'cake' };
  }
  return { id: image.id, url: image.imageUrl, hint: image.imageHint };
}

export const cakes: Cake[] = [
  {
    id: 'tarta-cumpleanos-especial',
    name: 'Tarta de Cumpleaños Especial',
    description: 'La tarta perfecta para celebrar un año más. Decoración festiva, colores alegres y el sabor que tú elijas. ¡Hacemos que tu día sea inolvidable!',
    price: 30.00,
    flavorProfile: ['Cumpleaños', 'Festiva', 'Personalizada'],
    image: getImage('birthday-cake-1'),
    gallery: [
      getImage('birthday-cake-1'),
      getImage('birthday-cake-2'),
      getImage('birthday-cake-3'),
      getImage('birthday-cake-4'),
    ]
  },
  {
    id: 'tarta-personalizada',
    name: 'Tarta Personalizada',
    description: 'Diseñamos la tarta de tus sueños para cualquier ocasión especial. Cuéntanos tu idea y la haremos realidad con un diseño único.',
    price: 30.00,
    flavorProfile: ['Personalizado', 'Artesanal', 'Elegante'],
    image: getImage('tarta-personalizada'),
  },
  {
    id: 'tarta-tres-leches-fruta-fresca',
    name: 'Tarta Tres Leches con fruta fresca',
    description: 'Nuestra especialidad: bizcocho húmedo bañado en una mezcla de tres leches y decorado con las mejores frutas de temporada.',
    price: 30.00,
    flavorProfile: ['Tres Leches', 'Frutas', 'Vainilla'],
    image: getImage('tres-leches'),
  },
  {
    id: 'tarta-de-chocolate',
    name: 'Tarta de Chocolate',
    description: 'Para los amantes del cacao. Un bizcocho de chocolate intenso relleno y cubierto con una suave ganache de chocolate.',
    price: 30.00,
    flavorProfile: ['Chocolate', 'Ganache', 'Dulce'],
    image: getImage('chocolate-cake'),
  },
  {
    id: 'carrot-cake',
    name: 'Carrot Cake',
    description: 'El equilibrio perfecto. Bizcocho de zanahoria súper jugoso con nueces crujientes y un delicioso frosting de queso crema.',
    price: 30.00,
    flavorProfile: ['Zanahoria', 'Nueces', 'Queso Crema'],
    image: getImage('carrot-cake'),
  },
  {
    id: 'tarta-vainilla',
    name: 'Tarta Vainilla',
    description: 'Un clásico que nunca falla. Bizcocho de vainilla suave, esponjoso y con un aroma irresistible, hecho de forma tradicional.',
    price: 30.00,
    flavorProfile: ['Vainilla', 'Clásico', 'Artesanal'],
    image: getImage('vanilla-cake'),
  },
  {
    id: 'mini-tarta-personal',
    name: 'Mini Tarta (PERSONAL)',
    description: 'La opción ideal para un antojo personal o un detalle especial. Pequeña en tamaño, pero gigante en sabor y dedicación.',
    price: 30.00,
    flavorProfile: ['Personal', 'Individual', 'Detalle'],
    image: getImage('mini-tarta'),
  },
  {
    id: 'tarta-sabor-personalizado',
    name: 'Tarta Sabor Personalizado',
    description: '¿Tienes un sabor favorito en mente? Nosotros lo preparamos para ti. Elige tu combinación preferida y disfruta de algo único.',
    price: 30.00,
    flavorProfile: ['Personalizado', 'Creativo', 'Especial'],
    image: getImage('custom-flavor'),
  },
  {
    id: 'galletas-artesanales',
    name: 'Galletas',
    description: 'Nuestras galletas artesanales son el acompañamiento perfecto. Hechas con ingredientes de alta calidad y mucho cariño.',
    price: 2.50,
    flavorProfile: ['Dulce', 'Crujiente', 'Chocolate'],
    image: getImage('galletas'),
  }
];

export const mockUser: User = {
  id: 'user-123',
  name: 'Ana Pérez',
  email: 'ana.perez@example.com',
};

export const orders: Order[] = [
  {
    id: 'ORD-001',
    clientName: 'Ana Pérez',
    date: '2023-10-15',
    items: [{ name: 'Tarta Vainilla', quantity: 1 }],
    total: 30.00,
    status: 'Entregado',
  },
  {
    id: 'ORD-002',
    clientName: 'Juan Rodriguez',
    date: '2023-11-20',
    items: [{ name: 'Tarta de Chocolate', quantity: 1 }],
    total: 30.00,
    status: 'Entregado',
  },
  {
    id: 'ORD-003',
    clientName: 'Ana Pérez',
    date: '2024-01-05',
    items: [
      { name: 'Carrot Cake', quantity: 1 },
      { name: 'Tarta Tres Leches con fruta fresca', quantity: 1 },
    ],
    total: 60.00,
    status: 'Entregado',
  },
  {
    id: 'ORD-004',
    clientName: 'Valentina Prieto',
    date: '2024-03-01',
    items: [{ name: 'Tarta Personalizada', quantity: 1 }],
    total: 30.00,
    status: 'En Proceso',
  },
];