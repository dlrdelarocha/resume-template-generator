import { reactive, watch } from 'vue'

const STORAGE_KEY = 'resume-typography'

const DEFAULTS = {
  fontSize:   13,     // px — base font size for the resume page
  nameSize:   1.85,   // em — name heading size
  lineHeight: 1.2,    // unitless multiplier
  paddingX:   38,     // px — left & right padding of the resume page
  color:      '#6B2FA0',
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS }
  } catch {
    return { ...DEFAULTS }
  }
}

const typography = reactive(load())

watch(
  () => JSON.stringify(typography),
  (val) => localStorage.setItem(STORAGE_KEY, val),
  { deep: true }
)

function resetTypography() {
  Object.assign(typography, DEFAULTS)
}

// Derive a lighter tint from the primary color for dividers / subtle text
function hexToRgb(hex) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return { r, g, b }
}

function lighten(hex, amount = 0.45) {
  const { r, g, b } = hexToRgb(hex)
  const lr = Math.round(r + (255 - r) * amount)
  const lg = Math.round(g + (255 - g) * amount)
  const lb = Math.round(b + (255 - b) * amount)
  return `rgb(${lr}, ${lg}, ${lb})`
}

// Returns an object of CSS custom properties to bind inline on .resume-page
function cssVars(t) {
  return {
    '--primary':       t.color,
    '--divider':       lighten(t.color, 0.4),
    '--resume-fs':     t.fontSize + 'px',
    '--resume-name-fs': t.nameSize + 'em',
    '--resume-lh':     t.lineHeight,
    '--resume-px':     t.paddingX + 'px',
  }
}

export function useTypography() {
  return { typography, resetTypography, cssVars, DEFAULTS }
}
