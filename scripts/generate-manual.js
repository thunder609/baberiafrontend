import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.join(__dirname, '..', 'Manual_Barberia.pdf');

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 60, bottom: 60, left: 60, right: 60 },
  info: {
    Title: 'Manual de Usuario - Barbería App',
    Author: 'Barbería App',
    Subject: 'Manual de usuario del sistema de gestión de barbería',
  },
});

doc.pipe(fs.createWriteStream(outputPath));

const leftMargin = 60;
const pageWidth = 595.28;
const contentWidth = pageWidth - leftMargin * 2;
const primaryColor = '#1e293b';
const secondaryColor = '#3b82f6';
const accentColor = '#f59e0b';
const grayColor = '#64748b';
const lightBg = '#f8fafc';
const borderColor = '#e2e8f0';

function header(title) {
  doc.rect(0, 0, pageWidth, 50).fill(primaryColor);
  doc.fill('#ffffff').fontSize(12).font('Helvetica-Bold').text('Barbería App', leftMargin, 17);
  doc.fontSize(9).font('Helvetica').text('Manual de Usuario', leftMargin, 32, { continued: true });
  doc.text('v1.0', { align: 'right' });
  doc.y = 80;
}

function footer() {
  const bottom = 780;
  doc.fontSize(8).font('Helvetica').fill(grayColor);
  doc.text(
    `Barbería App — Manual de Usuario — Página ${doc.bufferedPageRange().count}`,
    leftMargin,
    bottom,
    { align: 'center' }
  );
}

function sectionTitle(text) {
  doc.moveDown(1.5);
  doc.fontSize(22).font('Helvetica-Bold').fill(primaryColor);
  doc.text(text, { underline: false });
  doc.moveDown(0.3);
  doc.rect(leftMargin, doc.y, contentWidth, 2).fill(secondaryColor);
  doc.moveDown(1);
}

function subSectionTitle(text) {
  doc.moveDown(1);
  doc.fontSize(16).font('Helvetica-Bold').fill(primaryColor);
  doc.text(text);
  doc.moveDown(0.5);
}

function subSubSectionTitle(text) {
  doc.moveDown(0.8);
  doc.fontSize(13).font('Helvetica-Bold').fill(secondaryColor);
  doc.text(text);
  doc.moveDown(0.3);
}

function bodyText(text) {
  doc.fontSize(10).font('Helvetica').fill('#334155');
  doc.text(text, { align: 'justify', lineGap: 4 });
  doc.moveDown(0.3);
}

function bullet(text, indent = 0) {
  doc.fontSize(10).font('Helvetica').fill('#334155');
  doc.text(`  •  ${text}`, { indent: leftMargin + 20 + indent, lineGap: 3, paragraphGap: 2 });
}

function step(number, title, description) {
  doc.moveDown(0.5);
  doc.fontSize(11).font('Helvetica-Bold').fill(secondaryColor);
  doc.text(`Paso ${number}: ${title}`);
  doc.fontSize(10).font('Helvetica').fill('#334155');
  doc.text(description, { indent: leftMargin + 15, lineGap: 3, align: 'justify' });
  doc.moveDown(0.3);
}

function infoBox(text) {
  doc.moveDown(0.5);
  const boxY = doc.y;
  doc.rect(leftMargin, boxY, contentWidth, 30).fill('#eff6ff');
  doc.rect(leftMargin, boxY, 4, 30).fill(secondaryColor);
  doc.fill('#1e40af').fontSize(9).font('Helvetica');
  doc.text(`  ℹ  ${text}`, leftMargin + 10, boxY + 8, { width: contentWidth - 20, lineGap: 2 });
  doc.moveDown(1);
}

function tipBox(text) {
  doc.moveDown(0.5);
  const boxY = doc.y;
  doc.rect(leftMargin, boxY, contentWidth, 30).fill('#fefce8');
  doc.rect(leftMargin, boxY, 4, 30).fill(accentColor);
  doc.fill('#92400e').fontSize(9).font('Helvetica');
  doc.text(`  💡  ${text}`, leftMargin + 10, boxY + 8, { width: contentWidth - 20, lineGap: 2 });
  doc.moveDown(1);
}

