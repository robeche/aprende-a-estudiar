/* =========================================================
   CONTENIDOS DEL CURSO "Aprende a estudiar"
   Puedes editar este archivo para añadir módulos o ejercicios.
   Tipos de paso: lectura | quiz | texto | foto | subrayado | tarea
   ========================================================= */

const TEXTOS = {
  agua: {
    titulo: 'El ciclo del agua',
    parrafos: [
      'El agua de la Tierra está en continuo movimiento. Este recorrido, que no tiene principio ni fin, se llama ciclo del agua o ciclo hidrológico, y está impulsado por la energía del Sol y por la fuerza de la gravedad.',
      'Todo comienza cuando el calor del Sol calienta el agua de los océanos, ríos y lagos. Parte de esa agua se transforma en vapor y sube a la atmósfera: es la evaporación. Las plantas también liberan vapor de agua a través de sus hojas, un proceso llamado transpiración.',
      'Al ascender, el vapor se enfría y se convierte en pequeñas gotas que forman las nubes. Este cambio de gas a líquido se denomina condensación. Cuando las gotas se unen y pesan demasiado, caen en forma de lluvia, nieve o granizo: es la precipitación.',
      'Una vez en el suelo, el agua puede seguir varios caminos. Una parte corre por la superficie hasta llegar a ríos y mares; es la escorrentía. Otra se filtra en el terreno y forma acuíferos subterráneos; es la infiltración. Finalmente, el agua vuelve a evaporarse y el ciclo comienza de nuevo.'
    ],
    claves: [['ciclo'], ['Sol'], ['gravedad'], ['evaporación'], ['transpiración'], ['condensación'], ['nubes'], ['precipitación'], ['escorrentía'], ['infiltración'], ['acuíferos']]
  },
  industrial: {
    titulo: 'La Revolución Industrial',
    parrafos: [
      'La Revolución Industrial fue un conjunto de grandes cambios económicos, tecnológicos y sociales que comenzó en Gran Bretaña a mediados del siglo XVIII y se extendió después por Europa y Estados Unidos.',
      'Su principal motor fue la máquina de vapor, perfeccionada por James Watt hacia 1769. Gracias a ella, las fábricas ya no dependían de la fuerza humana, animal o del agua de los ríos, y podían producir mucho más en menos tiempo. La industria textil del algodón y la siderurgia, que fabricaba hierro, fueron los primeros sectores en transformarse.',
      'El transporte también cambió por completo. El ferrocarril y el barco de vapor permitieron llevar materias primas y productos más lejos, más rápido y a menor precio.',
      'Estos cambios tuvieron consecuencias sociales muy importantes. Muchas personas abandonaron el campo para trabajar en las fábricas de las ciudades, que crecieron de forma desordenada. Así surgió una nueva clase social, el proletariado, formada por obreros que trabajaban jornadas de hasta catorce horas, en malas condiciones y con salarios bajos. Entre ellos había también niños. Para defender sus derechos, los trabajadores se organizaron en sindicatos.'
    ],
    claves: [['Gran Bretaña'], ['XVIII'], ['vapor'], ['textil', 'algodón'], ['siderurgia'], ['ferrocarril'], ['campo'], ['ciudades'], ['proletariado'], ['condiciones', 'catorce'], ['sindicatos']]
  },
  fotosintesis: {
    titulo: 'La fotosíntesis',
    parrafos: [
      'La fotosíntesis es el proceso mediante el cual las plantas, las algas y algunas bacterias fabrican su propio alimento. Por eso decimos que son seres vivos autótrofos.',
      'Para realizarla necesitan cuatro ingredientes: luz solar, agua, dióxido de carbono y clorofila. El agua y las sales minerales, que forman la savia bruta, se absorben por las raíces y suben por el tallo hasta las hojas. El dióxido de carbono entra desde el aire a través de unos pequeños orificios de las hojas llamados estomas.',
      'La clorofila es un pigmento verde que se encuentra en los cloroplastos, sobre todo de las hojas. Capta la energía de la luz y la usa para transformar el agua y el dióxido de carbono en glucosa, un azúcar que la planta utiliza como alimento y para crecer. La savia elaborada reparte estos nutrientes por toda la planta.',
      'Como resultado de la fotosíntesis también se libera oxígeno a la atmósfera. Gracias a este proceso, las plantas producen el oxígeno que respiramos y son la base de casi todas las cadenas alimentarias.'
    ],
    claves: []
  },
  volcanes: {
    titulo: 'Los volcanes',
    parrafos: [
      'Un volcán es una abertura de la corteza terrestre por la que sale al exterior el magma, roca fundida que procede del interior de la Tierra. Cuando el magma llega a la superficie y pierde sus gases, recibe el nombre de lava.',
      'Las partes principales de un volcán son la cámara magmática, donde se acumula el magma; la chimenea, el conducto por el que asciende; el cráter, la abertura de salida; y el cono volcánico, la montaña que se forma al acumularse los materiales expulsados.',
      'Aunque las erupciones pueden ser muy destructivas, los volcanes también aportan beneficios. Las cenizas volcánicas producen suelos muy fértiles para la agricultura y el calor del interior puede aprovecharse como energía geotérmica. Por eso, en lugares como las islas Canarias, la población ha aprendido a convivir con ellos y a vigilarlos de cerca.'
    ],
    claves: []
  }
};

