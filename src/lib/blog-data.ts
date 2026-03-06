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
        <h2 class="text-3xl font-headline text-primary mb-6">¿Por qué elegir Sweet Queen para tus momentos más especiales? 👑✨</h2>
        
        <p>En <strong>Sweet Queen</strong> no solo horneamos pasteles; creamos recuerdos comestibles. Sabemos que detrás de cada celebración hay una ilusión, un esfuerzo y una historia que contar. Por eso, ponemos todo nuestro corazón en cada detalle.</p>
        
        <p class="mt-4">Si te estás preguntando qué es lo que nos hace diferentes y por qué confiar en nosotras para tu gran día, aquí te damos 4 razones fundamentales:</p>
        
        <div class="space-y-8 mt-8">
          <section>
            <h3 class="text-2xl font-bold text-primary mb-2">1. Pasión por el detalle artesanal 🎨</h3>
            <p>Cada tarta es una obra de arte única. Huimos de los procesos industriales y los diseños genéricos. Desde la primera capa de bizcocho hasta el último toque de decoración, trabajamos a mano para que el resultado refleje tu personalidad o la temática de tu fiesta. No hay dos pedidos iguales porque no hay dos clientes iguales.</p>
          </section>
          
          <section>
            <h3 class="text-2xl font-bold text-primary mb-2">2. Ingredientes de máxima calidad 🥚🍓</h3>
            <p>Estamos convencidas de que un pastel espectacular por fuera debe ser inolvidable por dentro. Por eso, seleccionamos cuidadosamente materias primas de primera: huevos frescos, mantequilla de calidad, fruta de temporada y el chocolate más fino. El resultado es ese sabor casero y auténtico que te hace cerrar los ojos en cada bocado.</p>
          </section>
          
          <section>
            <h3 class="text-2xl font-bold text-primary mb-2">3. Personalización sin límites 🍰</h3>
            <p>¿Eres fan del Red Velvet clásico? ¿Prefieres una combinación atrevida de trufa y maracuyá? ¿Necesitas opciones para intolerancias? En Sweet Queen nos adaptamos a ti. Tú sueñas el diseño y eliges el sabor, y nosotras nos encargamos de convertirlo en realidad, cuidando siempre el equilibrio perfecto entre estética y sabor.</p>
          </section>
          
          <section>
            <h3 class="text-2xl font-bold text-primary mb-2">4. Somos parte de tu historia 🎂</h3>
            <p>Hemos tenido el privilegio de acompañar a muchas familias en sus bautizos, cumpleaños, bodas y comuniones. Nuestra mayor recompensa es ver la cara de sorpresa y felicidad cuando abrís la caja por primera vez. Para nosotras, no eres un número de pedido; eres parte de la familia Sweet Queen y tratamos tu tarta con el mismo mimo que si fuera para nuestra propia casa.</p>
          </section>
        </div>
        
        <div class="bg-primary/10 p-8 rounded-3xl mt-12 border border-primary/20 shadow-inner">
          <h4 class="text-2xl font-headline text-primary mb-4">¿Quieres que tu próximo evento sea realmente dulce?</h4>
          <p>No esperes más y haz tu reserva a través de nuestra nueva plataforma web. Ahora es más fácil que nunca: personaliza tu pedido, sigue el estado de tu encargo y, una vez aceptado, podrás descargar tu comprobante en PDF al instante.</p>
        </div>
      `,
      ca: `
        <h2 class="text-3xl font-headline text-primary mb-6">Per què triar Sweet Queen per als teus moments més especials? 👑✨</h2>
        
        <p>A <strong>Sweet Queen</strong> no només hornegem pastissos; creem records comestibles. Sabem que darrere de cada celebració hi ha una il·lusió, un esforç i una història per explicar. Per això, posem tot el nostre cor en cada detall.</p>
        
        <p class="mt-4">Si t'estàs preguntant què és el que ens fa diferents i per què confiar en nosaltres per al teu gran dia, aquí et donem 4 raons fonamentals:</p>
        
        <div class="space-y-8 mt-8">
          <section>
            <h3 class="text-2xl font-bold text-primary mb-2">1. Passió pel detall artesanal 🎨</h3>
            <p>Cada pastís és una obra d'art única. Fugim dels processos industrials i els dissenys genèrics. Des de la primera capa de bescuit fins a l'últim toc de decoració, treballem a mà perquè el resultat reflecteixi la teva personalitat o la temàtica de la teva festa. No hi ha dues comandes iguals perquè no hi ha dos clients iguals.</p>
          </section>
          
          <section>
            <h3 class="text-2xl font-bold text-primary mb-2">2. Ingredients de màxima qualitat 🥚🍓</h3>
            <p>Estem convençudes que un pastís espectacular per fora ha de ser inoblidable per dins. Per això, seleccionem acuradament matèries primeres de primera: ous frescos, mantega de qualitat, fruita de temporada i la xocolata més fina. El resultat és aquest sabor casolà i autèntic que et fa tancar els ulls en cada mos.</p>
          </section>
          
          <section>
            <h3 class="text-2xl font-bold text-primary mb-2">3. Personalització sense límits 🍰</h3>
            <p>Ets fan del Red Velvet clàssic? Prefereixes una combinació atrevida de trufa i maracujà? Necessites opcions per a intoleràncies? A Sweet Queen ens adaptem a tu. Tu somies el disseny i tries el sabor, i nosaltres ens encarreguem de convertir-lo en realitat, cuidant sempre l'equilibri perfecte entre estètica i sabor.</p>
          </section>
          
          <section>
            <h3 class="text-2xl font-bold text-primary mb-2">4. Som part de la teva història 🎂</h3>
            <p>Hem tingut el privilegi d'acompanyar moltes famílies en els seus batejos, aniversaris, bodes i comunions. La nostra major recompensa és veure la cara de sorpresa i felicitat quan obriu la caixa per primera vegada. Per a nosaltres, no ets un número de comanda; ets part de la família Sweet Queen i tractem el teu pastís amb el mateix afecte que si fos per a la nostra pròpia casa.</p>
          </section>
        </div>
        
        <div class="bg-primary/10 p-8 rounded-3xl mt-12 border border-primary/20 shadow-inner">
          <h4 class="text-2xl font-headline text-primary mb-4">Vols que el teu proper esdeveniment sigui realment dolç?</h4>
          <p>No esperis més i fes la teva reserva a través de la nostra nova plataforma web. Ara és més fàcil que mai: personalitza la teva comanda, segueix l'estat del teu encàrrec i, un cop acceptat, podràs descarregar el teu comprovant en PDF a l'instant.</p>
        </div>
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