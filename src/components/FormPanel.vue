<template>
  <aside class="form-panel">
    <!-- Header -->
    <div class="app-header">
      <div class="app-header-top">
        <div class="app-logo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          {{ t('appName') }}
        </div>
        <div class="header-actions">
          <div class="lang-toggle">
            <button :class="['btn-lang', { active: locale === 'es' }]" @click="setLocale('es')" title="Español">🇲🇽</button>
            <button :class="['btn-lang', { active: locale === 'en' }]" @click="setLocale('en')" title="English">🇺🇸</button>
          </div>
          <button class="btn-clear" @click="confirmClear">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/>
            </svg>
            {{ t('btnNew') }}
          </button>
        </div>
      </div>
      <p class="app-subtitle">{{ t('autoSave') }}</p>
    </div>

    <!-- Form Body -->
    <div class="form-body">

      <!-- Saves -->
      <section class="form-section" :class="{ 'section-collapsed': sections.saves }">
        <h2 class="section-legend" @click="sections.saves = !sections.saves">
          <span class="dot" />{{ t('savesSection') }}
          <SectionChevron :collapsed="sections.saves" />
        </h2>
        <div v-show="!sections.saves" class="section-body">

          <!-- Save current -->
          <div class="save-input-row">
            <input v-model="saveName" type="text" class="field save-name-field"
                   :placeholder="t('savePlaceholder')" @keydown.enter="doSave" />
            <button class="btn-save-action" @click="doSave">{{ t('btnGuardar') }}</button>
          </div>

          <!-- Export / Import -->
          <div class="save-ext-row">
            <button class="btn-ext" @click="doExport">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              {{ t('btnExportJSON') }}
            </button>
            <label class="btn-ext btn-import-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              {{ t('btnImportJSON') }}
              <input type="file" accept=".json" @change="doImport" style="display:none" ref="importInput" />
            </label>
          </div>

          <!-- Saved list -->
          <div v-if="saves.length" class="saves-list">
            <div v-for="s in saves" :key="s.id" class="save-item" :class="{ 'save-item-active': s.id === activeSaveId }">
              <div class="save-item-info">
                <span class="save-item-name">{{ s.name }}</span>
                <span class="save-item-date">{{ formatSaveDate(s.savedAt) }}</span>
              </div>
              <div class="save-item-btns">
                <button class="btn-load" @click="doLoad(s)">{{ t('btnCargar') }}</button>
                <button v-if="s.id === activeSaveId"
                        class="btn-sync" :class="{ 'btn-sync-done': syncingId === s.id }"
                        @click="doSync(s)" :title="t('btnSyncTitle')">
                  <svg v-if="syncingId === s.id" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="sync-icon">
                    <polyline points="23 4 23 10 17 10"/>
                    <polyline points="1 20 1 14 7 14"/>
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                  </svg>
                </button>
                <button class="btn-remove" @click="deleteSave(s.id)">✕</button>
              </div>
            </div>
          </div>
          <p v-else class="no-saves">{{ t('noSaves') }}</p>
        </div>
      </section>

      <!-- Personal Info -->
      <section class="form-section" :class="{ 'section-collapsed': sections.personal }">
        <h2 class="section-legend" @click="sections.personal = !sections.personal">
          <span class="dot" />{{ t('personalSection') }}
          <SectionChevron :collapsed="sections.personal" />
        </h2>
        <div v-show="!sections.personal" class="section-body">
          <input v-model="personal.name"    type="text"  :placeholder="t('phName')"    class="field" />
          <input v-model="personal.address" type="text"  :placeholder="t('phAddress')" class="field" />
          <div class="field-row">
            <input v-model="personal.phone" type="tel"   :placeholder="t('phPhone')"   class="field" />
            <input v-model="personal.email" type="email" :placeholder="t('phEmail')"   class="field" />
          </div>
          <input v-model="personal.website" type="text"  :placeholder="t('phWebsite')" class="field" />
        </div>
      </section>

      <!-- Summary -->
      <section class="form-section" :class="{ 'section-collapsed': sections.summary }">
        <h2 class="section-legend" @click="sections.summary = !sections.summary">
          <span class="dot" />{{ t('summarySection') }}
          <SectionChevron :collapsed="sections.summary" />
        </h2>
        <div v-show="!sections.summary" class="section-body">
          <div class="bullets-preview summary-preview" @click="openSummaryModal">
            <span v-if="summary.text.trim()" class="summary-preview-text">{{ summary.text }}</span>
            <span v-else class="bullets-empty">{{ t('summaryEmpty') }}</span>
            <span class="bullets-edit-hint">{{ t('editHint') }}</span>
          </div>
        </div>
      </section>

      <!-- Work Experience -->
      <section class="form-section" :class="{ 'section-collapsed': sections.work }">
        <h2 class="section-legend" @click="sections.work = !sections.work">
          <span class="dot" />{{ t('workSection') }}
          <SectionChevron :collapsed="sections.work" />
        </h2>
        <div v-show="!sections.work" class="section-body">

        <draggable
          :list="work"
          item-key="_id"
          handle=".drag-handle"
          ghost-class="dragging-ghost"
          animation="180"
        >
          <template #item="{ element: entry, index: i }">
            <div class="entry-block" :class="{ collapsed: workCollapsed[i] }">
              <!-- Header (always visible) -->
              <div class="entry-header" @click="toggleWork(i)">
                <div class="entry-header-left">
                  <span class="drag-handle" :title="t('dragTitle')" @click.stop>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="8" y1="6"  x2="21" y2="6"/>
                      <line x1="8" y1="12" x2="21" y2="12"/>
                      <line x1="8" y1="18" x2="21" y2="18"/>
                      <line x1="3" y1="6"  x2="3.01" y2="6"/>
                      <line x1="3" y1="12" x2="3.01" y2="12"/>
                      <line x1="3" y1="18" x2="3.01" y2="18"/>
                    </svg>
                  </span>
                  <div class="entry-title-group">
                    <span class="entry-company">{{ entry.company || entry.title || `${t('position')} ${i + 1}` }}</span>
                    <span v-if="entry.title && entry.company" class="entry-role">{{ entry.title }}</span>
                  </div>
                </div>
                <div class="entry-header-right" @click.stop>
                  <button class="btn-move" :disabled="i === 0"               @click="moveWork(i, i - 1)" :title="t('moveUp')">↑</button>
                  <button class="btn-move" :disabled="i === work.length - 1" @click="moveWork(i, i + 1)" :title="t('moveDown')">↓</button>
                  <button class="btn-chevron" @click.stop="toggleWork(i)" :title="workCollapsed[i] ? t('expand') : t('collapse')">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                      :style="{ transform: workCollapsed[i] ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                  <button class="btn-remove" @click="removeWorkEntry(i)">✕</button>
                </div>
              </div>

              <!-- Body (collapsible) -->
              <div v-show="!workCollapsed[i]" class="entry-body">
                <input v-model="entry.title"   type="text" :placeholder="t('phJobTitle')" class="field" />
                <input v-model="entry.company" type="text" :placeholder="t('phCompany')"  class="field" />

                <div class="date-row">
                  <div class="date-col">
                    <span class="date-label">{{ t('dateStart') }}</span>
                    <div class="date-selects">
                      <select class="field date-select"
                              :value="getPart(entry.dateStart, 'month')"
                              @change="setPart(entry, 'dateStart', 'month', $event.target.value)">
                        <option value="">{{ t('dateMon') }}</option>
                        <option v-for="(m, idx) in MONTH_OPTS" :key="idx"
                                :value="String(idx+1).padStart(2,'0')">{{ m }}</option>
                      </select>
                      <select class="field date-select"
                              :value="getPart(entry.dateStart, 'year')"
                              @change="setPart(entry, 'dateStart', 'year', $event.target.value)">
                        <option value="">{{ t('dateYear') }}</option>
                        <option v-for="y in YEAR_OPTS" :key="y" :value="String(y)">{{ y }}</option>
                      </select>
                    </div>
                  </div>
                  <div class="date-col">
                    <span class="date-label">{{ t('dateEnd') }}</span>
                    <div class="date-selects" :class="{ 'date-disabled': entry.datePresent }">
                      <select class="field date-select"
                              :value="getPart(entry.dateEnd, 'month')"
                              @change="setPart(entry, 'dateEnd', 'month', $event.target.value)"
                              :disabled="entry.datePresent">
                        <option value="">{{ t('dateMon') }}</option>
                        <option v-for="(m, idx) in MONTH_OPTS" :key="idx"
                                :value="String(idx+1).padStart(2,'0')">{{ m }}</option>
                      </select>
                      <select class="field date-select"
                              :value="getPart(entry.dateEnd, 'year')"
                              @change="setPart(entry, 'dateEnd', 'year', $event.target.value)"
                              :disabled="entry.datePresent">
                        <option value="">{{ t('dateYear') }}</option>
                        <option v-for="y in YEAR_OPTS" :key="y" :value="String(y)">{{ y }}</option>
                      </select>
                    </div>
                    <label class="present-toggle">
                      <input type="checkbox" v-model="entry.datePresent" />
                      {{ t('present') }}
                    </label>
                  </div>
                </div>

                <p class="bullets-label">{{ t('roleDescLabel') }} <span class="optional">{{ t('optional') }}</span></p>
                <div class="bullets-preview summary-preview" @click="openWorkDescModal(i)">
                  <span v-if="entry.description && entry.description.trim()" class="summary-preview-text">{{ entry.description }}</span>
                  <span v-else class="bullets-empty">{{ t('descEmpty') }}</span>
                  <span class="bullets-edit-hint">{{ t('editHint') }}</span>
                </div>

                <p class="bullets-label">{{ t('techLabel') }} <span class="optional">{{ t('optional') }}</span></p>
                <div class="tech-tags-wrap" @click="$refs['ti_'+i][0].focus()">
                  <span v-for="(tech, ti) in getTechs(entry)" :key="ti" class="tech-tag">
                    {{ tech }}
                    <button @click.stop="removeTech(entry, ti)" class="tech-tag-remove">×</button>
                  </span>
                  <input
                    :ref="'ti_'+i"
                    v-model="techInputs[i]"
                    type="text"
                    :placeholder="t('phTech')"
                    class="tech-tag-input"
                    @keydown="onTechKey($event, entry, i)"
                    @blur="onTechBlur(entry, i)"
                  />
                </div>

                <p class="bullets-label">{{ t('bulletsLabel') }}</p>
                <div class="bullets-preview" @click="openBulletModal('work', i)">
                  <template v-if="entry.bullets.filter(b => b.trim()).length">
                    <div v-for="(b, j) in entry.bullets.filter(b => b.trim())" :key="j" class="bullet-preview-item">
                      <span class="bullet-dot">•</span>
                      <span class="bullet-preview-text">{{ b }}</span>
                    </div>
                  </template>
                  <span v-else class="bullets-empty">{{ t('bulletsEmpty') }}</span>
                  <span class="bullets-edit-hint">{{ t('editHint') }}</span>
                </div>
              </div>
            </div>
          </template>
        </draggable>

        <button class="btn-add" @click="addWorkEntry">{{ t('btnAddWork') }}</button>
        </div>
      </section>

      <!-- Education -->
      <section class="form-section" :class="{ 'section-collapsed': sections.education }">
        <h2 class="section-legend" @click="sections.education = !sections.education">
          <span class="dot" />{{ t('educationSection') }}
          <SectionChevron :collapsed="sections.education" />
        </h2>
        <div v-show="!sections.education" class="section-body">

        <div v-for="(entry, i) in education" :key="i" class="entry-block" :class="{ collapsed: eduCollapsed[i] }">
          <!-- Header -->
          <div class="entry-header" @click="toggleEdu(i)">
            <div class="entry-header-left">
              <div class="entry-title-group">
                <span class="entry-company">{{ entry.school || entry.degree || `${t('degree')} ${i + 1}` }}</span>
                <span v-if="entry.degree && entry.school" class="entry-role">{{ entry.degree }}</span>
              </div>
            </div>
            <div class="entry-header-right" @click.stop>
              <button class="btn-chevron" @click.stop="toggleEdu(i)" :title="eduCollapsed[i] ? t('expand') : t('collapse')">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                  :style="{ transform: eduCollapsed[i] ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              <button class="btn-remove" @click="removeEduEntry(i)">✕</button>
            </div>
          </div>

          <!-- Body -->
          <div v-show="!eduCollapsed[i]" class="entry-body">
            <input v-model="entry.degree"  type="text" :placeholder="t('phDegree')"  class="field" />
            <input v-model="entry.school"  type="text" :placeholder="t('phSchool')"  class="field" />
            <input v-model="entry.license" type="text" :placeholder="t('phLicense')" class="field" />

            <div class="date-row">
              <div class="date-col">
                <span class="date-label">{{ t('dateStart') }}</span>
                <div class="date-selects">
                  <select class="field date-select"
                          :value="getPart(entry.dateStart, 'month')"
                          @change="setPart(entry, 'dateStart', 'month', $event.target.value)">
                    <option value="">{{ t('dateMon') }}</option>
                    <option v-for="(m, idx) in MONTH_OPTS" :key="idx"
                            :value="String(idx+1).padStart(2,'0')">{{ m }}</option>
                  </select>
                  <select class="field date-select"
                          :value="getPart(entry.dateStart, 'year')"
                          @change="setPart(entry, 'dateStart', 'year', $event.target.value)">
                    <option value="">{{ t('dateYear') }}</option>
                    <option v-for="y in YEAR_OPTS" :key="y" :value="String(y)">{{ y }}</option>
                  </select>
                </div>
              </div>
              <div class="date-col">
                <span class="date-label">{{ t('dateEnd') }}</span>
                <div class="date-selects" :class="{ 'date-disabled': entry.datePresent }">
                  <select class="field date-select"
                          :value="getPart(entry.dateEnd, 'month')"
                          @change="setPart(entry, 'dateEnd', 'month', $event.target.value)"
                          :disabled="entry.datePresent">
                    <option value="">{{ t('dateMon') }}</option>
                    <option v-for="(m, idx) in MONTH_OPTS" :key="idx"
                            :value="String(idx+1).padStart(2,'0')">{{ m }}</option>
                  </select>
                  <select class="field date-select"
                          :value="getPart(entry.dateEnd, 'year')"
                          @change="setPart(entry, 'dateEnd', 'year', $event.target.value)"
                          :disabled="entry.datePresent">
                    <option value="">{{ t('dateYear') }}</option>
                    <option v-for="y in YEAR_OPTS" :key="y" :value="String(y)">{{ y }}</option>
                  </select>
                </div>
                <label class="present-toggle">
                  <input type="checkbox" v-model="entry.datePresent" />
                  {{ t('present') }}
                </label>
              </div>
            </div>

            <p class="bullets-label">{{ t('bulletsOptional') }} <span class="optional">{{ t('optional') }}</span></p>
            <div class="bullets-preview" @click="openBulletModal('edu', i)">
              <template v-if="entry.bullets.filter(b => b.trim()).length">
                <div v-for="(b, j) in entry.bullets.filter(b => b.trim())" :key="j" class="bullet-preview-item">
                  <span class="bullet-dot">•</span>
                  <span class="bullet-preview-text">{{ b }}</span>
                </div>
              </template>
              <span v-else class="bullets-empty">{{ t('bulletsEmpty') }}</span>
              <span class="bullets-edit-hint">{{ t('editHint') }}</span>
            </div>
          </div>
        </div>

        <button class="btn-add" @click="addEduEntry">{{ t('btnAddEdu') }}</button>
        </div>
      </section>

      <!-- Certifications -->
      <section class="form-section" :class="{ 'section-collapsed': sections.certs }">
        <h2 class="section-legend" @click="sections.certs = !sections.certs">
          <span class="dot" />{{ t('certsSection') }}
          <SectionChevron :collapsed="sections.certs" />
        </h2>
        <div v-show="!sections.certs" class="section-body">
          <div v-for="(cert, ci) in certifications" :key="ci"
               class="entry-block" :class="{ collapsed: certCollapsed[ci] }">
            <div class="entry-header" @click="toggleCert(ci)">
              <div class="entry-header-left">
                <div class="entry-title-group">
                  <span class="entry-company">{{ cert.name || `${t('certsSection')} ${ci + 1}` }}</span>
                  <span v-if="cert.issuer" class="entry-role">{{ cert.issuer }}</span>
                </div>
              </div>
              <div class="entry-header-right" @click.stop>
                <button class="btn-chevron" @click.stop="toggleCert(ci)"
                        :title="certCollapsed[ci] ? t('expand') : t('collapse')">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                    :style="{ transform: certCollapsed[ci] ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                <button class="btn-remove" @click="removeCertEntry(ci)">✕</button>
              </div>
            </div>
            <div v-show="!certCollapsed[ci]" class="entry-body">
              <input v-model="cert.name"         type="text" :placeholder="t('phCertName')"   class="field" />
              <input v-model="cert.credentialId" type="text" :placeholder="t('phCertId')"     class="field" />
              <input v-model="cert.issuer"       type="text" :placeholder="t('phCertIssuer')" class="field" />
              <div class="date-row">
                <div class="date-col">
                  <span class="date-label">{{ t('certsDateIssued') }}</span>
                  <div class="date-selects">
                    <select class="field date-select"
                            :value="getPart(cert.dateIssued, 'month')"
                            @change="setPart(cert, 'dateIssued', 'month', $event.target.value)">
                      <option value="">{{ t('dateMon') }}</option>
                      <option v-for="(m, idx) in MONTH_OPTS" :key="idx"
                              :value="String(idx+1).padStart(2,'0')">{{ m }}</option>
                    </select>
                    <select class="field date-select"
                            :value="getPart(cert.dateIssued, 'year')"
                            @change="setPart(cert, 'dateIssued', 'year', $event.target.value)">
                      <option value="">{{ t('dateYear') }}</option>
                      <option v-for="y in YEAR_OPTS" :key="y" :value="String(y)">{{ y }}</option>
                    </select>
                  </div>
                </div>
                <div class="date-col">
                  <span class="date-label">{{ t('certsDateExpires') }}</span>
                  <div class="date-selects" :class="{ 'date-disabled': cert.noExpiry }">
                    <select class="field date-select"
                            :value="getPart(cert.dateExpires, 'month')"
                            @change="setPart(cert, 'dateExpires', 'month', $event.target.value)"
                            :disabled="cert.noExpiry">
                      <option value="">{{ t('dateMon') }}</option>
                      <option v-for="(m, idx) in MONTH_OPTS" :key="idx"
                              :value="String(idx+1).padStart(2,'0')">{{ m }}</option>
                    </select>
                    <select class="field date-select"
                            :value="getPart(cert.dateExpires, 'year')"
                            @change="setPart(cert, 'dateExpires', 'year', $event.target.value)"
                            :disabled="cert.noExpiry">
                      <option value="">{{ t('dateYear') }}</option>
                      <option v-for="y in YEAR_OPTS" :key="y" :value="String(y)">{{ y }}</option>
                    </select>
                  </div>
                  <label class="present-toggle">
                    <input type="checkbox" v-model="cert.noExpiry" />
                    {{ t('certNoExpiry') }}
                  </label>
                </div>
              </div>
              <textarea v-model="cert.notes" :placeholder="t('phCertNotes')" class="field cert-notes-field" rows="2" />
            </div>
          </div>
          <button class="btn-add" @click="addCertEntry">{{ t('btnAddCert') }}</button>
        </div>
      </section>

      <!-- Languages -->
      <section class="form-section" :class="{ 'section-collapsed': sections.langs }">
        <h2 class="section-legend" @click="sections.langs = !sections.langs">
          <span class="dot" />{{ t('langsSection') }}
          <SectionChevron :collapsed="sections.langs" />
        </h2>
        <div v-show="!sections.langs" class="section-body">
          <div v-for="(lang, li) in languages" :key="li" class="lang-entry">
            <div class="lang-row">
              <input v-model="lang.name" type="text" :placeholder="t('phLangName')" class="field lang-name-field" />
              <select v-model="lang.level" class="field lang-level-select">
                <option value="">{{ t('phLangLevel') }}</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
                <option value="Nativo">{{ t('langLevelNative') }}</option>
              </select>
              <button class="btn-remove lang-remove" @click="removeLanguage(li)">✕</button>
            </div>
            <input v-model="lang.notes" type="text" :placeholder="t('phLangNotes')" class="field lang-notes-field" />
          </div>
          <button class="btn-add" @click="addLanguage">{{ t('btnAddLang') }}</button>
        </div>
      </section>

      <!-- Additional Info -->
      <section class="form-section" :class="{ 'section-collapsed': sections.additional }">
        <h2 class="section-legend" @click="sections.additional = !sections.additional">
          <span class="dot" />{{ t('additionalSection') }}
          <SectionChevron :collapsed="sections.additional" />
        </h2>
        <div v-show="!sections.additional" class="section-body">
          <label class="field-label">{{ t('skillsLabel') }}</label>
          <div class="tech-tags-wrap" @click="$refs.skillsInputRef.focus()">
            <span v-for="(sk, si) in getSkills('skills')" :key="si" class="tech-tag">
              {{ sk }}
              <button @click.stop="removeSkill('skills', si)" class="tech-tag-remove">×</button>
            </span>
            <input ref="skillsInputRef" v-model="skillsInput" type="text"
                   :placeholder="t('phSkills')" class="tech-tag-input"
                   @keydown="onSkillKey($event, 'skills')"
                   @blur="onSkillBlur('skills')" />
          </div>
          <label class="field-label">{{ t('softSkillsLabel') }}</label>
          <div class="tech-tags-wrap" @click="$refs.softSkillsInputRef.focus()">
            <span v-for="(sk, si) in getSkills('softSkills')" :key="si" class="tech-tag">
              {{ sk }}
              <button @click.stop="removeSkill('softSkills', si)" class="tech-tag-remove">×</button>
            </span>
            <input ref="softSkillsInputRef" v-model="softSkillsInput" type="text"
                   :placeholder="t('phSoftSkills')" class="tech-tag-input"
                   @keydown="onSkillKey($event, 'softSkills')"
                   @blur="onSkillBlur('softSkills')" />
          </div>
        </div>
      </section>

      <!-- Download -->
      <div class="form-actions">
        <button class="btn-download" @click="$emit('download')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          {{ t('downloadPDF') }}
        </button>
      </div>

    </div>

    <!-- Work Description Modal -->
    <Teleport to="body">
      <div v-if="workDescModal.open" class="bullet-modal-backdrop" @click.self="workDescModal.open = false">
        <div class="bullet-modal">
          <div class="bullet-modal-header">
            <span class="bullet-modal-title">{{ t('roleDescModalTitle') }}</span>
            <button class="bullet-modal-close" @click="workDescModal.open = false">✕</button>
          </div>
          <p class="bullet-modal-hint">{{ t('roleDescModalHint') }}</p>
          <textarea
            ref="workDescTextareaRef"
            v-model="workDescModal.text"
            class="bullet-modal-textarea"
            :placeholder="t('roleDescModalPh')"
            spellcheck="true"
          />
          <div class="bullet-modal-footer">
            <span class="bullet-modal-count">{{ workDescModal.text.trim().length }} {{ t('chars') }}</span>
            <div class="bullet-modal-actions">
              <button class="btn-modal-cancel" @click="workDescModal.open = false">{{ t('btnCancel') }}</button>
              <button class="btn-modal-save" @click="saveWorkDescModal">{{ t('btnSave') }}</button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Summary Editor Modal -->
    <Teleport to="body">
      <div v-if="summaryModal.open" class="bullet-modal-backdrop" @click.self="summaryModal.open = false">
        <div class="bullet-modal">
          <div class="bullet-modal-header">
            <span class="bullet-modal-title">{{ t('summaryModalTitle') }}</span>
            <button class="bullet-modal-close" @click="summaryModal.open = false">✕</button>
          </div>
          <p class="bullet-modal-hint">{{ t('summaryModalHint') }}</p>
          <textarea
            ref="summaryTextareaRef"
            v-model="summaryModal.text"
            class="bullet-modal-textarea"
            :placeholder="t('summaryModalPh')"
            spellcheck="true"
          />
          <div class="bullet-modal-footer">
            <span class="bullet-modal-count">{{ summaryModal.text.trim().length }} {{ t('chars') }}</span>
            <div class="bullet-modal-actions">
              <button class="btn-modal-cancel" @click="summaryModal.open = false">{{ t('btnCancel') }}</button>
              <button class="btn-modal-save" @click="saveSummaryModal">{{ t('btnSave') }}</button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Bullet Editor Modal -->
    <Teleport to="body">
      <div v-if="bulletModal.open" class="bullet-modal-backdrop" @click.self="closeBulletModal">
        <div class="bullet-modal bullet-modal-list">
          <div class="bullet-modal-header">
            <span class="bullet-modal-title">{{ t('bulletsModalTitle') }}</span>
            <button class="bullet-modal-close" @click="closeBulletModal">✕</button>
          </div>

          <div class="bullet-list-body">
            <draggable
              :list="bulletModal.items"
              item-key="id"
              handle=".bm-drag"
              ghost-class="bm-ghost"
              animation="150"
            >
              <template #item="{ element: item, index: bi }">
                <div class="bm-item">
                  <span class="bm-drag" title="Arrastra para reordenar">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <line x1="8" y1="6"  x2="21" y2="6"/>
                      <line x1="8" y1="12" x2="21" y2="12"/>
                      <line x1="8" y1="18" x2="21" y2="18"/>
                      <line x1="3" y1="6"  x2="3.01" y2="6"/>
                      <line x1="3" y1="12" x2="3.01" y2="12"/>
                      <line x1="3" y1="18" x2="3.01" y2="18"/>
                    </svg>
                  </span>
                  <span class="bm-number">{{ bi + 1 }}.</span>
                  <textarea
                    v-model="item.text"
                    class="bm-textarea"
                    rows="2"
                    :placeholder="t('bulletPh', bi + 1)"
                    spellcheck="true"
                    @keydown.enter.exact.prevent="addBulletItem(bi)"
                  />
                  <button class="bm-remove" @click="bulletModal.items.splice(bi, 1)" :title="t('deleteBullet')">✕</button>
                </div>
              </template>
            </draggable>

            <button class="bm-add" @click="addBulletItem()">{{ t('btnAddBullet') }}</button>
          </div>

          <div class="bullet-modal-footer">
            <span class="bullet-modal-count">{{ t('bulletCount', bulletModal.items.filter(b => b.text.trim()).length) }}</span>
            <div class="bullet-modal-actions">
              <button class="btn-modal-cancel" @click="closeBulletModal">{{ t('btnCancel') }}</button>
              <button class="btn-modal-save" @click="saveBulletModal">{{ t('btnSave') }}</button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

  </aside>
