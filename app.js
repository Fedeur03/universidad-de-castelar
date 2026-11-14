const { estudiantes, materias, comisiones, iniciales, estudiante, materia, comision, cupos, motivoDeRechazo, inscripcionVigente } = Academico;
const clave = "academica-del-sur-v1";
const periodoAbierto = true;
const main = document.querySelector("main");
const nombreSesion = document.querySelector("#estudiante");
const sesionAccion = document.querySelector("#sesion-accion");
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
let modoAcceso = "login";
const claveDemo = "Campus-2026";
const correoDemo = "lucia.torres@campus.example";
const correoActivacion = "mateo.rios@campus.example";
const codigoActivacion = "AULA-218";
const filtros = { anio: "", cuatrimestre: "", estado: "", pagina: 1 };
const porPagina = 6;

function leer() {
  try {
    return JSON.parse(localStorage.getItem(clave)) ?? memoria;
  } catch {
    return memoria;
  }
}

let datos = leer() ?? { alumno: estudiantes[0].id, registros: iniciales, cerrada: true };

function guardar(cambios) {
  datos = { ...(leer() ?? datos), ...cambios };
  memoria = datos;
  try {
    localStorage.setItem(clave, JSON.stringify(datos));
  } catch {
    // El flujo sigue disponible durante esta sesión.
  }
}

