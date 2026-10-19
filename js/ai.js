/* =========================================================
   CONEXIÓN CON LA IA (Claude de Anthropic o Gemini de Google)
   La clave se guarda solo en el navegador de este dispositivo.
   ========================================================= */

const AI = {
  PROVEEDORES: {
    claude: { nombre: 'Claude (Anthropic)', modeloPorDefecto: 'claude-haiku-5-5', web: 'https://console.anthropic.com/' },
    gemini: { nombre: 'Gemini (Google)', modeloPorDefecto: 'gemini-flash-latest', web: 'https://aistudio.google.com/apikey' }
  },

  ajustes() { return Store.data.ajustes; },

  configurada() {
    const a = this.ajustes();
    return !!(a.claves[a.proveedor] && a.claves[a.proveedor].trim());
  },

  SISTEMA_CORRECTOR: `Eres "Profe Búho", un tutor de técnicas de estudio para un alumno de 12-14 años que estudia 1.º-2.º de ESO en España. Corriges ejercicios sobre TÉCNICAS DE ESTUDIO (subrayado, esquemas, resúmenes, mapas conceptuales, planificación, autoevaluación, explicaciones...).
Reglas:
- Evalúa sobre todo cómo aplica la técnica, siguiendo la rúbrica. No penalices la letra ni pequeñas faltas salvo que impidan entender (puedes mencionarlas aparte, con amabilidad).
- Sé concreto: refiérete a partes reales de su trabajo.
- Tono cercano, motivador y honesto. Si algo está mal, dilo claramente pero sin humillar. Nada de elogios vacíos.
- No le hagas el trabajo: da pistas y ejemplos breves, nunca la solución completa.
- Si la imagen no se ve bien, está vacía o no tiene relación con la tarea, explícalo en "resumen", pon "nota": null y pide otra foto.
- Si aparece contenido inapropiado, o algo que indique que el alumno lo está pasando mal o está en peligro, no corrijas: responde con calma y cariño animándole a hablarlo con un adulto de confianza, con "nota": null.
- Español de España, frases cortas y claras. Máximo 4 elementos en cada lista.
Responde ÚNICAMENTE con un objeto JSON válido (sin markdown ni texto fuera del JSON) con esta forma:
{"nota": número de 0 a 10 con como mucho un decimal, o null, "resumen": "1-2 frases", "bien": ["..."], "mejorar": ["..."], "siguientePaso": "una acción concreta", "preguntas": []}`,

  /** Evalúa un trabajo. imagenesSon: 'alumno' | 'original' */
  async evaluar({ titulo, enunciado, rubrica = [], referencia = '', textoAlumno = '', imagenes = [], imagenesSon = 'alumno', extra = '' }) {
    let t = `TAREA: ${titulo}\nENUNCIADO: ${limpiarHTML(enunciado)}\n`;
    if (rubrica.length) t += `RÚBRICA (criterios a valorar):\n${rubrica.map(r => '- ' + r).join('\n')}\n`;
    if (referencia) t += `\nTEXTO ORIGINAL DE REFERENCIA:\n"""\n${referencia}\n"""\n`;
    if (imagenes.length) {
      t += imagenesSon === 'original'
        ? `\nLa(s) imagen(es) adjunta(s) son el MATERIAL ORIGINAL que el alumno estudió (no su trabajo).\n`
        : `\nEl trabajo del alumno está en la(s) imagen(es) adjunta(s).\n`;
    }
    if (textoAlumno) t += `\nRESPUESTA DEL ALUMNO:\n"""\n${textoAlumno}\n"""\n`;
    if (extra) t += `\n${extra}\n`;
    const r = await this.pedirJSON(this.SISTEMA_CORRECTOR, t, imagenes);
    return normalizarEvaluacion(r);
  },

  async generarTarjetas({ texto = '', imagenes = [], cantidad = 10 }) {
    const sys = `Eres un profesor que crea tarjetas de estudio (flashcards) para un alumno de 13 años. Reglas: una sola idea por tarjeta; pregunta concreta y clara; respuesta corta (máximo 20 palabras); solo información que aparezca en el material; español de España. Responde ÚNICAMENTE con JSON: {"tarjetas":[{"p":"pregunta","r":"respuesta"}]}`;
    const t = `Crea ${cantidad} tarjetas a partir de este material.${texto ? `\n"""\n${texto}\n"""` : '\nEl material está en la(s) imagen(es).'}`;
    const r = await this.pedirJSON(sys, t, imagenes);
    return (r.tarjetas || []).filter(x => x && x.p && x.r).map(x => ({ p: String(x.p), r: String(x.r) }));
  },

  async probar() {
    const r = await this.pedirJSON('Responde solo con JSON.', 'Devuelve {"ok": true}', []);
    return !!r.ok;
  },

  /* ---------- llamadas de bajo nivel ---------- */
  async pedirJSON(sistema, texto, imagenes) {
    const a = this.ajustes();
    if (!this.configurada()) throw new Error('NO_CONFIG');
    const prov = a.proveedor;
    const modelo = (a.modelos[prov] || this.PROVEEDORES[prov].modeloPorDefecto).trim();
    const clave = a.claves[prov].trim();
    const txt = prov === 'gemini'
      ? await this.llamarGemini(clave, modelo, sistema, texto, imagenes)
      : await this.llamarClaude(clave, modelo, sistema, texto, imagenes);
    return extraerJSON(txt);
  },

  async llamarClaude(clave, modelo, sistema, texto, imagenes) {
    const contenido = imagenes.map(dataUrl => {
      const { mime, data } = partirDataURL(dataUrl);
      return { type: 'image', source: { type: 'base64', media_type: mime, data } };
    });
    contenido.push({ type: 'text', text: texto });
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': clave,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({ model: modelo, max_tokens: 2000, system: sistema, messages: [{ role: 'user', content: contenido }] })
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw errorHTTP(res.status, json?.error?.message);
    return (json.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n');
  },

  async llamarGemini(clave, modelo, sistema, texto, imagenes) {
    const parts = imagenes.map(dataUrl => {
      const { mime, data } = partirDataURL(dataUrl);
      return { inlineData: { mimeType: mime, data } };
    });
    parts.push({ text: texto });
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelo)}:generateContent`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': clave },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: sistema }] },
        contents: [{ role: 'user', parts }],
        generationConfig: { temperature: 0.4, responseMimeType: 'application/json' }
      })
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw errorHTTP(res.status, json?.error?.message);
    const cand = json.candidates && json.candidates[0];
    if (!cand) throw new Error('La IA no ha devuelto respuesta (puede que el contenido se haya bloqueado).');
    return (cand.content?.parts || []).map(p => p.text || '').join('\n');
  }
};

/* ---------- utilidades ---------- */
function limpiarHTML(html) {
  const d = document.createElement('div');
  d.innerHTML = html || '';
  return (d.textContent || '').replace(/\s+/g, ' ').trim();
}

function partirDataURL(dataUrl) {
  const m = /^data:([^;]+);base64,(.*)$/.exec(dataUrl);
  return { mime: m ? m[1] : 'image/jpeg', data: m ? m[2] : '' };
}

function extraerJSON(txt) {
  if (!txt) throw new Error('Respuesta vacía de la IA.');
  let s = txt.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  try { return JSON.parse(s); } catch (e) { /* sigue */ }
  const i = s.indexOf('{'), j = s.lastIndexOf('}');
  if (i >= 0 && j > i) {
    try { return JSON.parse(s.slice(i, j + 1)); } catch (e) { /* sigue */ }
  }
  throw new Error('La IA respondió en un formato inesperado. Inténtalo de nuevo.');
}

function normalizarEvaluacion(r) {
  const lista = x => Array.isArray(x) ? x.map(String).slice(0, 5) : (x ? [String(x)] : []);
  let nota = r.nota;
  if (nota !== null && nota !== undefined) {
    nota = Number(nota);
    nota = isNaN(nota) ? null : Math.max(0, Math.min(10, Math.round(nota * 10) / 10));
  } else nota = null;
  return {
    nota,
    resumen: String(r.resumen || ''),
    bien: lista(r.bien),
    mejorar: lista(r.mejorar),
    siguientePaso: String(r.siguientePaso || ''),
    preguntas: lista(r.preguntas)
  };
}

function errorHTTP(status, msg) {
  let t;
  if (status === 401 || status === 403) t = 'La clave de la IA no es válida o no tiene permisos. Revísala en el panel de padres.';
  else if (status === 404) t = 'No se encuentra el modelo de IA indicado. Revisa el nombre del modelo en el panel de padres.';
  else if (status === 429) t = 'Demasiadas peticiones o límite de uso alcanzado. Espera un minuto y vuelve a intentarlo.';
  else if (status >= 500) t = 'El servicio de IA no está disponible ahora mismo. Prueba en un rato.';
  else t = 'Error al contactar con la IA (' + status + ').';
  const e = new Error(t + (msg ? '\nDetalle: ' + msg : ''));
  e.status = status;
  return e;
}

/** Reduce y comprime una foto para enviarla (máx. 1600 px, JPEG). */
function comprimirImagen(file, max = 1600, calidad = 0.85) {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onerror = () => reject(new Error('No se pudo leer la imagen.'));
    lector.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Formato de imagen no compatible. Prueba con JPG o PNG.'));
      img.onload = () => {
        let { width: w, height: h } = img;
        const k = Math.min(1, max / Math.max(w, h));
        w = Math.round(w * k); h = Math.round(h * k);
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        resolve(c.toDataURL('image/jpeg', calidad));
      };
      img.src = lector.result;
    };
    lector.readAsDataURL(file);
  });
}
