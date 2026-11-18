const {
  estudiantes, materias, comisiones, iniciales, calendario,
  estudiante, materia, comision, carrera, facultad, nota: notaDe, promedio,
  cupos, ocupados, motivoDeRechazo, validaciones, inscripcionVigente
} = Academico;

const clave = "academica-del-sur-v1";
function periodoVigente() {
  const hoy = hoyAcademico();
  return calendario.find(item => item.categoria === "inscripcion" && item.fecha <= hoy && (item.hasta ?? item.fecha) >= hoy);
}
const periodoAbierto = Boolean(periodoVigente());
const main = document.querySelector("main");
const nombreSesion = document.querySelector("#estudiante");
const sesionCarrera = document.querySelector("#sesion-carrera");
const sesionAccion = document.querySelector("#sesion-accion");
const botonPerfil = document.querySelector("#mi-perfil");
const avatarPerfil = document.querySelector("#avatar-perfil");
const avatarSesion = document.querySelector("#avatar-sesion");
const vistaMovil = matchMedia("(max-width: 760px)");
const menuMovil = document.querySelector("#menu-movil");
const abrirMenu = document.querySelector("#abrir-menu");
const cabecera = document.querySelector(".masthead-inner");
const sesion = document.querySelector(".session");
const enlacesMoviles = menuMovil.querySelector(".drawer-links");
enlacesMoviles.innerHTML = document.querySelector(".nav-inner").innerHTML;

function adaptarMenu() {
  if (vistaMovil.matches) document.querySelector("#sesion-movil").append(sesion);
  else {
    if (menuMovil.open) cerrarMenu();
    cabecera.append(sesion);
  }
}

function cerrarMenu() {
  menuMovil.close();
  abrirMenu.setAttribute("aria-expanded", "false");
}

abrirMenu.addEventListener("click", () => {
  menuMovil.showModal();
  abrirMenu.setAttribute("aria-expanded", "true");
});
document.querySelector("#cerrar-menu").addEventListener("click", cerrarMenu);
menuMovil.addEventListener("cancel", event => {
  event.preventDefault();
  cerrarMenu();
});
menuMovil.addEventListener("click", event => {
  if (event.target.closest("a, .session-links button")) cerrarMenu();
  if (event.target === menuMovil) {
    const { left, right } = menuMovil.getBoundingClientRect();
    if (event.clientX < left || event.clientX > right) cerrarMenu();
  }
}, true);
vistaMovil.addEventListener("change", adaptarMenu);
adaptarMenu();

const dialogo = document.querySelector("#dialogo");
const contenido = document.querySelector("#dialogo-contenido");
let memoria = null;
let seleccion = "";
let comisionElegida = "";
let mostrarTodo = false;
let aviso = null;
let perfilAviso = null;
let modoAcceso = "login";
const claveDemo = "Campus-2026";
const correoDemo = "federico.acosta@campus.example";
const correoActivacion = "mateo.rios@campus.example";
const codigoActivacion = "AULA-218";
const filtros = { anio: "", cuatrimestre: "", estado: "", pagina: 1 };
const porPagina = 6;
const programados = new Set();

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const MESES_CORTOS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

const ICONOS = {
  check: '<path d="m5 12 4 4L19 6"/>',
  alert: '<path d="M12 3 2.5 20h19L12 3Z"/><path d="M12 9v5"/><path d="M12 17h.01"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  x: '<path d="m6 6 12 12M18 6 6 18"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 0-2 2V5Z"/><path d="M8 7h7"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  seat: '<path d="M6 10V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/><path d="M4 10h16v7H4z"/><path d="M7 17v3M17 17v3"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  link: '<path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/>'
};