</template>

<script setup>
import { ref, reactive, computed, nextTick, defineComponent, h } from 'vue'
import draggable from 'vuedraggable'
import { useResume } from '../composables/useResume.js'
import { useResumes } from '../composables/useResumes.js'
import { useTypography } from '../composables/useTypography.js'
import { useLocale } from '../composables/useLocale.js'

// Inline chevron component to avoid creating a separate file
const SectionChevron = defineComponent({
  props: { collapsed: Boolean },
  setup(props) {
    return () => h('svg', {
      width: 13, height: 13,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2.5',
      class: 'section-chevron',
      style: { transform: props.collapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }
    }, [h('polyline', { points: '6 9 12 15 18 9' })])
  }
})

defineEmits(['download'])

const {
  personal, summary, work, education, additional, certifications, languages,
  addWork, removeWork, addEducation, removeEducation, removeBullet,
  addCertification, removeCertification,
  addLanguage, removeLanguage,
  clearAll, getSnapshot, restoreSnapshot,
} = useResume()

const { saves, saveResume, updateSave, deleteSave, exportJSON, formatSaveDate } = useResumes()
const { typography } = useTypography()
const { locale, setLocale, t } = useLocale()

// ---- Saves UI ----
const saveName    = ref('')
const importInput = ref(null)
const ACTIVE_SAVE_KEY = 'resume-active-save-id'
const _storedActiveId = localStorage.getItem(ACTIVE_SAVE_KEY)
const activeSaveId = ref(
  saves.value.some(s => s.id === _storedActiveId) ? _storedActiveId : null
)