function warningBox(text) {
  doc.moveDown(0.5);
  const boxY = doc.y;
  doc.rect(leftMargin, boxY, contentWidth, 30).fill('#fef2f2');
  doc.rect(leftMargin, boxY, 4, 30).fill('#ef4444');
  doc.fill('#991b1b').fontSize(9).font('Helvetica');
  doc.text(`  ⚠  ${text}`, leftMargin + 10, boxY + 8, { width: contentWidth - 20, lineGap: 2 });
  doc.moveDown(1);
}

function checkPageSpace(needed = 150) {
  if (doc.y > 700 - needed) {
    doc.addPage();
    header('');
  }
}

// ─────────────────────────────────────────────
// PORTADA
// ─────────────────────────────────────────────
doc.rect(0, 0, pageWidth, 400).fill(primaryColor);
doc.fill('#ffffff');
doc.fontSize(36).font('Helvetica-Bold').text('Barbería App', leftMargin, 160);
doc.fontSize(18).font('Helvetica').text('Manual de Usuario', leftMargin, 210);
doc.fontSize(12).font('Helvetica').fill('#94a3b8').text('Sistema de Gestión de Barbería', leftMargin, 245);
doc.fontSize(10).font('Helvetica').fill('#64748b').text('Versión 1.0', leftMargin, 280);

doc.rect(0, 400, pageWidth, 395).fill('#f8fafc');
doc.fill('#475569').fontSize(11).font('Helvetica');
doc.text('Contenido:', leftMargin, 430);
doc.fontSize(10).font('Helvetica').fill(secondaryColor);
const toc = [
  '1. Introducción',
  '2. Landing Page — Sitio Público',
  '    2.1 Navegación',
  '    2.2 Servicios',
  '    2.3 Barbers',
  '    2.4 Reserva de Turnos',
  '    2.5 Contacto',
  '3. Panel de Administración',
  '    3.1 Inicio de Sesión',
  '    3.2 Gestión de Clientes',
  '    3.3 Gestión de Barbers',
  '    3.4 Gestión de Servicios',
  '    3.5 Gestión de Turnos',
  '    3.6 Gestión de Horarios',
  '    3.7 Gestión de Excepciones',
  '    3.8 Cambio de Contraseña',
  '4. Preguntas Frecuentes',
];
toc.forEach((item, i) => {
  const y = 460 + i * 18;
  doc.text(item, leftMargin + 10, y);
});

doc.addPage();

// ─────────────────────────────────────────────
// 1. INTRODUCCIÓN
// ─────────────────────────────────────────────
header('');
sectionTitle('1. Introducción');

bodyText(
  'Barbería App es un sistema integral de gestión para barberías que combina un sitio web público ' +
  'para que los clientes reserven turnos online con un panel de administración para gestionar ' +
  'clientes, barberos, servicios, horarios y turnos.'
);

bodyText(
  'El sistema está compuesto por dos aplicaciones:'
);

bullet('Landing Page: sitio público accesible para cualquier persona, donde los clientes pueden ' +
  'ver los servicios y barberos disponibles, y reservar turnos en línea.');
bullet('Panel de Administración: aplicación privada con autenticación, donde el personal de la ' +
  'barbería gestiona clientes, barberos, servicios, horarios y turnos.');
doc.moveDown(0.5);

infoBox('Tanto el sitio público como el panel de administración están optimizados para ' +
  'dispositivos móviles y computadoras de escritorio.');

doc.addPage();

// ─────────────────────────────────────────────
// 2. LANDING PAGE
// ─────────────────────────────────────────────
header('');
sectionTitle('2. Landing Page — Sitio Público');

bodyText(
  'La Landing Page es la cara pública de la barbería. Los clientes pueden explorar servicios, ' +
  'conocer a los barberos y reservar turnos sin necesidad de registrarse.'
);

