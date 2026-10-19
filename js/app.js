'use strict';
/* =========================================================
   APRENDE A ESTUDIAR — lógica de la aplicación
   ========================================================= */

/* ---------- utilidades ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Math.random().toString(36).slice(2, 10);
const z = n => String(n).padStart(2, '0');
function hoy(d = new Date()) { return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`; }
function aFecha(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
function sumarDias(s, n) { const d = aFecha(s); d.setDate(d.getDate() + n); return hoy(d); }
function diffDias(a, b) { return Math.round((aFecha(b) - aFecha(a)) / 86400000); }
const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
function fechaCorta(s) { const d = aFecha(s); return `${d.getDate()} ${MESES[d.getMonth()]}`; }
function contarPalabras(t) { return (t.trim().match(/\S+/g) || []).length; }

function toast(msg, tipo = '') {
  const t = $('#toast');
  t.textContent = msg; t.className = 'toast show ' + tipo;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.className = 'toast', 3200);
}

/* ---------- almacenamiento ---------- */
const Store = {
  k: 'aprendeAEstudiar_v1',
  data: null,
  defaults() {
    return {
      nombre: '', xp: 0, racha: { ultima: null, dias: 0 }, progreso: {}, borradores: {},
      mazos: [], plan: [], historial: [], pomodoros: {}, logros: [],
      ajustes: { proveedor: 'claude', claves: { claude: '', gemini: '' }, modelos: { claude: '', gemini: '' }, pin: '' }
    };
  },
  load() {
    let raw = null;
    try { raw = JSON.parse(localStorage.getItem(this.k)); } catch (e) { raw = null; }
    const d = this.defaults();
    this.data = Object.assign(d, raw || {});
    this.data.ajustes = Object.assign(this.defaults().ajustes, this.data.ajustes || {});
    this.data.ajustes.claves = Object.assign({ claude: '', gemini: '' }, this.data.ajustes.claves || {});
    this.data.ajustes.modelos = Object.assign({ claude: '', gemini: '' }, this.data.ajustes.modelos || {});
  },
  save() {
    try { localStorage.setItem(this.k, JSON.stringify(this.data)); }
    catch (e) { toast('No se ha podido guardar el progreso en este navegador.', 'error'); }
  }
};

/* ---------- puntos, niveles, racha, logros ---------- */
const XP_POR_TIPO = { lectura: 10, quiz: 20, texto: 30, foto: 30, subrayado: 30, tarea: 25 };
const NIVELES = ['Aprendiz', 'Explorador', 'Organizado', 'Estratega', 'Experto', 'Maestro del estudio'];
function nivel() {
  const xp = Store.data.xp, n = Math.floor(xp / 150);
  return { n: n + 1, nombre: NIVELES[Math.min(n, NIVELES.length - 1)], dentro: xp % 150, total: 150 };
}
function registrarActividad() {
  const r = Store.data.racha, h = hoy();
  if (r.ultima === h) return;
  r.dias = (r.ultima && diffDias(r.ultima, h) === 1) ? r.dias + 1 : 1;
  r.ultima = h;
}
function ganarXP(n) {
  Store.data.xp += n;
  registrarActividad();
  Store.save();
  toast(`+${n} puntos ✨`, 'ok');
  comprobarLogros();
}

const LOGROS = [
  { id: 'primer_paso', icono: '👣', nombre: 'Primer paso', desc: 'Completa tu primera actividad', ok: () => totalHechos() >= 1 },
  { id: 'modulo1', icono: '🏅', nombre: 'Módulo completo', desc: 'Termina un módulo entero', ok: () => MODULOS.some(m => pctModulo(m) === 100) },
  { id: 'mitad', icono: '🚀', nombre: 'A mitad de camino', desc: 'Completa la mitad del curso', ok: () => pctCurso() >= 50 },
  { id: 'curso', icono: '🎓', nombre: 'Graduado', desc: 'Completa todo el curso', ok: () => pctCurso() === 100 },
  { id: 'racha3', icono: '🔥', nombre: 'En racha', desc: '3 días seguidos estudiando', ok: () => Store.data.racha.dias >= 3 },
  { id: 'racha7', icono: '☄️', nombre: 'Imparable', desc: '7 días seguidos', ok: () => Store.data.racha.dias >= 7 },
  { id: 'tarjetas10', icono: '🃏', nombre: 'Coleccionista', desc: 'Crea 10 tarjetas', ok: () => Store.data.mazos.reduce((a, m) => a + m.tarjetas.length, 0) >= 10 },
  { id: 'caja5', icono: '📦', nombre: 'Memoria de hierro', desc: 'Sube una tarjeta a la caja 5', ok: () => Store.data.mazos.some(m => m.tarjetas.some(t => t.caja >= 5)) },
  { id: 'pomodoro4', icono: '🍅', nombre: 'Tomatero', desc: '4 pomodoros en total', ok: () => Object.values(Store.data.pomodoros).reduce((a, b) => a + b, 0) >= 4 },
  { id: 'nota9', icono: '🦉', nombre: 'Matrícula', desc: 'Saca un 9 o más con el Profe Búho', ok: () => Store.data.historial.some(h => h.nota >= 9) },
  { id: 'plan', icono: '🗓️', nombre: 'Planificador', desc: 'Crea un plan de examen', ok: () => Store.data.plan.some(p => p.tipo === 'Examen') }
];
function comprobarLogros() {
  LOGROS.forEach(l => {
    if (!Store.data.logros.includes(l.id) && l.ok()) {
      Store.data.logros.push(l.id); Store.save();
      setTimeout(() => toast(`🏆 ¡Logro desbloqueado: ${l.nombre}!`, 'ok'), 1200);
    }
  });
}

/* ---------- progreso ---------- */
function estadoPaso(mid, i) { return (Store.data.progreso[mid] || {})[i]; }
function pctModulo(m) {
  const p = Store.data.progreso[m.id] || {};
  return Math.round(m.pasos.filter((_, i) => p[i]?.hecho).length / m.pasos.length * 100);
}
function totalHechos() { return MODULOS.reduce((a, m) => a + m.pasos.filter((_, i) => estadoPaso(m.id, i)?.hecho).length, 0); }
function totalPasos() { return MODULOS.reduce((a, m) => a + m.pasos.length, 0); }
function pctCurso() { return Math.round(totalHechos() / totalPasos() * 100); }
function completarPaso(mod, i, extra = {}) {
  const p = Store.data.progreso[mod.id] || (Store.data.progreso[mod.id] = {});
  const ya = p[i]?.hecho;
  p[i] = Object.assign({}, p[i] || {}, extra, { hecho: true, fecha: hoy() });
  Store.save();
  if (!ya) ganarXP(XP_POR_TIPO[mod.pasos[i].tipo] || 10); else comprobarLogros();
}
function siguientePendiente() {
  for (const m of MODULOS) for (let i = 0; i < m.pasos.length; i++) if (!estadoPaso(m.id, i)?.hecho) return { m, i };
  return null;
}
function moduloDesbloqueado(idx) { return idx === 0 || pctModulo(MODULOS[idx - 1]) >= 50 || pctModulo(MODULOS[idx]) > 0; }

/* ---------- router ---------- */
let limpiezaVista = null;
function navegar(h) { location.hash = h; }
function render() {
  if (limpiezaVista) { limpiezaVista(); limpiezaVista = null; }
  const app = $('#app');
  const partes = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  window.scrollTo(0, 0);
  if (!Store.data.nombre && partes[0] !== 'padres') return vistaBienvenida(app);
  marcarNav(partes[0] || 'inicio');
  switch (partes[0]) {
    case 'm':
      if (partes[2] !== undefined) return vistaPaso(app, partes[1], +partes[2]);
      return vistaModulo(app, partes[1]);
    case 'h':
      return partes[1] ? vistaHerramienta(app, partes[1], partes.slice(2)) : vistaHerramientas(app);
    case 'logros': return vistaLogros(app);
    case 'padres': return vistaPadres(app);
    default: return vistaInicio(app);
  }
}
function marcarNav(sec) {
  const map = { inicio: 'inicio', m: 'inicio', h: 'h', logros: 'logros', padres: 'padres' };
  $$('.nav a').forEach(a => a.classList.toggle('activo', a.dataset.sec === map[sec]));
}

/* =========================================================
   VISTAS
   ========================================================= */
function vistaBienvenida(app) {
  app.innerHTML = `
  <section class="bienvenida card">
    <div class="buho-grande">🦉</div>
    <h1>¡Hola! Soy el Profe Búho</h1>
    <p>Voy a enseñarte a estudiar <b>mejor</b> (no más horas): técnicas que funcionan de verdad, ejercicios prácticos y correcciones personalizadas de tus esquemas, resúmenes y mapas.</p>
    <form id="f-nombre" class="fila">
      <label for="nombre" class="sr">¿Cómo te llamas?</label>
      <input id="nombre" maxlength="30" placeholder="¿Cómo te llamas?" autocomplete="given-name" required>
      <button class="btn primary">Empezar 🚀</button>
    </form>
    <p class="mini">Tu progreso se guarda en este dispositivo.</p>
  </section>`;
  $('#f-nombre').onsubmit = e => {
    e.preventDefault();
    const n = $('#nombre').value.trim();
    if (!n) return;
    Store.data.nombre = n; Store.save(); navegar('#/'); render();
  };
}