function fullSnapshot() {
  return { ...getSnapshot(), typography: { ...typography } }
}

function applySnapshot(snap) {
  restoreSnapshot(snap)
  if (snap.typography) Object.assign(typography, snap.typography)
  workCollapsed.value = work.map(() => true)
  eduCollapsed.value  = education.map(() => true)
}

function doSave() {
  const name = saveName.value.trim() || personal.name.trim() || t('defaultSaveName')
  const id = saveResume(name, fullSnapshot())
  activeSaveId.value = id
  localStorage.setItem(ACTIVE_SAVE_KEY, id)
  saveName.value = ''
}

function doExport() {
  const name = (personal.name.trim() || 'resume').replace(/\s+/g, '_')
  exportJSON(fullSnapshot(), `${name}_resume.json`)
}

async function doImport(e) {
  const file = e.target.files[0]
  if (!file) return
  try {
    const snap = JSON.parse(await file.text())
    applySnapshot(snap)
    activeSaveId.value = null
    localStorage.removeItem(ACTIVE_SAVE_KEY)
  } catch {
    alert(t('invalidJSON'))
  }
  if (importInput.value) importInput.value.value = ''
}

function doLoad(save) {
  if (!confirm(t('confirmLoad', save.name))) return
  applySnapshot(save.data)
  activeSaveId.value = save.id
  localStorage.setItem(ACTIVE_SAVE_KEY, save.id)
}

