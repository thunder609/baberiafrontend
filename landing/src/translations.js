const translations = {
  es: {
    'nav.services': 'Servicios',
    'nav.barbers': 'Barberos',
    'nav.appointments': 'Turnos',
    'nav.contact': 'Contacto',
    'nav.bookNow': 'Sacá tu turno',
    'nav.langToggle': 'EN',
    'nav.openMenu': 'Abrir menú',
    'nav.closeMenu': 'Cerrar menú',

    'hero.tagline': 'TRADICIÓN Y ESTILO',
    'hero.title': 'Donde el<br /><span class="text-barber-accent">clásico</span> nunca pasa<br />de moda',
    'hero.subtitle': 'Más de 15 años perfeccionando el arte de la barbería clásica.',
    'hero.ctaBook': 'Reservá tu turno',
    'hero.ctaServices': 'Ver servicios',

    'services.sectionLabel': 'Servicios',
    'services.title': 'Cortes con <span class="text-barber-accent">clase</span>',
    'services.empty': 'Próximamente más servicios.',
    'services.error': 'Error al cargar los servicios. ¿El backend está corriendo?',

    'barbers.sectionLabel': 'Equipo',
    'barbers.title': 'Artesanos de la <span class="text-barber-accent">tijera</span>',
    'barbers.professional': 'Barbero profesional',
    'barbers.bookWith': 'Reservá con {name}',
    'barbers.empty': 'Próximamente nuevos barberos.',
    'barbers.error': 'Error al cargar los barberos. ¿El backend está corriendo?',

    'booking.sectionLabel': 'Turnos',
    'booking.title': 'Pedí tu <span class="text-barber-accent">cita</span>',
    'booking.subtitle': 'Completá el formulario y te agendamos al toque.',
    'booking.step1': 'Barbero',
    'booking.step2': 'Servicio',
    'booking.step3': 'Fecha',
    'booking.step4': 'Hora',
    'booking.step5': 'Tus datos',
    'booking.header1': 'Elegí tu barbero',
    'booking.header2': 'Elegí el servicio',
    'booking.header3': 'Elegí la fecha',
    'booking.header4': 'Elegí el horario',
    'booking.header5': 'Confirmá tu turno',
    'booking.prev': 'Anterior',
    'booking.next': 'Siguiente',
    'booking.submit': 'Reservar turno',
    'booking.reserving': 'Reservando\u2026',
    'booking.reserved': '\u00a1Reservado!',
    'booking.lookupEmail': 'Email',
    'booking.lookupPhone': 'Tel\u00e9fono',
    'booking.lookupName': 'Nombre',
    'booking.emailPlaceholder': 'tucorreo@email.com',
    'booking.phonePlaceholder': '+54 11 1234-5678',
    'booking.namePlaceholder': 'Tu nombre',
    'booking.total': 'Total',
    'booking.service_one': '{count} servicio',
    'booking.service_other': '{count} servicios',
    'booking.welcomeBack': '\u00a1Bienvenido de vuelta, {name}!',
    'booking.occupied': 'Ocupado',
    'booking.notWorking': 'El barbero no trabaja este d\u00eda. Eleg\u00ed otra fecha.',
    'booking.noSlots': 'Completo \u2014 no hay turnos disponibles para este d\u00eda.',
    'booking.slotsAvailable_one': '{count} turno disponible',
    'booking.slotsAvailable_other': '{count} turnos disponibles',
    'booking.missingData': 'Faltan datos para calcular horarios.',
    'booking.success': '\u00a1Turno reservado con \u00e9xito! Te esperamos.',
    'booking.error': 'Error al calcular horarios.',
    'booking.submitError': 'Error al reservar. Intentalo de nuevo.',
    'booking.barberFallback': 'Barbero',

    'validate.selectBarber': 'Seleccion\u00e1 un barbero para continuar.',
    'validate.selectService': 'Seleccion\u00e1 al menos un servicio para continuar.',
    'validate.selectDate': 'Seleccion\u00e1 una fecha para continuar.',
    'validate.selectTime': 'Seleccion\u00e1 un horario para continuar.',
    'validate.emailRequired': 'Necesitamos tu email para contactarte.',
    'validate.phoneRequired': 'Necesitamos tu tel\u00e9fono por si hay que confirmar.',
    'validate.nameRequired': 'Decinos tu nombre para agendar el turno.',

    'contact.sectionLabel': 'Contacto',
    'contact.title': 'Pasate por el <span class="text-barber-accent">local</span>',
    'contact.address': 'Direcci\u00f3n',
    'contact.phone': 'Tel\u00e9fono',
    'contact.hours': 'Horarios',
    'contact.addressValue': 'Av. Siempre Viva 123, CABA',
    'contact.phoneValue': '+54 11 1234-5678',
    'contact.hoursValue': 'Lun\u2013Vie 9 a 18<br />S\u00e1b 9 a 14',

    'footer.copyright': '\u00a9 2026 Barber\u00eda Cl\u00e1sica. Todos los derechos reservados.',
    'page.title': 'Barber\u00eda Cl\u00e1sica \u2014 Oswaldo',
  },

  en: {
    'nav.services': 'Services',
    'nav.barbers': 'Barbers',
    'nav.appointments': 'Appointments',
    'nav.contact': 'Contact',
    'nav.bookNow': 'Book now',
    'nav.langToggle': 'ES',
    'nav.openMenu': 'Open menu',
    'nav.closeMenu': 'Close menu',

    'hero.tagline': 'TRADITION & STYLE',
    'hero.title': 'Where<br /><span class="text-barber-accent">classic</span> never goes<br />out of style',
    'hero.subtitle': 'Over 15 years perfecting the art of classic barbering.',
    'hero.ctaBook': 'Book your appointment',
    'hero.ctaServices': 'View services',

    'services.sectionLabel': 'Services',
    'services.title': 'Cuts with <span class="text-barber-accent">class</span>',
    'services.empty': 'More services coming soon.',
    'services.error': 'Error loading services. Is the backend running?',

    'barbers.sectionLabel': 'Team',
    'barbers.title': 'Masters of the <span class="text-barber-accent">scissors</span>',
    'barbers.professional': 'Professional barber',
    'barbers.bookWith': 'Book with {name}',
    'barbers.empty': 'New barbers coming soon.',
    'barbers.error': 'Error loading barbers. Is the backend running?',

    'booking.sectionLabel': 'Appointments',
    'booking.title': 'Book your <span class="text-barber-accent">slot</span>',
    'booking.subtitle': "Fill out the form and we'll get you scheduled right away.",
    'booking.step1': 'Barber',
    'booking.step2': 'Service',
    'booking.step3': 'Date',
    'booking.step4': 'Time',
    'booking.step5': 'Your info',
    'booking.header1': 'Choose your barber',
    'booking.header2': 'Choose the service',
    'booking.header3': 'Choose the date',
    'booking.header4': 'Choose the time',
    'booking.header5': 'Confirm your appointment',
    'booking.prev': 'Previous',
    'booking.next': 'Next',
    'booking.submit': 'Book now',
    'booking.reserving': 'Booking\u2026',
    'booking.reserved': 'Booked!',
    'booking.lookupEmail': 'Email',
    'booking.lookupPhone': 'Phone',
    'booking.lookupName': 'Name',
    'booking.emailPlaceholder': 'you@email.com',
    'booking.phonePlaceholder': '+54 11 1234-5678',
    'booking.namePlaceholder': 'Your name',
    'booking.total': 'Total',
    'booking.service_one': '{count} service',
    'booking.service_other': '{count} services',
    'booking.welcomeBack': 'Welcome back, {name}!',
    'booking.occupied': 'Booked',
    'booking.notWorking': "The barber doesn't work on this day. Pick another date.",
    'booking.noSlots': 'Fully booked \u2014 no slots available for this day.',
    'booking.slotsAvailable_one': '{count} slot available',
    'booking.slotsAvailable_other': '{count} slots available',
    'booking.missingData': 'Missing data to calculate times.',
    'booking.success': 'Appointment booked successfully! See you soon.',
    'booking.error': 'Error calculating times.',
    'booking.submitError': 'Error booking. Please try again.',
    'booking.barberFallback': 'Barber',

    'validate.selectBarber': 'Select a barber to continue.',
    'validate.selectService': 'Select at least one service to continue.',
    'validate.selectDate': 'Select a date to continue.',
    'validate.selectTime': 'Select a time to continue.',
    'validate.emailRequired': 'We need your email to contact you.',
    'validate.phoneRequired': 'We need your phone in case we need to confirm.',
    'validate.nameRequired': 'Tell us your name to book the appointment.',

    'contact.sectionLabel': 'Contact',
    'contact.title': 'Stop by the <span class="text-barber-accent">shop</span>',
    'contact.address': 'Address',
    'contact.phone': 'Phone',
    'contact.hours': 'Hours',
    'contact.addressValue': '123 Main St, Buenos Aires',
    'contact.phoneValue': '+54 11 1234-5678',
    'contact.hoursValue': 'Mon\u2013Fri 9\u20136<br />Sat 9\u20132',

    'footer.copyright': '\u00a9 2026 Barber\u00eda Cl\u00e1sica. All rights reserved.',
    'page.title': 'Barber\u00eda Cl\u00e1sica \u2014 Oswaldo',
  },
};

