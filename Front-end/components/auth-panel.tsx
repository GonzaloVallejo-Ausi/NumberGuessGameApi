'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api, ApiError } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { AdBox, CouponField, Kicker, Stamp } from './vintage'

type Mode = 'login' | 'register'

export function AuthPanel() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [mode, setMode] = useState<Mode>('register')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [age, setAge] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res =
        mode === 'register'
          ? await api.register({
              firstName: firstName.trim(),
              lastName: lastName.trim(),
              age: Number(age) || 0,
              email: email.trim(),
              password,
            })
          : await api.login({ email: email.trim(), password })
      signIn(res.token)
      router.push('/play')
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Ocurrió un error inesperado.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdBox double className="relative">
      <Stamp className="absolute -top-3 -right-3 z-10 text-xs">
        ¡Envíe
        <br />
        hoy!
      </Stamp>

      <Kicker>Cupón de inscripción &mdash; sin costo</Kicker>
      <h2 className="headline mt-1 text-3xl sm:text-4xl font-bold leading-none">
        {mode === 'register'
          ? '¡Únase al Club!'
          : '¡Bienvenido de nuevo!'}
      </h2>
      <p className="mt-1 font-sans text-sm text-muted-foreground">
        {mode === 'register'
          ? 'Complete sus datos con letra clara y comience a jugar en el acto.'
          : 'Identifíquese para retomar la partida.'}
      </p>

      <div className="my-3 border-t-2 border-dotted border-foreground" />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {mode === 'register' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CouponField
                label="Nombre"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                autoComplete="given-name"
              />
              <CouponField
                label="Apellido"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                autoComplete="family-name"
              />
            </div>
            <CouponField
              label="Edad"
              type="number"
              min={1}
              max={120}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              className="max-w-[6rem]"
            />
          </>
        )}
        <CouponField
          label="Correo"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <CouponField
          label="Clave"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete={
            mode === 'register' ? 'new-password' : 'current-password'
          }
        />

        {error && (
          <p
            role="alert"
            className="border-2 border-accent bg-card px-3 py-2 font-sans text-sm text-accent"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-1 w-full border-2 border-foreground bg-foreground px-4 py-3 font-display text-lg uppercase tracking-wide text-primary-foreground transition-colors hover:bg-accent hover:border-accent disabled:opacity-60"
        >
          {loading
            ? 'Enviando…'
            : mode === 'register'
              ? 'Enviar cupón e ingresar'
              : 'Ingresar'}
        </button>
      </form>

      <div className="my-3 border-t-2 border-dotted border-foreground" />

      <button
        onClick={() => {
          setMode(mode === 'register' ? 'login' : 'register')
          setError(null)
        }}
        className="font-display uppercase text-sm tracking-wide text-accent hover:underline underline-offset-2"
      >
        {mode === 'register'
          ? '¿Ya es suscriptor? Inicie sesión →'
          : '¿Nuevo por aquí? Inscríbase gratis →'}
      </button>
    </AdBox>
  )
}
