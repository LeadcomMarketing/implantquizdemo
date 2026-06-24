'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setError(data.error || 'Inloggning misslyckades')
        return
      }
      router.push('/admin')
      router.refresh()
    } catch {
      setError('Nätverksfel — försök igen')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-cream">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[360px] bg-surface border border-border rounded-[var(--r)] p-7"
        style={{ boxShadow: 'var(--shadow)' }}
      >
        <h1 className="font-display font-semibold text-2xl text-ink">Admin</h1>
        <p className="text-muted text-sm mt-1.5 mb-5">Logga in för att hantera kliniker.</p>

        <label htmlFor="password" className="block text-[13px] font-semibold mb-1.5 text-ink">
          Lösenord
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full font-body text-base bg-cream border-[1.5px] border-border-strong rounded-[11px] py-3 px-3.5 transition-all focus:outline-none focus:border-coral focus:bg-white focus:shadow-[0_0_0_4px_var(--coral-soft)]"
          autoFocus
        />

        {error && <p className="text-coral-deep text-sm mt-3">{error}</p>}

        <button
          type="submit"
          disabled={loading || !password}
          className="btn-gold w-full py-3.5 text-base mt-5 disabled:opacity-60"
        >
          {loading ? 'Loggar in…' : 'Logga in'}
        </button>
      </form>
    </main>
  )
}