let currentLang = 'es';

function getLanguage() {
  const stored = localStorage.getItem('barberia-lang');
  if (stored === 'es' || stored === 'en') return stored;
  const nav = (navigator.language || navigator.userLanguage || '').toLowerCase();
  return nav.startsWith('en') ? 'en' : 'es';
}

function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  localStorage.setItem('barberia-lang', lang);
}

function initLanguage() {
  currentLang = getLanguage();
  document.documentElement.lang = currentLang;
}

function t(key, params = {}) {
  const str = translations[currentLang]?.[key] ?? translations['es']?.[key] ?? key;
  if (Object.keys(params).length === 0) return str;
  return str.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? `{${k}}`);
}

function tn(key, count, params = {}) {
  const pluralKey = count === 1 ? `${key}_one` : `${key}_other`;
  return t(pluralKey, { ...params, count });
}

const I18N_SELECTOR = '[data-i18n]';
const PLACEHOLDER_SELECTOR = '[data-i18n-placeholder]';
const ARIA_SELECTOR = '[data-i18n-aria]';

function applyTranslations() {
  document.querySelectorAll(I18N_SELECTOR).forEach((el) => {
    const key = el.dataset.i18n;
    if (!key) return;
    if (el.dataset.i18nHtml !== undefined) {
      el.innerHTML = t(key);
    } else {
      el.textContent = t(key);
    }
  });
  document.querySelectorAll(PLACEHOLDER_SELECTOR).forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (key) el.placeholder = t(key);
  });
  document.querySelectorAll(ARIA_SELECTOR).forEach((el) => {
    const key = el.dataset.i18nAria;
    if (key) el.setAttribute('aria-label', t(key));
  });
  const titleEl = document.querySelector('title');
  const titleKey = titleEl?.dataset?.i18n;
  if (titleKey) document.title = t(titleKey);
}

export {
  t, tn, translations, currentLang,
  setLanguage, getLanguage, initLanguage, applyTranslations,
};