const MODULOS = [
  /* ---------------------------------------------------- 1 */
  {
    id: 'cerebro', icono: '🧠', color: '#7c5cff',
    titulo: 'Cómo aprende tu cerebro',
    descripcion: 'Por qué olvidamos y qué funciona de verdad para recordar.',
    pasos: [
      { tipo: 'lectura', titulo: '¿Por qué olvidamos?', html: `
        <p>Tu memoria funciona en dos “pisos”. La <b>memoria de trabajo</b> es como una mesa pequeña: ahí cabe lo que piensas ahora mismo, pero se llena enseguida. La <b>memoria a largo plazo</b> es un almacén enorme donde las cosas se guardan durante años.</p>
        <p>Estudiar consiste en pasar información de la mesa al almacén… y, sobre todo, en <b>saber sacarla</b> de ahí cuando la necesitas (en un examen, por ejemplo).</p>
        <h3>La curva del olvido</h3>
        <p>En 1885, el psicólogo Hermann Ebbinghaus descubrió que, si aprendemos algo y no lo repasamos, <b>olvidamos gran parte en pocos días</b>. Pero cada vez que repasamos, el olvido es más lento. Por eso estudiar todo la noche antes funciona mal: lo olvidas casi tan rápido como lo aprendiste.</p>
        <div class="nota-caja">💡 Idea clave: no se trata de estudiar <i>más horas</i>, sino de estudiar <i>mejor</i> y <i>repartido</i> en el tiempo.</div>` },
      { tipo: 'lectura', titulo: 'Lo que dice la ciencia', html: `
        <p>En 2013, un equipo de psicólogos dirigido por John Dunlosky revisó cientos de estudios sobre 10 técnicas que usan los estudiantes. Sus conclusiones sorprenden a mucha gente:</p>
        <ul>
          <li>✅ <b>Ponerse a prueba</b> (hacerse preguntas, tarjetas, exámenes de práctica) es de lo más eficaz.</li>
          <li>✅ <b>Repartir el estudio</b> en varios días (en vez de “darse un atracón”) también.</li>
          <li>🟡 <b>Preguntarse “¿por qué?”</b>, explicarse las cosas a uno mismo y <b>mezclar tipos de ejercicios</b> funcionan bastante bien.</li>
          <li>🔴 <b>Releer</b> y <b>subrayar</b>, que es lo que más hace la gente, ayudan poco <i>si solo haces eso</i>.</li>
        </ul>
        <h3>La trampa de releer</h3>
        <p>Cuando relees un tema, te suena todo y tienes la sensación de que “ya te lo sabes”. Pero reconocer no es lo mismo que recordar. En el examen nadie te enseña el texto: tienes que <b>sacarlo tú de la memoria</b>. Por eso, practicar a sacarlo (ponerte a prueba) es mucho más útil.</p>
        <p>En este curso aprenderás las técnicas clásicas (subrayado, esquema, resumen, mapa conceptual) <b>y</b> las que más funcionan según la ciencia. Lo mejor es combinarlas.</p>` },
      { tipo: 'lectura', titulo: 'Mitos sobre el estudio', html: `
        <p><b>Mito 1: “Soy de aprendizaje visual (o auditivo), así que tengo que estudiar así”.</b> Las investigaciones no han encontrado que adaptar el estudio a un “estilo” mejore los resultados. Lo que sí ayuda a todo el mundo es combinar palabras con dibujos y esquemas.</p>
        <p><b>Mito 2: “Puedo estudiar mientras miro el móvil”.</b> El cerebro no hace dos tareas de pensar a la vez: salta de una a otra y pierde tiempo y concentración en cada salto. Incluso tener el móvil a la vista puede distraer.</p>
        <p><b>Mito 3: “Si me cuesta, es que no valgo para esto”.</b> Al contrario: cuando algo cuesta un poco (recordar sin mirar, resolver un problema distinto), el cerebro está trabajando y aprende más. Equivocarse al practicar es parte de aprender.</p>
        <p><b>Mito 4: “Cuantas más horas, mejor”.</b> Dos horas con distracciones rinden menos que 50 minutos concentrado y con descansos.</p>` },
      { tipo: 'quiz', titulo: 'Comprueba lo que sabes', preguntas: [
        { p: 'Según la curva del olvido, ¿qué pasa si estudias algo una vez y no lo repasas?', o: ['Lo recuerdas igual durante meses', 'Olvidas gran parte en pocos días', 'Lo olvidas solo si es difícil'], c: 1, e: 'Sin repasos, el olvido es muy rápido. Cada repaso lo frena.' },
        { p: '¿Cuál de estas técnicas tiene más apoyo científico?', o: ['Releer el tema varias veces', 'Subrayar con muchos colores', 'Ponerse a prueba con preguntas'], c: 2, e: 'La práctica de recuperación (ponerse a prueba) es de las más eficaces.' },
        { p: '¿Por qué releer da una falsa sensación de saber?', o: ['Porque reconocer el texto no es lo mismo que recordarlo sin mirar', 'Porque cansa la vista', 'Porque se lee demasiado rápido'], c: 0, e: 'Te “suena”, pero en el examen tienes que recordarlo tú solo.' },
        { p: 'Tienes examen el viernes. ¿Qué plan es mejor?', o: ['Estudiar 3 horas el jueves por la noche', 'Estudiar un rato el lunes, el miércoles y el jueves', 'No estudiar y confiar en lo que recuerdas de clase'], c: 1, e: 'Repartir el estudio en varios días (práctica distribuida) es mucho más eficaz.' },
        { p: '“Si algo me cuesta al estudiar, es mala señal.”', o: ['Verdadero', 'Falso'], c: 1, e: 'Un esfuerzo moderado (recordar sin mirar, equivocarse y corregir) ayuda a aprender.' }
      ] },
      { tipo: 'texto', titulo: 'Explícaselo a un amigo', minPalabras: 40,
        enunciado: '<p>Un amigo tuyo estudia releyendo el tema cinco veces la tarde antes del examen y luego se queja de que se queda en blanco. <b>Escríbele un mensaje</b> explicándole por qué su método no funciona bien y qué debería hacer en su lugar.</p>',
        rubrica: ['Explica por qué releer da falsa sensación de saber', 'Menciona el problema de estudiarlo todo el último día (olvido rápido)', 'Propone al menos una técnica eficaz (ponerse a prueba, repartir el estudio…)', 'Lo explica con sus palabras y de forma clara'] }
    ]
  },
  /* ---------------------------------------------------- 2 */
  {
    id: 'organizacion', icono: '🗓️', color: '#16a34a',
    titulo: 'Organízate: lugar, tiempo y plan',
    descripcion: 'Dónde, cuándo y cómo planificar para no ir con prisas.',
    pasos: [
      { tipo: 'lectura', titulo: 'Tu lugar de estudio', html: `
        <ul>
          <li><b>Siempre el mismo sitio</b>, ordenado, con buena luz y todo el material a mano antes de empezar.</li>
          <li><b>El móvil, fuera de la habitación</b> (o en otra sala, en silencio). No basta con ponerlo boca abajo.</li>
          <li><b>Música:</b> si la usas, mejor sin letra y baja. La música con letra compite con lo que lees.</li>
          <li><b>Misma hora cada día</b>: la rutina hace que empezar cueste menos.</li>
        </ul>
        <h3>¿Por dónde empiezo?</h3>
        <p>Empieza con una tarea de dificultad media para “arrancar”, haz lo más difícil cuando estés más fresco y deja lo más fácil o mecánico para el final.</p>` },
      { tipo: 'lectura', titulo: 'La técnica Pomodoro', html: `
        <p>La inventó Francesco Cirillo usando un temporizador de cocina con forma de tomate (<i>pomodoro</i> en italiano). Es muy sencilla:</p>
        <ol>
          <li>Elige <b>una</b> tarea.</li>
          <li>Pon un temporizador de <b>25 minutos</b> y trabaja solo en eso, sin interrupciones.</li>
          <li>Cuando suene, <b>descansa 5 minutos</b> (levántate, bebe agua, estírate; mejor sin pantallas).</li>
          <li>Cada 4 pomodoros, haz un <b>descanso largo</b> de 15–30 minutos.</li>
        </ol>
        <p>Si te viene a la cabeza algo que hacer (“tengo que contestar a…”), apúntalo en un papel y sigue. Lo harás en el descanso.</p>
        <div class="nota-caja">🍅 En la sección <b>Herramientas</b> tienes un temporizador Pomodoro listo para usar.</div>` },
      { tipo: 'tarea', titulo: 'Prueba un Pomodoro de verdad', enlace: '#/h/pomodoro', enlaceTexto: 'Abrir el temporizador 🍅',
        enunciado: '<p>Elige unos deberes reales que tengas hoy y haz <b>al menos un pomodoro completo</b> (25 min + 5 de descanso).</p>',
        checklist: ['He elegido una sola tarea', 'He dejado el móvil fuera de la habitación', 'He completado los 25 minutos sin interrupciones', 'He descansado 5 minutos sin pantallas'] },
      { tipo: 'lectura', titulo: 'Planifica tu semana', html: `
        <p>Planificar evita el “tengo examen mañana y no he empezado”. Cada domingo (o lunes) dedica 10 minutos a:</p>
        <ol>
          <li><b>Apuntar</b> todos los deberes, trabajos y exámenes de la semana (y de las siguientes).</li>
          <li><b>Dividir</b> los trabajos grandes en pasos pequeños con fecha (“buscar información”, “hacer borrador”…).</li>
          <li><b>Repartir</b> el estudio de cada examen en varios días y reservar huecos para <b>repasos</b>.</li>
          <li>Dejar tiempo libre: el descanso y el deporte también son parte del plan.</li>
        </ol>
        <p>Un truco: si un examen es en 7 días, planifica repasos cortos varios días antes en lugar de una sesión enorme al final. En la herramienta <b>Planificador</b> puedes crear un “plan de examen” automático.</p>` },
      { tipo: 'tarea', titulo: 'Crea tu plan de la semana', enlace: '#/h/planificador', enlaceTexto: 'Abrir el planificador 🗓️',
        enunciado: '<p>Usa el planificador (o tu agenda) para organizar esta semana.</p>',
        checklist: ['He apuntado todos los deberes y exámenes', 'He puesto al menos 5 bloques de estudio', 'He incluido al menos 2 repasos', 'He dividido algún trabajo grande en pasos', 'He dejado tiempo libre'] },
      { tipo: 'foto', titulo: 'Enséñame tu agenda', 
        enunciado: '<p>Haz una foto de tu <b>agenda, horario o plan semanal</b> (en papel o una captura del planificador) y el Profe Búho te dará consejos para mejorarlo.</p>',
        rubrica: ['Aparecen deberes y fechas de exámenes', 'El estudio de los exámenes está repartido en varios días', 'Hay repasos planificados', 'Hay descansos o tiempo libre y el plan es realista'] },
      { tipo: 'quiz', titulo: 'Repaso rápido', preguntas: [
        { p: '¿Dónde debería estar el móvil mientras estudias?', o: ['Boca abajo en la mesa', 'En otra habitación', 'En la mano por si acaso'], c: 1, e: 'Incluso a la vista puede distraer. Lo mejor es sacarlo de la habitación.' },
        { p: 'En la técnica Pomodoro, ¿cuánto dura cada bloque de trabajo?', o: ['10 minutos', '25 minutos', '60 minutos'], c: 1, e: '25 minutos de concentración y 5 de descanso.' },
        { p: 'Te pasa por la cabeza algo pendiente durante un pomodoro. ¿Qué haces?', o: ['Lo hago ya para no olvidarlo', 'Lo apunto y sigo', 'Paro el pomodoro'], c: 1, e: 'Apúntalo y hazlo en el descanso.' },
        { p: 'Tienes que hacer un trabajo largo para dentro de 2 semanas. ¿Qué es mejor?', o: ['Hacerlo todo el último fin de semana', 'Dividirlo en pasos pequeños con fecha', 'Esperar a tener inspiración'], c: 1, e: 'Dividir en pasos pequeños hace que sea fácil empezar y avanzar.' }
      ] }
    ]
  },
  /* ---------------------------------------------------- 3 */
  {
    id: 'lectura', icono: '📖', color: '#0ea5e9',
    titulo: 'Leer para entender',
    descripcion: 'Prelectura, lectura comprensiva e ideas principales.',
    pasos: [
      { tipo: 'lectura', titulo: 'El método de lectura en 3 pasos', html: `
        <h3>1. Prelectura (2–3 minutos)</h3>
        <p>Antes de leer el tema “en serio”, échale un vistazo general: título, apartados, palabras en negrita, imágenes, gráficos y las preguntas del final. Pregúntate: <i>¿de qué va?, ¿qué sé ya de esto?</i> Así tu cerebro prepara “cajones” donde guardar la información.</p>
        <h3>2. Lectura comprensiva</h3>
        <p>Lee despacio, <b>párrafo a párrafo</b>. Al acabar cada uno, para y dite: <i>¿qué me ha querido decir?</i> Si hay una palabra que no entiendes, búscala. No pases al siguiente párrafo si no has entendido el anterior.</p>
        <h3>3. Comprobación</h3>
        <p>Cierra el libro y explica con tus palabras lo que has leído, o responde a las preguntas del tema sin mirar. Si no puedes, vuelve al párrafo concreto.</p>
        <div class="nota-caja">📌 Después de esto vendrán el subrayado y el esquema. ¡Pero nunca se subraya en la primera lectura!</div>` },
      { tipo: 'lectura', titulo: 'Ideas principales y secundarias', html: `
        <p>Casi todos los párrafos tienen una <b>idea principal</b>: lo más importante, lo que no se puede quitar sin que el párrafo pierda su sentido. Las <b>ideas secundarias</b> la explican, la amplían o dan ejemplos.</p>
        <p>Ejemplo:</p>
        <blockquote>“Los gatos duermen muchas horas al día. Un gato adulto puede dormir entre 12 y 16 horas. Los más jóvenes y los más mayores duermen todavía más.”</blockquote>
        <p>👉 Idea principal: <b>los gatos duermen muchas horas</b>. Lo demás son datos que la amplían.</p>
        <p><b>Truco:</b> la idea principal suele estar al principio del párrafo (a veces al final). Pregúntate: <i>si tuviera que resumir este párrafo en una frase, ¿cuál sería?</i></p>` },
      { tipo: 'quiz', titulo: 'Encuentra la idea principal', preguntas: [
        { p: '“El cerebro consume mucha energía. Aunque solo pesa alrededor del 2 % del cuerpo, gasta cerca del 20 % de la energía que usamos. Por eso es importante desayunar.” ¿Cuál es la idea principal?', o: ['El cerebro pesa un 2 %', 'El cerebro consume mucha energía', 'Hay que desayunar'], c: 1, e: 'Los porcentajes y el desayuno explican o derivan de esa idea.' },
        { p: '“Hay muchas formas de reciclar en casa: separar el plástico, el papel y el vidrio, reutilizar bolsas o dar ropa que ya no usas.” ¿Cuál es la idea principal?', o: ['Separar el vidrio', 'Hay muchas formas de reciclar en casa', 'Dar ropa usada'], c: 1, e: 'El resto son ejemplos de esa idea.' },
        { p: '¿Cuándo debes empezar a subrayar un texto?', o: ['En la primera lectura', 'Después de haberlo leído y entendido', 'Nunca'], c: 1, e: 'Primero hay que entender; si no, subrayas casi todo.' }
      ] },
      { tipo: 'texto', titulo: 'Las ideas de “Los volcanes”', minPalabras: 20, texto: 'volcanes',
        enunciado: '<p>Lee el texto con el método de los 3 pasos. Después escribe <b>la idea principal de cada uno de los 3 párrafos</b>, en una frase corta y con tus palabras (numéralas 1, 2 y 3).</p>',
        rubrica: ['Escribe una idea por cada párrafo (3 en total)', 'Cada idea es la principal, no un detalle', 'Usa sus propias palabras, no copia frases enteras', 'Las frases son cortas y claras'] }
    ]
  },
  /* ---------------------------------------------------- 4 */
  {
    id: 'subrayado', icono: '🖍️', color: '#f59e0b',
    titulo: 'Subrayado inteligente',
    descripcion: 'Subrayar poco y bien: solo palabras clave.',
    pasos: [
      { tipo: 'lectura', titulo: 'Las reglas del buen subrayado', html: `
        <ol>
          <li><b>Nunca en la primera lectura.</b> Primero entiende, luego subraya.</li>
          <li><b>Palabras clave, no frases enteras.</b> Subraya los sustantivos, verbos y datos que llevan el significado.</li>
          <li><b>Poco:</b> como mucho, alrededor de un 20–30 % del texto. Si subrayas casi todo, no destacas nada.</li>
          <li><b>Dos colores como máximo</b>: uno para las ideas principales y otro para las secundarias o datos.</li>
          <li><b>La prueba:</b> si lees solo lo subrayado, debería entenderse el texto (como un telegrama).</li>
        </ol>
        <div class="nota-caja">⚠️ Subrayar, por sí solo, ayuda poco a recordar. Su verdadera utilidad es prepararte para hacer un esquema o un resumen, y para repasar después.</div>` },
      { tipo: 'subrayado', titulo: 'Subraya: El ciclo del agua', texto: 'agua',
        enunciado: '<p>Toca las palabras para subrayarlas (toca otra vez para quitarlas). Subraya solo las <b>palabras clave</b>. Al final, lee solo lo subrayado: ¿se entiende?</p>',
        rubrica: ['Subraya los conceptos clave (evaporación, condensación, precipitación…)', 'No subraya frases enteras ni palabras vacías', 'Subraya entre un 15 % y un 30 % del texto', 'Leyendo solo lo subrayado se entiende la idea del texto'] },
      { tipo: 'subrayado', titulo: 'Subraya: La Revolución Industrial', texto: 'industrial',
        enunciado: '<p>Ahora con un texto de Historia. Fíjate en las causas, los cambios y las consecuencias.</p>',
        rubrica: ['Subraya lugar y época, la máquina de vapor y los sectores principales', 'Subraya las consecuencias sociales (ciudades, proletariado, sindicatos)', 'No subraya demasiado (máx. ~30 %)', 'Leyendo solo lo subrayado se entiende el texto'] },
      { tipo: 'quiz', titulo: 'Repaso del subrayado', preguntas: [
        { p: '¿Qué porcentaje del texto es razonable subrayar?', o: ['Alrededor de un 20–30 %', 'Más de la mitad', 'Todo lo que parezca importante'], c: 0, e: 'Si subrayas demasiado, nada destaca.' },
        { p: '¿Qué se subraya?', o: ['Frases completas', 'Palabras clave', 'Los ejemplos'], c: 1, e: 'Las palabras que llevan el significado.' },
        { p: '¿Cuál es la mejor prueba de que has subrayado bien?', o: ['Que quede bonito', 'Que leyendo solo lo subrayado se entienda el texto', 'Que hayas usado muchos colores'], c: 1, e: 'Debe leerse como un telegrama con sentido.' }
      ] }
    ]
  },
  /* ---------------------------------------------------- 5 */
  {
    id: 'sintesis', icono: '🗂️', color: '#ef4444',
    titulo: 'Esquemas y resúmenes',
    descripcion: 'Organizar las ideas y contarlas con tus palabras.',
    pasos: [
      { tipo: 'lectura', titulo: 'Cómo hacer un buen esquema', html: `
        <p>Un esquema es el <b>“esqueleto” del tema</b>: muestra de un vistazo las ideas y cómo se ordenan. Se hace a partir del subrayado.</p>
        <ul>
          <li><b>Título</b> arriba.</li>
          <li>Ideas de <b>más general a más concreta</b>, de izquierda a derecha o de arriba abajo.</li>
          <li><b>Palabras clave</b>, no frases largas.</li>
          <li>Que se vea la <b>jerarquía</b>: llaves, números (1, 1.1, 1.2…) o flechas.</li>
        </ul>
        <p>Tipos más usados:</p>
        <pre class="esquema-ej">Ciclo del agua
 ├─ Motor: Sol + gravedad
 ├─ Fases
 │   ├─ Evaporación (+ transpiración)
 │   ├─ Condensación → nubes
 │   └─ Precipitación (lluvia, nieve, granizo)
 └─ En el suelo
     ├─ Escorrentía → ríos, mares
     └─ Infiltración → acuíferos</pre>
        <p>Hazlo a mano en una hoja: es más fácil organizarlo y luego podrás hacerle una foto para que te lo corrijan.</p>` },
      { tipo: 'lectura', titulo: 'Cómo hacer un buen resumen', html: `
        <p>Un resumen cuenta las ideas importantes <b>con tus propias palabras</b>, en un texto seguido y bien redactado.</p>
        <ul>
          <li>Más o menos <b>un cuarto</b> de la longitud original.</li>
          <li>Solo ideas principales (y alguna secundaria importante). Sin ejemplos ni detalles.</li>
          <li><b>Con tus palabras</b>: no se vale pegar trozos de frases del libro.</li>
          <li>Usa <b>conectores</b> para unir ideas: <i>además, por eso, sin embargo, como consecuencia, finalmente…</i></li>
          <li>Sin opiniones personales.</li>
        </ul>
        <p><b>Truco:</b> escribe el resumen con el libro cerrado, mirando solo tu esquema. Así además practicas recordar.</p>` },
      { tipo: 'foto', titulo: 'Esquema del ciclo del agua', texto: 'agua',
        enunciado: '<p>Usando tu subrayado del módulo anterior, haz <b>en papel un esquema</b> de “El ciclo del agua” (¡sin copiar el ejemplo de la lectura!, prueba con otro formato: llaves o numérico). Hazle una foto y súbela.</p>',
        rubrica: ['Tiene título', 'Muestra la jerarquía de ideas (de general a concreto)', 'Usa palabras clave, no frases largas', 'Incluye las fases del ciclo y lo que pasa con el agua en el suelo', 'Es claro y ordenado'] },
      { tipo: 'texto', titulo: 'Resume la Revolución Industrial', minPalabras: 50, texto: 'industrial',
        enunciado: '<p>Escribe un <b>resumen de entre 60 y 100 palabras</b> del texto. Intenta hacerlo mirando solo lo que subrayaste y, al final, comprueba con el texto.</p>',
        rubrica: ['Recoge las ideas principales: qué fue, dónde y cuándo, la máquina de vapor, el transporte y las consecuencias sociales', 'Está escrito con sus propias palabras', 'Usa conectores y se lee como un texto seguido', 'No incluye detalles innecesarios ni opiniones', 'Longitud adecuada (60–100 palabras)'] },
      { tipo: 'quiz', titulo: 'Esquema o resumen', preguntas: [
        { p: '¿Qué diferencia principal hay entre un esquema y un resumen?', o: ['El esquema usa palabras clave y jerarquía; el resumen es un texto seguido', 'No hay diferencia', 'El resumen es más largo que el texto original'], c: 0 },
        { p: '¿Qué longitud aproximada debe tener un resumen?', o: ['Igual que el texto', 'La mitad', 'Alrededor de un cuarto'], c: 2 },
        { p: '¿Cuál NO debe aparecer en un resumen?', o: ['Las ideas principales', 'Tu opinión personal', 'Conectores'], c: 1 }
      ] }
    ]
  },
  /* ---------------------------------------------------- 6 */
  {
    id: 'mapas', icono: '🕸️', color: '#14b8a6',
    titulo: 'Mapas conceptuales',
    descripcion: 'Conceptos unidos por flechas que forman frases.',
    pasos: [
      { tipo: 'lectura', titulo: 'Qué es un mapa conceptual', html: `
        <p>Lo inventó el investigador Joseph Novak. Es un dibujo que muestra cómo se <b>relacionan</b> los conceptos de un tema. Tiene tres elementos:</p>
        <ul>
          <li><b>Conceptos</b>: palabras clave dentro de óvalos o cajas (“fotosíntesis”, “clorofila”…).</li>
          <li><b>Palabras de enlace</b>: escritas sobre las flechas (“necesita”, “produce”, “se encuentra en”…).</li>
          <li><b>Proposiciones</b>: lo que se lee al unir concepto + enlace + concepto. Ej.: <i>Fotosíntesis → produce → oxígeno</i>.</li>
        </ul>
        <h3>Pasos</h3>
        <ol>
          <li>Haz una lista de 8–15 conceptos clave del tema.</li>
          <li>Ordénalos de más general (arriba) a más concreto (abajo).</li>
          <li>Únelos con flechas y escribe <b>siempre</b> la palabra de enlace.</li>
          <li>Busca <b>enlaces cruzados</b> entre ramas distintas: ¡ahí está la comprensión de verdad!</li>
          <li>Revísalo y rehazlo: el primer borrador nunca es el definitivo.</li>
        </ol>
        <p><b>No confundir</b> con el mapa mental, que parte de una idea central y se ramifica libremente con dibujos y colores, sin palabras de enlace.</p>` },
      { tipo: 'quiz', titulo: 'Comprueba', preguntas: [
        { p: '¿Qué se escribe sobre las flechas de un mapa conceptual?', o: ['Nada', 'Palabras de enlace', 'Números'], c: 1 },
        { p: '¿Dónde van los conceptos más generales?', o: ['Arriba', 'Abajo', 'En cualquier sitio'], c: 0 },
        { p: '“Clorofila → se encuentra en → cloroplastos” es…', o: ['Un concepto', 'Una proposición', 'Un mapa mental'], c: 1 }
      ] },
      { tipo: 'foto', titulo: 'Tu mapa de la fotosíntesis', texto: 'fotosintesis',
        enunciado: '<p>Lee el texto y haz en papel un <b>mapa conceptual</b> de la fotosíntesis con <b>al menos 8 conceptos</b>, palabras de enlace en todas las flechas y, si puedes, algún enlace cruzado. Hazle una foto.</p>',
        rubrica: ['Tiene al menos 8 conceptos clave del tema', 'Todas las flechas llevan palabras de enlace', 'Las proposiciones son correctas científicamente', 'Está jerarquizado (general arriba, concreto abajo)', 'Incluye al menos un enlace cruzado'] }
    ]
  },
  /* ---------------------------------------------------- 7 */
  {
    id: 'recuperar', icono: '🔁', color: '#ec4899',
    titulo: 'Ponte a prueba y repasa espaciado',
    descripcion: 'Las dos técnicas con más evidencia científica.',
    pasos: [
      { tipo: 'lectura', titulo: 'La práctica de recuperación', html: `
        <p>Cada vez que <b>sacas algo de tu memoria</b> sin mirar, ese recuerdo se hace más fuerte. Es como abrir un camino en el bosque: cuanto más lo recorres, más fácil es pasar.</p>
        <h3>Formas de ponerte a prueba</h3>
        <ul>
          <li><b>Tarjetas</b> (flashcards): pregunta por un lado, respuesta por el otro.</li>
          <li><b>Hoja en blanco</b>: cierra el libro y escribe todo lo que recuerdes del tema. Luego compara y completa con otro color lo que faltaba.</li>
          <li><b>Preguntas del final del tema</b> o exámenes de otros años, sin mirar.</li>
          <li><b>Explicarlo en voz alta</b> como si fueras el profe.</li>
        </ul>
        <div class="nota-caja">🔑 Muy importante: después de ponerte a prueba, <b>comprueba siempre las respuestas</b> y corrige lo que esté mal. Así aprendes de tus errores.</div>` },
      { tipo: 'lectura', titulo: 'Repaso espaciado e intercalado', html: `
        <p><b>Espaciar</b> es repartir los repasos en el tiempo, dejando cada vez más días entre uno y otro: por ejemplo, 1 día, 3 días, 1 semana… Justo cuando empiezas a olvidar, repasas, y el recuerdo se refuerza mucho.</p>
        <h3>El sistema Leitner</h3>
        <p>Es una forma sencilla de espaciar con tarjetas. Tienes 5 cajas:</p>
        <ul>
          <li>Las tarjetas nuevas van a la <b>caja 1</b> (se repasan cada día).</li>
          <li>Si aciertas, la tarjeta sube a la siguiente caja, que se repasa con menos frecuencia (2, 4, 8, 16 días).</li>
          <li>Si fallas, vuelve a la caja 1.</li>
        </ul>
        <p>Así dedicas más tiempo a lo que te cuesta y menos a lo que ya sabes. ¡La herramienta <b>Tarjetas</b> de esta app lo hace por ti!</p>
        <h3>Intercalar</h3>
        <p>En Matemáticas o Física, en vez de hacer 10 problemas iguales seguidos, <b>mezcla tipos</b> (un poco de ecuaciones, luego de porcentajes, luego otra vez ecuaciones). Cuesta más, pero aprendes a reconocer qué método usar en cada caso, que es justo lo que pide el examen.</p>` },
      { tipo: 'tarea', titulo: 'Crea tu primer mazo de tarjetas', enlace: '#/h/tarjetas', enlaceTexto: 'Abrir Tarjetas 🃏',
        enunciado: '<p>Elige un tema que estés dando ahora en clase y crea un mazo con <b>al menos 10 tarjetas</b>. Consejos: una sola idea por tarjeta; pregunta concreta; respuesta corta.</p>',
        checklist: ['He creado un mazo de una asignatura real', 'Tiene al menos 10 tarjetas', 'Cada tarjeta tiene una sola pregunta concreta', 'He hecho una primera sesión de estudio'] },
      { tipo: 'tarea', titulo: 'Prueba la hoja en blanco', enlace: '#/h/hojablanco', enlaceTexto: 'Abrir Hoja en blanco 📝',
        enunciado: '<p>Elige un apartado de un tema que hayas estudiado esta semana. Usa la herramienta <b>Hoja en blanco</b>: pega o fotografía el texto original, escribe de memoria todo lo que recuerdes y deja que el Profe Búho te diga qué te faltaba.</p>',
        checklist: ['He escrito sin mirar el libro', 'He comparado con el original', 'He repasado lo que me faltaba'] },
      { tipo: 'tarea', titulo: 'Planifica repasos para un examen', enlace: '#/h/planificador', enlaceTexto: 'Abrir el planificador 🗓️',
        enunciado: '<p>Si tienes algún examen próximo, usa <b>“Plan de examen”</b> en el planificador para crear repasos espaciados automáticamente. Si no tienes ninguno, inventa uno para dentro de 10 días y mira cómo quedaría.</p>',
        checklist: ['He creado un plan de examen', 'Los repasos están repartidos en varios días', 'Sé qué técnica usaré en cada repaso (tarjetas, hoja en blanco, preguntas…)'] },
      { tipo: 'quiz', titulo: 'Repaso', preguntas: [
        { p: 'En el sistema Leitner, si fallas una tarjeta de la caja 4…', o: ['Se queda en la caja 4', 'Vuelve a la caja 1', 'Se elimina'], c: 1 },
        { p: '¿Qué es lo más importante tras ponerte a prueba?', o: ['Comprobar y corregir las respuestas', 'Pasar rápido al siguiente tema', 'Contar los aciertos'], c: 0 },
        { p: '¿Qué significa “intercalar” en Matemáticas?', o: ['Hacer muchos problemas iguales seguidos', 'Mezclar distintos tipos de problemas', 'Estudiar con un compañero'], c: 1 },
        { p: 'La técnica de la hoja en blanco consiste en…', o: ['Copiar el tema en limpio', 'Escribir de memoria todo lo que recuerdas y luego comparar', 'Dejar una hoja libre para dibujar'], c: 1 }
      ] }
    ]
  },
  /* ---------------------------------------------------- 8 */
  {
    id: 'entender', icono: '💡', color: '#eab308',
    titulo: 'Entender de verdad y recordar',
    descripcion: 'Preguntarse por qué, la técnica Feynman y las reglas mnemotécnicas.',
    pasos: [
      { tipo: 'lectura', titulo: 'Pregúntate ¿por qué? y explícalo', html: `
        <p><b>Interrogación elaborativa:</b> mientras estudias, pregúntate <i>¿por qué es así?, ¿cómo se relaciona con lo que ya sé?</i> Por ejemplo: <i>“¿Por qué las ciudades crecieron con la Revolución Industrial?” → porque las fábricas estaban allí y la gente iba buscando trabajo.</i> Las cosas que entiendes se recuerdan mucho mejor que las que memorizas “a pelo”.</p>
        <h3>La técnica Feynman</h3>
        <p>Recibe el nombre del físico Richard Feynman, famoso por explicar cosas difíciles de forma sencilla:</p>
        <ol>
          <li>Elige un concepto.</li>
          <li>Explícalo por escrito <b>como si se lo contaras a un niño de 10 años</b>, sin palabras técnicas que no expliques.</li>
          <li>Donde te atasques o tengas que usar “palabros”, ahí tienes un <b>hueco</b>: vuelve al libro.</li>
          <li>Simplifica y usa un ejemplo o una comparación.</li>
        </ol>
        <h3>Palabras + dibujos</h3>
        <p>Acompañar lo que estudias con un dibujo sencillo, un gráfico o una línea del tiempo ayuda a recordar, porque guardas la información de dos maneras.</p>` },
      { tipo: 'lectura', titulo: 'Reglas mnemotécnicas', html: `
        <p>Sirven para memorizar listas, datos o vocabulario que no tienen una lógica que entender.</p>
        <ul>
          <li><b>Acrónimos:</b> juntar las iniciales. Ej.: para los colores del arcoíris en inglés, “ROYGBIV”.</li>
          <li><b>Frases:</b> una frase cuyas palabras empiezan como lo que quieres recordar. Ej.: “<b>M</b>i <b>V</b>ieja <b>T</b>ía <b>M</b>aría <b>J</b>amás <b>S</b>upo <b>U</b>sar <b>N</b>ada” → Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano, Neptuno.</li>
          <li><b>Historias o imágenes absurdas:</b> cuanto más rara y visual, mejor se recuerda.</li>
          <li><b>Palabra clave (idiomas):</b> une la palabra nueva con otra que suene parecido. Ej.: <i>“duck”</i> (pato) suena a “da”: imagina un pato que te <i>da</i> un regalo.</li>
          <li><b>Palacio de la memoria:</b> coloca cada cosa en un lugar de un recorrido que conoces bien (tu casa) y luego “pasea” mentalmente por él.</li>
        </ul>
        <p>⚠️ Son muy útiles para memorizar, pero no sustituyen a entender.</p>` },
      { tipo: 'tarea', titulo: 'Explica algo con la técnica Feynman', enlace: '#/h/feynman', enlaceTexto: 'Abrir Técnica Feynman 💡',
        enunciado: '<p>Elige un concepto que estés estudiando (por ejemplo: <i>fracción</i>, <i>célula</i>, <i>fotosíntesis</i>, <i>feudalismo</i>…) y explícalo en la herramienta Feynman. El Profe Búho hará de niño curioso y te hará preguntas.</p>',
        checklist: ['He explicado un concepto sin palabras técnicas sin explicar', 'He usado un ejemplo o comparación', 'He mirado el libro para rellenar los huecos que encontré'] },
      { tipo: 'texto', titulo: 'Inventa tu regla mnemotécnica', minPalabras: 25,
        enunciado: '<p>Elige algo que tengas que memorizar (una lista, unas fechas, vocabulario de inglés, los huesos del brazo…). <b>Inventa una regla mnemotécnica</b> propia y explica cómo funciona y qué te ayuda a recordar.</p>',
        rubrica: ['Dice claramente qué quiere memorizar', 'La regla es original (inventada por el alumno)', 'Funciona: permite recuperar los datos correctos', 'Explica cómo usarla'] },
      { tipo: 'quiz', titulo: 'Repaso', preguntas: [
        { p: 'En la técnica Feynman, ¿a quién imaginas que se lo explicas?', o: ['A un profesor universitario', 'A un niño de 10 años', 'A ti mismo dentro de un año'], c: 1 },
        { p: '¿Para qué son más útiles las reglas mnemotécnicas?', o: ['Para entender razonamientos', 'Para memorizar listas y datos sueltos', 'Para hacer resúmenes'], c: 1 },
        { p: 'Preguntarse “¿por qué?” mientras estudias sirve para…', o: ['Relacionar ideas y entenderlas mejor', 'Perder el tiempo', 'Memorizar fechas'], c: 0 }
      ] }
    ]
  },
  /* ---------------------------------------------------- 9 */
  {
    id: 'examenes', icono: '🎯', color: '#6366f1',
    titulo: 'Exámenes sin pánico',
    descripcion: 'Prepararlos con tiempo y afrontarlos con calma.',
    pasos: [
      { tipo: 'lectura', titulo: 'Antes del examen', html: `
        <ul>
          <li><b>Empieza con al menos una semana</b> de antelación y reparte los repasos (¡plan de examen!).</li>
          <li><b>Haz simulacros:</b> preguntas del libro, exámenes antiguos, tarjetas… sin mirar y con tiempo limitado.</li>
          <li>Dedica más tiempo a lo que <b>fallas</b> en los simulacros, no a lo que ya sabes.</li>
          <li><b>Duerme bien</b> la noche antes: mientras duermes, el cerebro consolida lo que has aprendido. Trasnochar estudiando suele salir caro.</li>
          <li>Prepara el material (bolis, calculadora…) la noche anterior.</li>
        </ul>` },
      { tipo: 'lectura', titulo: 'Durante el examen y los nervios', html: `
        <h3>Estrategia</h3>
        <ol>
          <li><b>Lee todo el examen</b> antes de empezar y fíjate en cuánto vale cada pregunta.</li>
          <li>Empieza por lo que mejor sabes: da confianza y asegura puntos.</li>
          <li>Lee bien cada enunciado: ¿piden explicar, comparar, definir, enumerar?</li>
          <li>Si te bloqueas en una pregunta, pasa a otra y vuelve después.</li>
          <li>Deja unos minutos al final para <b>revisar</b>.</li>
        </ol>
        <h3>Si te pones nervioso</h3>
        <p>Un poco de nervios es normal y hasta ayuda a concentrarse. Si son muchos:</p>
        <ul>
          <li><b>Respira lento</b>: coge aire por la nariz contando hasta 4 y suéltalo despacio contando hasta 6. Repite unas cuantas veces.</li>
          <li>Antes del examen, <b>escribe en un papel</b> durante unos minutos lo que te preocupa: a algunas personas les ayuda a “descargar” la cabeza.</li>
          <li>Recuerda que te has preparado con un buen método.</li>
          <li>Si los nervios te bloquean a menudo, <b>cuéntaselo a tu familia o a tu tutor/a</b>: hay formas de ayudarte.</li>
        </ul>` },
      { tipo: 'tarea', titulo: 'Plan para tu próximo examen',
        enunciado: '<p>Piensa en tu próximo examen real y prepáralo con todo lo aprendido.</p>',
        checklist: ['He creado un plan de examen con repasos espaciados', 'He hecho tarjetas o preguntas de práctica del tema', 'He hecho al menos un simulacro sin mirar', 'Tengo pensado cómo calmarme si me pongo nervioso'] },
      { tipo: 'quiz', titulo: 'Repaso final', preguntas: [
        { p: '¿Qué es lo primero que haces al recibir el examen?', o: ['Empezar por la pregunta 1', 'Leerlo entero', 'Contestar la más difícil'], c: 1 },
        { p: '¿Por qué es importante dormir bien antes del examen?', o: ['Porque el cerebro consolida lo aprendido mientras duermes', 'Solo para no tener sueño', 'No es importante'], c: 0 },
        { p: 'En los simulacros, ¿a qué dedicas más tiempo después?', o: ['A lo que ya sabes', 'A lo que has fallado', 'A nada, ya está'], c: 1 }
      ] },
      { tipo: 'texto', titulo: 'Tu método personal de estudio', minPalabras: 80,
        enunciado: '<p>¡Último reto! Elige el próximo tema que vayas a estudiar de cualquier asignatura y describe <b>paso a paso cómo lo vas a estudiar</b>, desde el primer día hasta el examen, usando <b>al menos 4 técnicas</b> de este curso. Di cuándo harás cada cosa.</p>',
        rubrica: ['Usa al menos 4 técnicas del curso de forma adecuada', 'Incluye ponerse a prueba (tarjetas, hoja en blanco, preguntas…)', 'Reparte el estudio en varios días con repasos', 'El orden de los pasos tiene sentido (leer → entender → organizar → practicar)', 'Es realista y concreto (días, tiempos)'] }
    ]
  }
];

