<template>
  <div class="app">
    <FormPanel @download="downloadPDF" />
    <ResumePreview />
  </div>
</template>

<script setup>
import { nextTick } from 'vue'
import html2pdf from 'html2pdf.js'
import FormPanel from './components/FormPanel.vue'
import ResumePreview from './components/ResumePreview.vue'
import { useResume } from './composables/useResume.js'

const { personal } = useResume()

function downloadPDF() {
  nextTick(() => {
    const element = document.getElementById('resume-preview')
    if (!element) return

    const name     = personal.name.trim() || 'resume'
    const filename = name.replace(/\s+/g, '_') + '_resume.pdf'

    // Clone outside any scrollable container so html2canvas captures full height
    // Width 794px = A4 at 96dpi (210mm) so left/right padding is symmetric
    const clone = element.cloneNode(true)
    clone.style.width = '794px'
    clone.style.backgroundImage = 'none'   // quita la línea de página del preview
    clone.style.minHeight = '0'            // evita página en blanco al final
    const holder = document.createElement('div')
    holder.style.cssText = 'position:absolute;top:0;left:-9999px;width:794px;background:#fff;'
    holder.appendChild(clone)
    document.body.appendChild(holder)

    // A4 a 96dpi exacto: 210mm = 794px, 297mm = 1123px
    // Usar px como unidad para que jsPDF corte exactamente donde el browser lo hace
    html2pdf().set({
      margin:      [20, 0, 0, 0],  // 20px top margin en páginas 2+
      filename,
      image:       { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, windowWidth: 794 },
      jsPDF:       { unit: 'px', format: [794, 1123], orientation: 'portrait', hotfixes: ['px_scaling'] },
      pagebreak:   { mode: ['css', 'legacy'], avoid: '.resume-entry, .resume-section-title, .resume-additional-block' },
    }).from(clone).save().finally(() => {
      document.body.removeChild(holder)
    })
  })
}
</script>

<style scoped>
.app {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

@media (max-width: 860px) {
  .app {
    flex-direction: column;
    height: auto;
    overflow: visible;
  }
}
</style>
