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
    slug: 'un-dia-en-el-obrador-sweet-queen',
    title: {
      es: 'Un día en el obrador de Sweet Queen: Cómo nace tu tarta desde cero 👩‍🍳🍰',
      ca: 'Un dia a l\'obrador de Sweet Queen: Com neix el teu pastís des de zero 👩‍🍳🍰'
    },
    excerpt: {
      es: 'Mucha gente nos pregunta: "¿Por qué necesito encargar mi tarta con tanta antelación?". La respuesta corta es: porque la magia lleva su tiempo.',
      ca: 'Molta gent ens pregunta: "Per què necessito encarregar el meu pastís amb tanta antelació?". La resposta curta és: perquè la màgia porta el seu temps.'
    },
    date: '2024-03-25',
    author: 'Sweet Queen',
    image: getImage('obrador-huevo'),
    content: {
      es: `
        <h2 class="text-3xl font-headline text-primary mb-6">La magia lleva su tiempo: El viaje de tu tarta 👑✨</h2>
        
        <p>Mucha gente nos pregunta: "¿Por qué necesito encargar mi tarta con tanta antelación?". La respuesta corta es: porque la magia lleva su tiempo.</p>
        
        <p class="mt-4">Hoy queremos abrirte las puertas de nuestro rincón favorito, el obrador de Sweet Queen, para que nos acompañes en el viaje que hace tu tarta desde que haces clic en "Enviar Reserva" hasta que llega a tus manos.</p>
        
        <div class="space-y-10 mt-10">
          <section class="border-l-4 border-primary pl-6 py-2">
            <h3 class="text-2xl font-bold text-primary mb-2">08:00 AM – El aroma de la mañana ☕</h3>
            <p>El día empieza muy temprano. Lo primero es revisar las reservas confirmadas en nuestro sistema. Imprimimos los resúmenes en PDF (los mismos que tú recibes) para tener cada detalle a la vista: sabores, alergias y anotaciones de diseño.</p>
            <p class="mt-2 text-muted-foreground italic">Encendemos los hornos y empezamos con el batido de las masas. Aquí no hay mezclas preparadas; rompemos huevos frescos, tamizamos harina y fundimos el chocolate.</p>
          </section>
          
          <section class="border-l-4 border-primary pl-6 py-2">
            <h3 class="text-2xl font-bold text-primary mb-2">11:00 AM – El reposo es sagrado 🧊</h3>
            <p>Una vez salen los bizcochos del horno, llega un paso que muchos olvidan: el reposo. Un bizcocho caliente no se puede rellenar. Dejamos que se enfríen lentamente para que la miga se asiente. Esto garantiza que tu tarta sea estable y no se desmorone al cortarla.</p>
          </section>
          
          <section class="border-l-4 border-primary pl-6 py-2">
            <h3 class="text-2xl font-bold text-primary mb-2">13:00 PM – La arquitectura del sabor 🏗️</h3>
            <p>Aquí empieza la construcción. Cortamos los bizcochos en capas perfectas, aplicamos el almíbar para que estén jugosos y rellenamos. Aplicamos lo que llamamos la "crumb coat" (una capa fina de crema que atrapa las migas) y la tarta vuelve al frío para sellar el sabor.</p>
          </section>
          
          <section class="border-l-4 border-primary pl-6 py-2">
            <h3 class="text-2xl font-bold text-primary mb-2">16:00 PM – El momento del artista 🎨</h3>
            <p>Esta es nuestra parte favorita. Con la estructura bien firme, sacamos las espátulas, las mangas pasteleras y el fondant. Es el momento de dar vida al diseño que imaginaste. Pintamos detalles, modelamos figuras o colocamos flores frescas.</p>
          </section>
          
          <section class="border-l-4 border-primary pl-6 py-2">
            <h3 class="text-2xl font-bold text-primary mb-2">19:00 PM – Control de calidad y empaquetado 🎀</h3>
            <p>Antes de meter la tarta en su caja, verificamos que todo esté perfecto. Limpiamos la base, hacemos la foto de rigor y cerramos la caja con nuestro lazo rosa. Actualizamos el estado en la web a "Listo para entrega" y preparamos todo para el gran encuentro.</p>
          </section>
        </div>
        
        <div class="bg-primary/10 p-8 rounded-[2rem] mt-12 border border-primary/20">
          <h4 class="text-2xl font-headline text-primary mb-4 text-center">¿Quieres ser el protagonista de nuestra próxima hornada? 👑</h4>
          <p class="text-center italic">Como ves, cada tarta de Sweet Queen es un proceso artesanal de horas de dedicación. Por eso, te animamos a usar nuestro sistema de reservas online con antelación.</p>
        </div>
      `,
      ca: `
        <h2 class="text-3xl font-headline text-primary mb-6">La màgia porta el seu temps: El viatge del teu pastís 👑✨</h2>
        
        <p>Molta gent ens pregunta: "Per què necessito encarregar el meu pastís amb tanta antelació?". La resposta curta és: perquè la màgia porta el seu temps.</p>
        
        <p class="mt-4">Avui volem obrir-te les portes del nostre racó preferit, l'obrador de Sweet Queen, perquè ens acompanyis en el viatge que fa el teu pastís des que fas clic a "Enviar Reserva" fins que arriba a les teves mans.</p>
        
        <div class="space-y-10 mt-10">
          <section class="border-l-4 border-primary pl-6 py-2">
            <h3 class="text-2xl font-bold text-primary mb-2">08:00 AM – L'aroma del matí ☕</h3>
            <p>El dia comença molt d'hora. El primer és revisar les reserves confirmades al nostre sistema. Imprimim els resums en PDF per tenir cada detall a la vista: sabors, al·lèrgies i anotacions de disseny.</p>
          </section>
          
          <section class="border-l-4 border-primary pl-6 py-2">
            <h3 class="text-2xl font-bold text-primary mb-2">11:00 AM – El repòs és sagrat 🧊</h3>
            <p>Una vegada surten els bescuits del forn, arriba un pas que molts obliden: el repòs. Un bescuit calent no es pot omplir. Deixem que es refredin lentament perquè la miga s'asenti. Això garanteix que el teu pastís sigui estable.</p>
          </section>
          
          <section class="border-l-4 border-primary pl-6 py-2">
            <h3 class="text-2xl font-bold text-primary mb-2">13:00 PM – L'arquitectura del sabor 🏗️</h3>
            <p>Aquí comença la construcció. Tallem els bescuits en capes perfectes, apliquem l'almívar perquè estiguin sucosos i els omplim. Apliquem la "crumb coat" i el pastís torna al fred per segellar el sabor.</p>
          </section>
          
          <section class="border-l-4 border-primary pl-6 py-2">
            <h3 class="text-2xl font-bold text-primary mb-2">16:00 PM – El moment de l'artista 🎨</h3>
            <p>Aquesta és la nostra part preferida. Amb l'estructura ben ferma, traiem les espàtules, les mànigues pastisseres i el fondant. És el moment de donar vida al disseny que vas imaginar.</p>
          </section>
          
          <section class="border-l-4 border-primary pl-6 py-2">
            <h3 class="text-2xl font-bold text-primary mb-2">19:00 PM – Control de qualitat i empaquetat 🎀</h3>
            <p>Abans de ficar el pastís a la seva caixa, verifiquem que tot estigui perfecte. Netegem la base, fem la foto de rigor i tanquem la caixa amb el nostre llaç rosa.</p>
          </section>
        </div>
        
        <div class="bg-primary/10 p-8 rounded-[2rem] mt-12 border border-primary/20">
          <h4 class="text-2xl font-headline text-primary mb-4 text-center">Vols ser el protagonista de la nostra propera fornada? 👑</h4>
          <p class="text-center italic">Com veus, cada pastís de Sweet Queen és un procés artesanal d'hores de dedicació. Per això, t'animem a fer servir el nostre sistema de reserves online.</p>
        </div>
      `
    }
  },
  {
    slug: '5-consejos-imprescindibles-transporte-tarta',
    title: {
      es: '5 Consejos imprescindibles para que tu Tarta Personalizada llegue perfecta a la mesa 🎂✨',
      ca: '5 Consells imprescindibles perquè el teu Pastís Personalitzat arribi perfecte a la taula 🎂✨'
    },
    excerpt: {
      es: 'Has pasado tiempo eligiendo el diseño y el sabor ideal. Aquí tienes la guía definitiva para que tu tarta llegue intacta.',
      ca: 'Has passat temps triant el disseny i el sabor ideal. Aquí tens la guia definitiva perquè la teva tarta arribi intacta.'
    },
    date: '2024-03-15',
    author: 'Sweet Queen',
    image: getImage('encargo-tarta'),
    content: {
      es: `
        <h2 class="text-3xl font-headline text-primary mb-6">Guía de cuidados para tu tarta Sweet Queen 👑</h2>
        
        <p>Has pasado tiempo eligiendo el diseño, el sabor y el tamaño ideal. Tu tarta de Sweet Queen ya está lista y luce espectacular. Pero ahora llega el momento crítico: el transporte y la conservación.</p>
        
        <p class="mt-4">Para que el esfuerzo y la ilusión lleguen intactos al momento de soplar las velas, hemos preparado esta guía rápida de cuidados básicos. ¡Toma nota!</p>
        
        <div class="space-y-8 mt-8">
          <section>
            <h3 class="text-2xl font-bold text-primary mb-2">1. El transporte: El suelo es tu mejor aliado 🚗</h3>
            <p>Parece contraintuitivo, pero nunca coloques la tarta en el asiento del coche. Los asientos tienen una ligera inclinación que puede hacer que la tarta se deslice o que los pisos se tuerzan.</p>
            <ul class="list-disc list-inside mt-2 space-y-1">
              <li><strong>El lugar ideal:</strong> El suelo del lado del copiloto o un maletero despejado y plano.</li>
              <li><strong>Conducción:</strong> Evita frenazos bruscos y curvas cerradas. ¡Recuerda que llevas una obra de arte comestible!</li>
            </ul>
          </section>
          
          <section>
            <h3 class="text-2xl font-bold text-primary mb-2">2. Adiós a la calefacción ❄️</h3>
            <p>Las tartas personalizadas (especialmente las de crema de mantequilla o ganache) son muy sensibles al calor. Si vienes a por ella en verano o invierno, pon el aire acondicionado a tope unos minutos antes de entrar la tarta al coche.</p>
            <p class="mt-2"><strong>Importante:</strong> Nunca dejes la tarta dentro del coche aparcado; el efecto invernadero podría derretir la decoración en cuestión de minutos.</p>
          </section>
          
          <section>
            <h3 class="text-2xl font-bold text-primary mb-2">3. La temperatura de servicio ideal 🌡️</h3>
            <p>Una tarta fría de nevera está muy firme, pero el sabor y la textura se disfrutan mucho más a temperatura ambiente. Mantén la tarta en la nevera hasta unas 1 o 2 horas antes de servirla (dependiendo de la temperatura ambiental).</p>
          </section>
          
          <section>
            <h3 class="text-2xl font-bold text-primary mb-2">4. Cuidado con la luz directa y los olores ☀️👃</h3>
            <p>Evita colocar la tarta en una mesa cerca de una ventana donde le dé el sol directo. En la nevera, asegúrate de que no haya alimentos con olores fuertes cerca, ya que las grasas de las cremas absorben los olores con facilidad.</p>
          </section>
          
          <section>
            <h3 class="text-2xl font-bold text-primary mb-2">5. El corte perfecto 🔪</h3>
            <p>Usa un cuchillo largo y liso (no de sierra). El truco Pro: Sumerge el cuchillo en agua caliente, sécalo y haz el corte. Repite el proceso en cada corte para obtener rebanadas limpias.</p>
          </section>
        </div>
        
        <div class="bg-primary/10 p-8 rounded-3xl mt-12 border border-primary/20 shadow-inner">
          <h4 class="text-2xl font-headline text-primary mb-4">¿Aún no has hecho tu pedido?</h4>
          <p>Recuerda que en Sweet Queen trabajamos bajo reserva para garantizar la máxima frescura. Entra en nuestra web, rellena el formulario y, una vez aceptemos tu encargo, podrás descargar tu resumen en PDF para tener todos los detalles a mano.</p>
        </div>
      `,
      ca: `
        <h2 class="text-3xl font-headline text-primary mb-6">Guia de cures per a la teva tarta Sweet Queen 👑</h2>
        
        <p>Has passat temps triant el disseny, el sabor i la mida ideal. La teva tarta de Sweet Queen ja està llesta i llueix espectacular. Però ara arriba el moment crític: el transport i la conservació.</p>
        
        <p class="mt-4">Perquè l'esforç i la il·lusió arribin intactes al moment de bufat les espelmes, hem preparat aquesta guia ràpida de cures bàsiques. Pren nota!</p>
        
        <div class="space-y-8 mt-8">
          <section>
            <h3 class="text-2xl font-bold text-primary mb-2">1. El transport: El terra és el teu millor aliat 🚗</h3>
            <p>Sembla contraintuïtiu, però mai col·loquis la tarta al seient del cotxe. Els seients tenen una lleugera inclinació que pot fer que la tarta llisqui o que els pisos es torcin.</p>
            <ul class="list-disc list-inside mt-2 space-y-1">
              <li><strong>El lloc ideal:</strong> El terra del costat del copilot o un maleter buit i pla.</li>
              <li><strong>Conducció:</strong> Evita frenades brusques i corbes tancades. Recorda que portes una obra d'art comestible!</li>
            </ul>
          </section>
          
          <section>
            <h3 class="text-2xl font-bold text-primary mb-2">2. Adeu a la calefacció ❄️</h3>
            <p>Les tartes personalitzades (especialment les de crema de mantega o ganache) són molt sensibles a la calor. Si vens a buscar-la a l'estiu o a l'hivern, posa l'aire condicionat al màxim uns minuts abans d'entrar la tarta al cotxe.</p>
            <p class="mt-2"><strong>Important:</strong> Mai deixis la tarta dins del cotxe aparcat; l'efecte hivernacle podria fondre la decoració en qüestió de minuts.</p>
          </section>
          
          <section>
            <h3 class="text-2xl font-bold text-primary mb-2">3. La temperatura de servei ideal 🌡️</h3>
            <p>Una tarta freda de nevera està molt ferma, herbor el sabor i la textura es gaudeixen molt més a temperatura ambient. Mantén la tarta a la nevera fins a unes 1 o 2 hores abans de servir-la.</p>
          </section>
          
          <section>
            <h3 class="text-2xl font-bold text-primary mb-2">4. Compte amb la llum directa i les olors ☀️👃</h3>
            <p>Evita col·locar la tarta en una taula a prop d'una finestra on li doni el sol directo. A la nevera, assegura't que no hi hagi aliments amb olors fortes a prop, ja que els greixos de les cremes absorbeixen les olors amb facilitat.</p>
          </section>
          
          <section>
            <h3 class="text-2xl font-bold text-primary mb-2">5. El tall perfecte 🔪</h3>
            <p>Fes servir un ganivet llarg i lliç (no de serra). El truc Pro: Submergeix el ganivet en aigua calenta, eixuga'l i fes el tall. Repeteix el procés en cada tall per obtenir llesques netes.</p>
          </section>
        </div>
        
        <div class="bg-primary/10 p-8 rounded-3xl mt-12 border border-primary/20 shadow-inner">
          <h4 class="text-2xl font-headline text-primary mb-4">Encara no has fet la teva comanda?</h4>
          <p>Recorda que a Sweet Queen treballem sota reserva per garantir la màxima frescor. Entra a la nostra web, omple el formulari i, un cop acceptem el teu encàrrec, podràs descarregar el teu resum en PDF per tenir tots els detalls a mà.</p>
        </div>
      `
    }
  },
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
            <p>Ets fan del Red Velvet clàssic? Prefereixes una combinació atrevida de trufa i maracuyà? Necessites opcions per a intoleràncies? A Sweet Queen ens adaptem a tu. Tu somies el disseny i tries el sabor, i nosaltres ens encarreguem de convertirlo en realitat, cuidant sempre l'equilibri perfecte entre estètica i sabor.</p>
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
            <p>Molta gent creu que el Red Velvet és simplement un bescuit de xocolata amb colorant. Error. El verdader secret resideix en la reacció entre el cacau natural, el bicarbonato i un ingredient àcid: el <strong>buttermilk</strong> (serum de llet).</p>
            <p class="mt-2">Aquesta combinació no només ajuda a intensificar el to vermellós del cacau, sinó que trenca les fibres de la farina per crear aquesta miga increïblement suau i fina que es desfà a la boca. D'aquí el seu nom: <em>Velvet</em> (vellut).</p>
          </section>
          
          <section>
            <h3 class="text-2xl font-bold text-primary mb-2">2. L'equilibri del sabor ⚖️</h3>
            <p>Un Red Velvet perfecte no ha de ser embafador. El sabor és subtil: un toque lleuger a cacau compensat pel punt àcid del vinagre i el buttermilk. És una dansa de sabors on cap domina, però tots se senten.</p>
          </section>
          
          <section>
            <h3 class="text-2xl font-bold text-primary mb-2">3. El Frosting: El company inseparable 🍦</h3>
            <p>A Sweet Queen som puristes: un Red Velvet no és res sense el seu frosting de crema de formatge. El truc: Utilitzem mantega d'alta qualitat i formatge crema amb el punt just de fred perquè sigui estable i lleuger.</p>
          </section>
          
          <section>
            <h3 class="text-2xl font-bold text-primary mb-2">4. La humitat és la clau 💧</h3>
            <p>No hi ha res pitjor que un Red Velvet sec. El secret dels nostres pastissos és l'ús d'oli en lloc de només mantega a la massa, cosa que garanteix que el bescuit es mantingui sucós durant dies.</p>
          </section>
        </div>
        
        <div class="bg-secondary/40 p-8 rounded-3xl mt-12 border border-primary/10">
          <h4 class="text-2xl font-headline text-primary mb-4">Vols tastar l'autèntic "vellut" en el teu proper esdeveniment? 👑</h4>
          <p>A Sweet Queen hem perfeccionat aquesta recepta després de moltes proves fins a donar amb l'equilibri exacte. Ja sigui en format pastís de diversos pisos o en els nostres famosos cupcakes, et prometem una experiència que va més enllà de la vista.</p>
          <p class="mt-4 font-bold">Fes la teva comanda avui mateix!</p>
        </div>
      `
    },
  }
];