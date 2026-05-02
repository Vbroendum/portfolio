<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth.js'
import { getProjects, getExperience } from '../../composables/useApi.js'
import {
  createProject, updateProject, deleteProject,
  createExperience, updateExperience, deleteExperience,
} from '../../composables/useAdminApi.js'

const router = useRouter()
const { clearToken } = useAuth()
const activeTab = ref('projects')

// ── Data ──────────────────────────────────────────────────────────────────────
const projects   = ref([])
const experience = ref([])

async function loadData() {
  const [p, e] = await Promise.all([getProjects(), getExperience()])
  projects.value   = p.map(x => ({ ...x, tech_stack: parseTech(x.tech_stack) }))
  experience.value = e
}

onMounted(loadData)

function parseTech(v) {
  if (Array.isArray(v)) return v
  try { return JSON.parse(v) } catch { return [] }
}

// ── Shared form helpers ───────────────────────────────────────────────────────
const saving  = ref(false)
const saveErr = ref('')

function emptyProject() {
  return { title: '', description: '', tech_stack: '', github_url: '', live_url: '', sort_order: 0 }
}

function emptyExperience() {
  return { company: '', role: '', period: '', description: '', sort_order: 0 }
}

// ── Projects ──────────────────────────────────────────────────────────────────
const projectForm    = ref(emptyProject())
const editingProject = ref(null)   // id of the row being edited

function editProject(p) {
  editingProject.value = p.id
  projectForm.value = {
    title: p.title,
    description: p.description,
    tech_stack: Array.isArray(p.tech_stack) ? p.tech_stack.join(', ') : p.tech_stack,
    github_url: p.github_url || '',
    live_url: p.live_url || '',
    sort_order: p.sort_order,
  }
}

function cancelProject() {
  editingProject.value = null
  projectForm.value = emptyProject()
  saveErr.value = ''
}

async function saveProject() {
  saving.value = true
  saveErr.value = ''
  const payload = {
    ...projectForm.value,
    tech_stack: projectForm.value.tech_stack.split(',').map(s => s.trim()).filter(Boolean),
  }
  try {
    if (editingProject.value) {
      await updateProject(editingProject.value, payload)
    } else {
      await createProject(payload)
    }
    cancelProject()
    await loadData()
  } catch (err) {
    saveErr.value = err.message
  } finally {
    saving.value = false
  }
}

async function removeProject(id) {
  if (!confirm('Delete this project?')) return
  await deleteProject(id)
  await loadData()
}

// ── Experience ────────────────────────────────────────────────────────────────
const expForm    = ref(emptyExperience())
const editingExp = ref(null)

function editExp(e) {
  editingExp.value = e.id
  expForm.value = {
    company: e.company,
    role: e.role,
    period: e.period,
    description: e.description || '',
    sort_order: e.sort_order,
  }
}

function cancelExp() {
  editingExp.value = null
  expForm.value = emptyExperience()
  saveErr.value = ''
}

async function saveExp() {
  saving.value = true
  saveErr.value = ''
  try {
    if (editingExp.value) {
      await updateExperience(editingExp.value, expForm.value)
    } else {
      await createExperience(expForm.value)
    }
    cancelExp()
    await loadData()
  } catch (err) {
    saveErr.value = err.message
  } finally {
    saving.value = false
  }
}

async function removeExp(id) {
  if (!confirm('Delete this entry?')) return
  await deleteExperience(id)
  await loadData()
}

function logout() {
  clearToken()
  router.push('/admin/login')
}
</script>

