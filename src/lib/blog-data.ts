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
            <p>Ets fan del Red Velvet clàssic? Prefereixes una combinació atrevida de trufa i maracuyà? Necessites opcions per a intoleràncies? A Sweet Queen ens adaptem a tu. Tu somies el disseny i tries el sabor, i nosaltres ens encarreguem de convertir-lo en realitat, cuidant sempre l'equilibri perfecte entre estètica i sabor.</p>
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
      es: 'El Secreto del Red Velvet perfecto: Mucho más que un color vibrante 🍰❤️',
      ca: 'El Secret del Red Velvet perfecte: Molt més que un color vibrant 🍰❤️'
    },
    excerpt: {
      es: 'Desvelamos los secretos detrás de nuestro pastel más icónico: textura de terciopelo y química dulce.',
      ca: 'Desvetllem els secrets darrere del nostre pastís més icònic: textura de vellut i química dolça.'
    },
    date: '2023-03-20',
    author: 'Chef Pastelero',
    image: getImage('red-velvet'),
    content: {
      es: `
        <h2 class="text-3xl font-headline text-primary mb-6">El secreto del Red Velvet perfecto: Mucho más que un color vibrante 🍰❤️</h2>
        
        <p>Si hay un pastel que despierta pasiones y curiosidad a partes iguales, ese es el Red Velvet. Su color carmesí profundo y su contraste con el blanco nuclear del frosting lo convierten en el rey de cualquier celebración.</p>
        
        <p class="mt-4">Pero, ¿alguna vez te has preguntado por qué se llama "terciopelo rojo"? En <strong>Sweet Queen</strong> desvelamos los secretos que hacen que nuestra receta sea irresistible.</p>
        
        <div class="space-y-8 mt-8">
          <section>
            <h3 class="text-2xl font-bold text-primary mb-2">1. No es solo chocolate (¡es química!) 🧪</h3>
            <p>Mucha gente cree que el Red Velvet es simplemente un bizcocho de chocolate con colorante. Error. El verdadero secreto reside en la reacción entre el cacao natural, el bicarbonato y un ingrediente ácido: el <strong>buttermilk</strong> (suero de leche).</p>
            <p class="mt-2">Esta combinación no solo ayuda a intensificar el tono rojizo del cacao, sino que rompe las fibras de la harina para crear esa miga increíblemente suave y fina que se deshace en la boca. De ahí su nombre: <em>Velvet</em> (terciopelo).</p>
          </section>
          
          <section>
            <h3 class="text-2xl font-bold text-primary mb-2">2. El equilibrio del sabor ⚖️</h3>
            <p>Un Red Velvet perfecto no debe ser empalagoso. El sabor es sutil: un toque ligero a cacao compensado por el punto ácido del vinagre y el buttermilk. Es una danza de sabores donde ninguno domina, pero todos se sienten.</p>
          </section>
          
          <section>
            <h3 class="text-2xl font-bold text-primary mb-2">3. El Frosting: El compañero inseparable 🍦</h3>
            <p>En Sweet Queen somos puristas: un Red Velvet no es nada sin su frosting de crema de queso. El truco: Usamos mantequilla de alta calidad y queso crema con el punto justo de frío para que sea estable pero ligero como una nube. El punto de sal del queso es lo que potencia el dulzor del bizcocho.</p>
          </section>
          
          <section>
            <h3 class="text-2xl font-bold text-primary mb-2">4. La humedad es la clave 💧</h3>
            <p>No hay nada peor que un Red Velvet seco. El secreto de nuestras tartas es el uso de aceite en lugar de solo mantequilla en la masa, lo que garantiza que el bizcocho se mantenga jugoso durante días, manteniendo esa textura "húmeda" tan característica.</p>
          </section>
        </div>
        
        <div class="bg-secondary/40 p-8 rounded-3xl mt-12 border border-primary/10">
          <h4 class="text-2xl font-headline text-primary mb-4">¿Quieres probar el auténtico "terciopelo" en tu próximo evento? 👑</h4>
          <p>En Sweet Queen hemos perfeccionado esta receta tras muchas pruebas hasta dar con el equilibrio exacto. Ya sea en formato tarta de varios pisos o en nuestros famosos cupcakes, te prometemos una experiencia que va más allá de la vista.</p>
          <p class="mt-4 font-bold">¡Haz tu pedido hoy mismo!</p>
          <p class="mt-2 text-sm italic">Entra en nuestra sección de reservas, elige "Red Velvet" como tu sabor preferido y prepárate para disfrutar. Recuerda que una vez aceptemos tu pedido, podrás descargar tu resumen en PDF directamente desde tu panel.</p>
        </div>
      `,
      ca: `
        <h2 class="text-3xl font-headline text-primary mb-6">El secret del Red Velvet perfecte: Molt més que un color vibrant 🍰❤️</h2>
        
        <p>Si hi ha un pastís que desperta passions i curiositat a parts iguals, aquest és el Red Velvet. El seu color carmesí profund i el seu contrast amb el blanc nuclear del frosting el converteixen en el rei de qualsevol celebració.</p>
        
        <p class="mt-4">Però, algun cop t'has preguntat per què se'n diu "vellut vermell"? A <strong>Sweet Queen</strong> desvetllem els secrets que fan que la nostra recepta sigui irresistible.</p>
        
        <div class="space-y-8 mt-8">
          <section>
            <h3 class="text-2xl font-bold text-primary mb-2">1. No és només xocolata (és química!) 🧪</h3>
            <p>Molta gent creu que el Red Velvet és simplement un bescuit de xocolata amb colorant. Error. El verdader secret resideix en la reacció entre el cacau natural, el bicarbonat i un ingredient àcid: el <strong>buttermilk</strong> (serum de llet).</p>
            <p class="mt-2">Aquesta combinació no només ajuda a intensificar el to vermellós del cacau, sinó que trenca les fibres de la farina per crear aquesta miga increïblement suau i fina que es desfà a la boca. D'aquí el seu nom: <em>Velvet</em> (vellut).</p>
          </section>
          
          <section>
            <h3 class="text-2xl font-bold text-primary mb-2">2. L'equilibri del sabor ⚖️</h3>
            <p>Un Red Velvet perfecte no ha de ser embafador. El sabor és subtil: un toc lleuger a cacau compensat pel punt àcid del vinagre i el buttermilk. És una dansa de sabors on cap domina, però tots se senten.</p>
          </section>
          
          <section>
            <h3 class="text-2xl font-bold text-primary mb-2">3. El Frosting: El company inseparable 🍦</h3>
            <p>A Sweet Queen som puristes: un Red Velvet no és res sense el seu frosting de crema de formatge. El truc: Utilitzem mantega d'alta qualitat i formatge crema amb el punt just de fred perquè sigui estable però lleuger com un núvol. El punt de sal del formatge és el que potencia la dolçor del bescuit.</p>
          </section>
          
          <section>
            <h3 class="text-2xl font-bold text-primary mb-2">4. La humitat és la clau 💧</h3>
            <p>No hi ha res pitjor que un Red Velvet sec. El secret dels nostres pastissos és l'ús d'oli en lloc de només mantega a la massa, cosa que garanteix que el bescuit es mantingui sucós durant dies, mantenint aquesta textura "humida" tan característica.</p>
          </section>
        </div>
        
        <div class="bg-secondary/40 p-8 rounded-3xl mt-12 border border-primary/10">
          <h4 class="text-2xl font-headline text-primary mb-4">Vols tastar l'autèntic "vellut" en el teu proper esdeveniment? 👑</h4>
          <p>A Sweet Queen hem perfeccionat aquesta recepta després de moltes proves fins a donar amb l'equilibri exacte. Ja sigui en format pastís de diversos pisos o en els nostres famosos cupcakes, et prometem una experiència que va més enllà de la vista.</p>
          <p class="mt-4 font-bold">Fes la teva comanda avui mateix!</p>
          <p class="mt-2 text-sm italic">Entra a la nostra secció de reserves, tria "Red Velvet" com el teu sabor preferit i prepara't per gaudir. Recorda que un cop acceptem la teva comanda, podràs descarregar el teu resum en PDF directament des del teu panell.</p>
        </div>
      `
    },
  }
];