const syncingId = ref(null)

function doSync(save) {
  updateSave(save.id, fullSnapshot())
  syncingId.value = save.id
  setTimeout(() => { syncingId.value = null }, 1200)
}

// ---- Technology tag helpers ----
const techInputs = reactive({})   // transient input text per entry index

function getTechs(entry) {
  return entry.technologies ? entry.technologies.split(',').map(s => s.trim()).filter(Boolean) : []
}

function addTech(entry, i, raw) {
  const tech = (raw || '').replace(/,\s*$/, '').trim()
  if (!tech) return
  const list = getTechs(entry)
  if (!list.includes(tech)) {
    list.push(tech)
    entry.technologies = list.join(', ')
  }
  techInputs[i] = ''
}

function removeTech(entry, idx) {
  const list = getTechs(entry)
  list.splice(idx, 1)
  entry.technologies = list.join(', ')
}

function onTechKey(e, entry, i) {
  if (e.key === ',' || e.key === 'Enter' || e.key === 'Tab') {
    e.preventDefault()
    addTech(entry, i, techInputs[i])
  }
}

function onTechBlur(entry, i) {
  if (techInputs[i]) addTech(entry, i, techInputs[i])
}

// ---- Skill tag helpers ----
const skillsInput = ref('')
const softSkillsInput = ref('')