<template>
  <div class="dashboard">
    <!-- ── Top bar ──────────────────────────────────────────────────────────── -->
    <header class="topbar">
      <span class="topbar-logo">vb<span class="cursor">_</span> <span class="topbar-sub">admin</span></span>
      <div class="topbar-right">
        <a href="/" target="_blank" class="topbar-link">View site ↗</a>
        <button class="topbar-logout" @click="logout">Logout</button>
      </div>
    </header>

    <main class="main">
      <!-- ── Tabs ────────────────────────────────────────────────────────────── -->
      <div class="tabs">
        <button :class="['tab', { active: activeTab === 'projects' }]" @click="activeTab = 'projects'">
          Projects <span class="count">{{ projects.length }}</span>
        </button>
        <button :class="['tab', { active: activeTab === 'experience' }]" @click="activeTab = 'experience'">
          Experience <span class="count">{{ experience.length }}</span>
        </button>
      </div>

      <!-- ── Projects tab ────────────────────────────────────────────────────── -->
      <section v-if="activeTab === 'projects'">
        <!-- Add / Edit form -->
        <div class="form-card">
          <p class="form-title">{{ editingProject ? '// edit project' : '// new project' }}</p>
          <div class="form-grid">
            <div class="field span-2">
              <label>Title</label>
              <input v-model="projectForm.title" type="text" placeholder="Project name" />
            </div>
            <div class="field span-2">
              <label>Description</label>
              <textarea v-model="projectForm.description" rows="3" placeholder="What it does" />
            </div>
            <div class="field span-2">
              <label>Tech stack <span class="hint">(comma separated)</span></label>
              <input v-model="projectForm.tech_stack" type="text" placeholder="Node.js, Vue 3, MariaDB" />
            </div>
            <div class="field">
              <label>GitHub URL</label>
              <input v-model="projectForm.github_url" type="url" placeholder="https://github.com/..." />
            </div>
            <div class="field">
              <label>Live URL</label>
              <input v-model="projectForm.live_url" type="url" placeholder="https://..." />
            </div>
            <div class="field">
              <label>Sort order</label>
              <input v-model.number="projectForm.sort_order" type="number" placeholder="0" />
            </div>
          </div>
          <p v-if="saveErr" class="save-err">{{ saveErr }}</p>
          <div class="form-actions">
            <button class="btn-save" :disabled="saving" @click="saveProject">
              {{ saving ? 'Saving…' : editingProject ? 'Update' : 'Add project' }}
            </button>
            <button v-if="editingProject" class="btn-cancel" @click="cancelProject">Cancel</button>
          </div>
        </div>

        <!-- List -->
        <div class="list">
          <div v-for="p in projects" :key="p.id" class="list-item">
            <div class="list-item-info">
              <span class="list-item-title">{{ p.title }}</span>
              <div class="tech-pills">
                <span v-for="t in p.tech_stack" :key="t" class="pill">{{ t }}</span>
              </div>
            </div>
            <div class="list-item-actions">
              <button class="btn-edit" @click="editProject(p)">Edit</button>
              <button class="btn-delete" @click="removeProject(p.id)">Delete</button>
            </div>
          </div>
          <p v-if="!projects.length" class="empty">No projects yet.</p>
        </div>
      </section>

      <!-- ── Experience tab ──────────────────────────────────────────────────── -->
      <section v-if="activeTab === 'experience'">
        <div class="form-card">
          <p class="form-title">{{ editingExp ? '// edit experience' : '// new experience' }}</p>
          <div class="form-grid">
            <div class="field">
              <label>Company</label>
              <input v-model="expForm.company" type="text" placeholder="Company name" />
            </div>
            <div class="field">
              <label>Role</label>
              <input v-model="expForm.role" type="text" placeholder="Job title" />
            </div>
            <div class="field">
              <label>Period</label>
              <input v-model="expForm.period" type="text" placeholder="Jan 2025 – Present" />
            </div>
            <div class="field">
              <label>Sort order</label>
              <input v-model.number="expForm.sort_order" type="number" placeholder="0" />
            </div>
            <div class="field span-2">
              <label>Description</label>
              <textarea v-model="expForm.description" rows="3" placeholder="What you did" />
            </div>
          </div>
          <p v-if="saveErr" class="save-err">{{ saveErr }}</p>
          <div class="form-actions">
            <button class="btn-save" :disabled="saving" @click="saveExp">
              {{ saving ? 'Saving…' : editingExp ? 'Update' : 'Add entry' }}
            </button>
            <button v-if="editingExp" class="btn-cancel" @click="cancelExp">Cancel</button>
          </div>
        </div>

        <div class="list">
          <div v-for="e in experience" :key="e.id" class="list-item">
            <div class="list-item-info">
              <span class="list-item-title">{{ e.role }}</span>
              <span class="list-item-sub">{{ e.company }} · {{ e.period }}</span>
            </div>
            <div class="list-item-actions">
              <button class="btn-edit" @click="editExp(e)">Edit</button>
              <button class="btn-delete" @click="removeExp(e.id)">Delete</button>
            </div>
          </div>
          <p v-if="!experience.length" class="empty">No experience entries yet.</p>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.dashboard {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ── Topbar ───────────────────────────────────────────────────────────────────── */
.topbar {
  background: var(--bg-alt);
  border-bottom: 1px solid var(--border);
  padding: 0 2rem;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 10;
}

.topbar-logo {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--blue);
}

.topbar-sub {
  color: var(--fg-muted);
  font-weight: 400;
  font-size: 0.75rem;
}