// 2.1 Navegación
subSectionTitle('2.1 Navegación');

bodyText(
  'La barra de navegación superior contiene enlaces a las distintas secciones de la página. ' +
  'En dispositivos móviles, la navegación se contrae en un menú tipo "hamburguesa".'
);

bullet('Inicio — sección principal con hero');
bullet('Servicios — galería de servicios disponibles');
bullet('Barberos — presentación del equipo');
bullet('Turnos — acceso directo al formulario de reserva');
bullet('Contacto — información de ubicación y horarios');
doc.moveDown(0.5);

bodyText(
  'En la esquina superior derecha se encuentra el selector de idioma para alternar entre ' +
  'español e inglés. El idioma seleccionado se guarda en el navegador para visitas futuras.'
);

tipBox('El sitio recuerda tu idioma preferido usando el almacenamiento local del navegador.');

// 2.2 Servicios
subSectionTitle('2.2 Servicios');

bodyText(
  'La sección de Servicios muestra tarjetas con todos los servicios activos. Cada tarjeta incluye:'
);

bullet('Nombre del servicio');
bullet('Descripción breve');
bullet('Duración estimada');
bullet('Precio');
bullet('Imagen representativa');
doc.moveDown(0.5);

bodyText(
  'Los servicios se cargan automáticamente desde el servidor. Si hay muchos servicios, ' +
  'puedes desplazarte verticalmente para verlos todos.'
);

// 2.3 Barbers
checkPageSpace(200);
subSectionTitle('2.3 Barberos');

bodyText(
  'La sección de Barberos presenta al equipo de trabajo. Cada tarjeta de barbero incluye:'
);

bullet('Nombre y foto');
bullet('Información de contacto');
bullet('Botón "Reservar con [nombre]" que inicia el proceso de reserva con ese barbero preseleccionado');
doc.moveDown(0.5);

doc.addPage();
header('');

// 2.4 Reserva de Turnos
subSectionTitle('2.4 Reserva de Turnos');

bodyText(
  'El sistema de reserva guía al cliente a través de 4 pasos para agendar un turno ' +
  'de manera rápida y sencilla.'
);

subSubSectionTitle('Paso 1: Seleccionar Barbero');
bodyText(
  'Elige el barbero con quien deseas tomar el turno. Puedes hacer clic en "Reservar" ' +
  'desde la sección de barberos o seleccionarlo directamente en el formulario de reserva.'
);

subSubSectionTitle('Paso 2: Seleccionar Servicios');
bodyText(
  'Elige uno o más servicios. Al seleccionar múltiples servicios, el sistema calcula ' +
  'automáticamente el tiempo total estimado y el precio total.'
);

infoBox('Puedes seleccionar varios servicios. La duración total se calcula sumando la duración de cada servicio seleccionado.');

subSubSectionTitle('Paso 3: Fecha y Hora');
bodyText(
  'Selecciona una fecha en el calendario interactivo y luego elige un horario disponible. ' +
  'El sistema muestra únicamente los horarios libres basándose en:'
);

bullet('El horario semanal del barbero seleccionado');
bullet('Las excepciones de horario (días no laborables, horarios especiales)');
bullet('Los turnos ya existentes');
doc.moveDown(0.5);

tipBox('Los horarios ocupados aparecen atenuados y no se pueden seleccionar.');

subSubSectionTitle('Paso 4: Datos del Cliente');
bodyText(
  'Ingresa tu nombre, teléfono y correo electrónico. Si ya eres cliente de la barbería, ' +
  'al completar el teléfono o email el sistema buscará tus datos automáticamente.'
);

bodyText(
  'Revisa el resumen de tu reserva que incluye: barbero seleccionado, servicios, ' +
  'fecha y hora, y precio total. Haz clic en "Confirmar Turno" para completar la reserva.'
);

warningBox('Si no completas todos los campos obligatorios, el sistema te lo indicará antes de confirmar.');

