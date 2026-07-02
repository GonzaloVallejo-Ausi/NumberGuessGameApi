'use client'

import { Masthead } from '@/components/masthead'
import { GameBoard } from '@/components/game-board'
import { RequireAuth } from '@/components/require-auth'

export default function PlayPage() {
  return (
    <main className="mx-auto max-w-5xl bg-card/40">
      <Masthead />
      <div className="p-5 sm:p-7">
        <RequireAuth>
          <GameBoard />
        </RequireAuth>
      </div>
    </main>
  )
}
