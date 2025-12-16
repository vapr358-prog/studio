import type { Cake, Order, User } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) => {
  const image = PlaceHolderImages.find(p => p.id === id);
  if (!image) {
    // Fallback or error handling
    return { id: 'fallback', url: 'https://placehold.co/400x300', hint: 'cake' };
  }
  return { id: image.id, url: image.imageUrl, hint: image.imageHint };
}

export const cakes: Cake[] = [
  {
    id: 'red-velvet-premium',
    name: 'Red Velvet Premium',
    description: 'Un clásico reinventado. Bizcocho de terciopelo rojo con un toque de cacao y un suave glaseado de queso crema artesanal. Perfecto para cualquier celebración.',
    price: 45.00,
    flavorProfile: ['Red Velvet', 'Vainilla', 'Queso Crema'],
    image: getImage('red-velvet'),
  },
  {
    id: 'tarta-tres-leches-con-fruta-fresca',
    name: 'Tarta Tres Leches con Fruta Fresca',
    description: 'Bizcocho esponjoso bañado en una mezcla de tres leches, cubierto con merengue italiano y fruta de temporada. Un postre húmedo y delicioso.',
    price: 40.00,
    flavorProfile: ['Tres Leches', 'Fresa', 'Vainilla'],
    image: getImage('tres-leches'),
  },
  {
    id: 'cheesecake-artesanal-premium',
    name: 'Cheesecake Artesanal Premium',
    description: 'Cremoso y rico, nuestro cheesecake se hornea a la perfección sobre una base de galleta de mantequilla. Coronado con una capa de mermelada de frutos rojos casera.',
    price: 50.00,
    flavorProfile: ['Queso Crema', 'Limón', 'Fresa'],
    image: getImage('cheesecake'),
  },
  {
    id: 'pastel-de-chocolate-intenso',
    name: 'Pastel de Chocolate Intenso',
    description: 'Para los amantes del chocolate. Capas de bizcocho de chocolate oscuro intercaladas con un rico fudge de chocolate y cubiertas con ganache de chocolate brillante.',
    price: 48.00,
    flavorProfile: ['Chocolate', 'Café'],
    image: getImage('chocolate-fudge'),
  },
  {
    id: 'tarta-de-zanahoria-y-nueces',
    name: 'Tarta de Zanahoria y Nueces',
    description: 'Un bizcocho húmedo y especiado con zanahoria fresca rallada, nueces tostadas y un glaseado de queso crema con un toque de canela.',
    price: 42.00,
    flavorProfile: ['Zanahoria', 'Vainilla', 'Nueces'],
    image: getImage('carrot-cake'),
  },
  {
    id: 'bizcocho-de-limon-y-amapola',
    name: 'Bizcocho de Limón y Amapola',
    description: 'Ligero y refrescante. Un bizcocho de limón brillante con semillas de amapola y un glaseado de limón que te hará soñar.',
    price: 35.00,
    flavorProfile: ['Limón', 'Vainilla'],
    image: getImage('lemon-drizzle'),
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
    items: [{ name: 'Red Velvet Premium', quantity: 1 }],
    total: 45.00,
    status: 'Entregado',
  },
  {
    id: 'ORD-002',
    clientName: 'Juan Rodriguez',
    date: '2023-11-20',
    items: [{ name: 'Pastel de Chocolate Intenso', quantity: 1 }],
    total: 48.00,
    status: 'Entregado',
  },
  {
    id: 'ORD-003',
    clientName: 'Ana Pérez',
    date: '2024-01-05',
    items: [
      { name: 'Tarta de Zanahoria y Nueces', quantity: 1 },
      { name: 'Bizcocho de Limón y Amapola', quantity: 1 },
    ],
    total: 77.00,
    status: 'Entregado',
  },
  {
    id: 'ORD-004',
    clientName: 'Valentina Prieto',
    date: '2024-03-01',
    items: [{ name: 'Tarta Tres Leches con Fruta Fresca', quantity: 1 }],
    total: 40.00,
    status: 'En Proceso',
  },
];