function getSkills(field) {
  return additional[field] ? additional[field].split(',').map(s => s.trim()).filter(Boolean) : []
}

function addSkill(field, raw) {
  const sk = (raw || '').replace(/,\s*$/, '').trim()
  if (!sk) return
  const list = getSkills(field)
  if (!list.includes(sk)) {
    list.push(sk)
    additional[field] = list.join(', ')
  }
  if (field === 'skills') skillsInput.value = ''
  else softSkillsInput.value = ''
}

function removeSkill(field, idx) {
  const list = getSkills(field)
  list.splice(idx, 1)
  additional[field] = list.join(', ')
}

function onSkillKey(e, field) {
  const val = field === 'skills' ? skillsInput.value : softSkillsInput.value
  if (e.key === ',' || e.key === 'Enter' || e.key === 'Tab') {
    e.preventDefault()
    addSkill(field, val)
  }
}

function onSkillBlur(field) {
  const val = field === 'skills' ? skillsInput.value : softSkillsInput.value
  if (val) addSkill(field, val)
}

// ---- Date select helpers ----
const MONTH_OPTS = computed(() => t('monthsShort'))
const _cy = new Date().getFullYear()
const YEAR_OPTS = Array.from({ length: _cy - 1949 + 2 }, (_, i) => _cy + 1 - i)

function getPart(ym, part) {
  if (!ym) return ''
  const [y, m] = ym.split('-')
  return part === 'year' ? (y || '') : (m || '')
}

function setPart(entry, field, part, val) {
  const [y, m] = (entry[field] || '-').split('-')
  const ny = part === 'year'  ? val : (y || '')
  const nm = part === 'month' ? val : (m || '')
  entry[field] = (ny || nm) ? `${ny}-${nm}` : ''
}

// ---- Section collapse state ----
const sections = reactive({ saves: true, personal: true, summary: true, work: true, education: true, certs: true, langs: true, additional: true })