subSubSectionTitle('WhatsApp');
doc.moveDown(0.3);
bodyText(
  'En la esquina inferior derecha hay un botón flotante de WhatsApp. Al hacer clic, ' +
  'se abre una conversación directa con la barbería con un mensaje predefinido.'
);

// 2.5 Contacto
subSectionTitle('2.5 Contacto');
bodyText(
  'La sección de contacto muestra la dirección física de la barbería, horarios de atención ' +
  'al público y un botón para llamar por teléfono directamente.'
);

doc.addPage();
header('');

// ─────────────────────────────────────────────
// 3. PANEL DE ADMINISTRACIÓN
// ─────────────────────────────────────────────
sectionTitle('3. Panel de Administración');

bodyText(
  'El panel de administración es la herramienta interna para gestionar todos los aspectos ' +
  'de la barbería. Requiere autenticación y está protegido por JWT (JSON Web Token).'
);

// 3.1 Login
subSectionTitle('3.1 Inicio de Sesión');

bodyText(
  'Para acceder al panel, navega a la URL del panel de administración. ' +
  'Verás un formulario de inicio de sesión.'
);

step(1, 'Ingresar credenciales', 'Escribe tu nombre de usuario y contraseña en los campos correspondientes.');
step(2, 'Hacer clic en Ingresar', 'Presiona el botón "Iniciar Sesión".');
step(3, 'Acceso al sistema', 'Si las credenciales son correctas, accederás al panel principal. ' +
  'Si son incorrectas, verás un mensaje de error.');

infoBox('La sesión permanece activa hasta que cierres sesión o el token expire. ' +
  'Puedes trabajar sin tener que ingresar nuevamente cada vez.');

subSubSectionTitle('Cerrar Sesión');
bodyText(
  'Haz clic en tu nombre de usuario en la barra superior y selecciona "Cerrar Sesión". ' +
  'Serás redirigido a la pantalla de inicio de sesión.'
);

// 3.2 Gestión de Clientes
subSectionTitle('3.2 Gestión de Clientes');

bodyText(
  'La sección de Clientes te permite administrar la base de datos de clientes de la barbería. ' +
  'Aquí puedes ver, crear, editar y eliminar clientes.'
);

subSubSectionTitle('Listado de Clientes');
bodyText(
  'La tabla muestra todos los clientes registrados con su nombre, teléfono y correo electrónico. ' +
  'Puedes buscar clientes usando el campo de búsqueda.'
);

subSubSectionTitle('Crear Cliente');
step(1, 'Abrir formulario', 'Haz clic en el botón "Nuevo Cliente".');
step(2, 'Completar datos', 'Ingresa nombre, teléfono y correo electrónico.');
step(3, 'Guardar', 'Haz clic en "Guardar". El cliente aparecerá en el listado.');

subSubSectionTitle('Editar Cliente');
step(1, 'Seleccionar cliente', 'Haz clic en el ícono de editar (lápiz) junto al cliente.');
step(2, 'Modificar datos', 'Actualiza los campos necesarios.');
step(3, 'Guardar cambios', 'Haz clic en "Guardar".');

subSubSectionTitle('Eliminar Cliente');
bodyText(
  'Haz clic en el ícono de eliminar (papelera) junto al cliente. Confirma la acción ' +
  'en el mensaje de confirmación.'
);

warningBox('Eliminar un cliente es irreversible. Los turnos asociados al cliente se conservan pero quedan sin cliente asignado.');

doc.addPage();
header('');

// 3.3 Gestión de Barbers
subSectionTitle('3.3 Gestión de Barberos');

bodyText(
  'La sección de Barberos permite administrar el equipo de trabajo. Puedes dar de alta, ' +
  'modificar y desactivar barberos.'
);

subSubSectionTitle('Listado de Barberos');
bodyText(
  'La tabla muestra todos los barberos con su nombre, teléfono, correo y estado (activo/inactivo).');
bullet('Un barbero activo aparece en la Landing Page y puede recibir turnos.');
bullet('Un barbero inactivo no aparece en el sitio público y no puede recibir nuevos turnos.');

