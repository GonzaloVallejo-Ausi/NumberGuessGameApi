'use client'

import Link from 'next/link'
import { Masthead } from '@/components/masthead'
import { AuthPanel } from '@/components/auth-panel'
import { AdBox, Kicker, Stamp } from '@/components/vintage'
import { useAuth } from '@/lib/auth'

const rules = [
  {
    term: 'FAMAS',
    desc: 'Cifra correcta en la posición correcta. ¡El premio mayor!',
  },
  {
    term: 'PICAS',
    desc: 'Cifra correcta, pero en la posición equivocada.',
  },
  {
    term: 'OBJETIVO',
    desc: 'Obtenga 4 Famas para descifrar el número secreto.',
  },
]

export default function HomePage() {
  const { isAuthenticated, ready } = useAuth()

  return (
    <main className="mx-auto max-w-5xl bg-card/40">
      <Masthead />

      <div className="grid grid-cols-1 gap-0 md:grid-cols-5">
        {/* Left editorial column */}
        <section className="md:col-span-3 border-b md:border-b-0 md:border-r border-foreground p-5 sm:p-7">
          <Kicker>Pruebas de laboratorio lo demuestran</Kicker>
          <h2 className="headline mt-2 text-4xl sm:text-5xl font-bold leading-[0.95]">
            ¿No logra
            <br />
            descifrar
            <br />
            el código?
          </h2>
          <p className="mt-4 font-sans leading-relaxed text-[15px]">
            Ponga a prueba su <em>ingenio deductivo</em> con el pasatiempo
            favorito de miles de hogares. La máquina elige un número secreto
            de cuatro cifras <strong>distintas</strong>. Usted intenta
            adivinarlo, y en cada intento recibe pistas exactas.
          </p>

          <div className="my-5 border-t-2 border-foreground pt-4">
            <Kicker>Cómo se juega</Kicker>
            <dl className="mt-3 divide-y divide-dotted divide-foreground">
              {rules.map((r) => (
                <div key={r.term} className="flex items-baseline gap-4 py-2">
                  <dt className="font-display uppercase font-bold tracking-wide text-accent w-24 shrink-0">
                    {r.term}
                  </dt>
                  <dd className="font-sans text-sm leading-snug">{r.desc}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex flex-wrap items-center gap-4 border-t-2 border-dotted border-foreground pt-5">
            <Stamp>
              Sin
              <br />
              costo
            </Stamp>
            <p className="font-sans italic text-sm text-muted-foreground max-w-xs">
              &ldquo;Lo probé una tarde y no pude soltarlo. ¡Mis vecinos
              también se apuntaron!&rdquo; &mdash; G. Hagins, Ohio
            </p>
          </div>

          {ready && isAuthenticated && (
            <Link
              href="/play"
              className="mt-6 inline-block border-2 border-foreground bg-accent px-5 py-3 font-display text-lg uppercase tracking-wide text-accent-foreground hover:bg-foreground hover:border-foreground"
            >
              ¡A jugar ahora! →
            </Link>
          )}
        </section>

        {/* Right column: coupon / account */}
        <aside className="md:col-span-2 p-5 sm:p-7">
          {ready && isAuthenticated ? (
            <AdBox double>
              <Kicker>Su suscripción está activa</Kicker>
              <h2 className="headline mt-1 text-3xl font-bold leading-none">
                ¡Todo listo!
              </h2>
              <p className="mt-2 font-sans text-sm text-muted-foreground">
                Ya puede comenzar una nueva partida o revisar las estadísticas
                del laboratorio.
              </p>
              <div className="mt-5 flex flex-col gap-3">
                <Link
                  href="/play"
                  className="w-full border-2 border-foreground bg-foreground px-4 py-3 text-center font-display text-lg uppercase tracking-wide text-primary-foreground hover:bg-accent hover:border-accent"
                >
                  Empezar partida
                </Link>
                <Link
                  href="/metrics"
                  className="w-full border-2 border-foreground px-4 py-3 text-center font-display text-sm uppercase tracking-wide text-foreground hover:bg-secondary"
                >
                  Ver laboratorio
                </Link>
              </div>
            </AdBox>
          ) : (
            <AuthPanel />
          )}

          <div className="mt-6 border-2 border-foreground bg-secondary p-4">
            <p className="font-display uppercase text-xs tracking-widest text-center text-muted-foreground">
              Próximamente el próximo mes
            </p>
            <p className="mt-1 text-center font-sans italic text-sm">
              Cómo construir su propio detector de mentiras
            </p>
          </div>
        </aside>
      </div>

      <footer className="border-t-[3px] border-foreground px-4 py-3 text-center">
        <p className="font-display uppercase text-[11px] tracking-widest text-muted-foreground">
          Picas &amp; Famas Mfg. Co. — Dept. W-23 — Oxford, Michigan, USA
        </p>
      </footer>
    </main>
  )
}
