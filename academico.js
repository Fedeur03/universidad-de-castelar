const Academico = (() => {
  const estudiantes = [
    { id: "S01", nombre: "Lucía Torres", legajo: "2026-0142", carrera: "Tecnicatura en Desarrollo de Software", plan: ["DAW", "BDD", "PRO", "RED"], aprobadas: ["PRO"], activo: true },
    { id: "S02", nombre: "Mateo Ríos", legajo: "2026-0218", carrera: "Tecnicatura en Desarrollo de Software", plan: ["DAW", "BDD", "PRO", "RED"], aprobadas: [], activo: true },
    { id: "S03", nombre: "Sofía Méndez", legajo: "2026-0305", carrera: "Licenciatura en Administración", plan: ["ADM"], aprobadas: [], activo: true }
  ];
  const materias = [
    { id: "DAW", codigo: "2628", nombre: "Programación Web II", correlativas: ["PRO"] },
    { id: "BDD", codigo: "2631", nombre: "Bases de Datos", correlativas: [] },
    { id: "PRO", codigo: "2614", nombre: "Programación I", correlativas: [] },
    { id: "RED", codigo: "2642", nombre: "Redes y Comunicaciones", correlativas: [] },
    { id: "ADM", codigo: "3102", nombre: "Administración General", correlativas: [] }
  ];
  const comisiones = [
    { id: "DAW-A", materia: "DAW", codigo: "01-1929", docente: "Paula Benítez", horario: "Lunes · 18:00–21:00", aula: "Laboratorio 2", capacidad: 24, ocupados: 21, activa: true },
    { id: "DAW-B", materia: "DAW", codigo: "02-1930", docente: "Diego Molina", horario: "Miércoles · 19:00–22:00", aula: "Laboratorio 3", capacidad: 20, ocupados: 20, activa: true },
    { id: "BDD-A", materia: "BDD", codigo: "01-1941", docente: "Marina Ortiz", horario: "Martes · 18:00–21:00", aula: "Laboratorio 1", capacidad: 24, ocupados: 17, activa: true },
    { id: "PRO-A", materia: "PRO", codigo: "01-1902", docente: "Ramiro Sosa", horario: "Jueves · 18:00–21:00", aula: "Laboratorio 2", capacidad: 25, ocupados: 17, activa: true },
    { id: "RED-A", materia: "RED", codigo: "01-1956", docente: "José Navarro", horario: "Viernes · 18:00–21:00", aula: "Aula 12", capacidad: 21, ocupados: 16, activa: true },
    { id: "ADM-A", materia: "ADM", codigo: "01-2203", docente: "Elena Vidal", horario: "Lunes · 17:00–20:00", aula: "Aula 5", capacidad: 30, ocupados: 18, activa: true }
  ];
  const iniciales = [{ id: "I-001", estudiante: "S01", comision: "BDD-A", estado: "Aprobada", motivo: "", fecha: "2026-11-10T15:00:00-03:00" }];
  const vigentes = new Set(["Pendiente", "Aprobada", "En curso"]);
  const materia = id => materias.find(item => item.id === id);
  const comision = id => comisiones.find(item => item.id === id);
  const estudiante = id => estudiantes.find(item => item.id === id);
  const inscripcionVigente = (alumno, materiaId, registros) => registros.find(item =>
    item.estudiante === alumno.id && comision(item.comision)?.materia === materiaId && vigentes.has(item.estado)
  );
  const cupos = (grupo, registros) => grupo.capacidad - grupo.ocupados - registros.filter(item =>
    item.comision === grupo.id && item.estado === "Aprobada"
  ).length;

  function motivoDeRechazo(alumno, grupo, registros, periodoAbierto) {
    if (!alumno?.activo) return "Tu usuario no está habilitado para inscribirse.";
    if (!grupo?.activa) return "La comisión ya no está disponible.";
    if (!alumno.plan.includes(grupo.materia)) return "La materia no pertenece a tu plan de estudios.";
    if (!periodoAbierto) return "El período de inscripción está cerrado.";
    const previa = inscripcionVigente(alumno, grupo.materia, registros);
    if (previa) return "Ya tenés una inscripción vigente a esta materia (" + previa.estado + ").";
    const faltantes = materia(grupo.materia).correlativas.filter(id => !alumno.aprobadas.includes(id));
    if (faltantes.length) return "Correlativas sin aprobar: " + faltantes.map(id => materia(id).nombre).join(", ") + ".";
    if (cupos(grupo, registros) <= 0) return "La comisión está completa. Elegí otra comisión de la materia.";
    return "";
  }

  return { estudiantes, materias, comisiones, iniciales, estudiante, materia, comision, cupos, motivoDeRechazo, inscripcionVigente };
})();