/* Rúbricas para el corrector libre */
const RUBRICAS_LIBRES = {
  esquema: { nombre: 'Esquema', rubrica: ['Tiene título', 'Muestra la jerarquía de ideas', 'Usa palabras clave', 'Recoge las ideas importantes del tema', 'Es claro y ordenado'] },
  resumen: { nombre: 'Resumen', rubrica: ['Recoge las ideas principales', 'Está escrito con sus palabras', 'Usa conectores y se lee seguido', 'Sin detalles innecesarios ni opiniones', 'Longitud adecuada (≈ 1/4 del original)'] },
  mapa: { nombre: 'Mapa conceptual', rubrica: ['Conceptos clave en nodos', 'Palabras de enlace en todas las flechas', 'Proposiciones correctas', 'Jerarquía de general a concreto', 'Enlaces cruzados'] },
  subrayado: { nombre: 'Subrayado', rubrica: ['Subraya palabras clave, no frases', 'Cantidad adecuada (≈ 20–30 %)', 'Distingue ideas principales y secundarias', 'Leyendo lo subrayado se entiende el texto'] },
  apuntes: { nombre: 'Apuntes de clase', rubrica: ['Están organizados con títulos y apartados', 'Recogen las ideas importantes', 'Usan abreviaturas y palabras clave', 'Se pueden entender al releerlos', 'Incluyen preguntas o espacio para repasar'] },
  tarjetas: { nombre: 'Tarjetas de estudio', rubrica: ['Una sola idea por tarjeta', 'Preguntas concretas', 'Respuestas cortas y correctas', 'Cubren lo importante del tema'] },
  otro: { nombre: 'Otro trabajo', rubrica: ['Aplica bien la técnica de estudio', 'Es claro y ordenado', 'Recoge lo importante'] }
};
