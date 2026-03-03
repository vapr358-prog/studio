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
    name: {
      es: 'Celebraciones Mágicas',
      ca: 'Celebracions Màgiques'
    },
    description: {
      es: 'Nuestra galería de momentos mágicos e inolvidables.',
      ca: 'La nostra galeria de moments màgics i inoblidables.'
    },
    price: 30.00,
    flavorProfile: ['Celebración', 'Felicidad', 'Magia'],
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
    name: {
      es: 'Tarta Personalizada',
      ca: 'Pastís Personalitzat'
    },
    description: {
      es: 'Diseñamos la tarta de tus sueños para cualquier ocasión especial.',
      ca: 'Dissenyem el pastís dels teus somnis per a qualsevol ocasió especial.'
    },
    price: 30.00,
    flavorProfile: ['Personalizado', 'Artesanal', 'Elegante'],
    image: getImage('tarta-personalizada'),
  },
  {
    id: 'tarta-tres-leches-fruta-fresca',
    name: {
      es: 'Tarta Tres Leches con fruta fresca',
      ca: 'Pastís Tres Llets amb fruita fresca'
    },
    description: {
      es: 'Nuestra especialidad: bizcocho húmedo bañado en tres leches.',
      ca: 'La nostra especialitat: bescuit humit banyat en tres llets.'
    },
    price: 30.00,
    flavorProfile: ['Tres Leches', 'Frutas', 'Vainilla'],
    image: getImage('tres-leches'),
  },
  {
    id: 'tarta-de-chocolate',
    name: {
      es: 'Tarta de Chocolate',
      ca: 'Pastís de Xocolata'
    },
    description: {
      es: 'Para los amantes del cacao. Bizcocho de chocolate intenso.',
      ca: 'Per als amants del cacau. Bescuit de xocolata intens.'
    },
    price: 30.00,
    flavorProfile: ['Chocolate', 'Ganache', 'Dulce'],
    image: getImage('chocolate-cake'),
  },
  {
    id: 'carrot-cake',
    name: {
      es: 'Carrot Cake',
      ca: 'Pastís de Pastanaga'
    },
    description: {
      es: 'Bizcocho de zanahoria súper jugoso con nueces.',
      ca: 'Bescuit de pastanaga súper sucós amb nous.'
    },
    price: 30.00,
    flavorProfile: ['Zanahoria', 'Nueces', 'Queso Crema'],
    image: getImage('carrot-cake'),
  },
  {
    id: 'tarta-vainilla',
    name: {
      es: 'Tarta Vainilla',
      ca: 'Pastís Vainilla'
    },
    description: {
      es: 'Un clásico que nunca falla. Bizcocho de vainilla suave.',
      ca: 'Un clàssic que mai falla. Bescuit de vainilla suau.'
    },
    price: 30.00,
    flavorProfile: ['Vainilla', 'Clásico', 'Artesanal'],
    image: getImage('vanilla-cake'),
  },
  {
    id: 'mini-tarta-personal',
    name: {
      es: 'Mini Tarta (PERSONAL)',
      ca: 'Mini Pastís (PERSONAL)'
    },
    description: {
      es: 'La opción ideal para un antojo personal.',
      ca: 'L\'opció ideal per a un desig personal.'
    },
    price: 30.00,
    flavorProfile: ['Personal', 'Individual', 'Detalle'],
    image: getImage('mini-tarta'),
  },
  {
    id: 'galletas-artesanales',
    name: {
      es: 'Galletas',
      ca: 'Galetes'
    },
    description: {
      es: 'Nuestras galletas artesanales hechas con cariño.',
      ca: 'Les nostres galetes artesanals fetes amb carinyo.'
    },
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
    id: 'ORD-004',
    clientName: 'Valentina Prieto',
    date: '2024-03-01',
    items: [{ name: 'Tarta Personalizada', quantity: 1 }],
    total: 30.00,
    status: 'En Proceso',
  },
];
