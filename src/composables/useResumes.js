import { ref } from 'vue'

const SAVES_KEY = 'resume-saves'

function loadSaves() {
  try { return JSON.parse(localStorage.getItem(SAVES_KEY)) || [] }
  catch { return [] }
}

const saves = ref(loadSaves())

function persist() {
  localStorage.setItem(SAVES_KEY, JSON.stringify(saves.value))
}

function saveResume(name, snapshot) {
  const entry = {
    id:      Date.now().toString(),
    name:    name || 'Resume sin nombre',
    savedAt: new Date().toISOString(),
    data:    snapshot,
  }
  saves.value.unshift(entry)
  persist()
  return entry.id
}

function deleteSave(id) {
  saves.value = saves.value.filter(s => s.id !== id)
  persist()
}

function updateSave(id, snapshot) {
  const entry = saves.value.find(s => s.id === id)
  if (!entry) return
  entry.data    = snapshot
  entry.savedAt = new Date().toISOString()
  persist()
}

function exportJSON(snapshot, filename) {
  const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function formatSaveDate(iso) {
  return new Date(iso).toLocaleString('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function useResumes() {
  return { saves, saveResume, updateSave, deleteSave, exportJSON, formatSaveDate }
}
