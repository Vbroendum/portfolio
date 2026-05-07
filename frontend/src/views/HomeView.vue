<script setup>
import { ref, onMounted } from 'vue'
import ProjectCard from '../components/ProjectCard.vue'
import ExperienceItem from '../components/ExperienceItem.vue'
import ContactForm from '../components/ContactForm.vue'
import { getProjects, getExperience } from '../composables/useApi.js'

const projects   = ref([])
const experience = ref([])

onMounted(async () => {
  try {
    [projects.value, experience.value] = await Promise.all([getProjects(), getExperience()])
  } catch (e) {
    console.error('Failed to load data:', e)
  }
})
</script>

<template>
  <!-- ── Nav ──────────────────────────────────────────────────────────────────── -->
  <nav>
    <div class="container nav-inner">
      <span class="nav-logo">Victor Brøndum<span class="cursor">_</span></span>
      <ul class="nav-links">
        <li><a href="#projects">projects</a></li>
        <li><a href="#experience">experience</a></li>
        <li><a href="#contact">contact</a></li>
        <li>
          <a href="https://github.com/Vbroendum" target="_blank" rel="noopener" class="nav-cta">
            GitHub ↗
          </a>
        </li>
      </ul>
    </div>
  </nav>

  <!-- ── Hero ─────────────────────────────────────────────────────────────────── -->
  <section class="hero">
    <div class="container">
      <p class="hero-greeting">Hi, I'm</p>
      <h1 class="hero-name">Victor Brøndum</h1>
      <p class="hero-title">
        <span class="keyword">Web</span> Developer
        <span class="dim"> / </span>
        <span class="keyword">Backend</span> Focused
      </p>
      <p class="hero-bio">
        I build polished, scalable systems that bridge technical architecture
        with real-world use. Based in Denmark, currently seeking an internship
        starting no later than August 2026.
      </p>
      <div class="hero-actions">
        <a href="#projects" class="btn-primary">View projects</a>
        <a href="#contact" class="btn-ghost">Get in touch</a>
      </div>
      <p class="hero-location">
        <span class="dot"></span> Odense, Denmark
      </p>
    </div>
  </section>

  <!-- ── Projects ─────────────────────────────────────────────────────────────── -->
  <section id="projects">
    <div class="container">
      <p class="section-label">// selected work</p>
      <h2 class="section-title">Projects</h2>
      <div class="projects-grid" v-if="projects.length">
        <ProjectCard
          v-for="project in projects"
          :key="project.id"
          :project="{ ...project, tech_stack: typeof project.tech_stack === 'string' ? JSON.parse(project.tech_stack) : project.tech_stack }"
        />
      </div>
      <p v-else class="loading-text">Loading projects…</p>
    </div>
  </section>

  <!-- ── Experience ────────────────────────────────────────────────────────────── -->
  <section id="experience">
    <div class="container">
      <p class="section-label">// where I've worked</p>
      <h2 class="section-title">Experience</h2>
      <div v-if="experience.length">
        <ExperienceItem
          v-for="item in experience"
          :key="item.id"
          :item="item"
        />
      </div>
      <p v-else class="loading-text">Loading experience…</p>
    </div>
  </section>

  <!-- ── About ─────────────────────────────────────────────────────────────────── -->
  <section id="about">
    <div class="container about-inner">
      <div>
        <p class="section-label">// about me</p>
        <h2 class="section-title">Stack</h2>
        <p class="about-text">
          I started in multimedia design and moved progressively toward engineering —
          now studying a Professional Bachelor's in Web Development at UCL.
          I'm comfortable across the full stack but gravitate toward backend architecture,
          infrastructure, and developer tooling.
        </p>
      </div>
      <div class="skill-groups">
        <div class="skill-group">
          <span class="skill-label">Languages</span>
          <div class="skill-tags">
            <span v-for="s in ['JavaScript', 'TypeScript']" :key="s" class="tag tag-blue">{{ s }}</span>
          </div>
        </div>
        <div class="skill-group">
          <span class="skill-label">Frontend</span>
          <div class="skill-tags">
            <span v-for="s in ['Vue 3', 'React', 'React Native', 'Vite', 'Angular']" :key="s" class="tag tag-purple">{{ s }}</span>
          </div>
        </div>
        <div class="skill-group">
          <span class="skill-label">Backend & DB</span>
          <div class="skill-tags">
            <span v-for="s in ['Node.js', 'Express', 'MariaDB', 'Firebase', 'Supabase']" :key="s" class="tag tag-cyan">{{ s }}</span>
          </div>
        </div>
        <div class="skill-group">
          <span class="skill-label">DevOps</span>
          <div class="skill-tags">
            <span v-for="s in ['Docker', 'Traefik', 'GitHub Actions']" :key="s" class="tag tag-orange">{{ s }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ── Contact ───────────────────────────────────────────────────────────────── -->
  <section id="contact">
    <div class="container">
      <p class="section-label">// let's talk</p>
      <h2 class="section-title">Contact</h2>
      <p class="contact-intro">
        I'm actively looking for internship opportunities starting no later than August 2026.
        If you have something in mind, send me a message.
      </p>
      <ContactForm />
    </div>
  </section>

  <!-- ── Footer ────────────────────────────────────────────────────────────────── -->
  <footer>
    <div class="container footer-inner">
      <span class="footer-mono">Victor Brøndum © {{ new Date().getFullYear() }}</span>
      <div class="footer-links">
        <a href="https://github.com/Vbroendum" target="_blank" rel="noopener">GitHub</a>
        <a href="https://linkedin.com/in/victor-broendum" target="_blank" rel="noopener">LinkedIn</a>
        <a href="mailto:vbroendum@gmail.com">Email</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* ── Nav ──────────────────────────────────────────────────────────────────────── */
nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(26, 27, 38, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
}

.nav-logo {
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 700;
  color: var(--blue);
}

.cursor {
  animation: blink 1.1s step-end infinite;
  color: var(--cyan);
}

@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

.nav-links {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-links a {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--fg-muted);
  transition: color 0.2s;
}

.nav-links a:hover { color: var(--fg); }

.nav-cta {
  color: var(--blue) !important;
  border: 1px solid var(--border);
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  transition: border-color 0.2s !important;
}

.nav-cta:hover { border-color: var(--blue) !important; }

/* ── Hero ─────────────────────────────────────────────────────────────────────── */
.hero {
  min-height: calc(100vh - 56px);
  display: flex;
  align-items: center;
  padding: 4rem 0;
}

.hero-greeting {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  color: var(--blue);
  margin-bottom: 0.5rem;
}

.hero-name {
  font-family: var(--font-mono);
  font-size: clamp(2.4rem, 6vw, 4rem);
  font-weight: 700;
  color: var(--fg);
  line-height: 1.1;
  margin-bottom: 0.75rem;
}

.hero-title {
  font-family: var(--font-mono);
  font-size: clamp(1rem, 2.5vw, 1.3rem);
  color: var(--fg-muted);
  margin-bottom: 1.5rem;
}

.keyword { color: var(--purple); }
.dim { color: var(--border); }

.hero-bio {
  max-width: 520px;
  font-size: 1rem;
  color: var(--fg-muted);
  margin-bottom: 2.5rem;
  line-height: 1.75;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.btn-primary {
  background: var(--blue);
  color: var(--bg);
  font-family: var(--font-mono);
  font-size: 0.85rem;
  padding: 0.65rem 1.5rem;
  border-radius: 6px;
  transition: opacity 0.2s;
}

.btn-primary:hover { opacity: 0.85; color: var(--bg); }

.btn-ghost {
  border: 1px solid var(--blue);
  color: var(--blue);
  font-family: var(--font-mono);
  font-size: 0.85rem;
  padding: 0.65rem 1.5rem;
  border-radius: 6px;
  transition: background 0.2s, color 0.2s;
}

.btn-ghost:hover { background: rgba(122, 162, 247, 0.1); color: var(--blue); }

.hero-location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--fg-muted);
}

.dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--green);
  box-shadow: 0 0 6px var(--green);
  animation: pulse 2s ease infinite;
  display: inline-block;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}

/* ── Projects ─────────────────────────────────────────────────────────────────── */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
}

/* ── About ────────────────────────────────────────────────────────────────────── */
.about-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

.about-text {
  font-size: 0.92rem;
  color: var(--fg-muted);
  line-height: 1.8;
  margin-top: -1rem;
}

.skill-groups { display: flex; flex-direction: column; gap: 1.25rem; }

.skill-group { display: flex; flex-direction: column; gap: 0.5rem; }

.skill-label {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--fg-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.skill-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; }

.tag {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
}

.tag-blue   { color: var(--blue);   background: rgba(122,162,247,0.08); border: 1px solid rgba(122,162,247,0.2); }
.tag-purple { color: var(--purple); background: rgba(187,154,247,0.08); border: 1px solid rgba(187,154,247,0.2); }
.tag-cyan   { color: var(--cyan);   background: rgba(125,207,255,0.08); border: 1px solid rgba(125,207,255,0.2); }
.tag-orange { color: var(--orange); background: rgba(255,158,100,0.08); border: 1px solid rgba(255,158,100,0.2); }

/* ── Contact ──────────────────────────────────────────────────────────────────── */
.contact-intro {
  font-size: 0.95rem;
  color: var(--fg-muted);
  max-width: 500px;
  margin-bottom: 2rem;
  line-height: 1.75;
}

/* ── Footer ───────────────────────────────────────────────────────────────────── */
footer {
  border-top: 1px solid var(--border);
  padding: 2rem 0;
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-mono {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--fg-muted);
}

.footer-links {
  display: flex;
  gap: 1.5rem;
}

.footer-links a {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--fg-muted);
}

.footer-links a:hover { color: var(--blue); }

/* ── Shared ───────────────────────────────────────────────────────────────────── */
.loading-text {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--fg-muted);
}

@media (max-width: 700px) {
  .about-inner { grid-template-columns: 1fr; gap: 2rem; }
  .nav-links { gap: 1rem; }
  .nav-links li:not(:last-child) { display: none; }
}
</style>
