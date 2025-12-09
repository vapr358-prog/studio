import type { BlogPost } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) => {
  const image = PlaceHolderImages.find(p => p.id === id);
  if (!image) {
    return { id: 'fallback', url: 'https://placehold.co/800x400', hint: 'baking' };
  }
  return { id: image.id, url: image.imageUrl, hint: image.imageHint };
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'nuestra-historia-dulce',
    title: 'Nuestra Historia Dulce: El Comienzo de Sweet Queen',
    excerpt: 'Todo comenzó en una pequeña cocina, con la pasión de una abuela y sus recetas secretas. Descubre cómo nació Sweet Queen y nuestra misión de endulzar tus días.',
    date: '2024-05-10',
    author: 'La Fundadora',
    image: getImage('blog-history'),
    content: `
      <p>En el corazón de Sweet Queen late una historia de amor familiar que se remonta a generaciones. Todo comenzó en la cocina de mi abuela, un lugar mágico donde los aromas de vainilla y canela llenaban el aire y cada pastel contaba una historia.</p>
      <p>Desde niña, me fascinaba verla transformar ingredientes simples en obras de arte comestibles. Sus manos, expertas y cariñosas, amasaban, horneaban y decoraban con una dedicación que iba más allá de la simple repostería. Era una forma de expresar amor.</p>
      <p>Heredé su recetario, un tesoro lleno de anotaciones y secretos, y con él, el sueño de compartir esa misma alegría con el mundo. Así nació Sweet Queen, no solo como una pastelería, sino como un homenaje a esa tradición, a ese calor de hogar y a la creencia de que un buen pastel puede hacer cualquier momento especial.</p>
      <p>Hoy, cada pastel que sale de nuestro obrador lleva un trocito de esa historia. Utilizamos ingredientes de la más alta calidad, técnicas artesanales y, por supuesto, la receta secreta de la abuela: una generosa pizca de amor. Gracias por ser parte de nuestro dulce viaje.</p>
    `,
  },
  {
    slug: 'el-secreto-del-red-velvet-perfecto',
    title: 'El Secreto del Red Velvet Perfecto',
    excerpt: 'Desvelamos los secretos detrás de nuestro pastel más icónico. La textura, el color y el glaseado que lo hacen inolvidable.',
    date: '2024-06-02',
    author: 'Chef Pastelero',
    image: getImage('red-velvet'),
    content: `
      <p>El Red Velvet es más que un pastel; es una experiencia. Su color rojo intenso y su textura aterciopelada lo han convertido en una leyenda de la repostería. Pero, ¿cuál es el secreto para lograr la perfección?</p>
      <p>En Sweet Queen, creemos que todo reside en el equilibrio. A diferencia de muchos, no dependemos únicamente del colorante. Nuestro bizcocho logra su tonalidad característica gracias a una reacción química natural entre el cacao en polvo sin procesar, el vinagre y el suero de leche. Este método tradicional no solo le da un color más profundo y natural, sino que también contribuye a su inconfundible y suave sabor, con un ligero toque ácido que corta la dulzura.</p>
      <p>Y luego está el glaseado. No cualquier glaseado sirve. Nosotros preparamos un frosting de queso crema artesanal, batido hasta alcanzar la consistencia perfecta: lo suficientemente firme para mantenerse, pero increíblemente ligero y cremoso al paladar. No es demasiado dulce, permitiendo que el sabor del bizcocho brille con luz propia.</p>
      <p>La combinación de este bizcocho húmedo y ligeramente ácido con el suave y fresco glaseado de queso crema es lo que, para nosotros, define al Red Velvet perfecto. Es un baile de sabores y texturas que esperamos disfrutes en cada bocado.</p>
    `,
  }
];