const pagina = () => ["oferta", "inscripciones", "novedades", "servicios", "plan", "horarios"].includes(location.hash.slice(1)) ? location.hash.slice(1) : "inicio";
const alumnoActual = () => estudiante(datos.alumno) ?? estudiantes[0];
const fecha = new Intl.DateTimeFormat("es-AR", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Argentina/Buenos_Aires" });
const inscripciones = () => datos.registros.filter(item => item.estudiante === alumnoActual().id);
const estado = valor => `<span class="status ${valor.toLowerCase()}">${valor}</span>`;
const encabezado = (titulo, descripcion) => `<header class="page-title"><h1>${titulo}</h1><p>${descripcion}</p></header>`;
const codigoCursada = grupo => `${materia(grupo.materia).codigo} · Com: ${grupo.codigo}`;

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
  ["Mis inscripciones", "Estado e historial de tus solicitudes.", "inscripciones"],
  ["Historia académica", "Calificaciones, regularidades y finales."],
  ["Constancias y certificados", "Trámites de alumno regular y constancias de examen."],
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

function plan() {
  const alumno = alumnoActual();
  return `${encabezado("Plan de estudios", alumno.carrera)}
    <section class="panel history"><div class="table-wrap" tabindex="0" role="region" aria-label="Materias del plan"><table>
    <thead><tr><th scope="col">Código y materia</th><th scope="col">Correlativas</th><th scope="col">Estado</th></tr></thead>
    <tbody>${alumno.plan.map(id => {
      const item = materia(id);
      return `<tr><td><strong>${item.codigo} · ${item.nombre}</strong></td><td>${item.correlativas.map(codigo => materia(codigo).nombre).join(", ") || "Sin correlativas"}</td><td>${alumno.aprobadas.includes(id) ? "Aprobada" : "Sin aprobar"}</td></tr>`;
    }).join("")}</tbody></table></div></section>`;
}

function horarios() {
  const cursadas = inscripciones().filter(item => item.estado === "Aprobada").map(item => comision(item.comision));
  return `${encabezado("Mis horarios", "Cursadas con inscripción aprobada.")}
    <section class="panel">${cursadas.length ? `<div class="news-list">${cursadas.map(grupo => `<article><h3>${materia(grupo.materia).nombre}</h3><p>${codigoCursada(grupo)} · ${grupo.horario}</p><p>${grupo.aula} · ${grupo.docente}</p></article>`).join("")}</div>` : '<p>Todavía no tenés inscripciones aprobadas para consultar horarios.</p><a class="inline-link" href="#oferta">Ver oferta de cursadas</a>'}</section>`;
}

function inicio() {
  const alumno = alumnoActual();
  return `<section class="hero">
    <div class="hero-copy">
      <p class="term">Segundo cuatrimestre · 2026</p>
      <h1>Portal del estudiante</h1>
      <p>Consultá tu carrera, organizá tus cursadas y accedé a los servicios académicos.</p>
    </div>
    <div class="hero-art" aria-hidden="true"></div>
  </section>
  <nav class="quick-links" aria-label="Accesos académicos">
    <a href="#oferta"><strong>Inscribirme a materias</strong><span>Elegí una comisión de tu plan</span><b aria-hidden="true">→</b></a>
    <a href="#inscripciones"><strong>Mis inscripciones</strong><span>Consultá el estado de tus solicitudes</span><b aria-hidden="true">→</b></a>
    <a href="#servicios"><strong>Servicios académicos</strong><span>Consultas y trámites estudiantiles</span><b aria-hidden="true">→</b></a>
  </nav>
  <div class="home-grid">
    <section class="panel context">
      <h2>Datos académicos</h2>
      <dl><div><dt>Estudiante</dt><dd>${alumno.nombre}</dd></div>
      <div><dt>Legajo</dt><dd>${alumno.legajo}</dd></div>
      <div><dt>Carrera</dt><dd>${alumno.carrera}</dd></div></dl>
    </section>
    <section class="panel period">
      <h2>Inscripción a materias</h2>
      <p class="period-state"><span></span> Período abierto</p>
      <p>Revisá las correlativas y los horarios antes de confirmar tu inscripción.</p>
      <a class="inline-link" href="#inscripciones">Ver mis inscripciones <span aria-hidden="true">→</span></a>
    </section>
  </div>
  <section class="panel home-news">
    <div class="section-heading"><h2>Mi actividad académica</h2><a class="inline-link" href="#servicios">Todos los servicios →</a></div>
    ${listaServicios([catalogoServicios[0], catalogoServicios[1], catalogoServicios[4], catalogoServicios[5]])}
  </section>
  <section class="panel home-news">
    <div class="section-heading"><h2>Últimas novedades</h2><a class="inline-link" href="#novedades">Ver todos los avisos →</a></div>
    ${listadoNovedades(true)}
  </section>`;
}

function oferta() {
  const alumno = alumnoActual();
  const listado = materias.filter(item => mostrarTodo || alumno.plan.includes(item.id));
  const elegida = listado.find(item => item.id === seleccion) ?? listado[0];
  const grupos = comisiones.filter(item => item.materia === elegida.id && item.activa);
  const grupoElegido = grupos.find(grupo => grupo.id === comisionElegida);
  const aprobada = inscripcionVigente(alumno, elegida.id, datos.registros)?.estado === "Aprobada";
  return `${encabezado("Inscripción a materias", "Seleccioná una materia y revisá sus comisiones antes de confirmar.")}
    <div class="student-strip"><span><strong>${alumno.nombre}</strong> · Legajo ${alumno.legajo}</span><span>${alumno.carrera}</span></div>
    <div class="offer-grid">
      <aside class="panel subjects"><h2>Materias</h2>
        <label class="check"><input id="todas" type="checkbox" ${mostrarTodo ? "checked" : ""}> Incluir otras carreras</label>
        <div class="subject-list">${listado.map(item => `<button type="button" data-materia="${item.id}" aria-pressed="${item.id === elegida.id}"><small>${item.codigo}</small><span>${item.nombre}</span></button>`).join("")}</div>
      </aside>
      <section class="panel groups">
        <div class="course-heading"><span class="course-code">${elegida.codigo}</span><h2>${elegida.nombre}</h2></div>
        <p class="muted">${elegida.correlativas.length ? "Correlativas: " + elegida.correlativas.map(id => materia(id).nombre).join(", ") : "Sin correlativas"}</p>
        ${aprobada ? '<div class="enrollment-confirmed"><strong>Ya estás inscripto/a en esta materia.</strong> Tu inscripción está aprobada. <a class="inline-link" href="#inscripciones">Ver mi inscripción</a></div>' : ""}
        ${!alumno.plan.includes(elegida.id) ? '<p class="note">Esta materia está fuera de tu plan de estudios.</p>' : ""}
        <fieldset class="commission-sheet"><legend>Comisiones de cursada</legend>
        <div class="sheet-head" aria-hidden="true"><span>Comisión y horario</span><span>Docente y aula</span><span>Cupo</span><span></span></div>
        ${grupos.map(grupo => {
          const plazas = cupos(grupo, datos.registros);
          const observacion = aprobada ? "" : motivoDeRechazo(alumno, grupo, datos.registros, periodoAbierto);
          return `<label class="commission-row">
            <span><strong>Com: ${grupo.codigo}</strong><small>${grupo.horario}</small></span>
            <span><strong>${grupo.docente}</strong><small>${grupo.aula}</small></span>
            <span><span class="status ${plazas ? "aprobada" : "rechazada"}">${plazas ? plazas + (plazas === 1 ? " lugar libre" : " lugares libres") : "Sin cupo"}</span></span>
            <input type="radio" name="comision" value="${grupo.id}" aria-label="Seleccionar comisión ${grupo.codigo}" ${grupo.id === comisionElegida ? "checked" : ""}>
            ${observacion ? `<span class="group-notice">${observacion}</span>` : ""}
          </label>`;
        }).join("")}</fieldset>
        <div class="enrollment-bar">
          <span id="cursada-seleccionada" aria-live="polite">${grupoElegido ? codigoCursada(grupoElegido) + " · Alumno/a" : "Seleccioná una comisión para continuar."}</span>
          <button class="button" type="button" id="revisar-inscripcion" ${grupoElegido ? "" : "disabled"}>Confirmar inscripción</button>
        </div>
      </section>
    </div>`;
}

function periodo(registro) {
  // Las solicitudes de versiones anteriores solo guardaban la fecha.
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
      <thead><tr><th scope="col">Materia y comisión</th><th scope="col">Fecha</th><th scope="col">Estado</th></tr></thead>
      <tbody>${visibles.map(registro => {
        const grupo = comision(registro.comision);
        const { anio, cuatrimestre } = periodo(registro);
        return `<tr><td><strong>${materia(grupo.materia).nombre}</strong><small>${codigoCursada(grupo)} · ${grupo.horario}</small></td><td><time datetime="${registro.fecha}">${fecha.format(new Date(registro.fecha))}</time><small>${cuatrimestre === "1" ? "1.er" : "2.º"} cuatrimestre · ${anio}</small></td><td>${estado(registro.estado)}${registro.motivo ? `<small>${registro.motivo}</small>` : ""}</td></tr>`;
      }).join("")}</tbody>
      </table></div>` : ""}
      ${paginas > 1 ? `<nav class="pagination" aria-label="Paginación del historial">
        <button class="button secondary" data-pagina="-1" ${filtros.pagina === 1 ? "disabled" : ""}>Anterior</button>
        <span>Página ${filtros.pagina} de ${paginas}</span>
        <button class="button secondary" data-pagina="1" ${filtros.pagina === paginas ? "disabled" : ""}>Siguiente</button>
      </nav>` : ""}` : `<div class="empty"><h2>Todavía no tenés inscripciones</h2><a class="button" href="#oferta">Consultar oferta académica</a></div>`}</section>`;
}

function limpiarFiltros() {
  Object.assign(filtros, { anio: "", cuatrimestre: "", estado: "", pagina: 1 });
}

function acceso() {
  const registro = modoAcceso === "registro";
  return `<section class="access-layout">
    <div class="access-intro"><p class="term">Autogestión estudiantil</p><h1>${registro ? "Activar cuenta" : "Ingresar al portal"}</h1>
      <p>${registro ? "Activá el acceso con un legajo ya asignado y el correo que figura en el padrón académico." : "Ingresá para consultar tu plan de estudios, horarios e inscripciones."}</p>
      <p class="access-demo">Prototipo educativo. Usá únicamente los datos de prueba de esta pantalla.</p>
    </div>
    <div class="panel access-panel">
      <form id="form-acceso">
        <h2>${registro ? "Datos de activación" : "Acceso estudiantil"}</h2>
        ${registro ? '<label>Legajo<input name="legajo" placeholder="2026-0218" required></label>' : ""}
        <label>Correo registrado<input name="correo" type="email" autocomplete="off" placeholder="${registro ? correoActivacion : correoDemo}" required></label>
        ${registro ? '<label>Código de activación<input name="codigo" autocomplete="off" placeholder="AULA-218" required></label>' : ""}
        <label>Clave de prueba<input name="clave" type="password" autocomplete="off" required></label>
        ${registro ? '<label>Confirmar clave<input name="confirmacion" type="password" autocomplete="off" required></label>' : ""}
        <label class="password-visibility"><input type="checkbox" id="mostrar-claves"> Mostrar clave</label>
        <p id="error-acceso" role="alert" hidden></p>
        <button class="button" type="submit">${registro ? "Activar cuenta e ingresar" : "Iniciar sesión"}</button>
      </form>
      <div class="access-options">
        <button class="text-button" type="button" data-acceso="${registro ? "login" : "registro"}">${registro ? "Volver a iniciar sesión" : "Activar mi cuenta"}</button>
        ${registro ? "" : '<button class="text-button" type="button" data-demo-acceso>Ingresar con la cuenta demo</button>'}
      </div>
      <div class="access-credentials"><strong>Datos de prueba</strong><br>
        ${registro ? `Legajo 2026-0218 · Código ${codigoActivacion}<br>${correoActivacion}` : correoDemo}<br>Clave <code>${claveDemo}</code>
      </div>
    </div></section>`;
}

function render(transicion = false) {
  const ruta = pagina();
  nombreSesion.textContent = datos.cerrada ? "Sesión cerrada" : alumnoActual().nombre;
  sesionAccion.textContent = datos.cerrada ? "Acceso" : "Cerrar sesión";
  document.querySelector("#mi-perfil").hidden = Boolean(datos.cerrada);
  document.querySelectorAll(".nav a, .drawer-links a").forEach(link => {
    if (link.hash === "#" + ruta || (["plan", "horarios"].includes(ruta) && link.hash === "#servicios")) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  const resultado = aviso && ruta === "oferta" ? `<section id="resultado" tabindex="-1" role="status" class="result ${aviso.estado.toLowerCase()}">
    <strong>${aviso.estado === "Aprobada" ? "Inscripción aprobada" : "Inscripción rechazada"}</strong>
    <p>${aviso.motivo || materia(comision(aviso.comision).materia).nombre + " · " + codigoCursada(comision(aviso.comision))}</p>
    <a class="inline-link" href="#inscripciones">Ver mis inscripciones</a></section>` : "";
  const vista = datos.cerrada ? acceso() :
    resultado + ({ inicio, oferta, inscripciones: historial, novedades, servicios, plan, horarios })[ruta]();
  main.innerHTML = `<div class="${transicion ? "view-enter" : ""}">${vista}</div>`;
}

function modal(html) {
  contenido.innerHTML = html;
  if (!dialogo.open) dialogo.showModal();
}

function confirmar(grupo) {
  modal(`<h2 id="dialogo-titulo">Confirmar inscripción</h2>
    <p><strong>${materia(grupo.materia).nombre}</strong><br>${codigoCursada(grupo)} · Alumno/a</p>
    <dl><div><dt>Estudiante</dt><dd>${alumnoActual().nombre}</dd></div>
    <div><dt>Horario</dt><dd>${grupo.horario}</dd></div></dl>
    <div class="dialog-actions"><button autofocus class="button secondary" data-cerrar>Volver</button><button class="button" data-confirmar="${grupo.id}">Confirmar</button></div>`);
}

async function registrar(grupo) {
  const alumno = alumnoActual();
  const solicitud = { id: Date.now().toString(36), estudiante: alumno.id, comision: grupo.id, estado: "Pendiente", motivo: "", fecha: new Date().toISOString(), anio: "2026", cuatrimestre: "2" };
  const tramite = () => {
    guardar({ registros: [...(leer()?.registros ?? datos.registros), solicitud] });
    const registros = (leer()?.registros ?? datos.registros).filter(item => item.id !== solicitud.id);
    const motivo = motivoDeRechazo(alumno, grupo, registros, periodoAbierto);
    const resuelta = { ...solicitud, estado: motivo ? "Rechazada" : "Aprobada", motivo };
    guardar({ registros: [...registros, resuelta] });
    return resuelta;
  };
  modal('<h2 id="dialogo-titulo">Procesando inscripción</h2><p role="status">Estado: Pendiente. Estamos verificando las condiciones de inscripción.</p>');
  await new Promise(resolve => setTimeout(resolve, 550));
  try {
    aviso = navigator.locks && location.protocol !== "file:" ? await navigator.locks.request(clave, tramite) : tramite();
    dialogo.close();
    render();
    document.querySelector("#resultado")?.focus();
  } catch {
    guardar({ registros: (leer()?.registros ?? datos.registros).filter(item => item.id !== solicitud.id) });
    modal('<h2 id="dialogo-titulo">No se pudo completar la inscripción</h2><p>Volvé a intentar desde la oferta académica.</p><button class="button" data-cerrar>Cerrar</button>');
  }
}

const escenarios = [
  ["Inscripción exitosa", "S01", "DAW-A"],
  ["Comisión sin cupo", "S01", "DAW-B"],
  ["Estudiante ya inscripto", "S01", "BDD-A"],
  ["Correlativas incumplidas", "S02", "DAW-A"],
  ["Materia fuera de la carrera", "S03", "DAW-A"]
];

function guia() {
  modal(`<h2 id="dialogo-titulo">Guía de demostración</h2>
    <p>Elegí un escenario y confirmá la inscripción para ver el resultado. Si ya inscribiste a Lucía en WEB-A, restablecé los datos antes de probar la comisión sin cupo.</p>
    <div class="demo-list">${escenarios.map(([titulo, id, grupo], i) => `<button data-escenario="${i}"><strong>${titulo}</strong><small>${estudiante(id).nombre} · ${comision(grupo).codigo}</small></button>`).join("")}</div>
    <div class="dialog-actions"><button class="button secondary" data-reiniciar>Restablecer datos de prueba</button><button class="button" data-cerrar>Cerrar</button></div>`);
}

main.addEventListener("change", event => {
  if (event.target.id === "mostrar-claves") {
    main.querySelectorAll('[name="clave"], [name="confirmacion"]').forEach(input => {
      input.type = event.target.checked ? "text" : "password";
    });
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
    document.querySelector("#cursada-seleccionada").textContent = codigoCursada(comision(comisionElegida)) + " · Alumno/a";
    document.querySelector("#revisar-inscripcion").disabled = false;
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
  if (boton?.hasAttribute("data-limpiar")) {
    limpiarFiltros();
    render();
    main.querySelector("[data-filtro]").focus();
    return;
  }
  if (boton?.dataset.pagina) {
    filtros.pagina += Number(boton.dataset.pagina);
    render();
    main.querySelector("#historial-resultados").focus();
    return;
  }
  if (boton?.dataset.acceso) {
    modoAcceso = boton.dataset.acceso;
    render();
    main.querySelector("h1").setAttribute("tabindex", "-1");
    main.querySelector("h1").focus();
  }
  if (boton?.hasAttribute("data-demo-acceso")) entrar(estudiantes[0].id);
  if (boton?.dataset.materia) {
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
  }
  if (boton?.id === "revisar-inscripcion" && comisionElegida) confirmar(comision(comisionElegida));
});

dialogo.addEventListener("click", event => {
  const boton = event.target.closest("button");
  if (!boton) return;
  if (boton.hasAttribute("data-cerrar")) dialogo.close();
  if (boton.dataset.confirmar) registrar(comision(boton.dataset.confirmar));
  if (boton.hasAttribute("data-reiniciar")) {
    limpiarFiltros();
    guardar({ alumno: estudiantes[0].id, registros: iniciales, cerrada: false });
    seleccion = "";
    comisionElegida = "";
    mostrarTodo = false;
    aviso = null;
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
  seleccion = "";
  comisionElegida = "";
  mostrarTodo = false;
  location.hash = "inicio";
  render();
  main.focus({ preventScroll: true });
}

main.addEventListener("submit", event => {
  if (event.target.id !== "form-acceso") return;
  event.preventDefault();
  const campos = new FormData(event.target);
  const correo = campos.get("correo").trim().toLowerCase();
  const clave = campos.get("clave");
  const error = main.querySelector("#error-acceso");
  if (modoAcceso === "registro") {
    if (datos.activada) error.textContent = "La cuenta de demostración ya está activa. Iniciá sesión con el correo de Mateo.";
    else if (clave !== campos.get("confirmacion")) error.textContent = "Las claves no coinciden.";
    else if (correo === correoActivacion && campos.get("legajo").trim() === "2026-0218" && campos.get("codigo").trim().toUpperCase() === codigoActivacion && clave === claveDemo) {
      entrar(estudiantes[1].id, true);
      return;
    } else error.textContent = "Revisá que el legajo, el correo, el código y la clave coincidan con los datos de prueba.";
  } else {
    if (clave === claveDemo && (correo === correoDemo || (correo === correoActivacion && datos.activada))) {
      entrar(correo === correoDemo ? estudiantes[0].id : estudiantes[1].id);
      return;
    }
    error.textContent = "No pudimos iniciar sesión. Revisá el correo y la clave de prueba.";
  }
  error.hidden = false;
});
sesionAccion.addEventListener("click", cambiarSesion);
document.querySelector("#mi-perfil").addEventListener("click", () => {
  const alumno = alumnoActual();
  modal(`<h2 id="dialogo-titulo">Mi perfil</h2>
    <dl><div><dt>Nombre</dt><dd>${alumno.nombre}</dd></div><div><dt>Legajo</dt><dd>${alumno.legajo}</dd></div><div><dt>Carrera</dt><dd>${alumno.carrera}</dd></div></dl>
    <div class="dialog-actions"><button class="button" data-cerrar>Cerrar</button></div>`);
});
document.querySelector("#ayuda").addEventListener("click", () => {
  modal('<h2 id="dialogo-titulo">Ayuda académica</h2><p>En Inscripción a materias elegí tu cursada y confirmá la solicitud. Consultá el resultado y los motivos de rechazo en Mis inscripciones.</p><div class="dialog-actions"><button class="button" data-cerrar>Cerrar</button></div>');
});
document.querySelector("#footer-ayuda").addEventListener("click", () => document.querySelector("#ayuda").click());
window.addEventListener("hashchange", () => {
  if (location.hash === "#contenido") return;
  aviso = null;
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