// ---- Entry collapse state (UI only, not persisted) ----
const workCollapsed = ref(work.map(() => true))
const eduCollapsed  = ref(education.map(() => true))

function toggleWork(i) { workCollapsed.value[i] = !workCollapsed.value[i] }
function toggleEdu(i)  { eduCollapsed.value[i]  = !eduCollapsed.value[i] }

// ---- Add entries (expand new ones automatically) ----
function addWorkEntry() {
  addWork()
  workCollapsed.value.push(false)
}

function addEduEntry() {
  addEducation()
  eduCollapsed.value.push(false)
}

// ---- Remove (keep collapse array in sync) ----
function removeWorkEntry(i) {
  removeWork(i)
  workCollapsed.value.splice(i, 1)
}

function removeEduEntry(i) {
  removeEducation(i)
  eduCollapsed.value.splice(i, 1)
}

function confirmClear() {
  if (confirm(t('confirmClear'))) {
    clearAll()
    activeSaveId.value = null
    localStorage.removeItem(ACTIVE_SAVE_KEY)
    Object.assign(sections, { personal: false, summary: false, work: false, education: false, certs: false, langs: false, additional: false })
    workCollapsed.value = [false, false]
    eduCollapsed.value  = [false]
  }
}

// ---- Work description modal ----
const workDescTextareaRef = ref(null)
const workDescModal = reactive({ open: false, index: -1, text: '' })

function openWorkDescModal(index) {
  workDescModal.index = index
  workDescModal.text  = work[index].description || ''
  workDescModal.open  = true
  nextTick(() => workDescTextareaRef.value?.focus())
}

function saveWorkDescModal() {
  work[workDescModal.index].description = workDescModal.text
  workDescModal.open = false
}

// ---- Summary modal ----
const summaryTextareaRef = ref(null)
const summaryModal = reactive({ open: false, text: '' })

function openSummaryModal() {
  summaryModal.text = summary.text
  summaryModal.open = true
  nextTick(() => summaryTextareaRef.value?.focus())
}

function saveSummaryModal() {
  summary.text = summaryModal.text
  summaryModal.open = false
}

// ---- Bullet modal ----
let _bmId = 0
const bulletModal = reactive({ open: false, type: '', index: -1, items: [] })

function openBulletModal(type, index) {
  const entry = type === 'work' ? work[index] : education[index]
  bulletModal.type  = type
  bulletModal.index = index
  const filled = (entry.bullets || []).filter(b => b.trim())
  bulletModal.items = (filled.length ? filled : ['']).map(b => ({ id: ++_bmId, text: b }))
  bulletModal.open  = true
  nextTick(() => {
    const first = document.querySelector('.bm-textarea')
    first?.focus()
  })
}

function addBulletItem(afterIndex) {
  const newItem = { id: ++_bmId, text: '' }
  if (afterIndex === undefined) {
    bulletModal.items.push(newItem)
  } else {
    bulletModal.items.splice(afterIndex + 1, 0, newItem)
  }
  nextTick(() => {
    const idx = afterIndex === undefined ? bulletModal.items.length - 1 : afterIndex + 1
    const all = document.querySelectorAll('.bm-textarea')
    all[idx]?.focus()
  })
}

function saveBulletModal() {
  const entry   = bulletModal.type === 'work' ? work[bulletModal.index] : education[bulletModal.index]
  const bullets = bulletModal.items.map(b => b.text.trimEnd()).filter(b => b.trim())
  entry.bullets.splice(0, entry.bullets.length, ...(bullets.length ? bullets : ['']))
  bulletModal.open = false
}

function closeBulletModal() {
  bulletModal.open = false
}

function moveWork(from, to) {
  const item = work.splice(from, 1)[0]
  work.splice(to, 0, item)
  const col = workCollapsed.value.splice(from, 1)[0]
  workCollapsed.value.splice(to, 0, col)
}

// ---- Certifications collapse state ----
const certCollapsed = ref(certifications.map(() => true))

function toggleCert(i) { certCollapsed.value[i] = !certCollapsed.value[i] }

function addCertEntry() {
  addCertification()
  certCollapsed.value.push(false)
}

function removeCertEntry(i) {
  removeCertification(i)
  certCollapsed.value.splice(i, 1)
}
</script>

<style scoped>
/* ---- Panel shell ---- */
.form-panel {
  width: 48%;
  min-width: 340px;
  max-width: 600px;
  background: var(--bg-form);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.app-header {
  padding: 18px 20px 12px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.app-header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.app-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  font-weight: 700;
  color: var(--primary);
}

.app-subtitle {
  font-size: 0.73rem;
  color: var(--text-subtle);
  margin-top: 4px;
  margin-left: 28px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.lang-toggle {
  display: flex;
  border: 1px solid var(--border);
  border-radius: 5px;
  overflow: hidden;
}

.btn-lang {
  padding: 3px 8px;
  background: transparent;
  border: none;
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  transition: background 0.15s;
  display: flex;
  align-items: center;
}

.btn-lang:first-child {
  border-right: 1px solid var(--border);
}

.btn-lang.active {
  background: var(--primary);
}

.btn-lang:not(.active):hover {
  background: var(--primary-light);
}

.btn-clear {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  background: transparent;
  color: var(--text-subtle);
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
}

.btn-clear:hover {
  color: var(--red);
  border-color: var(--red);
  background: #fff0f0;
}

.form-body {
  flex: 1;
  overflow-y: auto;
  padding: 14px 16px 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  scrollbar-width: thin;
  scrollbar-color: var(--divider) transparent;
}

/* ---- Sections ---- */
.form-section {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 12px 14px 14px;
  background: #fff;
}

.section-legend {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: var(--primary);
  margin-bottom: 10px;
  cursor: pointer;
  user-select: none;
}

.section-legend:hover { opacity: 0.8; }

.section-chevron {
  margin-left: auto;
  color: var(--primary);
  flex-shrink: 0;
}

.form-section.section-collapsed {
  padding-bottom: 12px;
}

.form-section.section-collapsed .section-legend {
  margin-bottom: 0;
}

.section-body { /* wrapper for collapsible content — no extra styles needed */ }

.dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--primary);
  flex-shrink: 0;
}

/* ---- Fields ---- */
.field {
  display: block;
  width: 100%;
  padding: 7px 10px;
  margin-bottom: 7px;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-family: var(--font-ui);
  font-size: 0.83rem;
  color: var(--text);
  background: #fff;
  transition: border-color 0.15s, box-shadow 0.15s;
  resize: vertical;
}

.field:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(107, 47, 160, 0.1);
}

.field::placeholder { color: #BBBBBB; }

.field:last-child { margin-bottom: 0; }

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 7px;
}

