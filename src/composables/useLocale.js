import { ref } from 'vue'

const LOCALE_KEY = 'resume-locale'

const locale = ref(localStorage.getItem(LOCALE_KEY) || 'es')

function setLocale(lang) {
  locale.value = lang
  localStorage.setItem(LOCALE_KEY, lang)
}

const translations = {
  es: {
    // Header
    appName: 'Resume Builder',
    autoSave: 'Tu progreso se guarda automáticamente',
    btnNew: 'Nuevo',

    // Saves section
    savesSection: 'Mis Curriculums',
    savePlaceholder: 'Nombre para guardar...',
    btnGuardar: 'Guardar',
    btnExportJSON: 'Exportar JSON',
    btnImportJSON: 'Importar JSON',
    btnCargar: 'Cargar',
    btnSyncTitle: 'Actualizar con datos actuales',
    noSaves: 'No hay resumes guardados aún',
    invalidJSON: 'El archivo no es un JSON válido de resume.',
    confirmLoad: (name) => `¿Cargar "${name}"? Se perderán los cambios no guardados.`,
    confirmClear: '¿Limpiar todo y empezar un nuevo resume?',
    defaultSaveName: 'Resume sin nombre',

    // Personal
    personalSection: 'Información Personal',
    phName: 'Nombre Completo *',
    phAddress: 'Dirección / Ubicación',
    phPhone: 'Teléfono',
    phEmail: 'Correo electrónico',
    phWebsite: 'Sitio web (www.tusitio.com)',

    // Summary
    summarySection: 'Perfil profesional',
    summaryEmpty: 'Sin resumen — clic para agregar',
    editHint: '✎ Editar',

    // Work
    workSection: 'Experiencia Laboral',
    dragTitle: 'Arrastra para reordenar',
    moveUp: 'Mover arriba',
    moveDown: 'Mover abajo',
    expand: 'Expandir',
    collapse: 'Colapsar',
    position: 'Puesto',
    phJobTitle: 'Puesto / Cargo',
    phCompany: 'Empresa',
    dateStart: 'Inicio',
    dateEnd: 'Fin',
    dateMon: 'Mes',
    dateYear: 'Año',
    present: 'Presente',
    roleDescLabel: 'Descripción del Puesto',
    optional: '(opcional)',
    descEmpty: 'Sin descripción — clic para agregar',
    techLabel: 'Tecnologías',
    phTech: 'Agrega y presiona Enter o coma',
    bulletsLabel: 'Puntos Clave',
    bulletsEmpty: 'Sin puntos — clic para agregar',
    btnAddWork: '+ Agregar Empleo',

    // Education
    educationSection: 'Educación',
    degree: 'Grado',
    phDegree: 'Título / Carrera',
    phSchool: 'Escuela / Universidad',
    phLicense: 'Cédula Profesional (opcional)',
    bulletsOptional: 'Puntos Clave',
    btnAddEdu: '+ Agregar Educación',

    // Additional
    additionalSection: 'Información Adicional',
    skillsLabel: 'Habilidades Técnicas',
    phSkills: 'ej. CAD, Python, Análisis Estructural',
    softSkillsLabel: 'Habilidades Blandas',
    phSoftSkills: 'ej. Liderazgo, Comunicación, Trabajo en equipo',

    // Certifications
    certsSection: 'Certificaciones',
    phCertName: 'Nombre de la certificación',
    phCertId: 'N° de acreditación (opcional)',
    phCertIssuer: 'Organismo emisor (opcional)',
    certsDateIssued: 'Emisión',
    certsDateExpires: 'Expiración',
    certNoExpiry: 'No expira',
    btnAddCert: '+ Agregar Certificación',
    previewCerts: 'Certificaciones',
    previewCertId: 'ID:',
    phCertNotes: 'Notas adicionales (opcional)',

    // Languages
    langsSection: 'Idiomas',
    phLangName: 'Idioma',
    phLangLevel: 'Nivel',
    btnAddLang: '+ Agregar Idioma',
    langLevelNative: 'Nativo',
    phLangNotes: 'Notas (opcional)',

    // Download
    downloadPDF: 'Descargar PDF',

    // Modals — Role Description
    roleDescModalTitle: 'Descripción del Puesto',
    roleDescModalHint: 'Breve descripción del rol o contexto (opcional).',
    roleDescModalPh: 'Lideré el equipo de backend responsable de construir la plataforma API...',
    chars: 'caracteres',
    btnCancel: 'Cancelar',
    btnSave: 'Guardar',

    // Modals — Summary
    summaryModalTitle: 'Editar Resumen',
    summaryModalHint: 'Escribe un breve resumen profesional.',
    summaryModalPh: 'Profesional orientado a resultados con X años de experiencia en...',

    // Modals — Bullets
    bulletsModalTitle: 'Editar Puntos Clave',
    bulletPh: (n) => `Punto ${n}...`,
    bulletCount: (n) => `${n} punto(s)`,
    btnAddBullet: '+ Agregar Punto',
    deleteBullet: 'Eliminar',

    // Resume preview section headers
    previewSummary: 'Perfil profesional',
    previewWork: 'Experiencia Laboral',
    previewEducation: 'Educación',
    previewAdditional: 'Información Adicional',
    previewLicense: 'Cédula Profesional:',
    previewTech: 'Tecnologías:',
    previewEmpty: 'Comienza a llenar el formulario\npara ver tu resume aquí',

    // Additional info labels in preview
    additionalSkills: 'Habilidades Técnicas',
    additionalSoftSkills: 'Habilidades Blandas',
    previewLangs: 'Idiomas',

    // Months
    months: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
    monthsShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
  },
  en: {
    // Header
    appName: 'Resume Builder',
    autoSave: 'Your progress is saved automatically',
    btnNew: 'New',

    // Saves section
    savesSection: 'My Resumes',
    savePlaceholder: 'Name to save as...',
    btnGuardar: 'Save',
    btnExportJSON: 'Export JSON',
    btnImportJSON: 'Import JSON',
    btnCargar: 'Load',
    btnSyncTitle: 'Update with current data',
    noSaves: 'No saved resumes yet',
    invalidJSON: 'The file is not a valid resume JSON.',
    confirmLoad: (name) => `Load "${name}"? Unsaved changes will be lost.`,
    confirmClear: 'Clear everything and start a new resume?',
    defaultSaveName: 'Untitled Resume',

    // Personal
    personalSection: 'Personal Info',
    phName: 'Full Name *',
    phAddress: 'Address / Location',
    phPhone: 'Phone',
    phEmail: 'Email',
    phWebsite: 'Website (www.yoursite.com)',

    // Summary
    summarySection: 'Summary',
    summaryEmpty: 'No summary yet — click to add',
    editHint: '✎ Edit',

    // Work
    workSection: 'Work Experience',
    dragTitle: 'Drag to reorder',
    moveUp: 'Move up',
    moveDown: 'Move down',
    expand: 'Expand',
    collapse: 'Collapse',
    position: 'Position',
    phJobTitle: 'Job Title',
    phCompany: 'Company Name',
    dateStart: 'Start',
    dateEnd: 'End',
    dateMon: 'Mon',
    dateYear: 'Year',
    present: 'Present',
    roleDescLabel: 'Role Description',
    optional: '(optional)',
    descEmpty: 'No description yet — click to add',
    techLabel: 'Technologies',
    phTech: 'Add, press Enter or comma',
    bulletsLabel: 'Bullet Points',
    bulletsEmpty: 'No bullets yet — click to add',
    btnAddWork: '+ Add Work Entry',

    // Education
    educationSection: 'Education',
    degree: 'Degree',
    phDegree: 'Degree / Qualification',
    phSchool: 'School / University',
    phLicense: 'Professional License No. (optional)',
    bulletsOptional: 'Bullet Points',
    btnAddEdu: '+ Add Education Entry',

    // Additional
    additionalSection: 'Additional Information',
    skillsLabel: 'Technical Skills',
    phSkills: 'e.g. CAD, Python, Structural Analysis',
    softSkillsLabel: 'Soft Skills',
    phSoftSkills: 'e.g. Leadership, Communication, Teamwork',

    // Certifications
    certsSection: 'Certifications',
    phCertName: 'Certification name',
    phCertId: 'Credential ID (optional)',
    phCertIssuer: 'Issuing organization (optional)',
    certsDateIssued: 'Issued',
    certsDateExpires: 'Expires',
    certNoExpiry: 'No expiry',
    btnAddCert: '+ Add Certification',
    previewCerts: 'Certifications',
    previewCertId: 'ID:',
    phCertNotes: 'Additional notes (optional)',

    // Languages
    langsSection: 'Languages',
    phLangName: 'Language',
    phLangLevel: 'Level',
    btnAddLang: '+ Add Language',
    langLevelNative: 'Native',
    phLangNotes: 'Notes (optional)',

    // Download
    downloadPDF: 'Download PDF',

    // Modals — Role Description
    roleDescModalTitle: 'Role Description',
    roleDescModalHint: 'Brief description of the role or context (optional).',
    roleDescModalPh: 'Led the backend team responsible for building the core API platform...',
    chars: 'chars',
    btnCancel: 'Cancel',
    btnSave: 'Save',

    // Modals — Summary
    summaryModalTitle: 'Edit Summary',
    summaryModalHint: 'Write a brief professional summary.',
    summaryModalPh: 'Results-driven professional with X years of experience in...',

    // Modals — Bullets
    bulletsModalTitle: 'Edit Bullet Points',
    bulletPh: (n) => `Bullet ${n}...`,
    bulletCount: (n) => `${n} bullet(s)`,
    btnAddBullet: '+ Add Bullet',
    deleteBullet: 'Delete',

    // Resume preview section headers
    previewSummary: 'Summary',
    previewWork: 'Work Experience',
    previewEducation: 'Education',
    previewAdditional: 'Additional Information',
    previewLicense: 'Professional License:',
    previewTech: 'Technologies:',
    previewEmpty: 'Start filling the form to see\nyour resume preview here',

    // Additional info labels in preview
    additionalSkills: 'Technical Skills',
    additionalSoftSkills: 'Soft Skills',
    previewLangs: 'Languages',

    // Months
    months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    monthsShort: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  },
}

function t(key, ...args) {
  const val = translations[locale.value]?.[key] ?? translations.en[key] ?? key
  return typeof val === 'function' ? val(...args) : val
}

export function useLocale() {
  return { locale, setLocale, t }
}
