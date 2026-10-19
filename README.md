# 🦉 Aprende a estudiar

App web para que un estudiante de ESO (12-14 años) aprenda técnicas de estudio con una ruta guiada: lecturas, tests, ejercicios escritos, ejercicios con foto, subrayado interactivo y tareas prácticas. Un tutor con IA ("Profe Búho") corrige los trabajos, incluidas fotos de esquemas, resúmenes y mapas conceptuales hechos en papel.

Es 100 % estática (HTML + CSS + JS, sin servidor ni compilación), así que funciona en **GitHub Pages**.

## Contenido

**9 módulos** (se desbloquean al completar la mitad del anterior):

1. Cómo aprende tu cerebro — curva del olvido, qué dice la ciencia (Dunlosky et al., 2013), mitos
2. Organízate — lugar de estudio, Pomodoro, planificación semanal
3. Leer para entender — prelectura, lectura comprensiva, ideas principales
4. Subrayado inteligente — ejercicios interactivos sobre textos
5. Esquemas y resúmenes — con foto de tu esquema en papel
6. Mapas conceptuales — con foto de tu mapa
7. Ponte a prueba y repasa espaciado — práctica de recuperación, Leitner, intercalado
8. Entender de verdad y recordar — técnica Feynman, reglas mnemotécnicas
9. Exámenes sin pánico — preparación, estrategia y nervios

**Herramientas:** Pomodoro · Tarjetas con repaso espaciado (sistema Leitner, con generación desde fotos de apuntes) · Planificador semanal con "plan de examen" automático · Hoja en blanco · Técnica Feynman · Corrector libre de fotos.

**Motivación:** puntos, niveles, racha de días y logros.

**Panel de padres** (protegido con PIN): configurar la IA, ver progreso y notas, historial de correcciones, copia de seguridad.

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub (por ejemplo `aprende-a-estudiar`). Puede ser público.
2. Sube **todo el contenido de esta carpeta** (`index.html`, `css/`, `js/`, `.nojekyll`, `README.md`) a la raíz del repositorio: *Add file → Upload files* y arrastra los archivos y carpetas.
3. Ve a **Settings → Pages**. En *Source* elige **Deploy from a branch**, rama **main** y carpeta **/ (root)**. Guarda.
4. En uno o dos minutos la app estará en `https://TU-USUARIO.github.io/aprende-a-estudiar/`.
5. Abre esa dirección en el móvil, tablet u ordenador de tu hijo/a. En el móvil puedes usar "Añadir a pantalla de inicio".

## Activar la corrección con IA

Sin IA la app funciona igual, pero los ejercicios de escritura y foto se resuelven con **autoevaluación** (lista de criterios). Para activar al Profe Búho:

1. Consigue una clave de API de uno de estos proveedores:
   - **Claude (Anthropic)** — https://console.anthropic.com/ → *API Keys*. Modelo por defecto: `claude-haiku-5-5` (rápido y barato, entiende imágenes).
   - **Gemini (Google)** — https://aistudio.google.com/apikey. Modelo por defecto: `gemini-flash-latest`.
2. En la app, entra en **⚙️ Padres**, crea un PIN, elige el proveedor, pega la clave y pulsa **Probar conexión**.
3. Si el modelo por defecto deja de existir, escribe en el campo "Modelo" el nombre de uno actual.

### Seguridad y privacidad — importante

- **Nunca pongas la clave en el código ni la subas a GitHub.** Se introduce en el panel de padres y se guarda solo en el navegador de ese dispositivo (localStorage).
- Cualquiera con acceso a ese navegador podría verla con conocimientos técnicos. El PIN es una protección básica, no una caja fuerte.
- **Pon un límite de gasto mensual** en la consola del proveedor (unos pocos euros sobran para uso familiar).
- Las fotos y textos se envían directamente del navegador al proveedor de IA elegido; no pasan por ningún otro servidor.
- En el **nivel gratuito de Gemini**, Google puede usar los datos para mejorar sus productos. Como son trabajos de un menor, es preferible usar Claude o el nivel de pago de Gemini.
- El progreso se guarda en el navegador. Usa *Exportar progreso* en el panel de padres para hacer copias o pasarlo a otro dispositivo.

## Personalizar

- **Contenidos:** todo está en `js/content.js` (módulos, lecturas, preguntas, textos de los ejercicios y rúbricas). Puedes añadir pasos de tipo `lectura`, `quiz`, `texto`, `foto`, `subrayado` o `tarea` siguiendo los ejemplos.
- **Tono del corrector:** instrucciones del Profe Búho en `SISTEMA_CORRECTOR` dentro de `js/ai.js`.
- **Aspecto:** `css/styles.css` (incluye modo oscuro automático).

## Base pedagógica

- Dunlosky, J. et al. (2013). *Improving Students' Learning With Effective Learning Techniques*. Psychological Science in the Public Interest. — La práctica de recuperación y la práctica distribuida obtienen la máxima utilidad; releer y subrayar, baja.
- Donoghue, G. M. y Hattie, J. A. C. (2021). *A Meta-Analysis of Ten Learning Techniques*. Frontiers in Education.
- Programas de técnicas de estudio de orientación en ESO (subrayado, esquema, resumen, mapa conceptual; método de lectura y planificación).
- Novak, J. D. — mapas conceptuales. Cirillo, F. — técnica Pomodoro. Leitner, S. — sistema de cajas.
