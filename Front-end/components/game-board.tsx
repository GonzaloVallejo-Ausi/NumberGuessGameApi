'use client'

import { useState } from 'react'
import { api, ApiError, type GuessResponse } from '@/lib/api'
import { AdBox, Kicker, Stamp } from './vintage'

interface Row extends GuessResponse {
  n: number
}

export function GameBoard() {
  const [gameId, setGameId] = useState<number | null>(null)
  const [rows, setRows] = useState<Row[]>([])
  const [guess, setGuess] = useState('')
  const [loading, setLoading] = useState(false)
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [won, setWon] = useState(false)

  const finished = won

  async function startGame() {
    setError(null)
    setStarting(true)
    try {
      const res = await api.startGame()
      setGameId(res.gameId)
      setRows([])
      setWon(false)
      setGuess('')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo iniciar.')
    } finally {
      setStarting(false)
    }
  }

  function isValid(value: string) {
    if (!/^\d{4}$/.test(value)) return false
    return new Set(value.split('')).size === 4
  }

  async function submitGuess(e: React.FormEvent) {
    e.preventDefault()
    if (gameId == null || !isValid(guess)) return
    setError(null)
    setLoading(true)
    try {
      const res = await api.guess(gameId, guess)
      setRows((prev) => [{ ...res, n: prev.length + 1 }, ...prev])
      setGuess('')
      if (res.famas === 4 || res.status?.toLowerCase() === 'finished') {
        setWon(true)
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Intento rechazado.')
    } finally {
      setLoading(false)
    }
  }

  // No active game yet — show the "start" ad.
  if (gameId == null) {
    return (
      <AdBox double className="mx-auto max-w-lg text-center">
        <Kicker>La máquina está lista</Kicker>
        <h2 className="headline mt-2 text-4xl font-bold leading-none">
          Nueva partida
        </h2>
        <p className="mt-3 font-sans text-sm leading-relaxed text-muted-foreground">
          Al presionar el botón, la máquina elegirá un número secreto de{' '}
          <strong>cuatro cifras distintas</strong>. Tendrá intentos
          ilimitados para descifrarlo.
        </p>
        {error && (
          <p className="mt-4 border-2 border-accent px-3 py-2 font-sans text-sm text-accent">
            {error}
          </p>
        )}
        <button
          onClick={startGame}
          disabled={starting}
          className="mt-6 w-full border-2 border-foreground bg-foreground px-4 py-4 font-display text-xl uppercase tracking-wide text-primary-foreground hover:bg-accent hover:border-accent disabled:opacity-60"
        >
          {starting ? 'Preparando…' : '¡Comenzar a jugar!'}
        </button>
      </AdBox>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Control panel */}
      <div className="lg:col-span-2">
        <AdBox double className="relative">
          {finished && (
            <Stamp className="absolute -top-3 -right-3 z-10 text-base">
              ¡Ganó!
            </Stamp>
          )}
          <Kicker>Partida N.º {gameId}</Kicker>
          <h2 className="headline mt-1 text-3xl font-bold leading-none">
            {finished ? '¡Descifrado!' : 'Su intento'}
          </h2>

          {finished ? (
            <>
              <p className="mt-3 font-sans text-sm leading-relaxed">
                ¡Felicitaciones! Descifró el número secreto en{' '}
                <strong>{rows.length}</strong>{' '}
                {rows.length === 1 ? 'intento' : 'intentos'}.
              </p>
              <button
                onClick={startGame}
                disabled={starting}
                className="mt-5 w-full border-2 border-foreground bg-accent px-4 py-3 font-display text-lg uppercase tracking-wide text-accent-foreground hover:bg-foreground hover:border-foreground disabled:opacity-60"
              >
                {starting ? 'Preparando…' : 'Jugar otra vez'}
              </button>
            </>
          ) : (
            <form onSubmit={submitGuess} className="mt-4">
              <label className="font-display uppercase text-xs tracking-widest text-muted-foreground">
                Escriba 4 cifras distintas
              </label>
              <input
                inputMode="numeric"
                pattern="\d*"
                maxLength={4}
                value={guess}
                onChange={(e) =>
                  setGuess(e.target.value.replace(/\D/g, '').slice(0, 4))
                }
                placeholder="0000"
                className="mt-2 w-full border-2 border-foreground bg-secondary px-3 py-3 text-center font-display text-4xl tracking-[0.5em] text-foreground focus:border-accent focus:outline-none"
              />
              {guess.length === 4 && !isValid(guess) && (
                <p className="mt-2 font-sans text-xs text-accent">
                  Las cuatro cifras deben ser distintas.
                </p>
              )}
              {error && (
                <p className="mt-2 border-2 border-accent px-3 py-2 font-sans text-sm text-accent">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading || !isValid(guess)}
                className="mt-4 w-full border-2 border-foreground bg-foreground px-4 py-3 font-display text-lg uppercase tracking-wide text-primary-foreground hover:bg-accent hover:border-accent disabled:opacity-50"
              >
                {loading ? 'Comprobando…' : 'Enviar intento'}
              </button>
            </form>
          )}

          <div className="mt-5 border-t-2 border-dotted border-foreground pt-3">
            <p className="flex justify-between font-sans text-sm">
              <span className="font-display uppercase tracking-wide text-accent">
                Famas
              </span>
              <span>cifra y posición correctas</span>
            </p>
            <p className="mt-1 flex justify-between font-sans text-sm">
              <span className="font-display uppercase tracking-wide text-accent">
                Picas
              </span>
              <span>cifra correcta, mal lugar</span>
            </p>
          </div>
        </AdBox>
      </div>

      {/* Attempts ledger */}
      <div className="lg:col-span-3">
        <AdBox className="h-full">
          <Kicker>Registro de intentos</Kicker>
          {rows.length === 0 ? (
            <p className="mt-4 font-sans italic text-sm text-muted-foreground">
              Aún no hay intentos. El registro aparecerá aquí, del más
              reciente al más antiguo.
            </p>
          ) : (
            <table className="mt-3 w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-foreground text-left font-display uppercase text-xs tracking-widest">
                  <th className="py-2 pr-2">N.º</th>
                  <th className="py-2 pr-2">Número</th>
                  <th className="py-2 pr-2 text-accent">Famas</th>
                  <th className="py-2 text-accent">Picas</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.n}
                    className="border-b border-dotted border-foreground"
                  >
                    <td className="py-2 pr-2 font-sans text-sm text-muted-foreground">
                      {r.n}
                    </td>
                    <td className="py-2 pr-2 font-display text-2xl tracking-[0.3em]">
                      {r.attemptedNumber}
                    </td>
                    <td className="py-2 pr-2 font-display text-2xl text-accent">
                      {r.famas}
                    </td>
                    <td className="py-2 font-display text-2xl">{r.picas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </AdBox>
      </div>
    </div>
  )
}