function icono(nombre) {
  return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONOS[nombre] ?? ""}</svg>`;
}

function leer() {
  try {
    return JSON.parse(localStorage.getItem(clave)) ?? memoria;
  } catch {
    return memoria;
  }
}

function plantilla() {
  return { alumno: estudiantes[0].id, registros: iniciales, constancias: [], fotos: {}, perfiles: {}, cerrada: true };
}

let datos = { ...plantilla(), ...(leer() ?? {}) };
datos.registros = Array.isArray(datos.registros) ? datos.registros : iniciales;
datos.constancias = Array.isArray(datos.constancias) ? datos.constancias : [];
datos.fotos = datos.fotos && typeof datos.fotos === "object" ? datos.fotos : {};
datos.perfiles = datos.perfiles && typeof datos.perfiles === "object" ? datos.perfiles : {};
if (!datos.perfilAcademicoV2) {
  const existentes = new Set(datos.registros.map(item => item.id));
  guardar({
    perfilAcademicoV2: true,
    registros: [...datos.registros, ...iniciales.filter(item => item.estudiante === "S04" && !existentes.has(item.id))]
  });
}

function guardar(cambios) {
  const siguiente = { ...(leer() ?? datos), ...cambios };
  try {
    localStorage.setItem(clave, JSON.stringify(siguiente));
    datos = siguiente;
    memoria = siguiente;
    return true;
  } catch {
    return false;
  }
}

const registrosActuales = () => leer()?.registros ?? datos.registros;
const pagina = () => ["inicio", "calendario", "oferta", "inscripciones", "novedades", "servicios", "plan", "horarios", "constancias", "mis-constancias", "historia", "calificaciones", "perfil", "docente"].includes(location.hash.slice(1)) ? location.hash.slice(1) : "inicio";
const alumnoActual = () => estudiante(datos.alumno) ?? estudiantes[0];
const perfilAlumno = alumno => ({ telefono: "", direccion: "", correoContacto: alumno.correo ?? "", ...(datos.perfiles?.[alumno.id] ?? {}) });
const COLORES_AVATAR = ["#2f5f8a", "#2f7a6f", "#8a5a3b", "#6b4b8a", "#b4633c", "#28658a"];
function avatarGenerico(alumno) {
  const iniciales = alumno.nombre.split(" ").map(parte => parte[0]).slice(0, 2).join("").toUpperCase();
  const color = COLORES_AVATAR[Number(alumno.id.slice(1)) % COLORES_AVATAR.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" rx="40" fill="${color}"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="Manrope,Segoe UI,sans-serif" font-size="28" font-weight="700" fill="white">${iniciales}</text></svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}
const avatarAlumno = alumno => datos.fotos?.[alumno.id] ?? avatarGenerico(alumno);
const primerNombre = nombre => nombre.split(" ")[0];
const fecha = new Intl.DateTimeFormat("es-AR", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Argentina/Buenos_Aires" });
const inscripciones = () => registrosActuales().filter(item => item.estudiante === alumnoActual().id);
const esperar = ms => new Promise(resolve => setTimeout(resolve, ms));

function slug(valor) {
  return valor.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
}

const estado = valor => `<span class="status ${slug(valor)}">${valor}</span>`;
const encabezado = (titulo, descripcion) => `<header class="page-title"><p class="eyebrow">Universidad De Castelar</p><h1>${titulo}</h1><p>${descripcion}</p></header>`;
const codigoCursada = grupo => `${materia(grupo.materia).codigo} · Com: ${grupo.codigo}`;

function hoyAcademico() {
  const partes = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "America/Argentina/Buenos_Aires" }).formatToParts(new Date());
  return ["year", "month", "day"].map(tipo => partes.find(parte => parte.type === tipo).value).join("-");
}

function resumenAcademico(alumno) {
  const total = alumno.plan.length;
  const aprobadas = alumno.aprobadas.length;
  const avance = total ? Math.round((aprobadas / total) * 100) : 0;
  const enCurso = alumno.plan.filter(id => !alumno.aprobadas.includes(id) && inscripcionVigente(alumno, id, registrosActuales())?.estado === "Aprobada").length;
  const valor = promedio(alumno);
  return {
    total,
    aprobadas,
    avance,
    enCurso,
    promedio: valor === null ? "—" : valor.toLocaleString("es-AR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  };
}

const comunicados = [
  { fecha: "2026-11-12", etiqueta: "12 de noviembre", titulo: "Está abierta la inscripción a materias", detalle: "Ingresá a la oferta de tu plan de estudios, revisá los horarios y elegí una comisión. El resultado queda registrado en Mis inscripciones.", enlace: "oferta", accion: "Consultar comisiones" },
  { fecha: "2026-11-10", etiqueta: "10 de noviembre", titulo: "Correlativas y cupos de cursada", detalle: "Antes de confirmar, consultá las correlativas de cada materia y los lugares disponibles. Si una comisión se completa, podés volver a la oferta y elegir otra.", enlace: "oferta", accion: "Ver oferta académica" },
  { fecha: "2026-11-06", etiqueta: "6 de noviembre", titulo: "Dónde consultar el estado de una solicitud", detalle: "En Mis inscripciones están las solicitudes de tu usuario, su estado y el motivo si alguna quedó rechazada.", enlace: "inscripciones", accion: "Ir a mis inscripciones" }
];

function listadoNovedades(resumen = false) {
  return `<div class="news-list">${comunicados.slice(0, resumen ? 2 : comunicados.length).map(noticia => `<article>
    <time datetime="${noticia.fecha}">${noticia.etiqueta} de 2026</time>
    <h3>${noticia.titulo}</h3>
    <p>${noticia.detalle}</p>
    ${resumen ? "" : `<a class="inline-link" href="#${noticia.enlace}">${noticia.accion} →</a>`}
  </article>`).join("")}</div>`;
}

function novedades() {
  return `${encabezado("Novedades", "Avisos del portal académico · Segundo cuatrimestre de 2026")}
    <section class="panel news-page" aria-label="Avisos académicos">${listadoNovedades()}</section>`;
}

const catalogoServicios = [
  ["Plan de estudios", "Materias de tu carrera y correlativas.", "plan"],
  ["Mis horarios", "Días, docentes y aulas de tus cursadas aprobadas.", "horarios"],
  ["Inscripción a materias", "Oferta de cursada y selección de comisión.", "oferta"],
  ["Mis inscripciones", "Estado, historial y cancelación de tus solicitudes.", "inscripciones"],
  ["Historia académica", "Materias, resultados y avance de la carrera.", "historia"],
  ["Calificaciones", "Notas, condiciones y promedio académico.", "calificaciones"],
  ["Constancias y certificados", "Solicitudes de constancia de examen.", "constancias"],
  ["Mi perfil", "Datos personales, foto y resumen académico.", "perfil"],
  ["Mesas de examen", "Fechas de finales e inscripción a mesas."],
  ["Becas y bienestar", "Programas de apoyo y orientación estudiantil."]
];

function listaServicios(entradas) {
  return `<div class="service-list">${entradas.map(([titulo, detalle, ruta]) => ruta
    ? `<a href="#${ruta}"><strong>${titulo}</strong><span>${detalle}</span><b aria-hidden="true">→</b></a>`
    : `<div><strong>${titulo}</strong><span>${detalle}</span><small>No disponible en la demo</small></div>`).join("")}</div>`;
}

function servicios() {
  return `${encabezado("Servicios académicos", "Consultas y trámites de autogestión estudiantil.")}
    <section class="panel" aria-label="Directorio de servicios">${listaServicios(catalogoServicios)}</section>`;
}

const tiposConstancia = new Map([
  ["parcial", "Constancia de Examen Parcial"],
  ["final", "Constancia de Examen Final"],
  ["recuperatorio", "Constancia de Examen Recuperatorio"]
]);

function constancias() {
  const habilitadas = inscripciones().filter(item => ["Aprobada", "En curso", "Finalizada"].includes(item.estado));
  return `${encabezado("Solicitar constancia", "Solicitá una constancia de examen al docente de tu comisión.")}
    <section class="panel access-panel constancia-panel">
    <p>${alumnoActual().nombre} · Legajo ${alumnoActual().legajo}<br>${alumnoActual().carrera}</p>
    <a class="inline-link" href="#mis-constancias">Mis constancias →</a>
    ${habilitadas.length ? `<form id="form-constancia" class="form-stack">
      <label>Tipo de constancia<select name="tipo" required>
        <option value="">Seleccioná un tipo</option>
        ${[...tiposConstancia].map(([valor, etiqueta]) => `<option value="${valor}">${etiqueta}</option>`).join("")}
      </select></label>
      <label>Materia y comisión<select name="inscripcion" required>${habilitadas.map(item => {
        const grupo = comision(item.comision);
        return `<option value="${item.id}">${materia(grupo.materia).nombre} · ${grupo.codigo} · ${grupo.docente}</option>`;
      }).join("")}</select></label>
      <label>Fecha del examen<input type="date" name="examen" max="${hoyAcademico()}" required></label>
      <details><summary>Agregar motivo o destinatario (opcional)</summary><label>Motivo o destinatario<textarea name="motivo" maxlength="300" rows="2"></textarea></label></details>
      <p id="resultado-constancia" role="status" hidden></p>
      <div class="dialog-actions"><a class="button secondary" href="#mis-constancias">Cancelar</a><button class="button secondary" type="reset">Limpiar</button><button class="button">Solicitar constancia</button></div>
    </form>` : '<p>No poseés comisiones habilitadas para solicitar constancias.</p><a class="inline-link" href="#oferta">Consultar oferta académica</a>'}
    </section>`;
}

let paginaConstancias = 1;
function misConstancias() {
  const solicitudes = (datos.constancias ?? []).filter(item => item.estudiante === alumnoActual().id).slice().reverse();
  const porPagina = 3;
  const paginas = Math.max(1, Math.ceil(solicitudes.length / porPagina));
  paginaConstancias = Math.min(paginaConstancias, paginas);
  const inicio = (paginaConstancias - 1) * porPagina;
  return `${encabezado("Mis constancias", "Historial de solicitudes de constancia de examen.")}
    <section class="panel"><a class="button" href="#constancias">Solicitar constancia</a>
    ${solicitudes.length ? `<div class="request-history">${solicitudes.slice(inicio, inicio + porPagina).map(item => {
      const grupo = comision(item.comision);
      return `<article><div><strong>${tiposConstancia.get(item.tipo) ?? "Constancia de examen"}</strong><p>${materia(grupo.materia).nombre} · Comisión ${grupo.codigo}</p><small>${item.examen.split("-").reverse().join("/")} · ${grupo.docente}</small></div>
      <div>${estado(item.estado)} <small class="id-solicitud">Solicitud ${item.id}</small>
      ${item.estado === "Emitido" ? `<button class="button secondary" data-descargar="${item.id}">Descargar constancia</button>` : ""}
      ${item.estado === "Rechazado" ? `<p>${escapar(item.observaciones)}</p>` : ""}</div></article>`;
    }).join("")}</div>` : '<p>Todavía no solicitaste constancias.</p>'}
    ${paginas > 1 ? `<nav class="pagination" aria-label="Páginas de constancias">
      <button class="button secondary" data-pagina-constancia="-1" ${paginaConstancias === 1 ? "disabled" : ""}>Anterior</button>
      <span role="status" tabindex="-1" id="pagina-constancias">Página ${paginaConstancias} de ${paginas}</span>
      <button class="button secondary" data-pagina-constancia="1" ${paginaConstancias === paginas ? "disabled" : ""}>Siguiente</button>
    </nav>` : ""}</section>`;
}

const escapar = valor => String(valor ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
let docenteDemo = "";
function docente() {
  const docentes = [...new Set(comisiones.map(grupo => grupo.docente))];
  docenteDemo ||= docentes[0];
  const solicitudes = (leer()?.constancias ?? []).filter(item => item.docente === docenteDemo);
  return `${encabezado("Resolver certificados", "Perfil Docente · Simulación local para la presentación")}
    <section class="panel"><label>Docente de prueba<select id="docente-demo">${docentes.map(nombre => `<option ${nombre === docenteDemo ? "selected" : ""}>${nombre}</option>`).join("")}</select></label>
    ${solicitudes.length ? solicitudes.map(item => `<article class="panel">
      <h2>${tiposConstancia.get(item.tipo) ?? "Constancia de examen"}</h2>
      <p>${estudiante(item.estudiante).nombre} · ${materia(comision(item.comision).materia).nombre} · Examen ${item.examen}</p>
      <p>Solicitud ${item.id} · ${estado(item.estado)}</p>
      ${item.estado === "Solicitado" ? `<form class="form-stack" data-resolver-certificado="${item.id}">
      <label>Resolución<select name="resolucion"><option value="Emitido">Emitir</option><option value="Rechazado">Rechazar</option></select></label>
      <label>Motivo del rechazo<input name="observaciones" maxlength="300"></label>
      <button class="button">Confirmar resolución</button></form>` : "<p>Trámite finalizado.</p>"}</article>`).join("") : "<p>No hay solicitudes para este docente.</p>"}</section>`;
}

function estadoMateria(alumno, materiaId) {
  const calificacion = notaDe(alumno, materiaId);
  if (alumno.aprobadas.includes(materiaId)) {
    return {
      etiqueta: "Aprobada",
      nota: calificacion?.valor ?? "—",
      condicion: "Materia aprobada",
      periodo: calificacion ? `${calificacion.cuatrimestre}.º cuat. ${calificacion.anio}` : "Aprobada"
    };
  }
  const vigente = inscripcionVigente(alumno, materiaId, registrosActuales());
  if (vigente) {
    return {
      etiqueta: vigente.estado === "Pendiente" ? "Pendiente" : "En curso",
      nota: "—",
      condicion: vigente.estado === "Aprobada" ? "Cursada regular" : "Solicitud en revisión",
      periodo: `${periodo(vigente).cuatrimestre}.º cuat. ${periodo(vigente).anio}`
    };
  }
  return { etiqueta: "Pendiente", nota: "—", condicion: "Sin cursada", periodo: "—" };
}

function historia() {
  const alumno = alumnoActual();
  const resumen = resumenAcademico(alumno);
  const promocionadas = alumno.plan.filter(id => alumno.aprobadas.includes(id));
  const cursando = alumno.plan.filter(id => !alumno.aprobadas.includes(id) && inscripcionVigente(alumno, id, registrosActuales()));
  const pendientes = alumno.plan.filter(id => !alumno.aprobadas.includes(id) && !inscripcionVigente(alumno, id, registrosActuales()));

  const tarjetaPromocionada = id => {
    const item = materia(id);
    const calificacion = notaDe(alumno, id);
    return `<article class="history-card aprobada">
      <div class="grade-top"><span class="course-code">${item.codigo}</span>${estado("Aprobada")}</div>
      <h3>${item.nombre}</h3>
      <p class="big-nota">${calificacion?.valor ?? "—"}</p>
      <p class="muted">${calificacion ? `Nota final · ${calificacion.cuatrimestre}.º cuat. ${calificacion.anio}` : "Materia aprobada"}</p>
    </article>`;
  };

  const tarjetaCursando = id => {
    const item = materia(id);
    const inscripcion = inscripcionVigente(alumno, id, registrosActuales());
    const grupo = comision(inscripcion.comision);
    return `<article class="history-card en-curso">
      <div class="grade-top"><span class="course-code">${item.codigo}</span>${estado(inscripcion.estado === "Pendiente" ? "Pendiente" : "En curso")}</div>
      <h3>${item.nombre}</h3>
      <p><strong>Comisión ${grupo.codigo}</strong> · ${grupo.docente}</p>
      <p class="muted">${grupo.dia} · ${grupo.franja} · ${grupo.aula}</p>
      <a class="inline-link" href="#inscripciones">Seguir inscripción →</a>
    </article>`;
  };

  const tarjetaPendiente = id => {
    const item = materia(id);
    const faltantes = item.correlativas.filter(codigo => !alumno.aprobadas.includes(codigo));
    const disponible = faltantes.length === 0;
    return `<article class="history-card pendiente">
      <div class="grade-top"><span class="course-code">${item.codigo}</span>${estado(disponible ? "Disponible" : "Correlativas")}</div>
      <h3>${item.nombre}</h3>
      <p class="muted">${item.anio} · ${item.correlativas.length ? "Requiere: " + item.correlativas.map(codigo => materia(codigo).nombre).join(", ") : "Sin correlativas"}</p>
      ${faltantes.length ? `<p class="pendiente-text">Te falta aprobar: ${faltantes.map(codigo => materia(codigo).nombre).join(", ")}</p>` : ""}
      <a class="button mini ${disponible ? "" : "secondary"}" href="#oferta">Ver comisiones</a>
    </article>`;
  };

  const tituloSeccion = (titulo, descripcion, cantidad) => `<div class="history-heading">
    <div><p class="eyebrow">${cantidad}</p><h2>${titulo}</h2><p class="muted">${descripcion}</p></div>
  </div>`;

  return `${encabezado("Historia académica", alumno.nombre + " · " + alumno.carrera)}
    <section class="panel summary-panel">
      <div class="summary-stats">
        <div class="stat"><span>Materias aprobadas</span><strong>${resumen.aprobadas}<small> / ${resumen.total}</small></strong></div>
        <div class="stat"><span>Avance de la carrera</span><strong>${resumen.avance}<small>%</small></strong></div>
        <div class="stat"><span>Promedio general</span><strong>${resumen.promedio}</strong></div>
        <div class="stat"><span>Cursadas en curso</span><strong>${resumen.enCurso}</strong></div>
      </div>
      <div class="progress" role="img" aria-label="Avance de la carrera: ${resumen.avance}%"><span style="width:${resumen.avance}%"></span></div>
    </section>
    ${tituloSeccion("Materias promocionadas", "Aprobadas con su nota final y condición.", promocionadas.length)}
    ${promocionadas.length ? `<div class="history-grid">${promocionadas.map(tarjetaPromocionada).join("")}</div>` : '<p class="empty-line">Todavía no tenés materias aprobadas en el plan.</p>'}
    ${tituloSeccion("Cursando ahora", "Materias con inscripción vigente en este cuatrimestre.", cursando.length)}
    ${cursando.length ? `<div class="history-grid">${cursando.map(tarjetaCursando).join("")}</div>` : '<p class="empty-line">No tenés cursadas en curso. Podés elegir una comisión desde la oferta.</p>'}
    ${tituloSeccion("Materias pendientes", "Qué te falta aprobar para completar la carrera.", pendientes.length)}
    ${pendientes.length ? `<div class="history-grid">${pendientes.map(tarjetaPendiente).join("")}</div>` : '<p class="empty-line">¡Completaste el plan de estudios!</p>'}
    <div class="panel-footer">
      <a class="inline-link" href="#calificaciones">Ver detalle de calificaciones →</a>
      <a class="inline-link" href="#inscripciones">Consultar inscripciones →</a>
      <a class="inline-link" href="#plan">Ver plan de estudios →</a>
    </div>`;
}

function calificaciones() {
  const alumno = alumnoActual();
  const resumen = resumenAcademico(alumno);
  return `${encabezado("Calificaciones", alumno.nombre + " · " + alumno.carrera)}
    <section class="panel summary-panel">
      <div class="summary-stats">
        <div class="stat highlight"><span>Promedio general</span><strong>${resumen.promedio}</strong><small>Escala 0 a 10</small></div>
        <div class="stat"><span>Materias aprobadas</span><strong>${resumen.aprobadas}</strong><small>de ${resumen.total} del plan</small></div>
        <div class="stat"><span>Avance</span><strong>${resumen.avance}%</strong><small>Carrera en curso</small></div>
        <div class="stat"><span>En curso</span><strong>${resumen.enCurso}</strong><small>Cursadas regulares</small></div>
      </div>
    </section>
    <div class="grade-grid">${alumno.plan.map(id => {
      const item = materia(id);
      const detalle = estadoMateria(alumno, id);
      return `<article class="grade-card ${slug(detalle.etiqueta)}">
        <div class="grade-top"><span class="course-code">${item.codigo}</span>${estado(detalle.etiqueta)}</div>
        <h3>${item.nombre}</h3>
        <p class="grade-number">${detalle.nota}</p>
        <p class="muted">${detalle.condicion} · ${detalle.periodo}</p>
      </article>`;
    }).join("")}</div>
    <p class="legend">Las calificaciones y condiciones son datos simulados para la demostración. Las materias aprobadas se actualizan con el historial del legajo.</p>`;
}

function plan() {
  const alumno = alumnoActual();
  const datosCarrera = carrera(alumno);
  return `${encabezado("Plan de estudios", alumno.carrera + " · " + datosCarrera.plan)}
    <section class="panel history"><div class="table-wrap" tabindex="0" role="region" aria-label="Materias del plan"><table>
    <thead><tr><th scope="col">Código y materia</th><th scope="col">Correlativas</th><th scope="col">Estado</th><th scope="col">Calificación</th></tr></thead>
    <tbody>${alumno.plan.map(id => {
      const item = materia(id);
      const detalle = estadoMateria(alumno, id);
      return `<tr><td><strong>${item.codigo} · ${item.nombre}</strong><small>${item.anio}</small></td><td>${item.correlativas.map(codigo => materia(codigo).nombre).join(", ") || "Sin correlativas"}</td><td>${estado(detalle.etiqueta)}</td><td>${detalle.nota}</td></tr>`;
    }).join("")}</tbody></table></div></section>`;
}

function horarios() {
  const cursadas = inscripciones().filter(item => item.estado === "Aprobada").map(item => comision(item.comision));
  return `${encabezado("Mis horarios", "Días, docentes y aulas de tus cursadas con inscripción aprobada.")}
    <section class="panel">${cursadas.length ? `<div class="schedule-grid">${cursadas.map(grupo => `<article class="schedule-card">
      <div class="schedule-day"><span>${grupo.dia}</span><strong>${grupo.franja}</strong></div>
      <div><h3>${materia(grupo.materia).nombre}</h3><p>${codigoCursada(grupo)} · ${grupo.aula}</p><p class="muted">Docente · ${grupo.docente}</p></div>
    </article>`).join("")}</div>` : '<div class="empty"><h2>Todavía no tenés cursadas aprobadas</h2><p>Cuando se apruebe una inscripción, el horario aparece automáticamente acá.</p><a class="button" href="#oferta">Ver oferta de cursadas</a></div>'}</section>`;
}

function calendarioAcademico() {
  const gruposDef = [
    { id: "inscripcion", titulo: "Inscripción", icono: "book", color: "inscripcion", descripcion: "Períodos para elegir comisiones y registrar solicitudes." },
    { id: "verificacion", titulo: "Verificación a materias", icono: "check", color: "verificacion", descripcion: "Control de inscripciones, comisiones y estados." },
    { id: "arranque", titulo: "Arranque de clases", icono: "clock", color: "arranque", descripcion: "Inicio de cursadas y actividades de comienzo." },
    { id: "cursada", titulo: "Cursada", icono: "calendar", color: "cursada", descripcion: "Desarrollo del cuatrimestre y actividades académicas." },
    { id: "finales", titulo: "Finales", icono: "alert", color: "finales", descripcion: "Inscripción y mesas de exámenes finales." }
  ];

  const fechaLarga = iso => {
    const [anio, mes, dia] = iso.split("-").map(Number);
    return `${dia} de ${MESES[mes - 1]} de ${anio}`;
  };
  const fechaCorta = iso => {
    const [anio, mes, dia] = iso.split("-").map(Number);
    return `${dia} ${MESES_CORTOS[mes - 1]}`;
  };
  const rango = item => item.hasta ? `${fechaLarga(item.fecha)} al ${fechaLarga(item.hasta)}` : fechaLarga(item.fecha);

  const hoyIso = hoyAcademico();
  const proximas = (calendario.filter(item => (item.hasta ?? item.fecha) >= hoyIso).length
    ? calendario.filter(item => (item.hasta ?? item.fecha) >= hoyIso)
    : calendario).slice(0, 4);

  const grupos = gruposDef.map(grupo => ({
    ...grupo,
    items: calendario.filter(item => item.categoria === grupo.id).sort((a, b) => a.fecha.localeCompare(b.fecha))
  })).filter(grupo => grupo.items.length);

  const proximoId = proximas[0]?.categoria;

  return `<section class="calendar-hero" aria-labelledby="calendario-titulo">
    <div class="calendar-hero-copy">
      <p class="eyebrow">Agenda institucional</p>
      <h2 id="calendario-titulo">Calendario académico 2026</h2>
      <p>Consultá las fechas clave de inscripción, verificación, cursada y finales. Abrí cada evento para ver el detalle.</p>
      <div class="calendar-tags" aria-label="Tipos de eventos">
        ${grupos.map(grupo => `<span class="calendar-tag ${grupo.color}">${icono(grupo.icono)} ${grupo.titulo}</span>`).join("")}
      </div>
    </div>
    <aside class="calendar-next" aria-label="Próximas fechas">
      <h3>Próximas fechas</h3>
      <ul>${proximas.map(item => `<li>
        <span class="next-date"><strong>${fechaCorta(item.fecha)}</strong>${item.hasta ? `<small>al ${fechaCorta(item.hasta)}</small>` : ""}</span>
        <span class="next-info"><strong>${item.titulo}</strong><small>${item.tipo}</small></span>
      </li>`).join("")}</ul>
    </aside>
  </section>
  <div class="calendar-accordion" aria-label="Eventos del calendario académico">
    ${grupos.map(grupo => `<details class="cal-group ${grupo.color}" ${grupo.id === (proximoId ?? grupos[0].id) ? "open" : ""}>
      <summary>
        <span class="cal-group-icon">${icono(grupo.icono)}</span>
        <span class="cal-group-text"><strong>${grupo.titulo}</strong><small>${grupo.descripcion}</small></span>
        <span class="cal-group-count">${grupo.items.length} ${grupo.items.length === 1 ? "evento" : "eventos"}</span>
        <span class="cal-chevron" aria-hidden="true"></span>
      </summary>
      <div class="cal-events">
        ${grupo.items.map(item => {
          const activo = item.fecha <= hoyIso && hoyIso <= (item.hasta ?? item.fecha);
          const pasado = (item.hasta ?? item.fecha) < hoyIso;
          return `<article class="cal-event ${activo ? "is-active" : pasado ? "is-past" : "is-upcoming"}">
            <div class="cal-event-date">
              <span class="cal-day-num">${item.fecha.split("-")[2]}</span>
              <span class="cal-month">${MESES_CORTOS[Number(item.fecha.split("-")[1]) - 1]}</span>
              ${item.hasta ? `<span class="cal-range">al ${fechaCorta(item.hasta)}</span>` : ""}
            </div>
            <div class="cal-event-body">
              <div class="cal-event-top"><span class="cal-badge ${grupo.color}">${item.tipo}</span>${activo ? '<span class="cal-live">En curso</span>' : pasado ? '<span class="cal-done">Finalizado</span>' : '<span class="cal-soon">Próximo</span>'}</div>
              <h3>${item.titulo}</h3>
              <p>${item.detalle}</p>
              <p class="cal-when">${icono("calendar")} ${rango(item)}</p>
            </div>
          </article>`;
        }).join("")}
      </div>
    </details>`).join("")}
  </div>
  <p class="legend calendar-note">Calendario de demostración del ciclo lectivo 2026. Las fechas pueden variar según la facultad y la comunicación oficial.</p>`;
}

function vistaCalendario() {
  return `<header class="page-title calendar-page-title">
    <p class="eyebrow">Universidad De Castelar</p>
    <h1>Calendario académico</h1>
    <p>Fechas importantes del ciclo lectivo: inscripción, verificación a materias, arranque de clases, cursada y finales.</p>
  </header>${calendarioAcademico()}`;
}

function inicio() {
  const alumno = alumnoActual();
  const datosCarrera = carrera(alumno);
  const fac = facultad(alumno);
  const resumen = resumenAcademico(alumno);
  return `<section class="hero hero-home">
    <div class="hero-copy">
      <p class="term">${periodoVigente()?.titulo ?? "Portal académico"}</p>
      <h1>Hola, ${primerNombre(alumno.nombre)}</h1>
      <p class="hero-career">${datosCarrera.nombre}</p>
      <p class="hero-lead">Período de inscripción abierto</p>
      <div class="hero-actions">
        <a class="button" href="#oferta">Inscribirme a materias ${icono("arrow")}</a>
        <a class="button ghost" href="#calificaciones">Ver mis notas</a>
      </div>
    </div>
    <aside class="hero-profile" aria-label="Resumen del legajo">
      <h2>Resumen académico</h2>
      <span>Legajo ${alumno.legajo} · ${alumno.estado}</span>
      <div class="hero-progress">
        <div class="progress-meta"><span>Avance de la carrera</span><strong>${resumen.avance}%</strong></div>
        <div class="progress" role="img" aria-label="Avance de la carrera: ${resumen.avance}%"><span style="width:${resumen.avance}%"></span></div>
      </div>
      <dl class="hero-mini">
        <div><dt>Aprobadas</dt><dd>${resumen.aprobadas}/${resumen.total}</dd></div>
        <div><dt>Promedio</dt><dd>${resumen.promedio}</dd></div>
        <div><dt>En curso</dt><dd>${resumen.enCurso}</dd></div>
      </dl>
    </aside>
  </section>
  <nav class="quick-links" aria-label="Accesos académicos">
    <a class="quick-card" href="#oferta">
      <span class="quick-icon">${icono("book")}</span>
      <span class="quick-text"><strong>Inscribirme a materias</strong><small>Elegí comisión, revisá cupos y confirmá tu inscripción.</small></span>
      <span class="quick-arrow" aria-hidden="true">Ir a oferta →</span>
    </a>
    <a class="quick-card" href="#inscripciones">
      <span class="quick-icon">${icono("check")}</span>
      <span class="quick-text"><strong>Mis inscripciones</strong><small>Consultá el estado de tus solicitudes o cancelá una inscripción.</small></span>
      <span class="quick-arrow" aria-hidden="true">Ver inscripciones →</span>
    </a>
    <a class="quick-card" href="#calificaciones">
      <span class="quick-icon">${icono("book")}</span>
      <span class="quick-text"><strong>Calificaciones</strong><small>Revisá tus notas, promedio y avance académico.</small></span>
      <span class="quick-arrow" aria-hidden="true">Ver notas →</span>
    </a>
    <a class="quick-card" href="#servicios">
      <span class="quick-icon">${icono("link")}</span>
      <span class="quick-text"><strong>Servicios académicos</strong><small>Accedé a horarios, plan, constancias y trámites.</small></span>
      <span class="quick-arrow" aria-hidden="true">Ver servicios →</span>
    </a>
  </nav>
  <div class="home-grid">
    <section class="panel context">
      <div class="section-heading"><h2>Datos académicos</h2><a class="inline-link" href="#perfil">Editar perfil</a></div>
      <dl>
        <div><dt>Estudiante</dt><dd>${alumno.nombre}</dd></div>
        <div><dt>Legajo</dt><dd>${alumno.legajo}</dd></div>
        <div><dt>Carrera</dt><dd>${datosCarrera.nombre}</dd></div>
        <div><dt>Facultad</dt><dd>${fac.nombre}</dd></div>
        <div><dt>Plan</dt><dd>${datosCarrera.plan} · ${datosCarrera.duracion}</dd></div>
        <div><dt>Estado</dt><dd>${alumno.estado}</dd></div>
      </dl>
    </section>
    <section class="panel period">
      <p class="eyebrow">Inscripción a materias</p>
      <h2>${periodoAbierto ? "Período de inscripción abierto" : "Inscripciones cerradas"}</h2>
      <p>${periodoVigente() ? `Desde ${periodoVigente().fecha} hasta ${periodoVigente().hasta ?? periodoVigente().fecha} · ${periodoVigente().titulo}` : "Consultá las próximas fechas en el calendario académico."}</p>
      <p class="period-state"><span></span> Hasta el 30 de noviembre de 2026</p>
      <p>Revisá las correlativas, el cupo y los horarios antes de confirmar. La solicitud pasa por Pendiente y luego se aprueba o rechaza.</p>
      <a class="button" href="#oferta">Elegir comisión ${icono("arrow")}</a>
      <a class="inline-link" href="#inscripciones">Ver mis inscripciones</a>
    </section>
  </div>
  <section class="panel faculty-panel">
    <div class="faculty-photo"><img src="facultad.jpg" alt="Edificio universitario del campus"></div>
    <div class="faculty-copy">
      <p class="eyebrow">Tu facultad</p>
      <h2>${fac.nombre}</h2>
      <p>${fac.descripcion}</p>
      <dl class="faculty-meta">
        <div><dt>Sede</dt><dd>${fac.sede}</dd></div>
        <div><dt>Coordinación</dt><dd>${fac.coordinacion}</dd></div>
        <div><dt>Contacto</dt><dd>${fac.correo} · ${fac.telefono}</dd></div>
        <div><dt>Carrera</dt><dd>${datosCarrera.nombre} · ${datosCarrera.resolucion}</dd></div>
      </dl>
      <a class="inline-link" href="#historia">Ver historia académica →</a>
    </div>
  </section>
  <section class="panel home-news">
    <div class="section-heading"><h2>Mi actividad académica</h2><a class="inline-link" href="#servicios">Todos los servicios →</a></div>
    ${listaServicios([catalogoServicios[0], catalogoServicios[1], catalogoServicios[4], catalogoServicios[5], catalogoServicios[6], catalogoServicios[7]])}
  </section>
  <section class="panel home-news">
    <div class="section-heading"><h2>Últimas novedades</h2><a class="inline-link" href="#novedades">Ver todos los avisos →</a></div>
    ${listadoNovedades(true)}
  </section>`;
}

function validacionPreview(grupo) {
  const checks = validaciones(alumnoActual(), grupo, registrosActuales(), periodoAbierto);
  const fallas = checks.filter(item => !item.ok);
  return `<div class="validation-preview ${fallas.length ? "warn" : "ok"}">
    <p><strong>${fallas.length ? "Revisá los requisitos antes de confirmar" : "Todo listo para inscribirte"}</strong><span>${fallas.length ? fallas.length + (fallas.length === 1 ? " punto a revisar" : " puntos a revisar") : "Las validaciones se volverán a ejecutar al confirmar."}</span></p>
    <ul class="validation-chips">${checks.map(item => `<li class="${item.ok ? "ok" : "fail"}">${icono(item.ok ? "check" : "x")}${item.etiqueta}</li>`).join("")}</ul>
  </div>`;
}

function oferta() {
  const alumno = alumnoActual();
  const listado = materias.filter(item => mostrarTodo || alumno.plan.includes(item.id));
  const elegida = listado.find(item => item.id === seleccion) ?? listado[0];
  const grupos = comisiones.filter(item => item.materia === elegida.id && item.activa);
  if (grupos.length === 1) comisionElegida = grupos[0].id;
  const grupoElegido = grupos.find(grupo => grupo.id === comisionElegida);
  const vigente = inscripcionVigente(alumno, elegida.id, registrosActuales());
  return `${encabezado("Inscripción a materias", "Seleccioná una materia y revisá sus comisiones antes de confirmar.")}
    <div class="student-strip">
      <img src="${avatarAlumno(alumno)}" alt="">
      <div><strong>${alumno.nombre}</strong><span>Legajo ${alumno.legajo} · ${alumno.estado}</span></div>
      <div class="strip-career"><small>Carrera</small><strong>${alumno.carrera}</strong></div>
      <div class="strip-faculty"><small>Facultad</small><strong>${facultad(alumno).sigla}</strong></div>
    </div>
    <div class="offer-grid">
      <aside class="panel subjects"><h2>Materias</h2>
        <label class="check"><input id="todas" type="checkbox" ${mostrarTodo ? "checked" : ""}> Incluir otras carreras</label>
        <label class="selector-materia">Materia<select id="selector-materia">${listado.map(item => `<option value="${item.id}" ${item.id === elegida.id ? "selected" : ""}>${item.codigo} · ${item.nombre}</option>`).join("")}</select></label>
        <div class="subject-list">${listado.map(item => `<button type="button" data-materia="${item.id}" aria-pressed="${item.id === elegida.id}"><small>${item.codigo}</small><span>${item.nombre}</span></button>`).join("")}</div>
        <p class="legend">${alumno.plan.length} materias en tu plan · ${alumno.aprobadas.length} aprobadas</p>
      </aside>
      <section class="panel groups">
        <div class="course-heading"><span class="course-code">${elegida.codigo}</span><h2>${elegida.nombre}</h2></div>
        <p class="muted">${elegida.correlativas.length ? "Correlativas: " + elegida.correlativas.map(id => materia(id).nombre).join(", ") : "Sin correlativas"} · ${elegida.anio}</p>
        ${vigente ? `<div class="enrollment-confirmed"><strong>${vigente.estado === "Pendiente" ? "Solicitud pendiente de verificación." : "Ya estás inscripto/a en esta materia."}</strong> ${vigente.estado === "Pendiente" ? "Esperá el resultado o consultá Mis inscripciones." : "Tu inscripción está aprobada."} <a class="inline-link" href="#inscripciones">Ver mi inscripción</a></div>` : ""}
        ${!alumno.plan.includes(elegida.id) ? '<p class="note">Esta materia está fuera de tu plan de estudios. La inscripción será rechazada.</p>' : ""}
        <fieldset class="commission-sheet"><legend>Comisiones de cursada</legend>
        <div class="sheet-head" aria-hidden="true"><span>Comisión y horario</span><span>Docente y aula</span><span>Cupo</span><span></span></div>
        ${grupos.length ? grupos.map(grupo => {
          const plazas = cupos(grupo, registrosActuales());
          const usados = ocupados(grupo, registrosActuales());
          const porcentaje = Math.min(100, Math.round((usados / grupo.capacidad) * 100));
          const observacion = vigente ? "" : motivoDeRechazo(alumno, grupo, registrosActuales(), periodoAbierto);
          return `<label class="commission-row">
            <span><strong>Com: ${grupo.codigo}</strong><small>${grupo.horario}</small></span>
            <span><strong>${grupo.docente}</strong><small>${grupo.aula}</small></span>
            <span class="cupo-cell"><span class="status ${plazas ? "aprobada" : "rechazada"}">${plazas ? plazas + (plazas === 1 ? " lugar libre" : " lugares libres") : "Sin cupo"}</span><span class="cupo-meter" aria-hidden="true"><span style="width:${porcentaje}%"></span></span></span>
            <input type="radio" name="comision" value="${grupo.id}" aria-label="Seleccionar comisión ${grupo.codigo}" ${grupo.id === comisionElegida ? "checked" : ""}>
            ${observacion ? `<span class="group-notice">${observacion}</span>` : ""}
          </label>`;
        }).join("") : '<p class="note">No hay comisiones activas para esta materia en el período actual.</p>'}</fieldset>
        <div id="validacion-previa" aria-live="polite">${grupoElegido ? validacionPreview(grupoElegido) : ""}</div>
        <div class="enrollment-bar">
          <span id="cursada-seleccionada" aria-live="polite">${grupoElegido ? codigoCursada(grupoElegido) + " · " + alumno.nombre : "Seleccioná una comisión para continuar."}</span>
          <button class="button" type="button" id="revisar-inscripcion" ${grupoElegido ? "" : "disabled"}>Confirmar inscripción ${icono("arrow")}</button>
        </div>
      </section>
    </div>`;
}

function periodo(registro) {
  const partes = new Intl.DateTimeFormat("es-AR", {
    year: "numeric", month: "numeric", timeZone: "America/Argentina/Buenos_Aires"
  }).formatToParts(new Date(registro.fecha));
  return {
    anio: registro.anio ?? partes.find(parte => parte.type === "year").value,
    cuatrimestre: registro.cuatrimestre ?? (Number(partes.find(parte => parte.type === "month").value) < 8 ? "1" : "2")
  };
}

function historial() {
  const registros = inscripciones().slice().reverse();
  const anios = [...new Set(registros.map(item => periodo(item).anio))].sort().reverse();
  const estados = [...new Set(registros.map(item => item.estado))].sort();
  const resultados = registros.filter(item => {
    const { anio, cuatrimestre } = periodo(item);
    return (!filtros.anio || filtros.anio === anio) &&
      (!filtros.cuatrimestre || filtros.cuatrimestre === cuatrimestre) &&
      (!filtros.estado || filtros.estado === item.estado);
  });
  const paginas = Math.max(1, Math.ceil(resultados.length / porPagina));
  filtros.pagina = Math.min(filtros.pagina, paginas);
  const desde = (filtros.pagina - 1) * porPagina;
  const visibles = resultados.slice(desde, desde + porPagina);
  const select = (campo, etiqueta, opciones) => `<label>${etiqueta}<select data-filtro="${campo}">
    <option value="">Todos</option>${opciones.map(([valor, nombre]) => `<option value="${valor}" ${filtros[campo] === valor ? "selected" : ""}>${nombre}</option>`).join("")}</select></label>`;
  return `${encabezado("Mis inscripciones", "Solicitudes y resultados de " + alumnoActual().nombre + ".")}
    <section class="panel history">${registros.length ? `
      <div class="history-toolbar">
        ${select("anio", "Año", anios.map(anio => [anio, anio]))}
        ${select("cuatrimestre", "Cuatrimestre", [["1", "Primero"], ["2", "Segundo"]])}
        ${select("estado", "Estado", estados.map(valor => [valor, valor]))}
        <button class="text-button" type="button" data-limpiar>Limpiar filtros</button>
      </div>
      <p class="history-count" id="historial-resultados" role="status" tabindex="-1">${visibles.length ? `${desde + 1}–${desde + visibles.length} de ${resultados.length} inscripciones` : "No hay inscripciones con estos filtros."}</p>
      ${visibles.length ? `<div class="table-wrap" tabindex="0" role="region" aria-label="Historial de inscripciones"><table class="history-table">
      <thead><tr><th scope="col">Materia y comisión</th><th scope="col">Fecha</th><th scope="col">Estado</th><th scope="col">Acciones</th></tr></thead>
      <tbody>${visibles.map(registro => {
        const grupo = comision(registro.comision);
        const { anio, cuatrimestre } = periodo(registro);
        const cancela = ["Pendiente", "Aprobada"].includes(registro.estado);
        return `<tr><td><strong>${materia(grupo.materia).nombre}</strong><small>${codigoCursada(grupo)} · ${grupo.horario}</small></td><td><time datetime="${registro.fecha}">${fecha.format(new Date(registro.fecha))}</time><small>${cuatrimestre === "1" ? "1.er" : "2.º"} cuatrimestre · ${anio}</small></td><td>${estado(registro.estado)}${registro.motivo ? `<small>${registro.motivo}</small>` : ""}</td><td class="acciones">${cancela ? `<button class="button mini secondary cancel-action" type="button" data-cancelar="${registro.id}">Cancelar inscripción</button>` : '<span class="accion-na">Sin acciones</span>'}</td></tr>`;
      }).join("")}</tbody>
      </table></div>` : ""}
      ${paginas > 1 ? `<nav class="pagination" aria-label="Paginación del historial">
        <button class="button secondary" data-pagina="-1" ${filtros.pagina === 1 ? "disabled" : ""}>Anterior</button>
        <span>Página ${filtros.pagina} de ${paginas}</span>
        <button class="button secondary" data-pagina="1" ${filtros.pagina === paginas ? "disabled" : ""}>Siguiente</button>
      </nav>` : ""}` : `<div class="empty"><h2>Todavía no tenés inscripciones</h2><p>Cuando confirmes una solicitud, acá vas a poder seguir su estado y cancelarla si lo necesitás.</p><a class="button" href="#oferta">Consultar oferta académica</a></div>`}</section>`;
}

function limpiarFiltros() {
  Object.assign(filtros, { anio: "", cuatrimestre: "", estado: "", pagina: 1 });
}

function acceso() {
  const registro = modoAcceso === "registro";
  return `<section class="access-layout">
    <div class="access-intro">
      <p class="term">Universidad De Castelar</p>
      <h1>${registro ? "Activar cuenta" : "Portal de autogestión estudiantil"}</h1>
      <p class="access-lead">${registro ? "Activá el acceso con el legajo y el correo que figuran en el padrón académico." : "Accedé para consultar tu carrera, inscribirte a materias, revisar tu historia académica y realizar trámites en línea."}</p>
      <ul class="access-features">
        <li><strong>Inscripción a materias</strong><span>Comisiones, cupos y validaciones en tiempo real.</span></li>
        <li><strong>Historia y calificaciones</strong><span>Seguimiento del avance de tu carrera.</span></li>
        <li><strong>Servicios académicos</strong><span>Horarios, constancias y novedades institucionales.</span></li>
      </ul>
      <p class="access-note">Acceso seguro para estudiantes. Ante cualquier inconveniente, contactá a la Secretaría Académica.</p>
    </div>
    <section class="panel access-panel">
      <form id="form-acceso">
        <h2>${registro ? "Datos de activación" : "Iniciar sesión"}</h2>
        ${registro ? '<label>Legajo<input name="legajo" placeholder="2026-0218" required></label>' : ""}
        <label>Correo institucional<input name="correo" type="email" autocomplete="email" placeholder="${registro ? correoActivacion : correoDemo}" required></label>
        ${registro ? '<label>Código de activación<input name="codigo" autocomplete="off" placeholder="AULA-218" required></label>' : ""}
        <label>Contraseña<input name="clave" type="password" autocomplete="current-password" required></label>
        ${registro ? '<label>Confirmar contraseña<input name="confirmacion" type="password" autocomplete="new-password" required></label>' : ""}
        <label class="password-visibility"><input type="checkbox" id="mostrar-claves"> Mostrar contraseña</label>
        <p id="error-acceso" role="alert" hidden></p>
        <button class="button" type="submit">${registro ? "Activar cuenta e ingresar" : "Ingresar"}</button>
      </form>
      <div class="access-options">
        <button class="text-button" type="button" data-acceso="${registro ? "login" : "registro"}">${registro ? "Volver a iniciar sesión" : "¿Primera vez? Activar cuenta"}</button>
        ${registro ? "" : '<button class="text-button" type="button" data-demo-acceso>Ingresar con cuenta de demostración</button>'}
      </div>
      ${registro ? "" : `<details class="access-credentials">
        <summary>Datos de acceso de prueba</summary>
        <div><strong>Estudiante:</strong> ${estudiantes[0].nombre} (${estudiantes[0].legajo})<br><strong>Correo:</strong> ${correoDemo}<br><strong>Contraseña:</strong> <code>${claveDemo}</code></div>
      </details>`}
    </section></section>`;
}

function perfil() {
  const alumno = alumnoActual();
  const datosCarrera = carrera(alumno);
  const fac = facultad(alumno);
  const resumen = resumenAcademico(alumno);
  const foto = avatarAlumno(alumno);
  const generica = !datos.fotos?.[alumno.id];
  const contacto = perfilAlumno(alumno);
  const escapeAttr = valor => String(valor ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  return `${encabezado("Mi perfil", "Datos personales, foto y resumen de tu carrera.")}
    ${perfilAviso ? `<p class="inline-alert ${perfilAviso.tipo}" role="status">${perfilAviso.texto}</p>` : ""}
    <div class="profile-layout">
      <section class="panel profile-card">
        <div class="profile-avatar"><img id="foto-perfil" src="${foto}" alt="Foto de perfil de ${alumno.nombre}"></div>
        <h2>${alumno.nombre}</h2>
        <p class="muted">${alumno.legajo} · ${alumno.estado}</p>
        <div class="photo-actions">
          <label class="button secondary file-button">${icono("camera")} ${generica ? "Cargar foto" : "Cambiar foto"}<input type="file" id="foto-input" accept="image/*"></label>
          ${generica ? "" : '<button class="text-button" type="button" data-quitar-foto>Quitar foto</button>'}
        </div>
        <p class="legend">JPG, PNG o WebP. La imagen se recorta al centro y queda guardada en este navegador. Si no cargás una, se usa la foto genérica.</p>
      </section>
      <div class="profile-main">
        <section class="panel">
          <div class="section-heading"><h2>Datos académicos</h2><a class="inline-link" href="#historia">Ver historia académica</a></div>
          <dl class="profile-data">
            <div><dt>Nombre</dt><dd>${alumno.nombre}</dd></div>
            <div><dt>Legajo</dt><dd>${alumno.legajo}</dd></div>
            <div><dt>Correo institucional</dt><dd>${alumno.correo}</dd></div>
            <div><dt>Carrera</dt><dd>${datosCarrera.nombre}</dd></div>
            <div><dt>Facultad</dt><dd>${fac.nombre}</dd></div>
            <div><dt>Plan</dt><dd>${datosCarrera.plan} · ${datosCarrera.duracion}</dd></div>
            <div><dt>Ingreso</dt><dd>${alumno.ingreso}</dd></div>
            <div><dt>Estado</dt><dd>${alumno.estado}</dd></div>
          </dl>
        </section>
        <section class="panel">
          <h2>Datos de contacto</h2>
          <p class="muted">Podés actualizar tu información de contacto. Los datos académicos son gestionados por la Secretaría Académica.</p>
          <form id="form-perfil" class="form-stack profile-form">
            <label>Correo de contacto<input name="correoContacto" type="email" value="${escapeAttr(contacto.correoContacto)}" placeholder="tu-correo@ejemplo.com"></label>
            <label>Teléfono<input name="telefono" type="tel" value="${escapeAttr(contacto.telefono)}" placeholder="(011) 15-0000-0000"></label>
            <label>Dirección<input name="direccion" type="text" value="${escapeAttr(contacto.direccion)}" placeholder="Calle, número, localidad"></label>
            <div class="dialog-actions"><button class="button" type="submit">Guardar cambios</button></div>
          </form>
        </section>
        <section class="panel">
          <h2>Resumen académico</h2>
          <div class="summary-stats compact">
            <div class="stat"><span>Avance</span><strong>${resumen.avance}%</strong></div>
            <div class="stat"><span>Aprobadas</span><strong>${resumen.aprobadas}/${resumen.total}</strong></div>
            <div class="stat"><span>Promedio</span><strong>${resumen.promedio}</strong></div>
          </div>
          <div class="progress" role="img" aria-label="Avance de la carrera: ${resumen.avance}%"><span style="width:${resumen.avance}%"></span></div>
          <div class="profile-links"><a class="inline-link" href="#calificaciones">Calificaciones →</a><a class="inline-link" href="#horarios">Mis horarios →</a><a class="inline-link" href="#inscripciones">Mis inscripciones →</a></div>
        </section>
      </div>
    </div>`;
}

function banner() {
  if (!aviso) return "";
  const grupo = aviso.comision ? comision(aviso.comision) : null;
  const etiqueta = grupo ? `${materia(grupo.materia).nombre} · Comisión ${grupo.codigo}` : "";
  const libres = grupo ? cupos(grupo, registrosActuales()) : null;
  const config = {
    Pendiente: {
      clase: "pendiente",
      icono: "clock",
      titulo: "Solicitud registrada · Pendiente",
      texto: "Estamos verificando carrera, correlativas, inscripción previa y cupo. El resultado se actualiza en unos segundos."
    },
    Aprobada: {
      clase: "aprobada",
      icono: "check",
      titulo: "Inscripción realizada correctamente",
      texto: libres === null ? "La solicitud quedó aprobada." : `La solicitud quedó aprobada y el cupo fue reservado. Quedan ${libres} ${libres === 1 ? "lugar disponible" : "lugares disponibles"} en la comisión.`
    },
    Rechazada: {
      clase: "rechazada",
      icono: "alert",
      titulo: "Inscripción no permitida",
      texto: aviso.motivo || "No se cumplen los requisitos de inscripción."
    },
    Cancelada: {
      clase: "cancelada",
      icono: "x",
      titulo: "Inscripción cancelada",
      texto: "El cupo fue liberado y la comisión vuelve a tener disponibilidad."
    }
  }[aviso.estado] ?? { clase: "pendiente", icono: "clock", titulo: aviso.estado, texto: "" };
  return `<section id="resultado" tabindex="-1" role="status" class="result ${config.clase}">
    <span class="result-icon">${icono(config.icono)}</span>
    <div class="result-copy"><strong>${config.titulo}</strong>
    ${etiqueta ? `<p>${etiqueta}</p>` : ""}
    <p>${config.texto}</p>
    <a class="inline-link" href="#inscripciones">Ver mis inscripciones →</a></div>
  </section>`;
}

function render(transicion = false) {
  const ruta = pagina();
  const alumno = alumnoActual();
  const cerrada = Boolean(datos.cerrada);
  nombreSesion.textContent = cerrada ? "Acceso al portal" : alumno.nombre;
  sesionCarrera.textContent = cerrada ? "" : alumno.carrera;
  sesionCarrera.hidden = cerrada;
  sesionAccion.textContent = cerrada ? "Iniciar sesión" : "Cerrar sesión";
  document.querySelector("#mis-constancias").hidden = cerrada;
  botonPerfil.hidden = cerrada;
  avatarPerfil.hidden = cerrada;
  avatarSesion.src = cerrada ? "perfil.svg" : avatarAlumno(alumno);
  document.querySelectorAll(".nav a, .drawer-links a").forEach(link => {
    const activo = link.hash === "#" + ruta || (["plan", "horarios", "constancias", "historia", "calificaciones", "perfil", "inscripciones"].includes(ruta) && link.hash === "#servicios");
    if (activo) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  main.dataset.vista = cerrada ? "acceso" : ruta;
  const vistas = { inicio, calendario: vistaCalendario, oferta, inscripciones: historial, novedades, servicios, plan, horarios, constancias, "mis-constancias": misConstancias, historia, calificaciones, perfil, docente };
  const publicas = new Set(["calendario"]);
  const vista = datos.cerrada && !publicas.has(ruta)
    ? acceso()
    : datos.cerrada
      ? (vistas[ruta] ?? vistaCalendario)()
      : banner() + (vistas[ruta] ?? inicio)();
  main.innerHTML = `<div class="${transicion ? "view-enter" : ""}">${vista}</div>`;
}

function modal(html, ancho = false) {
  dialogo.classList.toggle("dialog-wide", ancho);
  contenido.innerHTML = html;
  if (!dialogo.open) dialogo.showModal();
}

function confirmar(grupo) {
  const alumno = alumnoActual();
  const datosCarrera = carrera(alumno);
  const checks = validaciones(alumno, grupo, registrosActuales(), periodoAbierto);
  const libres = cupos(grupo, registrosActuales());
  const usados = ocupados(grupo, registrosActuales());
  const todasOk = checks.every(item => item.ok);
  modal(`<h2 id="dialogo-titulo">Confirmar inscripción</h2>
    <div class="enrollment-review">
    <div class="review-scroll">
    <div class="confirm-card">
      <div class="confirm-head"><span class="course-code">${materia(grupo.materia).codigo}</span><span class="status ${libres ? "aprobada" : "rechazada"}">${libres ? libres + (libres === 1 ? " lugar libre" : " lugares libres") : "Sin cupo"}</span></div>
      <h3>${materia(grupo.materia).nombre}</h3>
      <dl class="confirm-grid">
        <div><dt>Estudiante</dt><dd>${alumno.nombre}</dd></div>
        <div><dt>Legajo</dt><dd>${alumno.legajo}</dd></div>
        <div><dt>Comisión</dt><dd>${grupo.codigo}</dd></div>
        <div><dt>Día y horario</dt><dd>${grupo.dia} · ${grupo.franja}</dd></div>
        <div><dt>Docente</dt><dd>${grupo.docente}</dd></div>
        <div><dt>Aula</dt><dd>${grupo.aula}</dd></div>
        <div><dt>Cupos disponibles</dt><dd>${libres} de ${grupo.capacidad}</dd></div>
      </dl>
    </div>
    <p class="review-summary">${todasOk ? "Cumplís todos los requisitos de inscripción." : "Revisá estas condiciones antes de confirmar."}</p>
    ${todasOk ? "" : `<ul class="review-errors">${checks.filter(item => !item.ok).map(item => `<li>${item.detalle}</li>`).join("")}</ul>`}
    <details class="review-details"><summary>Ver todas las validaciones (${checks.length})</summary>
    <ul>${checks.map(item => `<li>${item.ok ? "✓" : "!"} ${item.etiqueta}</li>`).join("")}</ul></details>
    <p class="hint">La solicitud se registra como Pendiente y se valida al confirmar.</p>
    </div>
    <div class="dialog-actions"><button autofocus class="button secondary" data-cerrar>Volver</button><button class="button" data-confirmar="${grupo.id}">Confirmar inscripción</button></div></div>`, true);
}

function operacionAcademica(accion) {
  return navigator.locks ? navigator.locks.request(clave + "-operaciones", accion) : Promise.resolve().then(accion);
}

function falloGuardado() {
  modal('<h2 id="dialogo-titulo">No pudimos completar la operación</h2><p>Los cambios no se guardaron. Conservamos tu selección para que puedas reintentar.</p><button class="button" data-cerrar>Volver</button>');
}

function resolverSolicitud(id) {
  const registros = registrosActuales();
  const solicitud = registros.find(item => item.id === id);
  if (!solicitud || solicitud.estado !== "Pendiente") return solicitud ?? null;
  const alumno = estudiante(solicitud.estudiante);
  const grupo = comision(solicitud.comision);
  const otros = registros.filter(item => item.id !== id);
  const motivo = motivoDeRechazo(alumno, grupo, otros, periodoAbierto);
  const resuelta = { ...solicitud, estado: motivo ? "Rechazada" : "Aprobada", motivo, resuelta: new Date().toISOString() };
  if (!guardar({ registros: [...otros, resuelta] })) {
    guardar({ registros: otros });
    throw new Error("No se pudo guardar la inscripción.");
  }
  return resuelta;
}

async function registrar(grupo) {
  const alumno = alumnoActual();
  const solicitud = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    estudiante: alumno.id,
    comision: grupo.id,
    estado: "Pendiente",
    motivo: "",
    fecha: new Date().toISOString(),
    anio: periodoVigente()?.titulo.includes("2027") ? "2027" : hoyAcademico().slice(0, 4),
    cuatrimestre: periodoVigente()?.titulo.includes("2027") ? "1" : Number(hoyAcademico().slice(5, 7)) < 8 ? "1" : "2"
  };
  const guardada = await operacionAcademica(() => guardar({ registros: [...registrosActuales(), solicitud] }));
  if (!guardada) { falloGuardado(); return; }
  dialogo.close();
  comisionElegida = grupo.id;
  aviso = { estado: "Pendiente", comision: grupo.id };
  render();
  document.querySelector("#resultado")?.focus();
  await esperar(1700);
  let resuelta;
  try {
    resuelta = await operacionAcademica(() => resolverSolicitud(solicitud.id));
  } catch {
    falloGuardado();
    return;
  }
  if (!resuelta) return;
  aviso = { estado: resuelta.estado, comision: resuelta.comision, motivo: resuelta.motivo };
  render();
  document.querySelector("#resultado")?.focus();
}

function confirmarCancelacion(registro) {
  const grupo = comision(registro.comision);
  modal(`<h2 id="dialogo-titulo">Cancelar inscripción</h2>
    <p class="modal-sub">Esta acción cancela la solicitud y libera el cupo de la comisión.</p>
    <div class="confirm-card compact">
      <div class="confirm-head"><span class="course-code">${materia(grupo.materia).codigo}</span>${estado(registro.estado)}</div>
      <h3>${materia(grupo.materia).nombre}</h3>
      <dl class="confirm-grid">
        <div><dt>Comisión</dt><dd>${grupo.codigo}</dd></div>
        <div><dt>Día y horario</dt><dd>${grupo.horario}</dd></div>
        <div><dt>Docente</dt><dd>${grupo.docente}</dd></div>
        <div><dt>Cupo actual</dt><dd>${cupos(grupo, registrosActuales())} lugares libres</dd></div>
      </dl>
    </div>
    <p class="hint">Después de cancelar vas a poder volver a inscribirte si quedan lugares. El historial conserva la inscripción con estado <strong>Cancelada</strong>.</p>
    <div class="dialog-actions"><button autofocus class="button secondary" data-cerrar>Volver</button><button class="button danger" data-confirmar-cancelacion="${registro.id}">Sí, cancelar inscripción</button></div>`);
}

async function cancelarInscripcion(id) {
  await operacionAcademica(() => {
  const registros = registrosActuales();
  const registro = registros.find(item => item.id === id && item.estudiante === alumnoActual().id);
  if (!registro || !["Pendiente", "Aprobada"].includes(registro.estado)) {
    dialogo.close();
    render();
    return;
  }
  const actualizado = { ...registro, estado: "Cancelada", motivo: "Cancelada por el estudiante", fechaCancelacion: new Date().toISOString() };
  if (!guardar({ registros: registros.map(item => item.id === id ? actualizado : item) })) {
    falloGuardado();
    return;
  }
  aviso = { estado: "Cancelada", comision: registro.comision };
  dialogo.close();
  render();
  document.querySelector("#resultado")?.focus();
  });
}

function guia() {
  modal(`<h2 id="dialogo-titulo">Guía de demostración</h2>
    <p>Elegí un escenario y confirmá la inscripción para ver el resultado. La solicitud pasa por <strong>Pendiente</strong> antes de quedar aprobada o rechazada.</p>
    <div class="demo-list">${escenarios.map(([titulo, id, grupo], i) => `<button data-escenario="${i}"><strong>${titulo}</strong><small>${estudiante(id).nombre} · ${comision(grupo).codigo}</small></button>`).join("")}</div>
    <div class="demo-scope"><strong>Resolución de certificados</strong><p>Para completar el recorrido del CU02, seleccioná el docente asignado en el perfil docente de prueba.</p><a class="button secondary" href="#docente" id="abrir-docente">Abrir perfil docente de prueba</a></div>
    <p class="hint">Para probar la cancelación, realizá una inscripción exitosa, entrá a <strong>Mis inscripciones</strong> y usá <strong>Cancelar</strong>. El cupo se libera y podés verlo en la oferta.</p>
    <div class="dialog-actions"><button class="button secondary" data-reiniciar>Restablecer datos de prueba</button><button class="button" data-cerrar>Cerrar</button></div>`, true);
}

const escenarios = [
  ["Inscripción exitosa", "S04", "DAW-A"],
  ["Comisión sin cupo", "S04", "DAW-B"],
  ["Estudiante ya inscripto", "S01", "BDD-A"],
  ["Correlativas incumplidas", "S02", "DAW-A"],
  ["Materia fuera de la carrera", "S03", "DAW-A"]
];

function redimensionarImagen(file, lado = 420) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const imagen = new Image();
    imagen.onload = () => {
      const recorte = Math.min(imagen.width, imagen.height);
      const lienzo = document.createElement("canvas");
      lienzo.width = Math.min(lado, recorte);
      lienzo.height = lienzo.width;
      const contexto = lienzo.getContext("2d");
      contexto.drawImage(
        imagen,
        (imagen.width - recorte) / 2,
        (imagen.height - recorte) / 2,
        recorte,
        recorte,
        0,
        0,
        lienzo.width,
        lienzo.height
      );
      URL.revokeObjectURL(url);
      resolve(lienzo.toDataURL("image/jpeg", 0.86));
    };
    imagen.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("imagen"));
    };
    imagen.src = url;
  });
}

async function cargarFoto(file) {
  perfilAviso = null;
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    perfilAviso = { tipo: "error", texto: "Elegí una imagen JPG, PNG o WebP." };
    render();
    return;
  }
  if (file.size > 8 * 1024 * 1024) {
    perfilAviso = { tipo: "error", texto: "La imagen no puede superar los 8 MB." };
    render();
    return;
  }
  try {
    const dataUrl = await redimensionarImagen(file);
    const fotos = { ...(leer()?.fotos ?? datos.fotos ?? {}), [alumnoActual().id]: dataUrl };
    if (!guardar({ fotos })) {
      perfilAviso = { tipo: "error", texto: "No se pudo guardar la foto en este navegador. Probá con una imagen más chica." };
      render();
      return;
    }
    perfilAviso = { tipo: "ok", texto: "Foto de perfil actualizada correctamente." };
    render();
  } catch {
    perfilAviso = { tipo: "error", texto: "No pudimos procesar la imagen. Probá con otro archivo." };
    render();
  }
}

function quitarFoto() {
  const fotos = { ...(datos.fotos ?? {}) };
  delete fotos[alumnoActual().id];
  guardar({ fotos });
  perfilAviso = { tipo: "ok", texto: "Se restauró la foto genérica del perfil." };
  render();
}

function programarPendientes() {
  registrosActuales().filter(item => item.estado === "Pendiente").forEach(item => {
    if (programados.has(item.id)) return;
    programados.add(item.id);
    setTimeout(async () => {
      programados.delete(item.id);
      let resuelta;
      try {
        resuelta = await operacionAcademica(() => resolverSolicitud(item.id));
      } catch {
        falloGuardado();
        return;
      }
      if (resuelta && !dialogo.open) render();
    }, 1600);
  });
}

main.addEventListener("change", event => {
  if (event.target.id === "docente-demo") { docenteDemo = event.target.value; render(); return; }
  if (event.target.id === "selector-materia") {
    seleccion = event.target.value;
    comisionElegida = "";
    aviso = null;
    render();
    main.querySelector("#selector-materia").focus({ preventScroll: true });
    return;
  }
  if (event.target.id === "mostrar-claves") {
    main.querySelectorAll('[name="clave"], [name="confirmacion"]').forEach(input => {
      input.type = event.target.checked ? "text" : "password";
    });
    return;
  }
  if (event.target.id === "foto-input") {
    cargarFoto(event.target.files?.[0]);
    return;
  }
  const filtro = event.target.dataset.filtro;
  if (filtro) {
    filtros[filtro] = event.target.value;
    filtros.pagina = 1;
    render();
    main.querySelector(`[data-filtro="${filtro}"]`).focus();
    return;
  }
  if (event.target.name === "comision") {
    comisionElegida = event.target.value;
    const grupo = comision(comisionElegida);
    document.querySelector("#cursada-seleccionada").textContent = codigoCursada(grupo) + " · " + alumnoActual().nombre;
    document.querySelector("#revisar-inscripcion").disabled = false;
    const previa = document.querySelector("#validacion-previa");
    if (previa) previa.innerHTML = validacionPreview(grupo);
    return;
  }
  if (event.target.id !== "todas") return;
  mostrarTodo = event.target.checked;
  comisionElegida = "";
  render();
  document.querySelector("#todas").focus();
});

main.addEventListener("click", event => {
  const boton = event.target.closest("button");
  if (boton?.dataset.descargar) {
    const item = (datos.constancias ?? []).find(item => item.id === boton.dataset.descargar && item.estudiante === alumnoActual().id && item.estado === "Emitido");
    if (!item) return;
    const contenido = ["Universidad De Castelar", "CONSTANCIA DE DEMOSTRACIÓN", tiposConstancia.get(item.tipo) ?? "Constancia de examen", estudiante(item.estudiante).nombre, "Legajo " + estudiante(item.estudiante).legajo, materia(comision(item.comision).materia).nombre, "Fecha de examen " + item.examen, "Docente " + item.docente, "Emitida " + item.fechaEmision, "Solicitud " + item.id].join("\n");
    const url = URL.createObjectURL(new Blob([contenido], { type: "text/plain;charset=utf-8" }));
    const enlace = document.createElement("a");
    enlace.href = url; enlace.download = "constancia-" + item.id + ".txt"; enlace.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return;
  }
  if (boton?.dataset.paginaConstancia) {
    paginaConstancias += Number(boton.dataset.paginaConstancia);
    render();
    main.querySelector("#pagina-constancias")?.focus({ preventScroll: true });
    return;
  }
  if (!boton) return;
  if (boton.dataset.ingresar) {
    entrar(boton.dataset.ingresar);
    return;
  }
  if (boton.dataset.acceso) {
    modoAcceso = boton.dataset.acceso;
    render();
    main.querySelector("h1").setAttribute("tabindex", "-1");
    main.querySelector("h1").focus();
    return;
  }
  if (boton.hasAttribute("data-demo-acceso")) {
    entrar(estudiantes[0].id);
    return;
  }
  if (boton.dataset.materia) {
    seleccion = boton.dataset.materia;
    comisionElegida = "";
    aviso = null;
    render();
    main.querySelector(`[data-materia="${seleccion}"]`).focus();
    if (matchMedia("(max-width: 900px)").matches) {
      const destino = main.querySelector(".groups");
      destino.setAttribute("tabindex", "-1");
      destino.focus({ preventScroll: true });
      destino.scrollIntoView({ block: "start" });
    }
    return;
  }
  if (boton.hasAttribute("data-limpiar")) {
    limpiarFiltros();
    render();
    main.querySelector("[data-filtro]").focus();
    return;
  }
  if (boton.dataset.pagina) {
    filtros.pagina += Number(boton.dataset.pagina);
    render();
    main.querySelector("#historial-resultados").focus();
    return;
  }
  if (boton.hasAttribute("data-quitar-foto")) {
    quitarFoto();
    return;
  }
  if (boton.dataset.cancelar) {
    const registro = inscripciones().find(item => item.id === boton.dataset.cancelar);
    if (registro) confirmarCancelacion(registro);
    return;
  }
  if (boton.id === "revisar-inscripcion" && comisionElegida) confirmar(comision(comisionElegida));
});

dialogo.addEventListener("click", event => {
  if (event.target.closest("#abrir-docente")) { dialogo.close(); return; }
  const boton = event.target.closest("button");
  if (!boton) return;
  if (boton.hasAttribute("data-cerrar")) dialogo.close();
  if (boton.dataset.confirmar) registrar(comision(boton.dataset.confirmar));
  if (boton.dataset.confirmarCancelacion) cancelarInscripcion(boton.dataset.confirmarCancelacion);
  if (boton.hasAttribute("data-reiniciar")) {
    limpiarFiltros();
    guardar({ alumno: estudiantes[0].id, registros: iniciales, constancias: [], fotos: {}, cerrada: false });
    seleccion = "";
    comisionElegida = "";
    mostrarTodo = false;
    aviso = null;
    perfilAviso = null;
    render();
    dialogo.close();
  }
  if (boton.dataset.escenario !== undefined) {
    limpiarFiltros();
    const [, id, grupoId] = escenarios[Number(boton.dataset.escenario)];
    const grupo = comision(grupoId);
    guardar({ alumno: id, cerrada: false });
    seleccion = grupo.materia;
    comisionElegida = grupo.id;
    mostrarTodo = !alumnoActual().plan.includes(seleccion);
    aviso = null;
    location.hash = "oferta";
    render();
    confirmar(grupo);
  }
});

dialogo.addEventListener("cancel", event => {
  if (!contenido.querySelector("button")) event.preventDefault();
});
document.querySelector("#demo").addEventListener("click", guia);

function cambiarSesion() {
  if (datos.cerrada) {
    modoAcceso = "login";
    render();
    main.querySelector("[name=correo]").focus();
    return;
  }
  guardar({ cerrada: true });
  modoAcceso = "login";
  reiniciarVista();
}

function entrar(id, activar = false) {
  guardar({ alumno: id, cerrada: false, activada: activar || datos.activada === true });
  reiniciarVista();
}

function reiniciarVista() {
  limpiarFiltros();
  aviso = null;
  perfilAviso = null;
  seleccion = "";
  comisionElegida = "";
  mostrarTodo = false;
  if (location.hash !== "#inicio") location.hash = "inicio";
  render();
  main.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

main.addEventListener("submit", async event => {
  if (event.target.dataset.resolverCertificado) {
    event.preventDefault();
    const formulario = event.target;
    const campos = new FormData(formulario);
    const observaciones = campos.get("observaciones").trim();
    if (campos.get("resolucion") === "Rechazado" && !observaciones) {
      formulario.querySelector("[name=observaciones]").setCustomValidity("Indicá el motivo del rechazo.");
      formulario.querySelector("[name=observaciones]").reportValidity();
      formulario.querySelector("[name=observaciones]").oninput = event => event.target.setCustomValidity("");
      return;
    }
    await operacionAcademica(() => {
      const solicitudes = leer()?.constancias ?? [];
      const item = solicitudes.find(item => item.id === formulario.dataset.resolverCertificado);
      if (!item || item.estado !== "Solicitado" || item.docente !== docenteDemo) return;
      if (!guardar({ constancias: solicitudes.map(actual => actual.id === item.id ? { ...actual, estado: campos.get("resolucion"), observaciones, fechaEmision: new Date().toISOString() } : actual) })) { falloGuardado(); return; }
      render();
    });
    return;
  }
  if (event.target.id === "form-constancia") {
    event.preventDefault();
    const formulario = event.target;
    await operacionAcademica(() => {
    datos = leer() ?? datos;
    const campos = new FormData(formulario);
    const inscripcion = inscripciones().find(item => item.id === campos.get("inscripcion"));
    const grupo = comision(inscripcion?.comision);
    const examen = campos.get("examen");
    const tipo = campos.get("tipo");
    const solicitudes = datos.constancias ?? [];
    const respuesta = main.querySelector("#resultado-constancia");
    let error = "";
    if (datos.cerrada || !alumnoActual().activo) error = "Tu usuario no está habilitado para realizar solicitudes.";
    else if (!inscripcion || !["Aprobada", "En curso", "Finalizada"].includes(inscripcion.estado)) error = "La comisión seleccionada no habilita una constancia.";
    else if (!grupo?.docente) error = "La comisión no tiene docente asignado.";
    else if (!examen || examen > hoyAcademico()) error = "Ingresá una fecha igual o anterior a hoy.";
    else if (!tiposConstancia.has(tipo)) error = "Seleccioná un tipo de constancia.";
    const duplicada = grupo && solicitudes.find(item => item.estudiante === alumnoActual().id && item.comision === grupo.id && item.examen === examen && (item.tipo === tipo || item.tipo === "examen" || !item.tipo) && ["Solicitado", "Emitido"].includes(item.estado));
    if (!error && duplicada) error = "Ya existe la solicitud " + duplicada.id + " con estado " + duplicada.estado + ". Consultá Mis constancias.";
    if (error) {
      respuesta.textContent = error;
      respuesta.hidden = false;
      return;
    }
    const id = crypto.randomUUID();
    if (!guardar({ constancias: [...solicitudes, { id, estudiante: alumnoActual().id, inscripcion: inscripcion.id, comision: grupo.id, docente: grupo.docente, tipo, examen, motivo: campos.get("motivo").trim(), estado: "Solicitado", fecha: new Date().toISOString() }] })) {
      respuesta.textContent = "No pudimos registrar la solicitud. Reintentá conservando estos datos.";
      respuesta.hidden = false;
      return;
    }
    render();
    const mensaje = main.querySelector("#resultado-constancia");
    mensaje.textContent = "Solicitud " + id + " registrada correctamente. " + tiposConstancia.get(tipo) + " · " + materia(grupo.materia).nombre + " · Docente " + grupo.docente + " · Estado: Solicitado. Estará disponible cuando el docente la emita.";
    paginaConstancias = 1;
    mensaje.hidden = false;
    mensaje.setAttribute("tabindex", "-1");
    mensaje.focus();
    });
    return;
  }
  if (event.target.id === "form-perfil") {
    event.preventDefault();
    const campos = new FormData(event.target);
    const perfiles = { ...(leer()?.perfiles ?? datos.perfiles ?? {}) };
    perfiles[alumnoActual().id] = {
      correoContacto: campos.get("correoContacto").trim(),
      telefono: campos.get("telefono").trim(),
      direccion: campos.get("direccion").trim()
    };
    guardar({ perfiles });
    perfilAviso = { tipo: "ok", texto: "Datos de contacto actualizados correctamente." };
    render();
    document.querySelector(".inline-alert")?.focus?.();
    return;
  }
  if (event.target.id !== "form-acceso") return;
  event.preventDefault();
  const campos = new FormData(event.target);
  const correo = campos.get("correo").trim().toLowerCase();
  const claveIngresada = campos.get("clave");
  const error = main.querySelector("#error-acceso");
  if (modoAcceso === "registro") {
    if (datos.activada) error.textContent = "La cuenta de demostración ya está activa. Iniciá sesión con el correo de Mateo.";
    else if (claveIngresada !== campos.get("confirmacion")) error.textContent = "Las contraseñas no coinciden.";
    else if (correo === correoActivacion && campos.get("legajo").trim() === "2026-0218" && campos.get("codigo").trim().toUpperCase() === codigoActivacion && claveIngresada === claveDemo) {
      entrar(estudiante("S02").id, true);
      return;
    } else error.textContent = "Revisá que el legajo, el correo, el código y la contraseña coincidan con los datos de prueba.";
  } else {
    if (claveIngresada === claveDemo && (correo === correoDemo || (correo === correoActivacion && datos.activada))) {
      entrar(correo === correoDemo ? estudiantes[0].id : estudiante("S02").id);
      return;
    }
    error.textContent = "No pudimos iniciar sesión. Revisá el correo y la contraseña.";
  }
  error.hidden = false;
});
sesionAccion.addEventListener("click", cambiarSesion);
botonPerfil.addEventListener("click", () => {
  if (datos.cerrada) return;
  if (location.hash === "#perfil") render(true);
  else location.hash = "perfil";
});
avatarPerfil.addEventListener("click", () => {
  if (datos.cerrada) return;
  if (location.hash === "#perfil") render(true);
  else location.hash = "perfil";
});
document.querySelector("#ayuda").addEventListener("click", () => {
  modal('<h2 id="dialogo-titulo">Ayuda académica</h2><p>En Inscripción a materias elegí tu cursada y confirmá la solicitud. La inscripción pasa por Pendiente y después queda Aprobada o Rechazada. En Mis inscripciones podés consultar el motivo de un rechazo o cancelar una inscripción para liberar el cupo.</p><p>La Historia académica y Calificaciones están en el menú principal. El perfil permite cargar una foto propia.</p><div class="dialog-actions"><button class="button" data-cerrar>Cerrar</button></div>');
});
document.querySelector("#footer-ayuda").addEventListener("click", () => document.querySelector("#ayuda").click());
window.addEventListener("hashchange", () => {
  if (location.hash === "#contenido") return;
  aviso = null;
  perfilAviso = null;
  render(true);
  if (!dialogo.open) {
    window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
  }
});
window.addEventListener("storage", event => {
  if (event.key !== clave) return;
  datos = leer() ?? datos;
  if (!dialogo.open) render();
});

render();
programarPendientes();

