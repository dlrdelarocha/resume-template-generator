<template>
  <main class="preview-panel" ref="panelEl">

    <!-- Typography toolbar -->
    <div class="typo-toolbar">
      <label class="typo-item">
        <span class="typo-label">Name <em>{{ typography.nameSize.toFixed(2) }}em</em></span>
        <input type="range" min="1.2" max="3.0" step="0.05"
               v-model.number="typography.nameSize" class="typo-range" />
      </label>

      <label class="typo-item">
        <span class="typo-label">Size <em>{{ typography.fontSize }}px</em></span>
        <input type="range" min="10" max="18" step="0.5"
               v-model.number="typography.fontSize" class="typo-range" />
      </label>

      <label class="typo-item">
        <span class="typo-label">Spacing <em>{{ typography.lineHeight.toFixed(2) }}</em></span>
        <input type="range" min="1.0" max="1.8" step="0.05"
               v-model.number="typography.lineHeight" class="typo-range" />
      </label>

      <label class="typo-item">
        <span class="typo-label">Margin <em>{{ typography.paddingX }}px</em></span>
        <input type="range" min="10" max="70" step="2"
               v-model.number="typography.paddingX" class="typo-range" />
      </label>

      <label class="typo-item typo-color-item">
        <span class="typo-label">Color</span>
        <input type="color" v-model="typography.color" class="typo-color" />
      </label>

      <button class="typo-reset" @click="resetTypography" title="Reset to defaults">↺</button>
    </div>

    <div class="preview-scroll">

      <!-- Empty state -->
      <div v-if="isEmpty" class="empty-state">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#C0A0D8" stroke-width="1">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
        <p style="white-space: pre-line">{{ t('previewEmpty') }}</p>
      </div>

      <!-- Resume -->
      <div v-else class="page-scale-wrapper" :style="wrapperStyle">
      <div class="page-breaks-overlay" :style="pageStyle" aria-hidden="true">
        <div v-for="n in pageCount" :key="n" class="page-break-gap" :style="{ top: (n * PAGE_MM_PX) + 'px' }"></div>
      </div>
      <div id="resume-preview" class="resume-page" ref="pageEl" :style="{ ...pageStyle, ...resumeVars, minHeight: PAGE_MM_PX + 'px' }">

        <!-- Header -->
        <h1 class="resume-name">{{ personal.name || 'YOUR NAME' }}</h1>

        <p v-if="contactParts.length" class="resume-contact">
          <template v-for="(part, i) in contactParts" :key="i">
            <a v-if="part.href" :href="part.href" target="_blank" rel="noopener noreferrer" class="contact-link">{{ part.text }}</a>
            <span v-else>{{ part.text }}</span>
            <span v-if="i < contactParts.length - 1" class="sep">&bull;</span>
          </template>
        </p>

        <hr class="resume-divider">

        <!-- Summary -->
        <template v-if="summary.text">
          <section class="resume-section">
            <h2 class="resume-section-title">{{ t('previewSummary') }}</h2>
            <p class="resume-summary">{{ summary.text }}</p>
          </section>
          <hr v-if="filledWork.length || filledEducation.length || filledAdditional.length" class="resume-divider">
        </template>

        <!-- Work Experience -->
        <template v-if="filledWork.length">
          <section class="resume-section">
            <h2 class="resume-section-title">{{ t('previewWork') }}</h2>
            <div v-for="(entry, i) in filledWork" :key="i" class="resume-entry">
              <div class="resume-entry-header">
                <span class="resume-entry-title">
                  {{ entry.title }}<template v-if="entry.title && entry.company">, </template>{{ entry.company }}
                </span>
                <span v-if="entryDates(entry)" class="resume-entry-dates">{{ entryDates(entry) }}</span>
              </div>
              <p v-if="entry.description" class="resume-entry-description">{{ entry.description }}</p>
              <ul v-if="filledBullets(entry.bullets).length" class="resume-bullets">
                <li v-for="(b, j) in filledBullets(entry.bullets)" :key="j">{{ b }}</li>
              </ul>
              <p v-if="entry.technologies" class="resume-entry-technologies">
                <span class="technologies-label">{{ t('previewTech') }}</span> {{ entry.technologies }}
              </p>
            </div>
          </section>
          <hr v-if="filledEducation.length || filledAdditional.length" class="resume-divider">
        </template>

        <!-- Education -->
        <template v-if="filledEducation.length">
          <section class="resume-section">
            <h2 class="resume-section-title">{{ t('previewEducation') }}</h2>
            <div v-for="(entry, i) in filledEducation" :key="i" class="resume-entry">
              <div class="resume-entry-header">
                <span class="resume-entry-title">{{ entry.degree }}</span>
                <span v-if="entryDates(entry)" class="resume-entry-dates">{{ entryDates(entry) }}</span>
              </div>
              <p v-if="entry.school" class="resume-entry-school">{{ entry.school }}</p>
              <p v-if="entry.license" class="resume-entry-license">{{ t('previewLicense') }} {{ entry.license }}</p>
              <ul v-if="filledBullets(entry.bullets).length" class="resume-bullets">
                <li v-for="(b, j) in filledBullets(entry.bullets)" :key="j">{{ b }}</li>
              </ul>
            </div>
          </section>
          <hr v-if="filledCertifications.length || filledLanguages.length || filledAdditional.length" class="resume-divider">
        </template>

        <!-- Certifications -->
        <template v-if="filledCertifications.length">
          <section class="resume-section">
            <h2 class="resume-section-title">{{ t('previewCerts') }}</h2>
            <div v-for="(cert, i) in filledCertifications" :key="i" class="resume-entry">
              <div class="resume-entry-header">
                <span class="resume-entry-title">{{ cert.name }}</span>
                <span v-if="certDates(cert)" class="resume-entry-dates">{{ certDates(cert) }}</span>
              </div>
              <p v-if="cert.credentialId || cert.issuer" class="resume-cert-meta">
                <template v-if="cert.credentialId">
                  <span class="resume-cert-id-label">{{ t('previewCertId') }}</span> {{ cert.credentialId }}
                </template>
                <template v-if="cert.credentialId && cert.issuer"> · </template>
                <template v-if="cert.issuer">{{ cert.issuer }}</template>
              </p>
              <p v-if="cert.notes && cert.notes.trim()" class="resume-cert-notes">{{ cert.notes }}</p>
            </div>
          </section>
          <hr v-if="filledLanguages.length || filledAdditional.length" class="resume-divider">
        </template>

        <!-- Languages -->
        <template v-if="filledLanguages.length">
          <section class="resume-section">
            <h2 class="resume-section-title">{{ t('previewLangs') }}</h2>
            <!-- Inline layout when no language has notes -->
            <p v-if="!filledLanguages.some(l => l.notes && l.notes.trim())" class="resume-languages">
              <span v-for="(lang, i) in filledLanguages" :key="i" class="resume-lang-item">
                <strong>{{ lang.name }}</strong><template v-if="lang.level"> <span class="lang-level">{{ lang.level }}</span></template><template v-if="i < filledLanguages.length - 1"> &nbsp;·&nbsp; </template>
              </span>
            </p>
            <!-- List layout when at least one language has notes -->
            <div v-else>
              <div v-for="(lang, i) in filledLanguages" :key="i" class="resume-lang-entry">
                <span class="resume-lang-entry-name"><strong>{{ lang.name }}</strong><template v-if="lang.level"> <span class="lang-level">{{ lang.level }}</span></template></span>
                <p v-if="lang.notes && lang.notes.trim()" class="resume-lang-notes">{{ lang.notes }}</p>
              </div>
            </div>
          </section>
          <hr v-if="filledAdditional.length" class="resume-divider">
        </template>

        <!-- Additional Information -->

        <template v-if="filledAdditional.length">
          <section class="resume-section">
            <h2 class="resume-section-title">{{ t('previewAdditional') }}</h2>
            <div v-for="(item, i) in filledAdditional" :key="i" class="resume-additional-block">
              <p class="resume-additional-label">{{ item.label }}</p>
              <ul class="resume-skills-grid">
                <li v-for="(skill, j) in splitSkills(item.value)" :key="j">{{ skill }}</li>
              </ul>
            </div>
          </section>
        </template>

      </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useResume } from '../composables/useResume.js'
