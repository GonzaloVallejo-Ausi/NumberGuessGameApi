'use client'

import { useEffect, useState } from 'react'
import { getApiBase, setApiBase } from '@/lib/api'

export function ApiSettings() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [current, setCurrent] = useState('')

  useEffect(() => {
    const base = getApiBase()
    setCurrent(base)
    setValue(base)
  }, [])

  function save() {
    const clean = value.trim()
    if (clean) {
      setApiBase(clean)
      setCurrent(clean.replace(/\/$/, ''))
    }
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="font-display uppercase tracking-wide text-foreground hover:text-accent hover:underline underline-offset-2"
      >
        Central telefónica
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-72 border-2 border-foreground bg-card p-4 text-left shadow-[4px_4px_0_0_var(--foreground)]">
          <p className="font-display uppercase text-xs tracking-widest text-accent font-semibold">
            Dirección de la centralita
          </p>
          <p className="mt-1 font-sans text-[11px] leading-snug text-muted-foreground">
            Indique dónde escucha su servidor de C#. Ej.
            http://localhost:5164
          </p>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="http://localhost:5164"
            className="mt-3 w-full border-b-2 border-dotted border-foreground bg-transparent px-1 py-1 font-mono text-xs text-foreground focus:border-solid focus:border-accent focus:outline-none"
          />
          <div className="mt-3 flex items-center justify-between">
            <span className="font-mono text-[10px] text-muted-foreground truncate max-w-[9rem]">
              {current}
            </span>
            <button
              onClick={save}
              className="border-2 border-foreground bg-foreground px-3 py-1 font-display text-xs uppercase tracking-wide text-primary-foreground hover:bg-accent hover:border-accent"
            >
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
