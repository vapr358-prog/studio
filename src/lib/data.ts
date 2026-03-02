
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
    id: 'tarta-personalizada',
    name: 'Tarta Personalizada',
    description: 'Diseñamos la tarta de tus sueños para cualquier ocasión especial. Cuéntanos tu idea y la haremos realidad con un diseño único.',
    price: 60.00,
    flavorProfile: ['Personalizado', 'Artesanal', 'Elegante'],
    image: getImage('tarta-personalizada'),
  },
  {
    id: 'tarta-tres-leches-fruta-fresca',
    name: 'Tarta Tres Leches con fruta fresca',
    description: 'Nuestra especialidad: bizcocho húmedo bañado en una mezcla de tres leches y decorado con las mejores frutas de temporada.',
    price: 40.00,
    flavorProfile: ['Tres Leches', 'Frutas', 'Vainilla'],
    image: getImage('tres-leches'),
  },
  {
    id: 'tarta-de-chocolate',
    name: 'Tarta de Chocolate',
    description: 'Para los amantes del cacao. Un bizcocho de chocolate intenso relleno y cubierto con una suave ganache de chocolate.',
    price: 45.00,
    flavorProfile: ['Chocolate', 'Ganache', 'Dulce'],
    image: getImage('chocolate-cake'),
  },
  {
    id: 'carrot-cake',
    name: 'Carrot Cake',
    description: 'El equilibrio perfecto. Bizcocho de zanahoria súper jugoso con nueces crujientes y un delicioso frosting de queso crema.',
    price: 42.00,
    flavorProfile: ['Zanahoria', 'Nueces', 'Queso Crema'],
    image: getImage('carrot-cake'),
  },
  {
    id: 'tarta-vainilla',
    name: 'Tarta Vainilla',
    description: 'Un clásico que nunca falla. Bizcocho de vainilla suave, esponjoso y con un aroma irresistible, hecho de forma tradicional.',
    price: 35.00,
    flavorProfile: ['Vainilla', 'Clásico', 'Artesanal'],
    image: getImage('vanilla-cake'),
  },
  {
    id: 'tarta-sabor-personalizado',
    name: 'Tarta Sabor Personalizado',
    description: '¿Tienes un sabor favorito en mente? Nosotros lo preparamos para ti. Elige tu combinación preferida y disfruta de algo único.',
    price: 55.00,
    flavorProfile: ['Personalizado', 'Creativo', 'Especial'],
    image: getImage('custom-flavor'),
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
    total: 35.00,
    status: 'Entregado',
  },
  {
    id: 'ORD-002',
    clientName: 'Juan Rodriguez',
    date: '2023-11-20',
    items: [{ name: 'Tarta de Chocolate', quantity: 1 }],
    total: 45.00,
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
    total: 82.00,
    status: 'Entregado',
  },
  {
    id: 'ORD-004',
    clientName: 'Valentina Prieto',
    date: '2024-03-01',
    items: [{ name: 'Tarta Personalizada', quantity: 1 }],
    total: 60.00,
    status: 'En Proceso',
  },
];