import { useTypography } from '../composables/useTypography.js'
import { useLocale } from '../composables/useLocale.js'

const {
  personal, summary,
  contactParts, filledWork, filledEducation, filledAdditional, filledCertifications, filledLanguages,
  isEmpty, filledBullets, entryDates,
} = useResume()

const { typography, resetTypography, cssVars } = useTypography()
const { t } = useLocale()

// CSS custom properties applied inline on .resume-page
const resumeVars = computed(() => cssVars(typography))

// Helper to split skills CSV
function splitSkills(csv) {
  return (csv || '').split(',').map(s => s.trim()).filter(Boolean)
}

// Helper to format certification dates
function fmtMon(ym) {
  if (!ym) return ''
  const [year, month] = ym.split('-')
  if (year && month) return `${t('months')[parseInt(month, 10) - 1]} ${year}`
  return year || ''
}

function certDates(cert) {
  const issued  = fmtMon(cert.dateIssued)
  const expires = cert.noExpiry ? t('certNoExpiry') : fmtMon(cert.dateExpires)
  if (issued && expires) return `${issued} – ${expires}`
  return issued || expires || ''
}

// ---- Scale preview to match PDF proportions ----
const PAGE_W = 794
// jsPDF con unit:'px', format:[794,1123], hotfixes:['px_scaling']
// hotfixes divide por devicePixelRatio en tiempo de ejecución del PDF
// Para el visor usamos el mismo cálculo: 1123 / devicePixelRatio
const PAGE_MM_PX = Math.round(1123 / window.devicePixelRatio)

