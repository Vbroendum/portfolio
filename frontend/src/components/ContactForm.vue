<script setup>
import { ref } from 'vue'
import { sendContact } from '../composables/useApi.js'

const name    = ref('')
const email   = ref('')
const message = ref('')
const status  = ref('idle') // idle | loading | success | error
const errorMsg = ref('')

async function handleSubmit() {
  status.value = 'loading'
  errorMsg.value = ''
  try {
    await sendContact({ name: name.value, email: email.value, message: message.value })
    status.value = 'success'
    name.value = email.value = message.value = ''
  } catch (err) {
    status.value = 'error'
    errorMsg.value = err.message
  }
}
</script>

<template>
  <div class="form-wrap">
    <div v-if="status === 'success'" class="success-msg">
      <span class="success-icon">✓</span>
      Message sent — I'll get back to you soon.
    </div>

    <template v-else>
      <div class="field">
        <label for="name">Name</label>
        <input id="name" v-model="name" type="text" placeholder="Your name" autocomplete="name" />
      </div>

      <div class="field">
        <label for="email">Email</label>
        <input id="email" v-model="email" type="email" placeholder="you@example.com" autocomplete="email" />
      </div>

      <div class="field">
        <label for="message">Message</label>
        <textarea id="message" v-model="message" rows="5" placeholder="What's on your mind?" />
      </div>

      <div v-if="status === 'error'" class="error-msg">{{ errorMsg }}</div>

      <button
        class="btn"
        :disabled="status === 'loading' || !name || !email || !message"
        @click="handleSubmit"
      >
        <span v-if="status === 'loading'">Sending…</span>
        <span v-else>Send message</span>
      </button>
    </template>
  </div>
</template>

<style scoped>
.form-wrap {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 540px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

label {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--fg-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

input, textarea {
  background: var(--bg-alt);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--fg);
  font-family: var(--font-sans);
  font-size: 0.95rem;
  padding: 0.65rem 0.9rem;
  outline: none;
  transition: border-color 0.2s;
  resize: vertical;
}

input::placeholder, textarea::placeholder { color: var(--fg-muted); }

input:focus, textarea:focus { border-color: var(--blue); }

.btn {
  align-self: flex-start;
  background: transparent;
  border: 1px solid var(--blue);
  border-radius: 6px;
  color: var(--blue);
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  padding: 0.6rem 1.4rem;
  transition: background 0.2s, color 0.2s;
}

.btn:hover:not(:disabled) {
  background: var(--blue);
  color: var(--bg);
}

.btn:disabled { opacity: 0.4; cursor: not-allowed; }

.success-msg {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--green);
  font-family: var(--font-mono);
  font-size: 0.9rem;
  padding: 1rem;
  border: 1px solid rgba(158, 206, 106, 0.3);
  border-radius: 6px;
  background: rgba(158, 206, 106, 0.05);
}

.success-icon {
  font-size: 1.1rem;
  color: var(--green);
}

.error-msg {
  color: var(--red);
  font-family: var(--font-mono);
  font-size: 0.8rem;
}
</style>
