import { ref, computed } from 'vue'

const token = ref(localStorage.getItem('admin_token') || null)

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value)

  function setToken(t) {
    token.value = t
    localStorage.setItem('admin_token', t)
  }

  function clearToken() {
    token.value = null
    localStorage.removeItem('admin_token')
  }

  function getToken() {
    return token.value
  }

  return { isAuthenticated, setToken, clearToken, getToken }
}