const panelEl  = ref(null)
const pageEl   = ref(null)
const panelW   = ref(1000)
const pageH    = ref(PAGE_MM_PX)

function measure() {
  if (panelEl.value) panelW.value = panelEl.value.clientWidth
  if (pageEl.value)  pageH.value  = pageEl.value.scrollHeight
}

onMounted(() => { measure(); window.addEventListener('resize', measure) })
onUnmounted(() => window.removeEventListener('resize', measure))

const scale      = computed(() => Math.min(1, (panelW.value - 32) / PAGE_W))
const pageCount  = computed(() => Math.floor(pageH.value / PAGE_MM_PX))

const pageStyle    = computed(() => ({ transform: `scale(${scale.value})`, transformOrigin: 'top center' }))
const wrapperStyle = computed(() => ({ width: PAGE_W + 'px', height: Math.round(pageH.value * scale.value) + 'px' }))
</script>

<style scoped>
/* ---- Panel shell ---- */
.preview-panel {
  flex: 1;
  overflow-y: auto;
  background: #3a3a4a;
  display: flex;
  flex-direction: column;
}

/* ---- Typography toolbar ---- */
.typo-toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 16px;
  background: #2c2c3a;
  border-bottom: 1px solid #4a4a5a;
  flex-shrink: 0;
  flex-wrap: wrap;
}

.typo-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
  cursor: default;
}

.typo-label {
  font-size: 0.68rem;
  color: #9990aa;
  font-family: system-ui, sans-serif;
  white-space: nowrap;
}

.typo-label em {
  font-style: normal;
  color: #c8b8e0;
  margin-left: 4px;
}

.typo-range {
  -webkit-appearance: none;
  appearance: none;
  width: 90px;
  height: 4px;
  border-radius: 2px;
  background: #4a4a5a;
  outline: none;
  cursor: pointer;
}

.typo-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #9b59c8;
  cursor: pointer;
  border: 2px solid #c0a0d8;
  transition: background 0.15s;
}

.typo-range::-webkit-slider-thumb:hover {
  background: #b07de0;
}

.typo-range::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #9b59c8;
  cursor: pointer;
  border: 2px solid #c0a0d8;
}

.typo-color-item { justify-content: center; }

.typo-color {
  width: 36px;
  height: 24px;
  border: none;
  border-radius: 4px;
  padding: 0;
  cursor: pointer;
  background: transparent;
}

.typo-reset {
  margin-left: auto;
  background: none;
  border: 1px solid #4a4a5a;
  color: #9990aa;
  border-radius: 4px;
  padding: 3px 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  align-self: flex-end;
}

.typo-reset:hover {
  color: #c8b8e0;
  border-color: #9990aa;
}

/* ---- Scroll area ---- */
.preview-scroll {
  flex: 1;
  padding: 24px 16px;
  display: flex;
  justify-content: center;
  min-height: 0;
  align-items: flex-start;
  overflow-y: auto;
}

/* ---- Empty state ---- */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 60vh;
  color: #9990aa;
  text-align: center;
  font-size: 0.9rem;
  line-height: 1.7;
}

/* ---- Scale wrapper (compensates transform height) ---- */
.page-scale-wrapper {
  flex-shrink: 0;
  overflow: visible;
  position: relative;
}

/* ---- Page break overlay (visual only, no interaction) ---- */
.page-breaks-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 794px;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.page-break-gap {
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background: rgba(180, 130, 220, 0.55);
  transform: translateY(-1px);
}

/* ---- Resume page ---- */
.resume-page {
  position: relative;
  z-index: 1;
  width: 794px;                /* A4 a 96dpi = 210mm */
  max-width: 100%;
  background-color: var(--bg-resume);
  min-height: 749px; /* fallback, sobreescrito por inline style */
  padding: 20px var(--resume-px, 38px) 38px;
  font-family: var(--font-resume);
  color: var(--text);
  font-size: var(--resume-fs, 13px);
  line-height: var(--resume-lh, 1.2);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.45);
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* Header */
.resume-name {
  font-size: var(--resume-name-fs, 1.85em);
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
  text-align: center;
  letter-spacing: 2px;
  line-height: 1.1;
  margin-bottom: 5px;
}

