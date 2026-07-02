'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { ApiSettings } from './api-settings'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/', label: 'Portada' },
  { href: '/play', label: 'El Juego' },
  { href: '/metrics', label: 'Laboratorio' },
]

export function Masthead() {
  const pathname = usePathname()
  const { isAuthenticated, email, signOut } = useAuth()

  return (
    <header className="border-b-[3px] border-foreground">
      {/* top slug line */}
      <div className="flex items-center justify-between border-b border-foreground px-4 py-1 text-[11px] font-display uppercase tracking-widest text-muted-foreground">
        <span>Vol. IV — No. 2</span>
        <span className="hidden sm:inline">
          El Diario del Ingenio Numérico
        </span>
        <span>Febrero, 1953</span>
      </div>

      {/* title */}
      <div className="px-4 py-5 text-center">
        <h1 className="headline text-5xl sm:text-7xl font-bold leading-none">
          Picas <span className="text-accent">&amp;</span> Famas
        </h1>
        <p className="mt-2 font-sans italic text-sm sm:text-base text-muted-foreground">
          &ldquo;El clásico desafío de deducción &mdash; ¡adivina el número
          secreto de cuatro cifras!&rdquo;
        </p>
      </div>

      {/* nav rule */}
      <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 border-y border-foreground px-4 py-2">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'font-display uppercase text-sm tracking-widest transition-colors hover:text-accent',
              pathname === item.href
                ? 'text-accent font-semibold underline underline-offset-4'
                : 'text-foreground',
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* account + settings bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs">
        <div className="font-display uppercase tracking-wide text-muted-foreground">
          {isAuthenticated ? (
            <span>
              Suscriptor:{' '}
              <span className="text-foreground">{email ?? 'Activo'}</span>
            </span>
          ) : (
            <span>Visitante &mdash; sin suscripción</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <ApiSettings />
          {isAuthenticated && (
            <button
              onClick={signOut}
              className="font-display uppercase tracking-wide text-accent hover:underline underline-offset-2"
            >
              Cerrar sesión
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
