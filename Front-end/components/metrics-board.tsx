'use client'

import { useEffect, useState } from 'react'
import {
  api,
  ApiError,
  type AttemptsStats,
  type TopGame,
  type UsersPerDay,
} from '@/lib/api'
import { AdBox, Kicker } from './vintage'

function formatNumber(v: number | undefined) {
  if (v == null || Number.isNaN(v)) return '—'
  return Number.isInteger(v) ? String(v) : v.toFixed(2)
}

export function MetricsBoard() {
  const [usersPerDay, setUsersPerDay] = useState<UsersPerDay[] | null>(null)
  const [topGames, setTopGames] = useState<TopGame[] | null>(null)
  const [stats, setStats] = useState<AttemptsStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const [u, t, s] = await Promise.all([
        api.usersPerDay().catch(() => [] as UsersPerDay[]),
        api.top5Games().catch(() => [] as TopGame[]),
        api.attemptsStats().catch(() => ({}) as AttemptsStats),
      ])
      setUsersPerDay(u)
      setTopGames(t)
      setStats(s)
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'No se pudieron cargar.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const maxUsers = usersPerDay?.length
    ? Math.max(...usersPerDay.map((d) => d.count), 1)
    : 1

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between border-b-2 border-foreground pb-3">
        <div>
          <Kicker>Pruebas de laboratorio lo demuestran</Kicker>
          <h2 className="headline mt-1 text-4xl font-bold leading-none">
            El Laboratorio
          </h2>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="border-2 border-foreground px-4 py-2 font-display text-sm uppercase tracking-wide hover:bg-secondary disabled:opacity-60"
        >
          {loading ? 'Midiendo…' : 'Actualizar'}
        </button>
      </div>

      {error && (
        <p className="border-2 border-accent px-3 py-2 font-sans text-sm text-accent">
          {error}
        </p>
      )}

      {/* Attempt statistics as big "spec" figures */}
      <AdBox>
        <Kicker>Rendimiento comprobado</Kicker>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Partidas totales', value: stats?.totalGames },
            { label: 'Intentos totales', value: stats?.totalAttempts },
            { label: 'Prom. intentos', value: stats?.averageAttempts },
            { label: 'Prom. picas', value: stats?.averagePicas },
          ].map((m) => (
            <div
              key={m.label}
              className="border-2 border-foreground bg-secondary p-3 text-center"
            >
              <p className="font-display text-4xl font-bold leading-none">
                {loading ? '··' : formatNumber(m.value as number)}
              </p>
              <p className="mt-2 font-display uppercase text-[10px] tracking-widest text-muted-foreground">
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </AdBox>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Users per day — ASCII-ish bar chart */}
        <AdBox className="h-full">
          <Kicker>Nuevos suscriptores por día</Kicker>
          {loading ? (
            <p className="mt-4 font-sans italic text-sm text-muted-foreground">
              Contando cupones recibidos…
            </p>
          ) : usersPerDay && usersPerDay.length > 0 ? (
            <ul className="mt-4 flex flex-col gap-2">
              {usersPerDay.map((d) => (
                <li key={d.date} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 font-mono text-xs text-muted-foreground">
                    {d.date}
                  </span>
                  <span
                    className="halftone h-4 border border-foreground"
                    style={{
                      width: `${Math.max((d.count / maxUsers) * 100, 4)}%`,
                    }}
                    aria-hidden="true"
                  />
                  <span className="font-display text-lg">{d.count}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 font-sans italic text-sm text-muted-foreground">
              Sin registros todavía.
            </p>
          )}
        </AdBox>

        {/* Top 5 games */}
        <AdBox className="h-full">
          <Kicker>Las 5 partidas más disputadas</Kicker>
          {loading ? (
            <p className="mt-4 font-sans italic text-sm text-muted-foreground">
              Revisando el archivo…
            </p>
          ) : topGames && topGames.length > 0 ? (
            <ol className="mt-3 flex flex-col divide-y divide-dotted divide-foreground">
              {topGames.map((g, i) => (
                <li
                  key={g.gameId}
                  className="flex items-baseline gap-3 py-2"
                >
                  <span className="font-display text-2xl font-bold text-accent w-8">
                    {i + 1}
                  </span>
                  <span className="flex-1 font-sans text-sm">
                    Partida N.º {g.gameId}
                    {g.playerEmail ? (
                      <span className="text-muted-foreground">
                        {' '}
                        — {g.playerEmail}
                      </span>
                    ) : null}
                  </span>
                  <span className="font-display text-lg">
                    {g.attempts}{' '}
                    <span className="text-xs uppercase text-muted-foreground">
                      int.
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-4 font-sans italic text-sm text-muted-foreground">
              Aún no hay partidas registradas.
            </p>
          )}
        </AdBox>
      </div>
    </div>
  )
}