subSubSectionTitle('Crear / Editar Barberos');
step(1, 'Formulario', 'Haz clic en "Nuevo Barbero" o en el ícono de editar.');
step(2, 'Completar datos', 'Nombre, teléfono y correo electrónico.');
step(3, 'Guardar', 'Confirma para guardar los cambios.');

subSubSectionTitle('Activar / Desactivar Barbero');
bodyText(
  'Usa el interruptor o botón de activar/desactivar en la lista. Al desactivar un barbero:');
bullet('No aparecerá en el sitio público');
bullet('No se podrán crear nuevos turnos para él');
bullet('Los turnos existentes no se ven afectados');

subSubSectionTitle('Horarios y Excepciones');
bodyText(
  'Desde la lista de barberos puedes acceder directamente a:');
bullet('Horarios semanales del barbero (ícono de calendario)');
bullet('Excepciones de horario (ícono de ajustes)');

// 3.4 Gestión de Servicios
subSectionTitle('3.4 Gestión de Servicios');

bodyText(
  'Los servicios son las prestaciones que ofrece la barbería (corte de cabello, barba, etc.). ' +
  'Puedes crear, editar, activar/desactivar y eliminar servicios.'
);

subSubSectionTitle('Campos del Servicio');
bullet('Nombre: nombre visible del servicio');
bullet('Descripción: texto explicativo breve');
bullet('Duración (minutos): tiempo estimado');
bullet('Precio: valor del servicio');
bullet('Activo: si está disponible para reserva');

subSubSectionTitle('Activar / Desactivar Servicio');
bodyText(
  'Al desactivar un servicio, no aparecerá en la Landing Page y no podrá ser seleccionado ' +
  'en nuevas reservas. Los turnos existentes con ese servicio no se ven afectados.'
);

warningBox('Eliminar un servicio puede afectar turnos históricos. Se recomienda desactivar en lugar de eliminar.');

doc.addPage();
header('');

// 3.5 Gestión de Turnos
subSectionTitle('3.5 Gestión de Turnos');

bodyText(
  'La sección de Turnos es el corazón del sistema. Aquí puedes ver, crear, modificar ' +
  'y cambiar el estado de los turnos.'
);

subSubSectionTitle('Filtros');
bodyText('Usa los filtros superiores para encontrar turnos específicos:');
bullet('Por barbero: filtra turnos de un barbero específico');
bullet('Por rango de fechas: selecciona una fecha de inicio y fin');

subSubSectionTitle('Estados de Turno');
bodyText('Cada turno pasa por los siguientes estados:');
doc.moveDown(0.3);

const states = [
  ['PENDIENTE', 'El turno ha sido creado pero aún no ha sido confirmado. Estado inicial.'],
  ['CONFIRMADO', 'El turno ha sido confirmado por la barbería.'],
  ['EN CURSO', 'El cliente está siendo atendido.'],
  ['COMPLETADO', 'El servicio ha sido finalizado correctamente.'],
  ['CANCELADO', 'El turno fue cancelado.'],
  ['NO ASISTIÓ', 'El cliente no se presentó al turno.'],
];

states.forEach(([name, desc]) => {
  checkPageSpace(60);
  doc.moveDown(0.3);
  doc.fontSize(10).font('Helvetica-Bold').fill(primaryColor).text(`${name}:  `, { continued: true });
  doc.font('Helvetica').fill('#334155').text(desc);
});

doc.moveDown(0.8);

subSubSectionTitle('Transiciones Permitidas');
doc.fontSize(9).font('Helvetica').fill('#334155');
const transitions = [
  'PENDIENTE    →  CONFIRMADO  →  EN CURSO  →  COMPLETADO',
  'PENDIENTE    →  CANCELADO',
  'PENDIENTE    →  NO ASISTIÓ',
  'CONFIRMADO   →  CANCELADO',
  'CONFIRMADO   →  NO ASISTIÓ',
];
transitions.forEach(t => {
  doc.text(`     ${t}`);
  doc.moveDown(0.2);
});

