<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth.js'
import { adminLogin } from '../../composables/useAdminApi.js'

const password = ref('')
const error    = ref('')
const loading  = ref(false)
const router   = useRouter()
const { setToken, isAuthenticated } = useAuth()

if (isAuthenticated.value) router.push('/admin')

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    const { token } = await adminLogin(password.value)
    setToken(token)
    router.push('/admin')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-wrap">
    <div class="login-box">
      <p class="login-label">// admin</p>
      <h1 class="login-title">vb<span class="cursor">_</span></h1>

      <div class="field">
        <label for="password">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="Enter password"
          autofocus
          @keydown.enter="handleLogin"
        />
      </div>

      <p v-if="error" class="error">{{ error }}</p>

      <button class="btn" :disabled="loading || !password" @click="handleLogin">
        {{ loading ? 'Authenticating…' : 'Login' }}
      </button>

      <a href="/" class="back-link">← back to site</a>
    </div>
  </div>
</template>

<style scoped>
.login-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-box {
  width: 100%;
  max-width: 380px;
  padding: 2.5rem;
  background: var(--bg-alt);
  border: 1px solid var(--border);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.login-label {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--blue);
  letter-spacing: 0.15em;
}

.login-title {
  font-family: var(--font-mono);
  font-size: 2rem;
  font-weight: 700;
  color: var(--fg);
  line-height: 1;
}

.cursor {
  color: var(--cyan);
  animation: blink 1.1s step-end infinite;
}

@keyframes blink { 0%,100% { opacity:1 } 50% { opacity:0 } }

.field { display: flex; flex-direction: column; gap: 0.4rem; }

label {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--fg-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

input {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--fg);
  font-family: var(--font-sans);
  font-size: 0.95rem;
  padding: 0.65rem 0.9rem;
  outline: none;
  transition: border-color 0.2s;
}

input:focus { border-color: var(--blue); }

.btn {
  background: var(--blue);
  border: none;
  border-radius: 6px;
  color: var(--bg);
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 700;
  padding: 0.7rem;
  transition: opacity 0.2s;
  width: 100%;
}

.btn:hover:not(:disabled) { opacity: 0.85; }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }

.error {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--red);
}

.back-link {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--fg-muted);
  text-align: center;
}

.back-link:hover { color: var(--blue); }
</style>
