# Portal del estudiante · Universidad De Castelar

MVP educativo de autogestión estudiantil para el caso de uso **Inscribirse a Materia**. Usa el nombre Universidad De Castelar en un prototipo sin afiliación oficial, con emblema propio, datos ficticios y avisos simulados.

## Cómo abrirlo

Extraé la carpeta completa y abrí `index.html` en Chrome, Edge o Firefox. El proyecto usa HTML, CSS y JavaScript y funciona sin dependencias de instalación. Las fuentes tienen alternativas del sistema para usarlo sin conexión.

La sesión y las solicitudes se guardan en el navegador. Cada navegador tiene su propia copia de los datos. El período de inscripción está abierto en esta demostración.

El inicio incluye un directorio de servicios. **Plan de estudios** muestra las materias y correlativas del perfil simulado y **Mis horarios** se actualiza con las inscripciones aprobadas. Historia académica, certificados, mesas de examen y bienestar figuran como servicios no disponibles en la demo.

## Demo de 5 minutos

Usá **Ingresar con la cuenta demo** para abrir el portal. La pantalla de acceso también permite probar el ingreso con credenciales ficticias y activar el legajo de Mateo con los datos de prueba indicados allí. El prototipo funciona en el navegador y no solicita datos reales.

1. Desde **Inicio**, mostrá el legajo y la carrera de Lucía Torres.
2. En **Oferta académica**, seleccioná Programación Web II. Mostrá los docentes, horarios y cupos de ambas comisiones.
3. Abrí **Guía de demostración** en el pie de página. Probá primero **Comisión sin cupo**, después **Estudiante ya inscripto** y finalmente **Inscripción exitosa**. En cada caso, confirmá la solicitud. Este orden evita que la inscripción exitosa active la validación de duplicados al probar la comisión llena.
4. En **Mis inscripciones**, mostrá los motivos de los dos rechazos y la inscripción aprobada. Volvé a la oferta para verificar que a 01-1929 le queda un lugar menos.

| Escenario | Estudiante | Comisión | Resultado esperado |
|---|---|---|---|
| Inscripción exitosa | Lucía Torres | 01-1929 | Aprobada, con un lugar menos |
| Comisión sin cupo | Lucía Torres | 02-1930 | Rechazada, comisión completa |
| Estudiante ya inscripto | Lucía Torres | 01-1941 | Rechazada, inscripción vigente |
| Correlativas incumplidas | Mateo Ríos | 01-1929 | Rechazada, falta Programación I |
| Materia fuera de la carrera | Sofía Méndez | 01-1929 | Rechazada, fuera del plan de estudios |

Usá **Restablecer datos de prueba** en la guía para repetir la demo desde el estado inicial. Al confirmar, el estado pasa por **Pendiente** antes de mostrar el resultado.

## Archivos

- `index.html` contiene la estructura del portal.
- `styles.css` define los estilos y la adaptación a pantallas pequeñas.
- `emblema.svg` contiene el emblema académico del prototipo.
- `academico.js` contiene los datos y reglas de inscripción.
- `app.js` implementa la navegación, los diálogos y el almacenamiento local.

