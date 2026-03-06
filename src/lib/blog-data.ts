
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
    title: {
      es: 'SWEET QUEEN – Donde los Sueños se Vuelven Pasteles',
      ca: 'SWEET QUEEN – On els Somnis es Tornen Pastissos'
    },
    excerpt: {
      es: 'En SWEET QUEEN convertimos momentos especiales en sabores inolvidables desde Reus.',
      ca: 'A SWEET QUEEN convertim moments especials en sabors inoblidables des de Reus.'
    },
    date: '2022-07-07',
    author: 'Sweet Queen',
    image: getImage('brand-post'),
    content: {
      es: `
        <p>En <strong>SWEET QUEEN</strong> convertimos momentos especiales en sabores inolvidables. Desde Reus, Tarragona (España) elaboramos pasteles artesanales llenos de creatividad.</p>
        <h2 class="font-headline text-3xl mt-8 mb-4">💖 ¿Por Qué Elegir SWEET QUEEN?</h2>
        <p>Cada pastel es una creación única, diseñada con amor y con un toque especial que nos diferencia.</p>
      `,
      ca: `
        <p>A <strong>SWEET QUEEN</strong> convertim moments especials en sabors inoblidables. Des de Reus, Tarragona (Espanya) elaborem pastissos artesanals plens de creativitat.</p>
        <h2 class="font-headline text-3xl mt-8 mb-4">💖 Per Què Triar SWEET QUEEN?</h2>
        <p>Cada pastís és una creació única, dissenyada amb amor i amb un toc especial que ens diferencia.</p>
      `
    }
  },
  {
    slug: 'el-secreto-del-red-velvet-perfecto',
    title: {
      es: 'El Secreto del Red Velvet Perfecto',
      ca: 'El Secret del Red Velvet Perfecte'
    },
    excerpt: {
      es: 'Desvelamos los secretos detrás de nuestro pastel más icónico.',
      ca: 'Desvetllem els secrets darrere del nostre pastís més icònic.'
    },
    date: '2023-03-20',
    author: 'Chef Pastelero',
    image: getImage('red-velvet'),
    content: {
      es: `<p>El Red Velvet es más que un pastel; es una experiencia. Su color rojo intenso y su textura aterciopelada lo han convertido en una leyenda.</p>`,
      ca: `<p>El Red Velvet és més que un pastís; és una experiència. El seu color vermell intens i la seva textura vellutada l'han convertit en una llegenda.</p>`
    },
  }
];