.field-label {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: var(--text-subtle);
  margin: 9px 0 3px;
}

/* ---- Entry Blocks ---- */
.entry-block {
  background: var(--entry-bg);
  border: 1px solid #E8E0F0;
  border-left: 3px solid var(--divider);
  border-radius: var(--radius);
  padding: 10px 10px 8px;
  margin-bottom: 8px;
  transition: border-left-color 0.15s;
}

.entry-block:focus-within { border-left-color: var(--primary); }

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 7px;
}

.entry-header-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.entry-header-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.drag-handle {
  display: flex;
  align-items: center;
  color: #bbb;
  cursor: grab;
  padding: 2px;
  border-radius: 3px;
  transition: color 0.15s;
}

.drag-handle:hover { color: var(--primary); }
.drag-handle:active { cursor: grabbing; }

.entry-title-group {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.entry-company {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
}

.entry-role {
  font-size: 0.68rem;
  color: var(--text-subtle);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
}

.entry-header {
  cursor: pointer;
  user-select: none;
}

.entry-body {
  margin-top: 8px;
}

.entry-block.collapsed {
  padding-bottom: 10px;
}

.btn-chevron {
  width: 22px;
  height: 22px;
  padding: 0;
  background: transparent;
  color: var(--text-subtle);
  border: 1px solid var(--border);
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
}

.btn-chevron:hover {
  background: var(--primary-light);
  color: var(--primary);
  border-color: var(--primary);
}

.btn-move {
  width: 22px;
  height: 22px;
  padding: 0;
  background: transparent;
  color: var(--text-subtle);
  border: 1px solid var(--border);
  border-radius: 3px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
}

.btn-move:hover:not(:disabled) {
  background: var(--primary-light);
  color: var(--primary);
  border-color: var(--primary);
}

.btn-move:disabled {
  opacity: 0.25;
  cursor: not-allowed;
}

:global(.dragging-ghost) {
  opacity: 0.4;
  background: var(--primary-light) !important;
  border: 1.5px dashed var(--primary) !important;
}

.bullets-label {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: var(--text-subtle);
  margin: 7px 0 4px;
}

.optional {
  text-transform: none;
  font-weight: 400;
  font-size: 0.68rem;
  opacity: 0.7;
}

.tech-tags-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  padding: 5px 8px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: #fff;
  min-height: 34px;
  cursor: text;
  margin-bottom: 7px;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.tech-tags-wrap:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(107, 47, 160, 0.1);
}

