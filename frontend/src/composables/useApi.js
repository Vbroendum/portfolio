const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export async function getProjects() {
  const res = await fetch(`${BASE}/projects`)
  if (!res.ok) throw new Error('Failed to fetch projects')
  return res.json()
}

export async function getExperience() {
  const res = await fetch(`${BASE}/experience`)
  if (!res.ok) throw new Error('Failed to fetch experience')
  return res.json()
}

export async function sendContact(data) {
  const res = await fetch(`${BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Failed to send message')
  }
  return res.json()
}
