const Academico = (() => {
  const facultades = {
    ingenieria: {
      id: "ingenieria",
      nombre: "Facultad de Ingeniería y Tecnología",
      sigla: "FIT",
      sede: "Sede Castelar · Av. Rivadavia 12.400",
      coordinacion: "Ing. Laura Ferrari",
      correo: "ingenieria@castelar.edu.ar",
      telefono: "(011) 4629-8400",
      descripcion: "Formación técnica con laboratorios, talleres y proyectos reales desde el primer año. Las cursadas combinan práctica en aula con seguimiento personalizado."
    },
    gestion: {
      id: "gestion",
      nombre: "Facultad de Ciencias Económicas y Gestión",
      sigla: "FCEG",
      sede: "Sede Castelar · Av. Rivadavia 12.400",
      coordinacion: "Lic. Martín Aguirre",
      correo: "gestion@castelar.edu.ar",
      telefono: "(011) 4629-8410",
      descripcion: "Espacio de formación en administración, economía y gestión de organizaciones, con seminarios y prácticas profesionales."
    }
  };

  const carreras = {
    tds: {
      id: "tds",
      nombre: "Tecnicatura en Desarrollo de Software",
      facultad: "ingenieria",
      duracion: "3 años",
      resolucion: "Res. 4821/23",
      plan: "Plan 2024",
      turno: "Tarde y noche"
    },
    adm: {
      id: "adm",
      nombre: "Licenciatura en Administración",
      facultad: "gestion",
      duracion: "5 años",
      resolucion: "Res. 3310/21",
      plan: "Plan 2021",
      turno: "Noche"
    }
  };

  const estudiantes = [
    {
      id: "S01",
      nombre: "Lucía Torres",
      legajo: "2026-0142",
      carrera: "Tecnicatura en Desarrollo de Software",
      carreraId: "tds",
      facultadId: "ingenieria",
      plan: ["DAW", "BDD", "PRO", "RED", "ING"],
      aprobadas: ["PRO", "ING"],
      notas: {
        PRO: { valor: 8, anio: "2026", cuatrimestre: "1" },
        ING: { valor: 9, anio: "2025", cuatrimestre: "2" }
      },
      activo: true,
      correo: "lucia.torres@campus.example",
      ingreso: "2025",
      estado: "Regular"
    },
    {
      id: "S02",
      nombre: "Mateo Ríos",
      legajo: "2026-0218",
      carrera: "Tecnicatura en Desarrollo de Software",
      carreraId: "tds",
      facultadId: "ingenieria",
      plan: ["DAW", "BDD", "PRO", "RED", "ING"],
      aprobadas: [],
      notas: {},
      activo: true,
      correo: "mateo.rios@campus.example",
      ingreso: "2026",
      estado: "Regular"
    },
    {
      id: "S03",
      nombre: "Sofía Méndez",
      legajo: "2026-0305",
      carrera: "Licenciatura en Administración",
      carreraId: "adm",
      facultadId: "gestion",
      plan: ["ADM", "ECO"],
      aprobadas: ["ADM"],
      notas: {
        ADM: { valor: 7, anio: "2026", cuatrimestre: "1" }
      },
      activo: true,
      correo: "sofia.mendez@campus.example",
      ingreso: "2026",
      estado: "Regular"
    }
  ];

  const materias = [
    { id: "DAW", codigo: "2628", nombre: "Programación Web II", correlativas: ["PRO"], anio: "2.º año" },
    { id: "BDD", codigo: "2631", nombre: "Bases de Datos", correlativas: [], anio: "2.º año" },
    { id: "PRO", codigo: "2614", nombre: "Programación I", correlativas: [], anio: "1.er año" },
    { id: "RED", codigo: "2642", nombre: "Redes y Comunicaciones", correlativas: [], anio: "2.º año" },
    { id: "ING", codigo: "2608", nombre: "Inglés Técnico I", correlativas: [], anio: "1.er año" },
    { id: "ADM", codigo: "3102", nombre: "Administración General", correlativas: [], anio: "1.er año" },
    { id: "ECO", codigo: "3205", nombre: "Economía I", correlativas: [], anio: "1.er año" }
  ];

  const comisiones = [
    { id: "DAW-A", materia: "DAW", codigo: "01-1929", docente: "Paula Benítez", dia: "Lunes", franja: "18:00–21:00", horario: "Lunes · 18:00–21:00", aula: "Laboratorio 2", capacidad: 24, ocupados: 21, activa: true },
    { id: "DAW-B", materia: "DAW", codigo: "02-1930", docente: "Diego Molina", dia: "Miércoles", franja: "19:00–22:00", horario: "Miércoles · 19:00–22:00", aula: "Laboratorio 3", capacidad: 20, ocupados: 20, activa: true },
    { id: "BDD-A", materia: "BDD", codigo: "01-1941", docente: "Marina Ortiz", dia: "Martes", franja: "18:00–21:00", horario: "Martes · 18:00–21:00", aula: "Laboratorio 1", capacidad: 24, ocupados: 17, activa: true },
    { id: "PRO-A", materia: "PRO", codigo: "01-1902", docente: "Ramiro Sosa", dia: "Jueves", franja: "18:00–21:00", horario: "Jueves · 18:00–21:00", aula: "Laboratorio 2", capacidad: 25, ocupados: 17, activa: true },
    { id: "RED-A", materia: "RED", codigo: "01-1956", docente: "José Navarro", dia: "Viernes", franja: "18:00–21:00", horario: "Viernes · 18:00–21:00", aula: "Aula 12", capacidad: 21, ocupados: 16, activa: true },
    { id: "ING-A", materia: "ING", codigo: "01-1888", docente: "Carla Núñez", dia: "Sábado", franja: "09:00–12:00", horario: "Sábado · 09:00–12:00", aula: "Aula 8", capacidad: 30, ocupados: 12, activa: true },
    { id: "ADM-A", materia: "ADM", codigo: "01-2203", docente: "Elena Vidal", dia: "Lunes", franja: "17:00–20:00", horario: "Lunes · 17:00–20:00", aula: "Aula 5", capacidad: 30, ocupados: 18, activa: true },
    { id: "ECO-A", materia: "ECO", codigo: "01-2210", docente: "Federico Paz", dia: "Martes", franja: "19:00–22:00", horario: "Martes · 19:00–22:00", aula: "Aula 7", capacidad: 28, ocupados: 15, activa: true }
  ];

  const iniciales = [
    { id: "I-001", estudiante: "S01", comision: "BDD-A", estado: "Aprobada", motivo: "", fecha: "2026-11-10T15:00:00-03:00", anio: "2026", cuatrimestre: "2" }
  ];

  const calendario = [
    { fecha: "2026-07-27", hasta: "2026-07-31", categoria: "inscripcion", tipo: "Inscripción", titulo: "Inscripción a materias", detalle: "Selección de comisiones y confirmación de solicitudes para el segundo cuatrimestre." },
    { fecha: "2026-08-04", hasta: "2026-08-06", categoria: "verificacion", tipo: "Verificación", titulo: "Verificación de materias", detalle: "Revisión de inscripciones registradas, comisiones asignadas y estado de cada solicitud." },
    { fecha: "2026-08-10", categoria: "arranque", tipo: "Arranque de clases", titulo: "Inicio de cursadas", detalle: "Comienzan las clases del segundo cuatrimestre en todas las facultades." },
    { fecha: "2026-10-19", hasta: "2026-10-23", categoria: "cursada", tipo: "Cursada", titulo: "Semana de consultas y recuperatorios", detalle: "Instancias de consulta con docentes y recuperatorios de parciales." },
    { fecha: "2026-11-16", hasta: "2026-11-20", categoria: "inscripcion", tipo: "Inscripción", titulo: "Inscripción a materias (ciclo 2027)", detalle: "Período anticipado para elegir comisiones del próximo ciclo lectivo." },
    { fecha: "2026-11-23", hasta: "2026-11-25", categoria: "finales", tipo: "Finales", titulo: "Inscripción a mesas de examen", detalle: "Apertura de inscripción para rendir exámenes finales." },
    { fecha: "2026-12-04", categoria: "cursada", tipo: "Cursada", titulo: "Finalización de clases", detalle: "Cierre del segundo cuatrimestre y entrega de trabajos finales." },
    { fecha: "2026-12-10", hasta: "2026-12-18", categoria: "finales", tipo: "Finales", titulo: "Mesas de examen finales", detalle: "Turno de exámenes finales para materias regulares y libres." },
    { fecha: "2026-12-21", hasta: "2026-12-23", categoria: "verificacion", tipo: "Verificación", titulo: "Verificación de actas y cierre", detalle: "Publicación de actas, regularidades y cierre administrativo del cuatrimestre." }
  ];

  const vigentes = new Set(["Pendiente", "Aprobada", "En curso"]);
  const conCupo = new Set(["Pendiente", "Aprobada", "En curso"]);
  const materia = id => materias.find(item => item.id === id);
  const comision = id => comisiones.find(item => item.id === id);
  const estudiante = id => estudiantes.find(item => item.id === id);
  const carrera = alumno => carreras[alumno?.carreraId] ?? carreras.tds;
  const facultad = alumno => facultades[alumno?.facultadId] ?? facultades.ingenieria;
  const nota = (alumno, materiaId) => alumno?.notas?.[materiaId] ?? null;

  const promedio = alumno => {
    const valores = Object.values(alumno?.notas ?? {}).map(item => item.valor).filter(valor => typeof valor === "number");
    return valores.length ? valores.reduce((total, valor) => total + valor, 0) / valores.length : null;
  };

  const inscripcionVigente = (alumno, materiaId, registros) => registros.find(item =>
    item.estudiante === alumno.id && comision(item.comision)?.materia === materiaId && vigentes.has(item.estado)
  );

  const cupos = (grupo, registros) => Math.max(0, grupo.capacidad - grupo.ocupados - registros.filter(item =>
    item.comision === grupo.id && conCupo.has(item.estado)
  ).length);

  const ocupados = (grupo, registros) => grupo.capacidad - cupos(grupo, registros);

  const faltantesDe = (alumno, grupo) => materia(grupo.materia).correlativas.filter(id => !alumno.aprobadas.includes(id));

  function validaciones(alumno, grupo, registros, periodoAbierto) {
    const materiaActual = grupo ? materia(grupo.materia) : null;
    const previa = alumno && grupo ? inscripcionVigente(alumno, grupo.materia, registros) : null;
    const faltantes = alumno && grupo ? faltantesDe(alumno, grupo) : [];
    const libres = grupo ? cupos(grupo, registros) : 0;
    return [
      {
        clave: "estudiante",
        etiqueta: "Estudiante habilitado",
        ok: Boolean(alumno?.activo),
        detalle: alumno?.activo ? "La cuenta está activa y habilitada para operar." : "Tu usuario no está habilitado para inscribirse."
      },
      {
        clave: "comision",
        etiqueta: "Comisión disponible",
        ok: Boolean(grupo?.activa),
        detalle: grupo?.activa ? "La comisión seleccionada está abierta." : "La comisión ya no está disponible."
      },
      {
        clave: "carrera",
        etiqueta: "Materia de tu carrera",
        ok: Boolean(alumno && grupo && alumno.plan.includes(grupo.materia)),
        detalle: alumno && grupo && alumno.plan.includes(grupo.materia)
          ? "La materia pertenece a tu plan de estudios."
          : "La materia no pertenece a tu plan de estudios."
      },
      {
        clave: "periodo",
        etiqueta: "Período abierto",
        ok: Boolean(periodoAbierto),
        detalle: periodoAbierto ? "El período de inscripción está abierto hasta el 30/11/2026." : "El período de inscripción está cerrado."
      },
      {
        clave: "previa",
        etiqueta: "Sin inscripción previa",
        ok: !previa,
        detalle: previa
          ? "Ya tenés una inscripción vigente a esta materia (" + previa.estado + ")."
          : "No tenés una inscripción vigente a esta materia."
      },
      {
        clave: "correlativas",
        etiqueta: "Correlativas aprobadas",
        ok: !faltantes.length,
        detalle: faltantes.length
          ? "Correlativas sin aprobar: " + faltantes.map(id => materia(id).nombre).join(", ") + "."
          : "Cumplís las correlativas requeridas."
      },
      {
        clave: "cupo",
        etiqueta: "Cupo disponible",
        ok: libres > 0,
        detalle: libres > 0
          ? libres + (libres === 1 ? " lugar disponible" : " lugares disponibles") + " en " + materiaActual?.nombre + "."
          : "La comisión está completa. Elegí otra comisión de la materia."
      }
    ];
  }

  function motivoDeRechazo(alumno, grupo, registros, periodoAbierto) {
    if (!alumno?.activo) return "Tu usuario no está habilitado para inscribirse.";
    if (!grupo?.activa) return "La comisión ya no está disponible.";
    if (!alumno.plan.includes(grupo.materia)) return "La materia no pertenece a tu plan de estudios.";
    if (!periodoAbierto) return "El período de inscripción está cerrado.";
    const previa = inscripcionVigente(alumno, grupo.materia, registros);
    if (previa) return "Ya tenés una inscripción vigente a esta materia (" + previa.estado + ").";
    const faltantes = faltantesDe(alumno, grupo);
    if (faltantes.length) return "Correlativas sin aprobar: " + faltantes.map(id => materia(id).nombre).join(", ") + ".";
    if (cupos(grupo, registros) <= 0) return "La comisión está completa. Elegí otra comisión de la materia.";
    return "";
  }

  return {
    facultades,
    carreras,
    estudiantes,
    materias,
    comisiones,
    iniciales,
    calendario,
    materia,
    comision,
    estudiante,
    carrera,
    facultad,
    nota,
    promedio,
    cupos,
    ocupados,
    motivoDeRechazo,
    validaciones,
    inscripcionVigente
  };
})();
