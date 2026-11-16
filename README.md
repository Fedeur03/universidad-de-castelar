# Portal del estudiante · Universidad De Castelar

MVP educativo de autogestión estudiantil para el caso de uso **Inscribirse a Materia** (Actividad 4 del TP2). Usa el nombre Universidad De Castelar en un prototipo sin afiliación oficial, con emblema propio, datos ficticios y avisos simulados.

## Cómo abrirlo

Extraé la carpeta completa y abrí `index.html` en Chrome, Edge o Firefox. El proyecto usa HTML, CSS y JavaScript y funciona sin dependencias de instalación. Las fuentes tienen alternativas del sistema para usarlo sin conexión.

La sesión y las solicitudes se guardan en el navegador. Cada navegador tiene su propia copia de los datos. El período de inscripción está abierto en esta demostración.

## Qué incluye

- **Ingreso con estudiante válido**: en la pantalla de acceso se elige un estudiante de prueba (Lucía, Mateo o Sofía) y el portal muestra su carrera, facultad, legajo y contexto académico. También hay acceso por correo y clave de prueba.
- **Inscripción a materias**: oferta con materias, comisiones, docentes, horarios, aulas y cupos actualizados al instante.
- **Validaciones visibles**: carrera, período, inscripción previa, correlativas y cupo se muestran como requisitos antes de confirmar y en el resultado.
- **Estados Pendiente → Aprobada / Rechazada**: la solicitud se registra en Pendiente, se verifica y queda aprobada o rechazada con su motivo.
- **Cancelación con liberación de cupo**: en Mis inscripciones se puede cancelar una inscripción vigente o pendiente; el lugar vuelve a estar disponible en la oferta.
- **Historia académica**: materias promocionadas con nota, cursando ahora y materias pendientes con correlativas.
- **Calificaciones**: promedio, avance, notas y condición de cada materia.
- **Mi perfil**: datos académicos, resumen de avance y carga de foto de perfil (con recorte automático y foto genérica con iniciales si no se carga ninguna).
- **Calendario académico**: agenda por tramos (inscripción, exámenes y cursada) con fechas y próximos vencimientos, al estilo de un calendario institucional.
- **Servicios académicos**: plan de estudios, horarios, constancias de examen y novedades.

**Alcance:** el prototipo implementa el flujo del perfil **Estudiante**. Los módulos de **Docente** y **Administrador** no forman parte del MVP de la Actividad 4.

## Demo de 5 minutos

Abrí la página y usá **Ingresar con la cuenta demo** o tocá un estudiante de la lista de la pantalla de acceso.

1. En **Inicio**, mostrá la carrera, la facultad, la foto del legajo y el calendario académico.
2. Entrá a **Historia académica** y mostrá las tres secciones: promocionadas con nota, cursando ahora y pendientes con correlativas.
3. En **Oferta académica**, seleccioná Programación Web II y mostrá los cupos de ambas comisiones.
4. Abrí **Guía de demostración** en el pie de página y probá los escenarios. Recordá **restablecer los datos de prueba** antes de repetir la secuencia.

| Escenario | Estudiante | Comisión | Resultado esperado |
|---|---|---|---|
| Inscripción exitosa | Lucía Torres | 01-1929 | Aprobada, con un lugar menos |
| Comisión sin cupo | Lucía Torres | 02-1930 | Rechazada, comisión completa |
| Estudiante ya inscripto | Lucía Torres | 01-1941 | Rechazada, inscripción vigente |
| Correlativas incumplidas | Mateo Ríos | 01-1929 | Rechazada, falta Programación I |
| Materia fuera de la carrera | Sofía Méndez | 01-1929 | Rechazada, fuera del plan de estudios |

5. En **Mis inscripciones**, mostrá los motivos de los rechazos y usá **Cancelar** en una inscripción aprobada. Volvé a la oferta y comprobá que el cupo se liberó.

## Archivos

- `index.html` contiene la estructura del portal.
- `styles.css` define los estilos, el diseño y la adaptación a pantallas pequeñas.
- `emblema.svg` y `campus.svg` contienen el emblema y la ilustración institucional del prototipo.
- `academico.js` contiene los datos, el calendario y las reglas de inscripción.
- `app.js` implementa la navegación, los diálogos, el perfil y el almacenamiento local.