function vistaInicio(app) {
  const nv = nivel(), sig = siguientePendiente(), r = Store.data.racha;
  const rachaViva = r.ultima && diffDias(r.ultima, hoy()) <= 1 ? r.dias : 0;
  const pendTarjetas = tarjetasPendientes();
  const hoyPlan = Store.data.plan.filter(p => p.fecha === hoy());
  app.innerHTML = `
  <section class="hero card">
    <div>
      <h1>¡Hola, ${esc(Store.data.nombre)}! 👋</h1>
      <p class="sub">Nivel ${nv.n} · <b>${nv.nombre}</b></p>
      <div class="barra" aria-label="Puntos del nivel"><span style="width:${nv.dentro / nv.total * 100}%"></span></div>
      <p class="mini">${Store.data.xp} puntos · ${nv.total - nv.dentro} para el siguiente nivel</p>
    </div>
    <div class="stats">
      <div class="stat"><b>🔥 ${rachaViva}</b><span>días de racha</span></div>
      <div class="stat"><b>📚 ${pctCurso()}%</b><span>del curso</span></div>
    </div>
  </section>
  ${sig ? `<a class="card continuar" href="#/m/${sig.m.id}/${sig.i}">
      <span class="ic" style="background:${sig.m.color}22">${sig.m.icono}</span>
      <span><small>Continúa por aquí</small><b>${esc(sig.m.pasos[sig.i].titulo)}</b><small>${esc(sig.m.titulo)}</small></span>
      <span class="flecha">→</span></a>`
    : `<div class="card continuar"><span class="ic">🎓</span><span><b>¡Has completado el curso!</b><small>Sigue usando las herramientas cada semana.</small></span></div>`}
  ${(pendTarjetas || hoyPlan.length) ? `<section class="card hoy">
     <h2>Para hoy</h2>
     ${pendTarjetas ? `<a class="pill" href="#/h/tarjetas">🃏 ${pendTarjetas} tarjeta${pendTarjetas > 1 ? 's' : ''} por repasar</a>` : ''}
     ${hoyPlan.map(p => `<a class="pill ${p.hecho ? 'hecho' : ''}" href="#/h/planificador">${p.hecho ? '✅' : '🗓️'} ${esc(p.hora || '')} ${esc(p.asignatura)} · ${esc(p.tipo)}</a>`).join('')}
  </section>` : ''}
  <h2 class="titulo-sec">Tu ruta de aprendizaje</h2>
  <div class="ruta">
    ${MODULOS.map((m, idx) => {
      const pct = pctModulo(m), abierto = moduloDesbloqueado(idx);
      return `<a class="card modulo ${abierto ? '' : 'bloqueado'}" href="${abierto ? '#/m/' + m.id : 'javascript:void 0'}" ${abierto ? '' : 'aria-disabled="true" title="Completa al menos la mitad del módulo anterior"'}>
        <span class="num" style="background:${m.color}">${abierto ? m.icono : '🔒'}</span>
        <span class="txt"><b>${idx + 1}. ${esc(m.titulo)}</b><small>${esc(m.descripcion)}</small>
        <span class="barra fina"><span style="width:${pct}%;background:${m.color}"></span></span></span>
        <span class="pct">${pct === 100 ? '✅' : pct + '%'}</span></a>`;
    }).join('')}
  </div>
  <h2 class="titulo-sec">Herramientas</h2>
  <div class="grid-h">${HERRAMIENTAS.map(tarjetaHerramienta).join('')}</div>`;
  $$('.modulo.bloqueado', app).forEach(a => a.onclick = e => { e.preventDefault(); toast('🔒 Completa al menos la mitad del módulo anterior para desbloquearlo.'); });
}

function vistaModulo(app, id) {
  const m = MODULOS.find(x => x.id === id);
  if (!m) return navegar('#/');
  const icon = { lectura: '📖', quiz: '❓', texto: '✍️', foto: '📷', subrayado: '🖍️', tarea: '✅' };
  const nom = { lectura: 'Lectura', quiz: 'Test', texto: 'Ejercicio escrito', foto: 'Ejercicio con foto', subrayado: 'Ejercicio interactivo', tarea: 'Tarea práctica' };
  app.innerHTML = `
  <a href="#/" class="volver">← Inicio</a>
  <header class="card cab-modulo" style="--c:${m.color}">
    <span class="ic-grande">${m.icono}</span>
    <div><h1>${esc(m.titulo)}</h1><p>${esc(m.descripcion)}</p>
    <div class="barra"><span style="width:${pctModulo(m)}%;background:${m.color}"></span></div></div>
  </header>
  <ol class="pasos">
    ${m.pasos.map((p, i) => {
      const e = estadoPaso(m.id, i);
      return `<li><a class="card paso-item ${e?.hecho ? 'hecho' : ''}" href="#/m/${m.id}/${i}">
        <span class="ic">${e?.hecho ? '✅' : icon[p.tipo]}</span>
        <span><b>${esc(p.titulo)}</b><small>${nom[p.tipo]}${e?.nota != null ? ` · Nota: ${e.nota}` : ''}</small></span>
        <span class="flecha">→</span></a></li>`;
    }).join('')}
  </ol>`;
}

function vistaPaso(app, id, i) {
  const m = MODULOS.find(x => x.id === id);
  if (!m || !m.pasos[i]) return navegar('#/');
  const p = m.pasos[i];
  app.innerHTML = `
  <a href="#/m/${m.id}" class="volver">← ${esc(m.titulo)}</a>
  <div class="puntos-paso">${m.pasos.map((_, k) => `<a href="#/m/${m.id}/${k}" class="pt ${k === i ? 'actual' : ''} ${estadoPaso(m.id, k)?.hecho ? 'hecho' : ''}" aria-label="Paso ${k + 1}"></a>`).join('')}</div>
  <article class="card paso" style="--c:${m.color}">
    <p class="etiqueta">${m.icono} Paso ${i + 1} de ${m.pasos.length}</p>
    <h1>${esc(p.titulo)}</h1>
    <div id="cuerpo"></div>
  </article>
  <nav class="nav-pasos">
    ${i > 0 ? `<a class="btn" href="#/m/${m.id}/${i - 1}">← Anterior</a>` : '<span></span>'}
    ${i < m.pasos.length - 1 ? `<a class="btn" href="#/m/${m.id}/${i + 1}">Siguiente →</a>` : `<a class="btn" href="#/">Volver al inicio</a>`}
  </nav>`;
  const cuerpo = $('#cuerpo');
  const ctx = { m, i, p, cuerpo, siguiente: () => navegar(i < m.pasos.length - 1 ? `#/m/${m.id}/${i + 1}` : '#/') };
  ({ lectura: pasoLectura, quiz: pasoQuiz, texto: pasoTexto, foto: pasoFoto, subrayado: pasoSubrayado, tarea: pasoTarea })[p.tipo](ctx);
}

/* ---------- tipos de paso ---------- */
function pasoLectura({ m, i, p, cuerpo, siguiente }) {
  const hecho = estadoPaso(m.id, i)?.hecho;
  cuerpo.innerHTML = `<div class="lectura">${p.html}</div>
    <div class="acciones"><button class="btn primary" id="leido">${hecho ? 'Seguir →' : '¡Leído! ✔'}</button></div>`;
  $('#leido').onclick = () => { if (!hecho) completarPaso(m, i); siguiente(); };
}

