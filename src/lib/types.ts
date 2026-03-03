export type Image = {
  id: string;
  url: string;
  hint: string;
};

export type LocalizedString = {
  es: string;
  ca: string;
};

export type Cake = {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  price: number;
  flavorProfile: string[]; // Estos suelen ser etiquetas técnicas, pero se podrían localizar si se prefiere
  image: Image;
  gallery?: Image[];
};

export type BlogPost = {
  slug: string;
  title: LocalizedString;
  excerpt: LocalizedString;
  date: string;
  author: string;
  image: Image;
  content: LocalizedString;
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
