'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { AdBox, Kicker } from './vintage'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, ready } = useAuth()

  if (!ready) {
    return (
      <div className="p-10 text-center font-display uppercase tracking-widest text-muted-foreground">
        Cargando la edición…
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="p-6 sm:p-10">
        <AdBox double className="mx-auto max-w-md text-center">
          <Kicker>Acceso reservado a suscriptores</Kicker>
          <h2 className="headline mt-2 text-3xl font-bold leading-none">
            ¡Alto ahí!
          </h2>
          <p className="mt-2 font-sans text-sm text-muted-foreground">
            Debe inscribirse o iniciar sesión antes de tomar asiento en la
            mesa de juego.
          </p>
          <Link
            href="/"
            className="mt-5 inline-block border-2 border-foreground bg-foreground px-5 py-3 font-display uppercase tracking-wide text-primary-foreground hover:bg-accent hover:border-accent"
          >
            Ir al cupón de inscripción →
          </Link>
        </AdBox>
      </div>
    )
  }

  return <>{children}</>
}