doc.moveDown(0.5);

subSubSectionTitle('Crear Turno');
step(1, 'Nuevo Turno', 'Haz clic en "Nuevo Turno".');
step(2, 'Seleccionar barbero', 'Elige el barbero de la lista.');
step(3, 'Seleccionar cliente', 'Elige un cliente existente o escribe el nombre para crear uno nuevo.');
step(4, 'Seleccionar servicio', 'Elige el servicio principal.');
step(5, 'Fecha y hora', 'Selecciona fecha y hora del turno.');
step(6, 'Notas (opcional)', 'Agrega cualquier observación relevante.');
step(7, 'Guardar', 'Confirma para crear el turno.');

subSubSectionTitle('Reasignar Turno');
bodyText(
  'Puedes modificar un turno existente usando el botón "Reasignar". Esto permite cambiar:');
bullet('El cliente asignado');
bullet('La fecha y/o hora');
bullet('El servicio');
doc.moveDown(0.3);

infoBox('La reasignación es útil cuando un cliente llama para reprogramar su turno.');

doc.addPage();
header('');

// 3.6 Gestión de Horarios
subSectionTitle('3.6 Gestión de Horarios');

bodyText(
  'Cada barbero tiene un horario semanal que define los días y horas en que trabaja. ' +
  'Esta sección permite configurar esos horarios.'
);

subSubSectionTitle('Vista Semanal');
bodyText(
  'Se muestra una tabla con los 7 días de la semana. Para cada día puedes definir:');
bullet('Hora de inicio (ej: 09:00)');
bullet('Hora de fin (ej: 18:00)');
bullet('Si el día es laborable o no');

subSubSectionTitle('Configurar Horario');
step(1, 'Seleccionar día', 'Haz clic en el día que deseas configurar.');
step(2, 'Definir horario', 'Ingresa hora de inicio y fin usando los selectores de hora.');
step(3, 'Guardar', 'Confirma para guardar el horario del día.');
step(4, 'Repetir', 'Repite para cada día laborable.');

tipBox('Usa el botón "Copiar a todos los días" para aplicar el mismo horario a todo la semana y luego ajusta los días diferentes.');

warningBox('Los horarios definidos aquí son la base para calcular los turnos disponibles en la Landing Page. ' +
  'Si un barbero no tiene horario configurado para un día, no aparecerán turnos disponibles para ese día.');

// 3.7 Gestión de Excepciones
subSectionTitle('3.7 Gestión de Excepciones');

bodyText(
  'Las excepciones permiten modificar el horario de un barbero para fechas específicas. ' +
  'Son útiles para:');
bullet('Días feriados o no laborables');
bullet('Horarios especiales (ej: solo atención mañana)');
bullet('Días de capacitación o reuniones');
bullet('Vacaciones');

subSubSectionTitle('Crear Excepción');
step(1, 'Nueva Excepción', 'Haz clic en "Nueva Excepción".');
step(2, 'Seleccionar fecha', 'Elige la fecha específica.');
step(3, 'Definir horario', 'Ingresa hora de inicio y fin.');
step(4, 'Disponible o no', 'Indica si el barbero estará disponible en ese horario.');
step(5, 'Motivo (opcional)', 'Agrega una razón (ej: "Feriado", "Vacaciones").');
step(6, 'Guardar', 'Confirma para crear la excepción.');

infoBox('Las excepciones tienen prioridad sobre el horario semanal. Si creas una excepción "no disponible" para un día, ' +
  'ese barbero no tendrá turnos disponibles ese día aunque tenga horario semanal configurado.');

doc.addPage();
header('');

// 3.8 Cambio de Contraseña
subSectionTitle('3.8 Cambio de Contraseña');

bodyText(
  'Puedes cambiar tu contraseña en cualquier momento desde el panel.'
);