.cursor { color: var(--cyan); animation: blink 1.1s step-end infinite; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

.topbar-right { display: flex; align-items: center; gap: 1.25rem; }

.topbar-link {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--fg-muted);
}
.topbar-link:hover { color: var(--blue); }

.topbar-logout {
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--fg-muted);
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  padding: 0.3rem 0.75rem;
  transition: border-color 0.2s, color 0.2s;
}
.topbar-logout:hover { border-color: var(--red); color: var(--red); }

/* ── Main ─────────────────────────────────────────────────────────────────────── */
.main {
  max-width: 860px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
}

/* ── Tabs ─────────────────────────────────────────────────────────────────────── */
.tabs {
  display: flex;
  gap: 0.25rem;
  border-bottom: 1px solid var(--border);
  margin-bottom: 2rem;
}

.tab {
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--fg-muted);
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  margin-bottom: -1px;
  padding: 0.6rem 1.25rem;
  transition: color 0.2s, border-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tab:hover { color: var(--fg); }
.tab.active { color: var(--blue); border-bottom-color: var(--blue); }

.count {
  background: var(--bg-highlight);
  border-radius: 10px;
  font-size: 0.65rem;
  padding: 0.1rem 0.45rem;
  color: var(--fg-muted);
}

/* ── Form card ────────────────────────────────────────────────────────────────── */
.form-card {
  background: var(--bg-alt);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-title {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--blue);
  letter-spacing: 0.12em;
  margin-bottom: 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.field { display: flex; flex-direction: column; gap: 0.35rem; }
.span-2 { grid-column: span 2; }

label {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--fg-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.hint { color: var(--border); text-transform: none; letter-spacing: 0; }

input, textarea {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 5px;
  color: var(--fg);
  font-family: var(--font-sans);
  font-size: 0.9rem;
  outline: none;
  padding: 0.55rem 0.8rem;
  resize: vertical;
  transition: border-color 0.2s;
}

input:focus, textarea:focus { border-color: var(--blue); }
input::placeholder, textarea::placeholder { color: var(--fg-muted); }

.form-actions { display: flex; gap: 0.75rem; margin-top: 1.25rem; }

.btn-save {
  background: var(--blue);
  border: none;
  border-radius: 5px;
  color: var(--bg);
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.55rem 1.25rem;
  transition: opacity 0.2s;
}
.btn-save:hover:not(:disabled) { opacity: 0.85; }
.btn-save:disabled { opacity: 0.4; cursor: not-allowed; }

.btn-cancel {
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 5px;
  color: var(--fg-muted);
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  padding: 0.55rem 1.25rem;
  transition: border-color 0.2s, color 0.2s;
}
.btn-cancel:hover { border-color: var(--fg-muted); color: var(--fg); }

.save-err {
  color: var(--red);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  margin-top: 0.5rem;
}

/* ── List ─────────────────────────────────────────────────────────────────────── */
.list { display: flex; flex-direction: column; gap: 0.5rem; }

.list-item {
  background: var(--bg-alt);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.9rem 1.1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  transition: border-color 0.2s;
}
.list-item:hover { border-color: var(--bg-highlight); }

.list-item-info { display: flex; flex-direction: column; gap: 0.3rem; min-width: 0; }

.list-item-title {
  font-family: var(--font-mono);
  font-size: 0.88rem;
  color: var(--fg);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.list-item-sub {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--fg-muted);
}

.tech-pills { display: flex; flex-wrap: wrap; gap: 0.3rem; }

.pill {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--green);
  background: rgba(158,206,106,0.08);
  border: 1px solid rgba(158,206,106,0.2);
  border-radius: 3px;
  padding: 0.1rem 0.45rem;
}

.list-item-actions { display: flex; gap: 0.5rem; flex-shrink: 0; }

.btn-edit {
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--fg-muted);
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  padding: 0.3rem 0.7rem;
  transition: border-color 0.2s, color 0.2s;
}
.btn-edit:hover { border-color: var(--blue); color: var(--blue); }

.btn-delete {
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--fg-muted);
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  padding: 0.3rem 0.7rem;
  transition: border-color 0.2s, color 0.2s;
}
.btn-delete:hover { border-color: var(--red); color: var(--red); }

.empty {
  color: var(--fg-muted);
  font-family: var(--font-mono);
  font-size: 0.82rem;
  padding: 1rem 0;
}

@media (max-width: 600px) {
  .form-grid { grid-template-columns: 1fr; }
  .span-2 { grid-column: span 1; }
}
</style>
