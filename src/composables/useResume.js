import { reactive, computed, watch } from 'vue'
import { useLocale } from './useLocale.js'

const STORAGE_KEY = 'resume-builder-data'

let _wid = 0
function defaultWork() {
  return { _id: ++_wid, title: '', company: '', description: '', dateStart: '', dateEnd: '', datePresent: false, technologies: '', bullets: ['', '', ''] }
}

function defaultEducation() {
  return { degree: '', school: '', license: '', dateStart: '', dateEnd: '', datePresent: false, bullets: [''] }
}

const { t } = useLocale()

function fmtMonth(ym) {
  if (!ym) return ''
  const [year, month] = ym.split('-')
  if (year && month) return `${t('months')[parseInt(month, 10) - 1]} ${year}`
  return year || ''
}

function entryDates(entry) {
  // New picker fields take priority; fall back to legacy free-text `dates` field
  if (!entry.dateStart && !entry.dateEnd && !entry.datePresent) {
    return entry.dates || ''
  }
  const start = fmtMonth(entry.dateStart)
  const end   = entry.datePresent ? t('present') : fmtMonth(entry.dateEnd)
  if (start && end)  return `${start} – ${end}`
  if (start)         return start
  return end
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const saved = loadFromStorage()

const personal = reactive(saved?.personal ?? {
  name: '', address: '', phone: '', email: '', website: '',
})

const summary = reactive({ text: saved?.summary?.text ?? saved?.summary ?? '' })

const work = reactive(
  saved?.work?.length
    ? saved.work.map(e => e._id ? e : { ...e, _id: ++_wid })
    : [defaultWork(), defaultWork()]
)

const education = reactive(
  saved?.education?.length ? saved.education : [defaultEducation()]
)

const additional = reactive(saved?.additional ?? {
  skills: '', softSkills: '',
})

function defaultCertification() {
  return { name: '', credentialId: '', issuer: '', dateIssued: '', dateExpires: '', noExpiry: false, notes: '' }
}

const certifications = reactive(
  saved?.certifications?.length ? saved.certifications : []
)

function defaultLanguage() {
  return { name: '', level: '', notes: '' }
}

const languages = reactive(
  saved?.languages?.length
    ? saved.languages
    : [
        { name: 'Inglés',  level: 'B2' },
        { name: 'Francés', level: 'A2' },
        { name: 'Japonés', level: 'A1' },
      ]
)

// Auto-save to localStorage on any change
watch(
  () => JSON.stringify({ personal, summary, work, education, additional, certifications, languages }),
  (val) => localStorage.setItem(STORAGE_KEY, val),
  { deep: true }
)

// --- Work ---
function addWork() {
  work.push(defaultWork())
}

function removeWork(index) {
  work.splice(index, 1)
}

// --- Education ---
function addEducation() {
  education.push(defaultEducation())
}

function removeEducation(index) {
  education.splice(index, 1)
}

// --- Bullets ---
function removeBullet(arr, index) {
  arr.splice(index, 1)
}

// --- Certifications ---
function addCertification() {
  certifications.push(defaultCertification())
}

function removeCertification(index) {
  certifications.splice(index, 1)
}

// --- Languages ---
function addLanguage() {
  languages.push(defaultLanguage())
}

function removeLanguage(index) {
  languages.splice(index, 1)
}

// --- Clear all ---
function clearAll() {
  Object.assign(personal, { name: '', address: '', phone: '', email: '', website: '' })
  summary.text = ''
  work.splice(0, work.length, defaultWork(), defaultWork())
  education.splice(0, education.length, defaultEducation())
  Object.assign(additional, { skills: '', softSkills: '' })
  certifications.splice(0, certifications.length)
  languages.splice(0, languages.length, defaultLanguage())
  localStorage.removeItem(STORAGE_KEY)
}

// --- Computed helpers for the preview ---
const contactParts = computed(() => {
  const parts = []
  if (personal.address) parts.push({ text: personal.address, href: null })
  if (personal.phone) {
    const digits = personal.phone.replace(/\D/g, '')
    parts.push({ text: personal.phone, href: `https://wa.me/${digits}` })
  }
  if (personal.email)   parts.push({ text: personal.email, href: null })
  if (personal.website) {
    const raw = personal.website.trim()
    const href = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
    parts.push({ text: raw, href })
  }
  return parts
})

const filledWork = computed(() =>
  work.filter(e => e.title || e.company)
)

const filledEducation = computed(() =>
  education.filter(e => e.degree || e.school)
)

const filledAdditional = computed(() =>
  [
    { label: t('additionalSkills'), value: additional.skills },
    { label: t('additionalSoftSkills'), value: additional.softSkills },
  ].filter(item => item.value?.trim())
)

const filledCertifications = computed(() =>
  certifications.filter(c => c.name?.trim())
)

const filledLanguages = computed(() =>
  languages.filter(l => l.name?.trim())
)

const isEmpty = computed(() =>
  !personal.name    &&
  !personal.address &&
  !personal.phone   &&
  !personal.email   &&
  !personal.website &&
  !summary.text     &&
  filledWork.value.length === 0            &&
  filledEducation.value.length === 0       &&
  filledLanguages.value.length === 0       &&
  filledCertifications.value.length === 0  &&
  filledAdditional.value.length === 0
)

function filledBullets(bullets) {
  return (bullets || []).filter(b => b.trim())
}

function getSnapshot() {
  return JSON.parse(JSON.stringify({ personal, summary, work, education, additional, certifications, languages }))
}

function restoreSnapshot(snap) {
  Object.assign(personal, snap.personal ?? {})
  summary.text = snap.summary?.text ?? snap.summary ?? ''
  const snapWork = snap.work?.length
    ? snap.work.map(e => e._id ? e : { ...e, _id: ++_wid })
    : [defaultWork(), defaultWork()]
  work.splice(0, work.length, ...snapWork)
  education.splice(0, education.length, ...(snap.education?.length ? snap.education : [defaultEducation()]))
  Object.assign(additional, snap.additional ?? {})
  certifications.splice(0, certifications.length, ...(snap.certifications?.length ? snap.certifications : []))
  languages.splice(0, languages.length, ...(snap.languages?.length ? snap.languages : [defaultLanguage()]))
}

export function useResume() {
  return {
    personal,
    summary,
    work,
    education,
    additional,
    certifications,
    languages,
    addWork,
    removeWork,
    addEducation,
    removeEducation,
    removeBullet,
    addCertification,
    removeCertification,
    addLanguage,
    removeLanguage,
    clearAll,
    getSnapshot,
    restoreSnapshot,
    contactParts,
    filledWork,
    filledEducation,
    filledAdditional,
    filledCertifications,
    filledLanguages,
    isEmpty,
    filledBullets,
    entryDates,
  }
}
