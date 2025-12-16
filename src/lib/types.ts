export type Image = {
  id: string;
  url: string;
  hint: string;
};

export type Cake = {
  id: string;
  name: string;
  description: string;
  price: number;
  flavorProfile: string[];
  image: Image;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  image: Image;
  content: string;
};

export type Order = {
  id: string;
  clientName: string;
  date: string;
  items: {
    name: string;
    quantity: number;
  }[];
  total: number;
  status: 'Entregado' | 'En Proceso' | 'Cancelado';
};

export type User = {
  id: string;
  name: string;
  email: string;
};

export type Shipment = {
  tracking_code: string;
  client: string;
  origin: string;
  destination: string;
  eta: string;
  status: 'EN PREPARACION' | 'EN TRANSITO' | 'ENTREGADO';
};

export const allFlavors = [
  "Vainilla",
  "Chocolate",
  "Fresa",
  "Limón",
  "Red Velvet",
  "Zanahoria",
  "Coco",
  "Café",
  "Caramelo Salado",
  "Tres Leches",
];
