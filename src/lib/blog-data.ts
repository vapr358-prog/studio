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
    slug: 'donde-los-suenos-se-vuelven-pasteles',
    title: 'SWEET QUEEN – Donde los Sueños se Vuelven Pasteles',
    excerpt: 'En SWEET QUEEN convertimos momentos especiales en sabores inolvidables. Desde Reus, Tarragona (España) elaboramos pasteles artesanales llenos de creatividad, hechos especialmente para ti.',
    date: '2022-07-07',
    author: 'Sweet Queen',
    image: getImage('brand-post'),
    content: `
      <p>En <strong>SWEET QUEEN</strong> convertimos momentos especiales en sabores inolvidables. Desde Reus, Tarragona (España) elaboramos pasteles artesanales llenos de creatividad, hechos especialmente para novios, cumpleaños, matrimonios, familias y eventos infantiles.</p>
      <p>Cada pastel es una creación única, diseñada con amor y con un toque especial que nos diferencia. Nuestros productos más representativos son:</p>
      <ul>
        <li>🎉 Tartas Tres Leches con Frutas (las más vendidas)</li>
        <li>❤️ Pastel Red Velvet</li>
        <li>🐶 Pasteles seguros y especiales para mascotas</li>
        <li>🎨 Pasteles temáticos en fondant o crema</li>
        <li>🍰 Diseños personalizados con tu toque y nuestra creatividad</li>
      </ul>
      <p>En SWEET QUEEN no solo hacemos pasteles: <strong>Creamos recuerdos que se disfrutan con cada bocado.</strong></p>

      <h2 class="font-headline text-3xl mt-8 mb-4">💖 ¿Por Qué Elegir SWEET QUEEN Para Tu Evento Especial?</h2>
      <p>Cuando deseas un pastel para un momento importante, buscas algo más que un postre: quieres una experiencia dulce y única.</p>
      
      <h3 class="font-headline text-2xl mt-6 mb-2">✔ Creatividad que nos distingue</h3>
      <p>Cada diseño es completamente original. Puedes traer tu idea o dejar que creemos algo hecho solo para ti.</p>

      <h3 class="font-headline text-2xl mt-6 mb-2">✔ Especialistas en Tres Leches</h3>
      <p>Nuestra tarta Tres Leches con frutas combina lo mejor de la tradición colombiana con decoraciones modernas y frescas.</p>

      <h3 class="font-headline text-2xl mt-6 mb-2">✔ Pasteles para todos los gustos</h3>
      <ul>
        <li>Matrimonios</li>
        <li>Cumpleaños</li>
        <li>Bautizos</li>
        <li>Eventos infantiles</li>
        <li>Pasteles corporativos</li>
        <li>Pasteles para mascotas</li>
      </ul>

      <h3 class="font-headline text-2xl mt-6 mb-2">✔ Calidad en cada detalle</h3>
      <p>Trabajamos con ingredientes frescos y dedicación total. Tu pastel será tan bello como delicioso.</p>

      <h3 class="font-headline text-2xl mt-6 mb-2">✔ Atención personalizada</h3>
      <p>Escuchamos tu idea, entendemos tu evento y diseñamos algo perfecto para ti.</p>

      <h2 class="font-headline text-3xl mt-8 mb-4">🎉 Tendencias de Pasteles 2025 – Lo Más Pedido en SWEET QUEEN</h2>
      <p>Si estás planeando una celebración, estas son las tendencias que más enamoran este año:</p>
      <ol>
        <li><strong>Pasteles minimalistas para bodas:</strong> Acabados suaves, flores naturales y colores elegantes.</li>
        <li><strong>Pasteles infantiles con personajes:</strong> Diseños tiernos, coloridos y llenos de creatividad.</li>
        <li><strong>Tartas Tres Leches con frutas frescas:</strong> La estrella del año. Fresca, jugosa y perfecta para cualquier ocasión.</li>
        <li><strong>Pasteles para mascotas:</strong> Ingredientes seguros y decoraciones adorables.</li>
        <li><strong>Red Velvet estilo gourmet:</strong> Un clásico elegante y siempre solicitado.</li>
      </ol>

      <h2 class="font-headline text-3xl mt-8 mb-4">🎀 Consejos Para Elegir el Pastel Perfecto Para Tu Celebración</h2>
      <p>Escoger un pastel no es solo elegir un sabor; es encontrar el que encaje perfectamente en tu evento. Aquí te dejo algunos consejos:</p>
      <ol>
        <li><strong>Define una temática:</strong> Romántico, infantil, clásico, elegante, divertido o moderno.</li>
        <li><strong>Elige los sabores pensando en tus invitados:</strong> Los más pedidos son Tres Leches con frutas, Red Velvet, Chocolate, Vainilla y Frutos rojos.</li>
        <li><strong>Calcula el tamaño correcto:</strong> Yo te puedo asesorar según el número de invitados.</li>
        <li><strong>Inspírate:</strong> Puedes enviarme una foto o idea y la transformo en un diseño único.</li>
        <li><strong>Haz tu pedido con tiempo:</strong> Los pasteles personalizados requieren dedicación y detalle.</li>
      </ol>

      <h2 class="font-headline text-3xl mt-8 mb-4">🇨🇴✨ SWEET QUEEN: Tradición Colombiana con Estilo en España</h2>
      <p>SWEET QUEEN mezcla lo mejor de la tradición colombiana con la repostería creativa española. Nuestra famosa Tarta Tres Leches con frutas es un homenaje a nuestras raíces y un favorito entre nuestros clientes en Reus, Tarragona.</p>
      <p>Llenamos cada pastel de amor, sabor y una presentación impecable. Aquí cada celebración importa, y cada pastel cuenta una historia.</p>
      
      <h2 class="font-headline text-3xl mt-8 mb-4">🎉 Te invitamos a endulzar tus momentos especiales</h2>
      <p>En SWEET QUEEN queremos ser parte de tus recuerdos más importantes. Si tienes una idea, un color, un personaje o un estilo especial, ¡lo hacemos realidad!</p>
      <p>📍 Reus – Tarragona, España</p>
      <p>SWEET QUEEN – Artesanía dulce que enamora.</p>
    `
  },
  {
    slug: 'el-secreto-del-red-velvet-perfecto',
    title: 'El Secreto del Red Velvet Perfecto',
    excerpt: 'Desvelamos los secretos detrás de nuestro pastel más icónico. La textura, el color y el glaseado que lo hacen inolvidable.',
    date: '2023-03-20',
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
