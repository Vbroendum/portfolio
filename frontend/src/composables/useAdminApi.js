import { useAuth } from './useAuth.js'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function authHeaders() {
  const { getToken } = useAuth()
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`,
  }
}

async function handle(res) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Request failed (${res.status})`)
  }
  return res.json()
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export async function adminLogin(password) {
  const res = await fetch(`${BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  return handle(res)
}

// ── Projects ──────────────────────────────────────────────────────────────────
export async function createProject(data) {
  return handle(await fetch(`${BASE}/projects`, {
    method: 'POST', headers: authHeaders(), body: JSON.stringify(data),
  }))
}

export async function updateProject(id, data) {
  return handle(await fetch(`${BASE}/projects/${id}`, {
    method: 'PUT', headers: authHeaders(), body: JSON.stringify(data),
  }))
}

export async function deleteProject(id) {
  return handle(await fetch(`${BASE}/projects/${id}`, {
    method: 'DELETE', headers: authHeaders(),
  }))
}

// ── Experience ────────────────────────────────────────────────────────────────
export async function createExperience(data) {
  return handle(await fetch(`${BASE}/experience`, {
    method: 'POST', headers: authHeaders(), body: JSON.stringify(data),
  }))
}

export async function updateExperience(id, data) {
  return handle(await fetch(`${BASE}/experience/${id}`, {
    method: 'PUT', headers: authHeaders(), body: JSON.stringify(data),
  }))
}

export async function deleteExperience(id) {
  return handle(await fetch(`${BASE}/experience/${id}`, {
    method: 'DELETE', headers: authHeaders(),
  }))
}