step(1, 'Acceder', 'Haz clic en tu nombre en la barra superior y selecciona "Cambiar Contraseña".');
step(2, 'Ingresar contraseña actual', 'Escribe tu contraseña actual.');
step(3, 'Ingresar nueva contraseña', 'Escribe la nueva contraseña.');
step(4, 'Confirmar', 'Vuelve a escribir la nueva contraseña para confirmar.');
step(5, 'Guardar', 'Haz clic en "Cambiar Contraseña".');

warningBox('Si cambias tu contraseña, la sesión actual se mantiene activa. La próxima vez que inicies sesión deberás usar la nueva contraseña.');

doc.addPage();
header('');

// ─────────────────────────────────────────────
// 4. PREGUNTAS FRECUENTES
// ─────────────────────────────────────────────
sectionTitle('4. Preguntas Frecuentes');

const faqs = [
  {
    q: '¿Cómo accedo al panel de administración?',
    a: 'El panel de administración está disponible en la URL /admin del sitio. Debes iniciar sesión con tu usuario y contraseña proporcionados por el administrador del sistema.',
  },
  {
    q: 'Olvidé mi contraseña, ¿cómo la recupero?',
    a: 'Contacta al administrador del sistema para que restablezca tu contraseña. Actualmente no hay un sistema de recuperación automática.',
  },
  {
    q: '¿Puedo tener el sistema en inglés?',
    a: 'Sí. La Landing Page tiene un selector de idioma en la esquina superior derecha. El panel de administración actualmente está en español.',
  },
  {
    q: '¿Los clientes necesitan registrarse para reservar?',
    a: 'No. Los clientes pueden reservar turnos sin registrarse. Solo necesitan ingresar su nombre, teléfono y correo electrónico.',
  },
  {
    q: '¿Qué sucede si un cliente no se presenta?',
    a: 'Puedes marcar el turno como "No Asistió" desde el panel de administración. Esto permite llevar un registro de inasistencias.',
  },
  {
    q: '¿Cómo configuro horarios especiales para un día en particular?',
    a: 'Usa la sección de Excepciones desde el perfil del barbero. Allí puedes definir horarios específicos para cualquier fecha.',
  },
  {
    q: '¿Puedo cancelar un turno desde la Landing Page?',
    a: 'Actualmente la cancelación debe ser gestionada por el personal de la barbería desde el panel de administración.',
  },
  {
    q: '¿Los cambios en horarios afectan turnos ya reservados?',
    a: 'No. Los cambios en horarios y excepciones solo afectan la disponibilidad futura. Los turnos ya reservados no se ven afectados.',
  },
];

faqs.forEach(({ q, a }) => {
  checkPageSpace(80);
  doc.moveDown(0.5);
  doc.fontSize(11).font('Helvetica-Bold').fill(secondaryColor);
  doc.text(`Q: ${q}`);
  doc.fontSize(10).font('Helvetica').fill('#334155');
  doc.text(`R: ${a}`, { indent: leftMargin + 10, align: 'justify', lineGap: 3 });
  doc.moveDown(0.3);
});

// ─────────────────────────────────────────────
// FINAL
// ─────────────────────────────────────────────
doc.addPage();
doc.rect(0, 0, pageWidth, 150).fill(primaryColor);
doc.fill('#ffffff').fontSize(24).font('Helvetica-Bold').text('Gracias por usar', leftMargin, 50);
doc.text('Barbería App', leftMargin, 85);
doc.fontSize(12).font('Helvetica').fill('#94a3b8').text('Manual generado el ' + new Date().toLocaleDateString('es-AR'), leftMargin, 130);

doc.rect(0, 150, pageWidth, 650).fill('#f8fafc');
doc.fill('#475569').fontSize(11).font('Helvetica').text('Para soporte técnico:', leftMargin, 200);
doc.fontSize(10).font('Helvetica').fill(secondaryColor);
doc.text('Contacta al administrador del sistema', leftMargin, 225);

doc.fontSize(10).font('Helvetica-Bold').fill(primaryColor);
doc.text('Barbería App v1.0', leftMargin, 280);

// Finalize
doc.end();

console.log(`PDF generado: ${outputPath}`);