function pasoQuiz({ m, i, p, cuerpo, siguiente }) {
  cuerpo.innerHTML = `<form id="quiz">
    ${p.preguntas.map((q, qi) => `<fieldset class="q" data-q="${qi}"><legend>${qi + 1}. ${q.p}</legend>
      ${q.o.map((op, oi) => `<label class="opt"><input type="radio" name="q${qi}" value="${oi}"><span>${op}</span></label>`).join('')}
      <div class="q-fb" hidden></div></fieldset>`).join('')}
    <div class="acciones"><button class="btn primary">Comprobar</button></div></form>
    <div id="quiz-res"></div>`;
  $('#quiz').onsubmit = e => {
    e.preventDefault();
    let ok = 0;
    p.preguntas.forEach((q, qi) => {
      const sel = $(`input[name=q${qi}]:checked`, cuerpo), fs = $(`[data-q="${qi}"]`, cuerpo), fb = $('.q-fb', fs);
      const v = sel ? +sel.value : -1, bien = v === q.c;
      if (bien) ok++;
      fs.classList.toggle('ok', bien); fs.classList.toggle('ko', !bien);
      fb.hidden = false;
      fb.innerHTML = (bien ? '✅ ¡Correcto! ' : `❌ ${v < 0 ? 'Sin responder. ' : ''}La correcta es: <b>${q.o[q.c]}</b>. `) + (q.e || '');
    });
    const n = p.preguntas.length, nota = Math.round(ok / n * 100) / 10, aprobado = ok / n >= 0.7;
    $('#quiz-res').innerHTML = `<div class="resultado ${aprobado ? 'ok' : 'ko'}">
      <b>${ok} de ${n}</b> · ${aprobado ? '¡Muy bien! 🎉' : 'Necesitas al menos un 70 %. Lee las explicaciones y vuelve a intentarlo.'}
      <div class="acciones">${aprobado ? '<button class="btn primary" id="seguir">Seguir →</button>' : '<button class="btn" id="otra">Reintentar</button>'}</div></div>`;
    if (aprobado) { completarPaso(m, i, { nota }); $('#seguir').onclick = siguiente; }
    else $('#otra').onclick = () => pasoQuiz({ m, i, p, cuerpo, siguiente });
    $('#quiz-res').scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
}

function textoReferencia(clave, abierto = true) {
  const t = TEXTOS[clave];
  if (!t) return '';
  return `<details class="ref" ${abierto ? 'open' : ''}><summary>📄 Texto: ${esc(t.titulo)}</summary>
    <div class="ref-txt">${t.parrafos.map(x => `<p>${esc(x)}</p>`).join('')}</div></details>`;
}
function referenciaPlana(clave) { const t = TEXTOS[clave]; return t ? t.titulo + '\n\n' + t.parrafos.join('\n\n') : ''; }
function rubricaHTML(rub) {
  return `<details class="rubrica"><summary>🎯 ¿Qué se valora?</summary><ul>${rub.map(r => `<li>${esc(r)}</li>`).join('')}</ul></details>`;
}

function pasoTexto({ m, i, p, cuerpo, siguiente }) {
  const clave = `${m.id}-${i}`;
  const est = estadoPaso(m.id, i);
  cuerpo.innerHTML = `<div class="enunciado">${p.enunciado}</div>
    ${p.texto ? textoReferencia(p.texto) : ''}
    <label class="sr" for="resp">Tu respuesta</label>
    <textarea id="resp" rows="9" placeholder="Escribe aquí tu respuesta…">${esc(Store.data.borradores[clave] || '')}</textarea>
    <p class="mini" id="contador"></p>
    ${rubricaHTML(p.rubrica)}
    <div class="acciones"><button class="btn primary" id="corregir">Corregir con el Profe Búho 🦉</button></div>
    <div id="fb">${est?.feedback ? feedbackHTML(est.feedback) : ''}</div>`;
  const ta = $('#resp'), cont = $('#contador');
  const actualizar = () => {
    const n = contarPalabras(ta.value);
    cont.textContent = `${n} palabras${p.minPalabras ? ` (mínimo ${p.minPalabras})` : ''}`;
    Store.data.borradores[clave] = ta.value; Store.save();
  };
  ta.oninput = actualizar; actualizar();
  $('#corregir').onclick = async () => {
    const txt = ta.value.trim();
    if (p.minPalabras && contarPalabras(txt) < p.minPalabras) return toast(`Escribe al menos ${p.minPalabras} palabras.`);
    await corregir({
      m, i, p, boton: $('#corregir'), destino: $('#fb'), siguiente,
      datos: { titulo: p.titulo, enunciado: p.enunciado, rubrica: p.rubrica, referencia: referenciaPlana(p.texto), textoAlumno: txt }
    });
  };
}

function pasoFoto({ m, i, p, cuerpo, siguiente }) {
  const est = estadoPaso(m.id, i);
  cuerpo.innerHTML = `<div class="enunciado">${p.enunciado}</div>
    ${p.texto ? textoReferencia(p.texto, false) : ''}
    ${rubricaHTML(p.rubrica)}
    <div id="subida"></div>
    <div class="acciones"><button class="btn primary" id="corregir">Corregir con el Profe Búho 🦉</button></div>
    <div id="fb">${est?.feedback ? feedbackHTML(est.feedback) : ''}</div>`;
  const sub = subidaFotos($('#subida'));
  $('#corregir').onclick = async () => {
    if (!sub.imagenes.length) return toast('Primero añade una foto de tu trabajo 📷');
    await corregir({
      m, i, p, boton: $('#corregir'), destino: $('#fb'), siguiente,
      datos: { titulo: p.titulo, enunciado: p.enunciado, rubrica: p.rubrica, referencia: referenciaPlana(p.texto), imagenes: sub.imagenes }
    });
  };
}

function pasoSubrayado({ m, i, p, cuerpo, siguiente }) {
  const t = TEXTOS[p.texto];
  const clave = `${m.id}-${i}`;
  let marcadas = new Set(Store.data.borradores[clave] || []);
  let idx = 0;
  const parrafos = t.parrafos.map(par => par.split(/(\s+)/).map(tok => {
    if (/^\s+$/.test(tok) || !tok) return tok;
    const k = idx++;
    return `<span class="w${marcadas.has(k) ? ' hl' : ''}" data-k="${k}">${esc(tok)}</span>`;
  }).join(''));
  const totalPal = idx;
  cuerpo.innerHTML = `<div class="enunciado">${p.enunciado}</div>
    <div class="herr-sub">
      <span id="pct-sub" class="pill"></span>
      <button class="btn mini-btn" id="ver-sub">👁️ Ver solo lo subrayado</button>
      <button class="btn mini-btn" id="borrar-sub">Borrar todo</button>
    </div>
    <div class="texto-sub" id="texto-sub"><h3>${esc(t.titulo)}</h3>${parrafos.map(x => `<p>${x}</p>`).join('')}</div>
    <div id="telegrama" class="telegrama" hidden></div>
    ${rubricaHTML(p.rubrica)}
    <div class="acciones"><button class="btn primary" id="corregir">Corregir mi subrayado 🦉</button></div>
    <div id="fb">${estadoPaso(m.id, i)?.feedback ? feedbackHTML(estadoPaso(m.id, i).feedback) : ''}</div>`;
  const pct = () => Math.round(marcadas.size / totalPal * 100);
  const pintar = () => {
    const v = pct();
    $('#pct-sub').textContent = `Subrayado: ${v}%`;
    $('#pct-sub').className = 'pill ' + (v === 0 ? '' : v <= 30 ? 'ok' : v <= 40 ? 'aviso' : 'mal');
    Store.data.borradores[clave] = [...marcadas]; Store.save();
  };
  const fragmentos = () => {
    const ws = $$('.w', cuerpo), out = []; let act = [];
    ws.forEach(w => { if (w.classList.contains('hl')) act.push(w.textContent); else if (act.length) { out.push(act.join(' ')); act = []; } });
    if (act.length) out.push(act.join(' '));
    return out;
  };
  // tocar o arrastrar para subrayar
  let arrastrando = false, modo = true;
  const zona = $('#texto-sub');
  const aplicar = el => {
    if (!el || !el.classList || !el.classList.contains('w')) return;
    const k = +el.dataset.k;
    el.classList.toggle('hl', modo);
    modo ? marcadas.add(k) : marcadas.delete(k);
    pintar();
  };
  zona.addEventListener('pointerdown', e => {
    const w = e.target.closest('.w'); if (!w) return;
    arrastrando = true; modo = !w.classList.contains('hl'); aplicar(w);
    if (e.pointerType === 'mouse') e.preventDefault();
  });
  zona.addEventListener('pointerover', e => { if (arrastrando && e.pointerType === 'mouse') aplicar(e.target.closest('.w')); });
  const fin = () => arrastrando = false;
  window.addEventListener('pointerup', fin);
  limpiezaVista = () => window.removeEventListener('pointerup', fin);
  $('#borrar-sub').onclick = () => { marcadas.clear(); $$('.w.hl', cuerpo).forEach(w => w.classList.remove('hl')); pintar(); };
  $('#ver-sub').onclick = () => {
    const tg = $('#telegrama');
    tg.hidden = !tg.hidden;
    tg.innerHTML = `<b>Solo lo subrayado:</b><p>${esc(fragmentos().join(' … ')) || '<i>Aún no has subrayado nada.</i>'}</p><p class="mini">¿Se entiende la idea del texto leyendo solo esto?</p>`;
  };
  pintar();
  $('#corregir').onclick = async () => {
    if (!marcadas.size) return toast('Primero subraya algunas palabras 🖍️');
    const frag = fragmentos();
    // valoración local (sin IA) como apoyo
    const subrayado = frag.join(' ').toLowerCase();
    const aciertos = t.claves.filter(alts => alts.some(a => subrayado.includes(a.toLowerCase()))).length;
    const local = { aciertos, total: t.claves.length, pct: pct() };
    await corregir({
      m, i, p, boton: $('#corregir'), destino: $('#fb'), siguiente, local,
      datos: {
        titulo: p.titulo, enunciado: p.enunciado, rubrica: p.rubrica, referencia: referenciaPlana(p.texto),
        textoAlumno: `Fragmentos subrayados (en orden):\n${frag.map(f => '• ' + f).join('\n')}\n\nPorcentaje del texto subrayado: ${local.pct} %`
      }
    });
  };
}

function pasoTarea({ m, i, p, cuerpo, siguiente }) {
  const est = estadoPaso(m.id, i);
  const marcados = new Set(est?.checks || []);
  cuerpo.innerHTML = `<div class="enunciado">${p.enunciado}</div>
    ${p.enlace ? `<p><a class="btn" href="${p.enlace}">${esc(p.enlaceTexto || 'Abrir herramienta')}</a></p>` : ''}
    <h3>Cuando lo hayas hecho, márcalo:</h3>
    <ul class="checklist">${p.checklist.map((c, k) => `<li><label><input type="checkbox" data-k="${k}" ${marcados.has(k) || est?.hecho ? 'checked' : ''}><span>${esc(c)}</span></label></li>`).join('')}</ul>
    <div class="acciones"><button class="btn primary" id="hecho" ${est?.hecho ? '' : 'disabled'}>${est?.hecho ? 'Completada ✔ Seguir →' : 'Tarea completada'}</button></div>`;
  const btn = $('#hecho');
  $$('.checklist input', cuerpo).forEach(cb => cb.onchange = () => {
    const ks = $$('.checklist input', cuerpo).filter(x => x.checked).map(x => +x.dataset.k);
    const pr = Store.data.progreso[m.id] || (Store.data.progreso[m.id] = {});
    pr[i] = Object.assign({}, pr[i] || {}, { checks: ks }); Store.save();
    btn.disabled = ks.length < p.checklist.length;
  });
  btn.onclick = () => { if (!estadoPaso(m.id, i)?.hecho) completarPaso(m, i); siguiente(); };
}

/* ---------- corrección (IA o autoevaluación) ---------- */
async function corregir({ m, i, p, boton, destino, datos, siguiente, local }) {
  if (!AI.configurada()) return autoevaluacion({ m, i, p, destino, siguiente, local });
  const original = boton.innerHTML;
  boton.disabled = true;
  boton.innerHTML = '<span class="spin"></span> El Profe Búho está corrigiendo…';
  destino.innerHTML = '';
  try {
    const r = await AI.evaluar(datos);
    guardarHistorial(p.titulo, r);
    const pr = Store.data.progreso[m.id] || (Store.data.progreso[m.id] = {});
    pr[i] = Object.assign({}, pr[i] || {}, { feedback: r }); Store.save();
    destino.innerHTML = feedbackHTML(r) + `<div class="acciones">${r.nota !== null && r.nota >= 5
      ? '<button class="btn primary" id="seguir">¡Genial! Seguir →</button>'
      : '<p class="mini">Mejora tu trabajo con los consejos y vuelve a corregir. ¡Equivocarse es parte de aprender!</p>'}</div>`;
    if (r.nota !== null && r.nota >= 5) { completarPaso(m, i, { nota: r.nota }); $('#seguir', destino).onclick = siguiente; }
    destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (e) {
    destino.innerHTML = `<div class="resultado ko">⚠️ ${esc(e.message).replace(/\n/g, '<br>')}</div>`;
  } finally {
    boton.disabled = false; boton.innerHTML = original;
  }
}

function autoevaluacion({ m, i, p, destino, siguiente, local }) {
  destino.innerHTML = `<div class="fb-card">
    <div class="fb-head"><span class="owl">🦉</span><b>Autoevaluación</b></div>
    <p>La corrección con IA no está activada (un adulto puede activarla en <a href="#/padres">⚙️ Padres</a>). Mientras tanto, <b>revisa tu trabajo tú mismo</b> con estos criterios, o pide a alguien que lo revise contigo:</p>
    ${local ? `<p class="pill ${local.aciertos / local.total >= 0.6 ? 'ok' : 'aviso'}">Has marcado ${local.aciertos} de ${local.total} conceptos clave · ${local.pct}% del texto</p>` : ''}
    <ul class="checklist">${p.rubrica.map(r => `<li><label><input type="checkbox"><span>${esc(r)}</span></label></li>`).join('')}</ul>
    <div class="acciones"><button class="btn primary" id="auto-ok" disabled>Lo he revisado y lo cumple ✔</button></div></div>`;
  const cbs = $$('input', destino), b = $('#auto-ok', destino);
  cbs.forEach(c => c.onchange = () => b.disabled = cbs.filter(x => x.checked).length < Math.ceil(cbs.length * 0.75));
  b.onclick = () => { completarPaso(m, i, { nota: null, auto: true }); siguiente(); };
}

function feedbackHTML(r) {
  const color = r.nota == null ? '' : r.nota >= 8 ? 'alta' : r.nota >= 5 ? 'media' : 'baja';
  const lista = (tit, arr, cls) => arr && arr.length ? `<h4>${tit}</h4><ul class="${cls}">${arr.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '';
  return `<div class="fb-card">
    <div class="fb-head"><span class="owl">🦉</span><b>Profe Búho</b>${r.nota != null ? `<span class="nota ${color}">${r.nota}/10</span>` : ''}</div>
    <p>${esc(r.resumen)}</p>
    ${lista('👍 Lo que has hecho bien', r.bien, 'bien')}
    ${lista('🔧 Para mejorar', r.mejorar, 'mejorar')}
    ${lista('🤔 Preguntas para pensar', r.preguntas, 'preg')}
    ${r.siguientePaso ? `<p class="sig"><b>👉 Siguiente paso:</b> ${esc(r.siguientePaso)}</p>` : ''}
  </div>`;
}

function guardarHistorial(titulo, r) {
  Store.data.historial.unshift({ fecha: new Date().toISOString(), titulo, nota: r.nota, resumen: r.resumen });
  Store.data.historial = Store.data.historial.slice(0, 60);
  registrarActividad(); Store.save(); comprobarLogros();
}

/* ---------- componente: subida de fotos ---------- */
function subidaFotos(el, max = 3) {
  const st = { imagenes: [] };
  const pintar = () => {
    el.innerHTML = `<div class="fotos">
      ${st.imagenes.map((src, k) => `<figure><img src="${src}" alt="Foto ${k + 1}"><button class="quitar" data-k="${k}" aria-label="Quitar foto">✕</button></figure>`).join('')}
      ${st.imagenes.length < max ? `<label class="add-foto"><input type="file" accept="image/*" multiple hidden><span>📷</span><small>Hacer o elegir foto</small></label>` : ''}
    </div><p class="mini">Consejo: foto de frente, con buena luz y que se vea toda la hoja. Máximo ${max} fotos.</p>`;
    $$('.quitar', el).forEach(b => b.onclick = () => { st.imagenes.splice(+b.dataset.k, 1); pintar(); });
    const inp = $('input[type=file]', el);
    if (inp) inp.onchange = async () => {
      const files = [...inp.files].slice(0, max - st.imagenes.length);
      for (const f of files) {
        try { st.imagenes.push(await comprimirImagen(f)); } catch (e) { toast(e.message, 'error'); }
      }
      pintar();
    };
  };
  pintar();
  return st;
}

/* =========================================================
   HERRAMIENTAS
   ========================================================= */
const HERRAMIENTAS = [
  { id: 'pomodoro', icono: '🍅', nombre: 'Pomodoro', desc: 'Temporizador 25 + 5' },
  { id: 'tarjetas', icono: '🃏', nombre: 'Tarjetas', desc: 'Repaso espaciado (Leitner)' },
  { id: 'planificador', icono: '🗓️', nombre: 'Planificador', desc: 'Tu semana y planes de examen' },
  { id: 'hojablanco', icono: '📝', nombre: 'Hoja en blanco', desc: 'Escribe lo que recuerdas' },
  { id: 'feynman', icono: '💡', nombre: 'Técnica Feynman', desc: 'Explícalo fácil' },
  { id: 'corrector', icono: '🦉', nombre: 'Corrector libre', desc: 'Sube cualquier esquema o resumen' }
];
function tarjetaHerramienta(h) {
  return `<a class="card herr" href="#/h/${h.id}"><span class="ic">${h.icono}</span><b>${h.nombre}</b><small>${h.desc}</small></a>`;
}
function vistaHerramientas(app) {
  app.innerHTML = `<h1>Herramientas</h1><p class="sub">Úsalas con tus asignaturas de verdad, cada semana.</p>
    <div class="grid-h">${HERRAMIENTAS.map(tarjetaHerramienta).join('')}</div>`;
}
function vistaHerramienta(app, id, args) {
  const h = HERRAMIENTAS.find(x => x.id === id);
  if (!h) return navegar('#/h');
  app.innerHTML = `<a href="#/h" class="volver">← Herramientas</a><h1>${h.icono} ${h.nombre}</h1><div id="herr"></div>`;
  const el = $('#herr');
  ({ pomodoro: herrPomodoro, tarjetas: herrTarjetas, planificador: herrPlanificador, hojablanco: herrHojaBlanco, feynman: herrFeynman, corrector: herrCorrector })[id](el, args);
}

/* ---------- Pomodoro ---------- */
const Pomo = { modo: 'trabajo', fin: null, restante: 25 * 60, corriendo: false, ciclo: 0, min: { trabajo: 25, corto: 5, largo: 20 }, intervalo: null };
function beep() {
  try {
    const C = window.AudioContext || window.webkitAudioContext, c = new C();
    [0, 0.35, 0.7].forEach(t => {
      const o = c.createOscillator(), g = c.createGain();
      o.frequency.value = 880; o.connect(g); g.connect(c.destination);
      g.gain.setValueAtTime(0.2, c.currentTime + t); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + t + 0.3);
      o.start(c.currentTime + t); o.stop(c.currentTime + t + 0.3);
    });
  } catch (e) { /* sin sonido */ }
}
function pomoTick() {
  if (!Pomo.corriendo) return;
  Pomo.restante = Math.max(0, Math.round((Pomo.fin - Date.now()) / 1000));
  if (Pomo.restante === 0) {
    beep();
    Pomo.corriendo = false;
    if (Pomo.modo === 'trabajo') {
      Pomo.ciclo++;
      const h = hoy(); Store.data.pomodoros[h] = (Store.data.pomodoros[h] || 0) + 1;
      ganarXP(5);
      Pomo.modo = Pomo.ciclo % 4 === 0 ? 'largo' : 'corto';
      toast('🍅 ¡Pomodoro completado! Toca descansar.', 'ok');
    } else { Pomo.modo = 'trabajo'; toast('⏰ ¡Descanso terminado! A por otro.'); }
    Pomo.restante = Pomo.min[Pomo.modo] * 60;
  }
  pintarPomo();
}
function pintarPomo() {
  const el = $('#pomo'); if (!el) return;
  const total = Pomo.min[Pomo.modo] * 60, frac = 1 - Pomo.restante / total;
  $('#pomo-t').textContent = `${z(Math.floor(Pomo.restante / 60))}:${z(Pomo.restante % 60)}`;
  $('#pomo-m').textContent = { trabajo: '🎯 Concentración', corto: '☕ Descanso corto', largo: '🌳 Descanso largo' }[Pomo.modo];
  el.style.setProperty('--p', (frac * 360) + 'deg');
  el.dataset.modo = Pomo.modo;
  $('#pomo-go').textContent = Pomo.corriendo ? '⏸ Pausa' : '▶ Empezar';
  $('#pomo-hoy').textContent = Store.data.pomodoros[hoy()] || 0;
  document.title = Pomo.corriendo ? `${$('#pomo-t').textContent} · Aprende a estudiar` : 'Aprende a estudiar';
}
function herrPomodoro(el) {
  el.innerHTML = `<div class="card centro">
    <div class="pomo" id="pomo"><div><span id="pomo-t">25:00</span><small id="pomo-m"></small></div></div>
    <div class="acciones centro"><button class="btn primary" id="pomo-go"></button><button class="btn" id="pomo-reset">↺ Reiniciar</button><button class="btn" id="pomo-skip">⏭ Saltar</button></div>
    <p>Pomodoros de hoy: <b id="pomo-hoy">0</b></p>
    <details><summary>⚙️ Ajustar tiempos</summary>
      <div class="fila">
        <label>Trabajo <input type="number" min="5" max="60" id="pm-t" value="${Pomo.min.trabajo}"> min</label>
        <label>Descanso <input type="number" min="1" max="15" id="pm-c" value="${Pomo.min.corto}"> min</label>
        <label>Largo <input type="number" min="5" max="40" id="pm-l" value="${Pomo.min.largo}"> min</label>
      </div></details>
    <p class="mini">Deja el móvil lejos, elige una sola tarea y apunta en un papel lo que te distraiga.</p></div>`;
  $('#pomo-go').onclick = () => {
    if (Pomo.corriendo) { Pomo.corriendo = false; }
    else { Pomo.corriendo = true; Pomo.fin = Date.now() + Pomo.restante * 1000; }
    pintarPomo();
  };
  $('#pomo-reset').onclick = () => { Pomo.corriendo = false; Pomo.restante = Pomo.min[Pomo.modo] * 60; pintarPomo(); };
  $('#pomo-skip').onclick = () => { Pomo.corriendo = false; Pomo.modo = Pomo.modo === 'trabajo' ? 'corto' : 'trabajo'; Pomo.restante = Pomo.min[Pomo.modo] * 60; pintarPomo(); };
  [['pm-t', 'trabajo'], ['pm-c', 'corto'], ['pm-l', 'largo']].forEach(([id, k]) => $('#' + id).onchange = e => {
    Pomo.min[k] = Math.max(1, Math.min(60, +e.target.value || 1));
    if (!Pomo.corriendo && Pomo.modo === k) Pomo.restante = Pomo.min[k] * 60;
    pintarPomo();
  });
  pintarPomo();
}

/* ---------- Tarjetas (Leitner) ---------- */
const INTERVALOS = { 1: 1, 2: 2, 3: 4, 4: 8, 5: 16 };
function tarjetasPendientes(mazo) {
  const h = hoy(), lista = mazo ? [mazo] : Store.data.mazos;
  return lista.reduce((a, m) => a + m.tarjetas.filter(t => t.proxima <= h).length, 0);
}
function herrTarjetas(el, args) {
  const mazo = args[0] && Store.data.mazos.find(m => m.id === args[0]);
  if (mazo && args[1] === 'estudiar') return estudiarMazo(el, mazo);
  if (mazo) return verMazo(el, mazo);
  el.innerHTML = `<p class="sub">Cada tarjeta sube de caja cuando la aciertas y vuelve a la caja 1 si la fallas. La app te avisa de cuándo toca repasarla.</p>
    <form id="f-mazo" class="card fila"><input id="mazo-n" placeholder="Nuevo mazo (ej.: Biología – La célula)" maxlength="60" required><button class="btn primary">Crear</button></form>
    <div class="lista-mazos">${Store.data.mazos.length ? Store.data.mazos.map(m => {
      const p = tarjetasPendientes(m);
      return `<a class="card mazo" href="#/h/tarjetas/${m.id}"><b>${esc(m.nombre)}</b><small>${m.tarjetas.length} tarjetas</small>${p ? `<span class="pill aviso">${p} por repasar</span>` : '<span class="pill ok">Al día</span>'}</a>`;
    }).join('') : '<p class="vacio">Aún no tienes mazos. ¡Crea el primero!</p>'}</div>`;
  $('#f-mazo').onsubmit = e => {
    e.preventDefault();
    const n = $('#mazo-n').value.trim(); if (!n) return;
    const m = { id: uid(), nombre: n, tarjetas: [] };
    Store.data.mazos.push(m); Store.save(); navegar(`#/h/tarjetas/${m.id}`);
  };
}
function nuevaTarjeta(p, r) { return { id: uid(), p, r, caja: 1, proxima: hoy() }; }
function verMazo(el, mazo) {
  const pend = tarjetasPendientes(mazo);
  el.innerHTML = `<div class="card">
    <h2>${esc(mazo.nombre)}</h2>
    <div class="cajas">${[1, 2, 3, 4, 5].map(c => `<div class="caja"><b>${mazo.tarjetas.filter(t => t.caja === c).length}</b><small>Caja ${c}</small></div>`).join('')}</div>
    <div class="acciones">
      ${pend ? `<a class="btn primary" href="#/h/tarjetas/${mazo.id}/estudiar">Estudiar (${pend}) ▶</a>` : '<span class="pill ok">✅ Nada pendiente hoy</span>'}
      ${mazo.tarjetas.length ? `<button class="btn" id="todo">Repasar todas igualmente</button>` : ''}
    </div></div>
  <form id="f-tarj" class="card">
    <h3>Añadir tarjeta</h3>
    <label>Pregunta<textarea id="t-p" rows="2" required placeholder="¿Qué es la fotosíntesis?"></textarea></label>
    <label>Respuesta<textarea id="t-r" rows="2" required placeholder="Proceso por el que las plantas fabrican su alimento con luz, agua y CO₂."></textarea></label>
    <div class="acciones"><button class="btn primary">Añadir</button></div>
    <p class="mini">Una sola idea por tarjeta. Pregunta concreta, respuesta corta.</p>
  </form>
  <details class="card"><summary>✨ Crear tarjetas desde mis apuntes (IA)</summary>
    <p class="mini">Hacer tú las tarjetas también ayuda a aprender. Usa esto para ahorrar tiempo y luego revísalas.</p>
    <textarea id="g-txt" rows="4" placeholder="Pega aquí el texto de tus apuntes… o sube una foto"></textarea>
    <div id="g-fotos"></div>
    <div class="acciones"><button class="btn" id="g-go">Generar tarjetas</button></div>
    <div id="g-res"></div>
  </details>
  <div class="card"><h3>Tarjetas (${mazo.tarjetas.length})</h3>
    <ul class="lista-tarj">${mazo.tarjetas.map(t => `<li><div><b>${esc(t.p)}</b><small>${esc(t.r)}</small></div><span class="pill">Caja ${t.caja}</span><button class="icono-btn" data-del="${t.id}" aria-label="Borrar">🗑️</button></li>`).join('') || '<li class="vacio">Sin tarjetas aún.</li>'}</ul>
    <div class="acciones"><button class="btn peligro" id="del-mazo">Borrar mazo</button></div></div>`;
  $('#f-tarj').onsubmit = e => {
    e.preventDefault();
    mazo.tarjetas.push(nuevaTarjeta($('#t-p').value.trim(), $('#t-r').value.trim()));
    Store.save(); registrarActividad(); comprobarLogros(); verMazo(el, mazo); toast('Tarjeta añadida 🃏');
    $('#t-p').focus();
  };
  $$('[data-del]', el).forEach(b => b.onclick = () => { mazo.tarjetas = mazo.tarjetas.filter(t => t.id !== b.dataset.del); Store.save(); verMazo(el, mazo); });
  $('#del-mazo').onclick = () => { if (confirm('¿Seguro que quieres borrar este mazo?')) { Store.data.mazos = Store.data.mazos.filter(m => m !== mazo); Store.save(); navegar('#/h/tarjetas'); } };
  const todo = $('#todo'); if (todo) todo.onclick = () => estudiarMazo(el, mazo, true);
  const sub = subidaFotos($('#g-fotos'), 2);
  $('#g-go').onclick = async () => {
    if (!AI.configurada()) return toast('La IA no está activada. Pide a un adulto que la configure en ⚙️ Padres.');
    const txt = $('#g-txt').value.trim();
    if (!txt && !sub.imagenes.length) return toast('Pega un texto o sube una foto.');
    const b = $('#g-go'); b.disabled = true; b.innerHTML = '<span class="spin"></span> Generando…';
    try {
      const ts = await AI.generarTarjetas({ texto: txt, imagenes: sub.imagenes });
      $('#g-res').innerHTML = `<p>Marca las que quieras añadir:</p><ul class="checklist">${ts.map((t, k) => `<li><label><input type="checkbox" checked data-k="${k}"><span><b>${esc(t.p)}</b><br><small>${esc(t.r)}</small></span></label></li>`).join('')}</ul>
        <div class="acciones"><button class="btn primary" id="g-add">Añadir seleccionadas</button></div>`;
      $('#g-add').onclick = () => {
        $$('#g-res input:checked').forEach(c => { const t = ts[+c.dataset.k]; mazo.tarjetas.push(nuevaTarjeta(t.p, t.r)); });
        Store.save(); comprobarLogros(); verMazo(el, mazo); toast('Tarjetas añadidas 🃏');
      };
    } catch (e) { $('#g-res').innerHTML = `<div class="resultado ko">⚠️ ${esc(e.message)}</div>`; }
    finally { b.disabled = false; b.textContent = 'Generar tarjetas'; }
  };
}
function estudiarMazo(el, mazo, todas = false) {
  const h = hoy();
  let cola = mazo.tarjetas.filter(t => todas || t.proxima <= h).sort(() => Math.random() - 0.5);
  const fallosSesion = new Set();
  let aciertos = 0, total = cola.length;
  const mostrar = () => {
    if (!cola.length) {
      el.innerHTML = `<div class="card centro"><div class="buho-grande">🎉</div><h2>¡Sesión terminada!</h2>
        <p>Has acertado a la primera ${aciertos} de ${total}.</p><p class="mini">Las tarjetas que has fallado volverán mañana.</p>
        <div class="acciones centro"><a class="btn primary" href="#/h/tarjetas/${mazo.id}">Volver al mazo</a></div></div>`;
      return;
    }
    const t = cola[0];
    el.innerHTML = `<p class="mini centro">${total - cola.length + 1} / ${total}${fallosSesion.size ? ` · repitiendo falladas` : ''}</p>
      <div class="flashcard" id="fc"><div class="cara"><small>Pregunta · Caja ${t.caja}</small><p>${esc(t.p)}</p></div>
      <div class="cara atras" hidden><small>Respuesta</small><p>${esc(t.r)}</p></div></div>
      <p class="mini centro" id="pista">Intenta responder en voz alta o en un papel <b>antes</b> de darle la vuelta.</p>
      <div class="acciones centro" id="botones"><button class="btn primary" id="girar">Ver respuesta</button></div>`;
    $('#girar').onclick = () => {
      $('.atras', el).hidden = false; $('#pista').hidden = true;
      $('#botones').innerHTML = `<button class="btn mal" id="no">❌ No la sabía</button><button class="btn bien" id="si">✅ La sabía</button>`;
      $('#si').onclick = () => {
        if (!fallosSesion.has(t.id)) { t.caja = Math.min(5, t.caja + 1); aciertos++; }
        t.proxima = sumarDias(h, INTERVALOS[t.caja]);
        cola.shift(); Store.save(); mostrar();
      };
      $('#no').onclick = () => {
        t.caja = 1; t.proxima = sumarDias(h, 1); fallosSesion.add(t.id);
        cola.push(cola.shift()); Store.save(); mostrar();
      };
    };
  };
  registrarActividad(); Store.save();
  mostrar();
  comprobarLogros();
}

/* ---------- Planificador ---------- */
let semanaOffset = 0;
function lunesDe(s) { const d = aFecha(s), dw = (d.getDay() + 6) % 7; d.setDate(d.getDate() - dw); return hoy(d); }
function herrPlanificador(el) {
  const lunes = sumarDias(lunesDe(hoy()), semanaOffset * 7);
  const dias = [...Array(7)].map((_, k) => sumarDias(lunes, k));
  const tipos = ['Deberes', 'Estudio', 'Repaso', 'Trabajo', 'Examen'];
  el.innerHTML = `
  <div class="card">
    <div class="cab-semana"><button class="btn mini-btn" id="ant">←</button><b>Semana del ${fechaCorta(dias[0])} al ${fechaCorta(dias[6])}</b><button class="btn mini-btn" id="sig">→</button></div>
    <div class="semana">${dias.map(d => {
      const items = Store.data.plan.filter(p => p.fecha === d).sort((a, b) => (a.hora || '').localeCompare(b.hora || ''));
      return `<div class="dia ${d === hoy() ? 'hoy' : ''}"><h4>${DIAS[aFecha(d).getDay()]} <small>${fechaCorta(d)}</small></h4>
        ${items.map(p => `<div class="bloque t-${p.tipo.toLowerCase()} ${p.hecho ? 'hecho' : ''}">
          <label><input type="checkbox" data-hecho="${p.id}" ${p.hecho ? 'checked' : ''}><span>${p.hora ? `<b>${esc(p.hora)}</b> ` : ''}${esc(p.asignatura)} · ${esc(p.tipo)}${p.nota ? `<small>${esc(p.nota)}</small>` : ''}</span></label>
          <button class="icono-btn" data-borrar="${p.id}" aria-label="Borrar">✕</button></div>`).join('') || '<p class="vacio">—</p>'}
      </div>`;
    }).join('')}</div>
  </div>
  <form id="f-plan" class="card">
    <h3>Añadir bloque</h3>
    <div class="fila">
      <label>Día<input type="date" id="pl-f" value="${dias.includes(hoy()) ? hoy() : dias[0]}" required></label>
      <label>Hora<input type="time" id="pl-h"></label>
      <label>Asignatura<input id="pl-a" required maxlength="40" placeholder="Matemáticas"></label>
      <label>Tipo<select id="pl-t">${tipos.map(t => `<option>${t}</option>`).join('')}</select></label>
    </div>
    <div class="acciones"><button class="btn primary">Añadir</button></div>
  </form>
  <form id="f-examen" class="card">
    <h3>🎯 Plan de examen (repasos espaciados automáticos)</h3>
    <div class="fila">
      <label>Asignatura<input id="ex-a" required maxlength="40" placeholder="Ciencias Naturales"></label>
      <label>Tema<input id="ex-t" maxlength="60" placeholder="Tema 4: la célula"></label>
      <label>Fecha del examen<input type="date" id="ex-f" required min="${sumarDias(hoy(), 1)}"></label>
    </div>
    <div class="acciones"><button class="btn primary">Crear plan</button></div>
    <p class="mini">Se crean sesiones repartidas antes del examen: primero entender y organizar, luego ponerte a prueba.</p>
  </form>`;
  $('#ant').onclick = () => { semanaOffset--; herrPlanificador(el); };
  $('#sig').onclick = () => { semanaOffset++; herrPlanificador(el); };
  $$('[data-hecho]', el).forEach(c => c.onchange = () => {
    const p = Store.data.plan.find(x => x.id === c.dataset.hecho); p.hecho = c.checked;
    if (c.checked) registrarActividad();
    Store.save(); herrPlanificador(el);
  });
  $$('[data-borrar]', el).forEach(b => b.onclick = () => { Store.data.plan = Store.data.plan.filter(x => x.id !== b.dataset.borrar); Store.save(); herrPlanificador(el); });
  $('#f-plan').onsubmit = e => {
    e.preventDefault();
    Store.data.plan.push({ id: uid(), fecha: $('#pl-f').value, hora: $('#pl-h').value, asignatura: $('#pl-a').value.trim(), tipo: $('#pl-t').value, hecho: false });
    Store.save(); toast('Bloque añadido 🗓️'); herrPlanificador(el);
  };
  $('#f-examen').onsubmit = e => {
    e.preventDefault();
    const fEx = $('#ex-f').value, asig = $('#ex-a').value.trim(), tema = $('#ex-t').value.trim();
    const dist = diffDias(hoy(), fEx);
    if (dist < 1) return toast('La fecha del examen debe ser futura.');
    const sesiones = [
      [-10, 'Estudio', 'Leer y entender (prelectura + lectura comprensiva)'],
      [-8, 'Estudio', 'Subrayar y hacer esquema o mapa conceptual'],
      [-6, 'Repaso', 'Hacer tarjetas y primera hoja en blanco'],
      [-4, 'Repaso', 'Tarjetas + preguntas del tema sin mirar'],
      [-2, 'Repaso', 'Simulacro de examen y repasar fallos'],
      [-1, 'Repaso', 'Repaso ligero con tarjetas · ¡dormir bien!']
    ].filter(([d]) => -d < dist).map(([d, tipo, nota]) => ({ id: uid(), fecha: sumarDias(fEx, d), hora: '', asignatura: asig, tipo, nota: (tema ? tema + ' · ' : '') + nota, hecho: false }));
    if (dist < 10 && sesiones.length < 3) sesiones.unshift({ id: uid(), fecha: hoy(), hora: '', asignatura: asig, tipo: 'Estudio', nota: (tema ? tema + ' · ' : '') + 'Entender y organizar el tema', hecho: false });
    sesiones.push({ id: uid(), fecha: fEx, hora: '', asignatura: asig, tipo: 'Examen', nota: tema, hecho: false });
    Store.data.plan.push(...sesiones); Store.save(); comprobarLogros();
    semanaOffset = 0;
    toast(`Plan creado: ${sesiones.length - 1} sesiones antes del examen 🎯`, 'ok');
    herrPlanificador(el);
  };
}

/* ---------- Hoja en blanco ---------- */
function herrHojaBlanco(el) {
  el.innerHTML = `<div class="card">
    <h3>1. El material original</h3>
    <p class="mini">Pega el texto que has estudiado o hazle foto a la página del libro.</p>
    <textarea id="hb-o" rows="5" placeholder="Pega aquí el texto original…"></textarea>
    <div id="hb-f"></div>
    <div class="acciones"><button class="btn primary" id="hb-ok">Listo: ocultar y empezar</button></div>
  </div>
  <div class="card" id="hb-2" hidden>
    <h3>2. Escribe todo lo que recuerdes (sin mirar)</h3>
    <p class="mini">Ideas, conceptos, datos, relaciones… Da igual el orden. ¡Esfuérzate antes de rendirte!</p>
    <textarea id="hb-r" rows="10" placeholder="Lo que recuerdo es…"></textarea>
    <div class="acciones"><button class="btn primary" id="hb-c">Comparar con el original 🦉</button></div>
    <div id="hb-fb"></div>
  </div>`;
  const sub = subidaFotos($('#hb-f'), 2);
  $('#hb-ok').onclick = () => {
    if (!$('#hb-o').value.trim() && !sub.imagenes.length) return toast('Añade el texto original o una foto.');
    $('#hb-o').closest('.card').classList.add('plegada');
    $('#hb-o').hidden = true; $('#hb-f').hidden = true; $('#hb-ok').hidden = true;
    $('#hb-2').hidden = false; $('#hb-r').focus();
  };
  $('#hb-c').onclick = async () => {
    const r = $('#hb-r').value.trim();
    if (contarPalabras(r) < 10) return toast('Escribe un poco más de lo que recuerdas.');
    if (!AI.configurada()) {
      $('#hb-o').hidden = false;
      $('#hb-fb').innerHTML = `<div class="fb-card"><p>Sin IA activada: compara tú mismo. Ahora puedes ver el original arriba. <b>Con otro color</b>, añade a tu hoja lo que te faltaba: eso es lo que debes repasar.</p></div>`;
      return;
    }
    await correccionHerramienta($('#hb-c'), $('#hb-fb'), {
      titulo: 'Hoja en blanco (práctica de recuperación)',
      enunciado: 'El alumno ha estudiado un material y ha escrito de memoria todo lo que recuerda. Compara su recuerdo con el original.',
      rubrica: ['Cuántas de las ideas principales del original recuerda', 'Si lo que recuerda es correcto o tiene errores', 'Qué ideas importantes ha olvidado (lístalas en "mejorar" para que las repase)'],
      referencia: $('#hb-o').value.trim(), imagenes: sub.imagenes, imagenesSon: 'original', textoAlumno: r,
      extra: 'La nota indica qué parte de lo importante recuerda correctamente. En "mejorar" incluye las ideas olvidadas o erróneas concretas.'
    });
  };
}

/* ---------- Feynman ---------- */
function herrFeynman(el) {
  el.innerHTML = `<div class="card">
    <ol class="mini"><li>Elige un concepto.</li><li>Explícalo como si se lo contaras a un niño de 10 años.</li><li>El Profe Búho hará de niño curioso y te dirá dónde hay huecos.</li></ol>
    <label>Asignatura<input id="fy-a" maxlength="40" placeholder="Matemáticas"></label>
    <label>Concepto<input id="fy-c" maxlength="60" placeholder="Las fracciones equivalentes" required></label>
    <label>Tu explicación<textarea id="fy-e" rows="9" placeholder="Imagina que tienes una pizza…"></textarea></label>
    <div class="acciones"><button class="btn primary" id="fy-go">Explicárselo al Profe Búho 💡</button></div>
    <div id="fy-fb"></div></div>`;
  $('#fy-go').onclick = async () => {
    const c = $('#fy-c').value.trim(), e = $('#fy-e').value.trim();
    if (!c) return toast('Escribe qué concepto vas a explicar.');
    if (contarPalabras(e) < 25) return toast('Escribe una explicación un poco más larga (25 palabras o más).');
    if (!AI.configurada()) return $('#fy-fb').innerHTML = `<div class="fb-card"><p>Sin IA activada: <b>léele tu explicación a alguien de tu familia</b> y pídele que te pregunte todo lo que no entienda. Donde te atasques, vuelve al libro.</p></div>`;
    await correccionHerramienta($('#fy-go'), $('#fy-fb'), {
      titulo: `Técnica Feynman: ${c}`,
      enunciado: `El alumno explica el concepto "${c}"${$('#fy-a').value ? ' (' + $('#fy-a').value + ')' : ''} como si se lo contara a un niño de 10 años.`,
      rubrica: ['La explicación es correcta (sin errores de contenido)', 'Usa palabras sencillas y explica los términos técnicos', 'Incluye un ejemplo o comparación', 'Está completa: no se salta pasos importantes'],
      textoAlumno: e,
      extra: 'Además, en "preguntas" incluye 2-3 preguntas que haría un niño curioso de 10 años y que pongan a prueba los huecos de la explicación. Si hay algún error de contenido, señálalo con claridad en "mejorar".'
    });
  };
}

/* ---------- Corrector libre ---------- */
function herrCorrector(el) {
  el.innerHTML = `<div class="card">
    <p class="sub">Sube una foto de un esquema, resumen, mapa conceptual, apuntes o tarjetas de cualquier asignatura.</p>
    <label>¿Qué es?<select id="cl-t">${Object.entries(RUBRICAS_LIBRES).map(([k, v]) => `<option value="${k}">${v.nombre}</option>`).join('')}</select></label>
    <label>Asignatura y tema (opcional)<input id="cl-a" maxlength="80" placeholder="Historia – El feudalismo"></label>
    <div id="cl-f"></div>
    <details><summary>Añadir el texto original (opcional, mejora la corrección)</summary><textarea id="cl-o" rows="5" placeholder="Pega aquí el texto del libro…"></textarea></details>
    <div class="acciones"><button class="btn primary" id="cl-go">Corregir 🦉</button></div>
    <div id="cl-fb"></div></div>`;
  const sub = subidaFotos($('#cl-f'));
  $('#cl-go').onclick = async () => {
    if (!sub.imagenes.length) return toast('Añade al menos una foto 📷');
    if (!AI.configurada()) return toast('La IA no está activada. Pide a un adulto que la configure en ⚙️ Padres.');
    const tipo = RUBRICAS_LIBRES[$('#cl-t').value];
    await correccionHerramienta($('#cl-go'), $('#cl-fb'), {
      titulo: `Corrector libre: ${tipo.nombre}`,
      enunciado: `El alumno ha hecho un/a ${tipo.nombre.toLowerCase()}${$('#cl-a').value ? ' de ' + $('#cl-a').value : ''} y pide que se lo corrijas.`,
      rubrica: tipo.rubrica, referencia: $('#cl-o').value.trim(), imagenes: sub.imagenes
    });
  };
}

async function correccionHerramienta(boton, destino, datos) {
  const original = boton.innerHTML;
  boton.disabled = true; boton.innerHTML = '<span class="spin"></span> Pensando…';
  try {
    const r = await AI.evaluar(datos);
    guardarHistorial(datos.titulo, r);
    destino.innerHTML = feedbackHTML(r);
    ganarXP(10);
    destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (e) { destino.innerHTML = `<div class="resultado ko">⚠️ ${esc(e.message).replace(/\n/g, '<br>')}</div>`; }
  finally { boton.disabled = false; boton.innerHTML = original; }
}

/* =========================================================
   LOGROS
   ========================================================= */
function vistaLogros(app) {
  comprobarLogros();
  const tot = Object.values(Store.data.pomodoros).reduce((a, b) => a + b, 0);
  app.innerHTML = `<h1>🏆 Logros</h1>
  <div class="stats-grid">
    <div class="card stat"><b>${Store.data.xp}</b><span>puntos</span></div>
    <div class="card stat"><b>${totalHechos()}/${totalPasos()}</b><span>actividades</span></div>
    <div class="card stat"><b>${tot}</b><span>pomodoros</span></div>
    <div class="card stat"><b>${Store.data.mazos.reduce((a, m) => a + m.tarjetas.length, 0)}</b><span>tarjetas</span></div>
  </div>
  <div class="grid-logros">${LOGROS.map(l => {
    const ok = Store.data.logros.includes(l.id);
    return `<div class="card logro ${ok ? '' : 'off'}"><span>${ok ? l.icono : '🔒'}</span><b>${l.nombre}</b><small>${l.desc}</small></div>`;
  }).join('')}</div>
  ${Store.data.historial.length ? `<h2 class="titulo-sec">Últimas correcciones</h2><ul class="historial">${Store.data.historial.slice(0, 10).map(h => `<li class="card"><b>${esc(h.titulo)}</b>${h.nota != null ? `<span class="nota ${h.nota >= 8 ? 'alta' : h.nota >= 5 ? 'media' : 'baja'}">${h.nota}</span>` : ''}<small>${new Date(h.fecha).toLocaleDateString('es-ES')} · ${esc(h.resumen)}</small></li>`).join('')}</ul>` : ''}`;
}

/* =========================================================
   PANEL DE PADRES
   ========================================================= */
let padresDesbloqueado = false;
async function hashPin(pin) {
  if (window.crypto && crypto.subtle) {
    const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('aae-' + pin));
    return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
  }
  return 'p' + pin;
}
function vistaPadres(app) {
  const a = Store.data.ajustes;
  if (!padresDesbloqueado) {
    const nuevo = !a.pin;
    app.innerHTML = `<section class="card bienvenida">
      <div class="buho-grande">🔐</div><h1>Zona de padres</h1>
      <p>${nuevo ? 'Crea un PIN de 4 a 8 cifras para proteger los ajustes de la IA.' : 'Introduce el PIN.'}</p>
      <form id="f-pin" class="fila"><input id="pin" type="password" inputmode="numeric" pattern="[0-9]{4,8}" maxlength="8" placeholder="PIN" required autocomplete="off">
      <button class="btn primary">${nuevo ? 'Crear PIN' : 'Entrar'}</button></form>
      ${Store.data.nombre ? '' : '<p class="mini"><a href="#/">← Volver</a></p>'}</section>`;
    $('#f-pin').onsubmit = async e => {
      e.preventDefault();
      const h = await hashPin($('#pin').value);
      if (nuevo) { a.pin = h; Store.save(); padresDesbloqueado = true; vistaPadres(app); }
      else if (h === a.pin) { padresDesbloqueado = true; vistaPadres(app); }
      else toast('PIN incorrecto', 'error');
    };
    return;
  }
  const P = AI.PROVEEDORES;
  app.innerHTML = `<h1>⚙️ Panel de padres</h1>
  <section class="card">
    <h2>🤖 Corrección con IA</h2>
    <p class="mini">La app llama a la IA directamente desde el navegador con <b>tu</b> clave de API. La clave se guarda solo en este dispositivo y no está en el código publicado. Pon un límite de gasto en la consola del proveedor.</p>
    <div class="fila radio">${Object.entries(P).map(([k, v]) => `<label><input type="radio" name="prov" value="${k}" ${a.proveedor === k ? 'checked' : ''}> ${v.nombre}</label>`).join('')}</div>
    ${Object.entries(P).map(([k, v]) => `<div class="prov" data-prov="${k}" ${a.proveedor === k ? '' : 'hidden'}>
      <label>Clave de API de ${v.nombre}<input type="password" id="key-${k}" value="${esc(a.claves[k])}" autocomplete="off" placeholder="Pega aquí la clave"></label>
      <label>Modelo<input id="mod-${k}" value="${esc(a.modelos[k])}" placeholder="${v.modeloPorDefecto}"></label>
      <p class="mini">Consigue la clave en <a href="${v.web}" target="_blank" rel="noopener">${v.web.replace('https://', '')}</a>. Deja el modelo vacío para usar el predeterminado (${v.modeloPorDefecto}).</p></div>`).join('')}
    <div class="acciones"><button class="btn primary" id="guardar-ia">Guardar</button><button class="btn" id="probar-ia">Probar conexión</button></div>
    <p id="estado-ia" class="mini"></p>
  </section>
  <section class="card">
    <h2>📊 Progreso de ${esc(Store.data.nombre || 'tu hijo/a')}</h2>
    <p>${pctCurso()}% del curso · ${Store.data.xp} puntos · racha actual ${Store.data.racha.dias} días · última actividad: ${Store.data.racha.ultima ? fechaCorta(Store.data.racha.ultima) : '—'}</p>
    <table class="tabla"><thead><tr><th>Módulo</th><th>Avance</th><th>Notas IA</th></tr></thead><tbody>
    ${MODULOS.map(m => {
      const notas = m.pasos.map((p, i) => ({ p, e: estadoPaso(m.id, i) })).filter(x => x.e?.nota != null && x.p.tipo !== 'quiz');
      return `<tr><td>${m.icono} ${esc(m.titulo)}</td><td>${pctModulo(m)}%</td><td>${notas.map(x => `<span title="${esc(x.p.titulo)}" class="nota ${x.e.nota >= 8 ? 'alta' : x.e.nota >= 5 ? 'media' : 'baja'}">${x.e.nota}</span>`).join(' ') || '—'}</td></tr>`;
    }).join('')}</tbody></table>
    ${Store.data.historial.length ? `<details><summary>Historial de correcciones (${Store.data.historial.length})</summary><ul class="historial">${Store.data.historial.map(h => `<li><b>${esc(h.titulo)}</b> ${h.nota != null ? `· ${h.nota}` : ''}<small>${new Date(h.fecha).toLocaleString('es-ES')} · ${esc(h.resumen)}</small></li>`).join('')}</ul></details>` : ''}
  </section>
  <section class="card">
    <h2>🧑 Alumno</h2>
    <form id="f-nom" class="fila"><input id="nom" value="${esc(Store.data.nombre)}" maxlength="30"><button class="btn">Cambiar nombre</button></form>
  </section>
  <section class="card">
    <h2>💾 Copia de seguridad</h2>
    <p class="mini">El progreso vive en este navegador. Exporta una copia para pasarlo a otro dispositivo (la clave de API no se incluye).</p>
    <div class="acciones"><button class="btn" id="exp">Exportar progreso</button><label class="btn">Importar<input type="file" accept="application/json" id="imp" hidden></label></div>
  </section>
  <section class="card">
    <h2>⚠️ Zona peligrosa</h2>
    <div class="acciones"><button class="btn" id="cambiar-pin">Cambiar PIN</button><button class="btn peligro" id="reset">Borrar todo el progreso</button><button class="btn" id="salir">Cerrar panel</button></div>
  </section>`;
  $$('input[name=prov]', app).forEach(r => r.onchange = () => $$('.prov', app).forEach(d => d.hidden = d.dataset.prov !== r.value));
  const guardar = () => {
    a.proveedor = $('input[name=prov]:checked', app).value;
    Object.keys(P).forEach(k => { a.claves[k] = $('#key-' + k).value.trim(); a.modelos[k] = $('#mod-' + k).value.trim(); });
    Store.save();
  };
  $('#guardar-ia').onclick = () => { guardar(); toast('Ajustes guardados ✔', 'ok'); };
  $('#probar-ia').onclick = async () => {
    guardar();
    const est = $('#estado-ia');
    if (!AI.configurada()) { est.textContent = 'Falta la clave.'; return; }
    est.innerHTML = '<span class="spin"></span> Probando…';
    try { await AI.probar(); est.textContent = '✅ ¡Conexión correcta! La corrección con IA está activa.'; }
    catch (e) { est.textContent = '❌ ' + e.message; }
  };
  $('#f-nom').onsubmit = e => { e.preventDefault(); const n = $('#nom').value.trim(); if (n) { Store.data.nombre = n; Store.save(); toast('Nombre cambiado'); } };
  $('#exp').onclick = () => {
    const d = JSON.parse(JSON.stringify(Store.data));
    d.ajustes = { proveedor: d.ajustes.proveedor, modelos: d.ajustes.modelos };
    const blob = new Blob([JSON.stringify(d, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob); link.download = `progreso-estudio-${hoy()}.json`; link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 2000);
  };
  $('#imp').onchange = async e => {
    const f = e.target.files[0]; if (!f) return;
    try {
      const d = JSON.parse(await f.text());
      if (typeof d !== 'object' || !d.progreso) throw new Error();
      const ajustes = Store.data.ajustes;
      Store.data = Object.assign(Store.defaults(), d, { ajustes });
      Store.save(); toast('Progreso importado ✔', 'ok'); vistaPadres(app);
    } catch (err) { toast('Archivo no válido', 'error'); }
  };
  $('#cambiar-pin').onclick = () => { a.pin = ''; Store.save(); padresDesbloqueado = false; vistaPadres(app); };
  $('#reset').onclick = () => {
    if (!confirm('¿Borrar TODO el progreso, tarjetas y plan? (Los ajustes de IA se mantienen)')) return;
    const ajustes = Store.data.ajustes;
    Store.data = Store.defaults(); Store.data.ajustes = ajustes; Store.save();
    toast('Progreso borrado'); navegar('#/');
  };
  $('#salir').onclick = () => { padresDesbloqueado = false; navegar('#/'); };
}

/* =========================================================
   ARRANQUE
   ========================================================= */
Store.load();
window.addEventListener('hashchange', render);
setInterval(pomoTick, 1000);
document.addEventListener('visibilitychange', pomoTick);
render();
comprobarLogros();
