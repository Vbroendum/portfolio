<script setup>
defineProps({
  project: { type: Object, required: true }
})
</script>

<template>
  <article class="card">
    <div class="card-header">
      <span class="card-icon">⬡</span>
      <div class="card-links">
        <a v-if="project.github_url" :href="project.github_url" target="_blank" rel="noopener" title="GitHub">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
          </svg>
        </a>
        <a v-if="project.live_url" :href="project.live_url" target="_blank" rel="noopener" title="Live site">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </a>
      </div>
    </div>

    <h3 class="card-title">{{ project.title }}</h3>
    <p class="card-desc">{{ project.description }}</p>

    <ul class="tech-list">
      <li v-for="tech in project.tech_stack" :key="tech" class="tech-tag">
        {{ tech }}
      </li>
    </ul>
  </article>
</template>

<style scoped>
.card {
  background: var(--bg-alt);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: border-color 0.2s, transform 0.2s;
  cursor: default;
}

.card:hover {
  border-color: var(--blue);
  transform: translateY(-3px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.card-icon {
  font-size: 1.5rem;
  color: var(--blue);
  line-height: 1;
}

.card-links {
  display: flex;
  gap: 0.75rem;
}

.card-links a {
  color: var(--fg-muted);
  display: flex;
  align-items: center;
}

.card-links a:hover { color: var(--blue); }

.card-title {
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 700;
  color: var(--fg);
}

.card-desc {
  font-size: 0.9rem;
  color: var(--fg-muted);
  flex: 1;
  line-height: 1.6;
}

.tech-list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.5rem;
}

.tech-tag {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--green);
  background: rgba(158, 206, 106, 0.08);
  border: 1px solid rgba(158, 206, 106, 0.2);
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
}
</style>