.resume-contact {
  text-align: center;
  font-family: var(--font-ui);
  font-size: 0.78em;
  color: var(--text-subtle);
  line-height: 1.5;
}

.sep {
  margin: 0 5px;
  color: var(--divider);
}

.contact-link {
  color: var(--primary);
  text-decoration: none;
  transition: opacity 0.15s;
}

.contact-link:hover {
  opacity: 0.75;
  text-decoration: underline;
}

/* Divider */
.resume-divider {
  border: none;
  border-top: 1.5px solid var(--divider);
  margin: 9px 0;
}

/* Section */
.resume-section { margin-bottom: 2px; }

.resume-section-title {
  font-family: var(--font-ui);
  font-size: 0.7em;
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 1.6px;
  padding-bottom: 4px;
  border-bottom: 1.5px solid var(--divider);
  margin-bottom: 8px;
}

/* Summary */
.resume-summary {
  font-size: 0.84em;
  line-height: var(--resume-lh, 1.2);
  white-space: pre-line;
  word-break: break-word;
  overflow-wrap: break-word;
}

/* Entry */
.resume-entry {
  margin-bottom: 9px;
  break-inside: avoid;
  page-break-inside: avoid;
}

.resume-entry-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
}

.resume-entry-title {
  font-weight: 700;
  font-size: 0.93em;
}

.resume-entry-school {
  font-family: var(--font-ui);
  font-size: 0.82em;
  margin: 1px 0;
}

.resume-entry-license {
  font-family: var(--font-ui);
  font-size: 0.77em;
  color: var(--text-subtle);
  margin: 1px 0;
}

.resume-entry-dates {
  font-family: var(--font-ui);
  font-size: 0.78em;
  color: var(--primary);
  font-weight: 700;
  font-style: italic;
  white-space: nowrap;
}

/* Role description */
.resume-entry-description {
  font-size: 0.82em;
  line-height: var(--resume-lh, 1.2);
  color: var(--text);
  margin: 2px 0 4px;
  white-space: pre-line;
  word-break: break-word;
}

/* Technologies */
.resume-entry-technologies {
  font-family: var(--font-ui);
  font-size: 0.77em;
  font-style: italic;
  color: var(--text-subtle);
  margin: 2px 0 3px;
  word-break: break-word;
  overflow-wrap: break-word;
}

.technologies-label {
  font-weight: 700;
  font-style: normal;
  color: var(--primary);
}

/* Bullets */
.resume-bullets {
  margin: 3px 0 0 18px;
  padding: 0;
  list-style: disc;
}

.resume-bullets li {
  font-size: 0.82em;
  line-height: var(--resume-lh, 1.2);
  margin-bottom: 3px;
}

/* Certifications */
.resume-cert-meta {
  font-family: var(--font-ui);
  font-size: 0.78em;
  color: var(--text-subtle);
  margin: 1px 0 3px;
}

.resume-cert-id-label {
  font-weight: 700;
  color: var(--primary);
}

.resume-cert-notes {
  font-size: 0.82em;
  line-height: var(--resume-lh, 1.2);
  color: var(--text);
  margin: 2px 0 5px;
  white-space: pre-line;
}

/* Languages */
.resume-languages {
  font-size: 0.84em;
  line-height: 1.6;
}

.resume-lang-item {
  white-space: nowrap;
}

.lang-level {
  display: inline-block;
  font-size: 0.82em;
  font-weight: 700;
  color: var(--primary);
  background: rgba(107, 47, 160, 0.08);
  border-radius: 3px;
  padding: 0 4px;
  font-style: normal;
}

/* Additional */
.resume-additional-block {
  margin-bottom: 5px;
}

.resume-additional-label {
  font-family: var(--font-ui);
  font-size: 0.65em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--primary);
  margin: 0 0 2px;
}

.resume-skills-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: 16px;
  row-gap: 0;
  list-style: disc;
  margin: 0 0 2px 18px;
  padding: 0;
}

.resume-skills-grid li {
  font-size: 0.82em;
  line-height: 1.45;
}

/* ---- Responsive ---- */
@media (max-width: 900px) {
  .preview-panel { overflow-y: visible; }
  .preview-scroll { padding: 16px 8px; }
  .resume-page { padding: 20px var(--resume-px, 20px) 30px; }
  .typo-toolbar { gap: 10px; }
  .typo-range { width: 70px; }
}

/* ---- Print fallback ---- */
@media print {
  .preview-panel { width: 100%; overflow: visible; }
  .typo-toolbar { display: none; }
  .preview-scroll { padding: 0; }
  .resume-page { box-shadow: none; width: 100%; padding: 0; }
}
</style>
