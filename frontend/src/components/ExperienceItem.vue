<script setup>
defineProps({
  item: { type: Object, required: true }
})
</script>

<template>
  <div class="item">
    <div class="item-left">
      <span class="item-period">{{ item.period }}</span>
    </div>
    <div class="item-right">
      <h3 class="item-role">{{ item.role }}</h3>
      <span class="item-company">@ {{ item.company }}</span>
      <p v-if="item.description" class="item-desc">{{ item.description }}</p>
    </div>
  </div>
</template>

<style scoped>
.item {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 1.5rem;
  padding: 1.5rem 0;
  border-top: 1px solid var(--border);
}

.item:last-child { border-bottom: 1px solid var(--border); }

.item-left {
  padding-top: 0.2rem;
}

.item-period {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--fg-muted);
  white-space: nowrap;
}

.item-role {
  font-family: var(--font-mono);
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--fg);
  margin-bottom: 0.2rem;
}

.item-company {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--blue);
}

.item-desc {
  margin-top: 0.6rem;
  font-size: 0.88rem;
  color: var(--fg-muted);
  line-height: 1.65;
}

@media (max-width: 600px) {
  .item { grid-template-columns: 1fr; gap: 0.5rem; }
}
</style>
