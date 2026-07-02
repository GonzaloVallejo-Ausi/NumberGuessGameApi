'use client'

import { Masthead } from '@/components/masthead'
import { MetricsBoard } from '@/components/metrics-board'
import { RequireAuth } from '@/components/require-auth'

export default function MetricsPage() {
  return (
    <main className="mx-auto max-w-5xl bg-card/40">
      <Masthead />
      <div className="p-5 sm:p-7">
        <RequireAuth>
          <MetricsBoard />
        </RequireAuth>
      </div>
    </main>
  )
}