.tech-tag {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 7px 2px 8px;
  background: var(--primary-light);
  color: var(--primary-dark);
  border-radius: 3px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.tech-tag-remove {
  background: none;
  border: none;
  color: var(--primary);
  font-size: 1rem;
  line-height: 1;
  padding: 0 0 1px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.1s;
}

.tech-tag-remove:hover { opacity: 1; }

.tech-tag-input {
  flex: 1;
  min-width: 80px;
  border: none;
  outline: none;
  font-family: var(--font-ui);
  font-size: 0.82rem;
  color: var(--text);
  background: transparent;
  padding: 2px 0;
}

.tech-tag-input::placeholder { color: #BBBBBB; }

/* ---- Date pickers ---- */
.date-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 7px;
  margin-bottom: 7px;
}

.date-col {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.date-label {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: var(--text-subtle);
}

.date-selects {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
}

.date-selects.date-disabled { opacity: 0.35; pointer-events: none; }

.date-select {
  margin-bottom: 0;
  padding: 5px 4px;
  font-size: 0.78rem;
  cursor: pointer;
  appearance: auto;
}

.present-toggle {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.75rem;
  color: var(--text-subtle);
  cursor: pointer;
  margin-top: 3px;
  user-select: none;
}

.present-toggle input[type="checkbox"] {
  accent-color: var(--primary);
  width: 13px;
  height: 13px;
  cursor: pointer;
}

/* ---- Buttons ---- */
.btn-remove {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 3px 8px;
  background: transparent;
  color: var(--red);
  border: 1px solid #F0C0C0;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  transition: background 0.15s, color 0.15s;
}

.btn-remove:hover {
  background: var(--red);
  color: #fff;
  border-color: var(--red);
}

.btn-add {
  display: block;
  width: 100%;
  padding: 8px;
  background: transparent;
  color: var(--primary);
  border: 1.5px dashed var(--divider);
  border-radius: var(--radius);
  font-size: 0.82rem;
  font-weight: 600;
  transition: background 0.15s, border-color 0.15s;
  margin-top: 2px;
}

.btn-add:hover {
  background: var(--primary-light);
  border-color: var(--primary);
}

/* ---- Saves section ---- */
.save-input-row {
  display: flex;
  gap: 6px;
  margin-bottom: 6px;
}

.save-name-field { flex: 1; margin-bottom: 0; }

.btn-save-action {
  padding: 6px 12px;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 700;
  white-space: nowrap;
  transition: background 0.15s;
}

.btn-save-action:hover { background: var(--primary-dark); }

.save-ext-row {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
}

.btn-ext {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 6px 8px;
  background: transparent;
  color: var(--text-subtle);
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
}

.btn-ext:hover {
  color: var(--primary);
  border-color: var(--primary);
  background: var(--primary-light);
}

.btn-import-label { cursor: pointer; }

.saves-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.save-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 7px 9px;
  background: var(--entry-bg);
  border: 1px solid #E8E0F0;
  border-radius: 4px;
}

.save-item-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.save-item-name {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
}

.save-item-date {
  font-size: 0.67rem;
  color: var(--text-subtle);
}

.save-item-active {
  border-color: var(--divider);
  border-left: 3px solid var(--primary);
  background: var(--primary-light);
}

.save-item-btns {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.btn-load {
  padding: 3px 9px;
  background: var(--primary-light);
  color: var(--primary-dark);
  border: 1px solid var(--divider);
  border-radius: 4px;
  font-size: 0.73rem;
  font-weight: 700;
  transition: background 0.15s;
}

.btn-load:hover {
  background: var(--divider);
  color: var(--primary-dark);
}

.btn-sync {
  width: 26px;
  height: 26px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: var(--text-subtle);
  border: 1px solid var(--border);
  border-radius: 4px;
  transition: color 0.15s, background 0.15s, border-color 0.15s;
}

.btn-sync:hover {
  color: var(--primary);
  border-color: var(--primary);
  background: var(--primary-light);
}

.btn-sync:hover .sync-icon {
  animation: spin-once 0.5s ease-in-out;
}

.btn-sync-done {
  color: #2e7d32 !important;
  border-color: #81c784 !important;
  background: #f0faf0 !important;
  transition: color 0.2s, border-color 0.2s, background 0.2s;
}

@keyframes spin-once {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.no-saves {
  font-size: 0.75rem;
  color: var(--text-subtle);
  text-align: center;
  padding: 8px 0 4px;
}

/* ---- Download ---- */
.form-actions { padding-top: 2px; }

.btn-download {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: var(--radius);
  font-size: 0.88rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  box-shadow: 0 2px 8px rgba(107, 47, 160, 0.35);
  transition: background 0.15s, box-shadow 0.15s, transform 0.1s;
}

.btn-download:hover {
  background: var(--primary-dark);
  box-shadow: 0 4px 14px rgba(107, 47, 160, 0.45);
}

.btn-download:active { transform: scale(0.98); }

/* ---- Bullets preview (inline in entry) ---- */
.bullets-preview {
  position: relative;
  padding: 7px 56px 7px 10px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: #fafafa;
  cursor: pointer;
  min-height: 36px;
  transition: border-color 0.15s, background 0.15s;
}

.bullets-preview:hover {
  border-color: var(--primary);
  background: var(--primary-light);
}

.bullet-preview-item {
  display: flex;
  gap: 5px;
  align-items: baseline;
  margin-bottom: 2px;
}

.bullet-dot {
  flex-shrink: 0;
  font-size: 0.7rem;
  color: var(--primary);
  line-height: 1.4;
}

.bullet-preview-text {
  font-size: 0.78rem;
  color: var(--text);
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.bullets-empty {
  font-size: 0.78rem;
  color: #bbb;
  font-style: italic;
}

.bullets-edit-hint {
  position: absolute;
  top: 50%;
  right: 9px;
  transform: translateY(-50%);
  font-size: 0.72rem;
  color: var(--primary);
  font-weight: 600;
  opacity: 0.6;
  pointer-events: none;
  white-space: nowrap;
}

.bullets-preview:hover .bullets-edit-hint { opacity: 1; }

.summary-preview { padding-right: 56px; }

.summary-preview-text {
  font-size: 0.78rem;
  color: var(--text);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: pre-line;
}

/* ---- Bullet editor modal ---- */
.bullet-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.bullet-modal {
  background: #fff;
  border-radius: 10px;
  width: 100%;
  max-width: 580px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.bullet-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px 10px;
  border-bottom: 1px solid var(--border);
}

.bullet-modal-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--primary);
  letter-spacing: 0.2px;
}

.bullet-modal-close {
  background: none;
  border: none;
  font-size: 1rem;
  color: var(--text-subtle);
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  line-height: 1;
  transition: color 0.15s, background 0.15s;
}

.bullet-modal-close:hover {
  color: var(--red);
  background: #fff0f0;
}

.bullet-modal-hint {
  font-size: 0.73rem;
  color: var(--text-subtle);
  padding: 8px 18px 0;
}

/* Summary modal still uses the textarea */
.bullet-modal-textarea {
  margin: 10px 18px 0;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-family: var(--font-ui);
  font-size: 0.85rem;
  color: var(--text);
  line-height: 1.6;
  resize: vertical;
  min-height: 220px;
  max-height: 60vh;
  background: #fafafa;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.bullet-modal-textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(107, 47, 160, 0.1);
  background: #fff;
}

.bullet-modal-textarea::placeholder { color: #bbb; }

/* ---- Bullet list modal ---- */
.bullet-modal-list { max-width: 640px; }

.bullet-list-body {
  padding: 10px 18px 4px;
  overflow-y: auto;
  max-height: 55vh;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.bm-item {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  background: #fafafa;
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 6px 8px 6px 6px;
  transition: border-color 0.15s;
}

.bm-item:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(107, 47, 160, 0.08);
}

.bm-drag {
  display: flex;
  align-items: center;
  padding: 4px 2px;
  color: #ccc;
  cursor: grab;
  flex-shrink: 0;
  margin-top: 4px;
  transition: color 0.15s;
}

.bm-drag:hover { color: var(--primary); }
.bm-drag:active { cursor: grabbing; }

.bm-number {
  flex-shrink: 0;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--primary);
  min-width: 18px;
  margin-top: 7px;
  text-align: right;
}

.bm-textarea {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-ui);
  font-size: 0.84rem;
  color: var(--text);
  line-height: 1.5;
  resize: none;
  padding: 4px 0;
  min-height: 36px;
}

.bm-textarea::placeholder { color: #bbb; }

.bm-remove {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  margin-top: 4px;
  background: transparent;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #ccc;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.bm-remove:hover {
  background: var(--red);
  color: #fff;
  border-color: var(--red);
}

.bm-add {
  align-self: flex-start;
  margin-top: 2px;
  padding: 5px 12px;
  background: transparent;
  color: var(--primary);
  border: 1.5px dashed var(--divider);
  border-radius: 5px;
  font-size: 0.78rem;
  font-weight: 600;
  transition: background 0.15s, border-color 0.15s;
}

.bm-add:hover {
  background: var(--primary-light);
  border-color: var(--primary);
}

:global(.bm-ghost) {
  opacity: 0.35;
  background: var(--primary-light) !important;
  border: 1.5px dashed var(--primary) !important;
}

.bullet-modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px 16px;
}

.bullet-modal-count {
  font-size: 0.72rem;
  color: var(--text-subtle);
}

.bullet-modal-actions {
  display: flex;
  gap: 8px;
}

.btn-modal-cancel {
  padding: 7px 16px;
  background: transparent;
  color: var(--text-subtle);
  border: 1px solid var(--border);
  border-radius: 5px;
  font-size: 0.82rem;
  font-weight: 600;
  transition: color 0.15s, border-color 0.15s;
}

.btn-modal-cancel:hover {
  color: var(--text);
  border-color: #aaa;
}

.btn-modal-save {
  padding: 7px 20px;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 0.82rem;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(107, 47, 160, 0.3);
  transition: background 0.15s;
}

.btn-modal-save:hover { background: var(--primary-dark); }

/* ---- Cert notes ---- */
.cert-notes-field {
  resize: vertical;
  min-height: 48px;
  font-size: 0.84em;
}

/* ---- Language rows ---- */
.lang-entry {
  margin-bottom: 10px;
}

.lang-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.lang-notes-field {
  width: 100%;
  font-size: 0.84em;
}

.lang-name-field {
  flex: 1;
  min-width: 0;
}

.lang-level-select {
  width: 90px;
  flex-shrink: 0;
}

.lang-remove {
  flex-shrink: 0;
  padding: 4px 7px;
}

/* ---- Responsive ---- */
@media (max-width: 860px) {
  .form-panel {
    width: 100%;
    max-width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--border);
    overflow-y: visible;
  }
  .field-row { grid-template-columns: 1fr; }
}
</style>
