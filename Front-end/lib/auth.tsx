'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { getToken, setToken } from './api'

interface JwtPayload {
  email?: string
  sub?: string
  name?: string
  exp?: number
  [key: string]: unknown
}

function decodeJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json)
  } catch {
    return null
  }
}

interface AuthContextValue {
  token: string | null
  email: string | null
  isAuthenticated: boolean
  ready: boolean
  signIn: (token: string) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTok] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const existing = getToken()
    if (existing) {
      const decoded = decodeJwt(existing)
      // Drop expired tokens.
      if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
        setToken(null)
      } else {
        setTok(existing)
      }
    }
    setReady(true)
  }, [])

  const signIn = useCallback((newToken: string) => {
    setToken(newToken)
    setTok(newToken)
  }, [])

  const signOut = useCallback(() => {
    setToken(null)
    setTok(null)
  }, [])

  const value = useMemo<AuthContextValue>(() => {
    const decoded = token ? decodeJwt(token) : null
    const email =
      (decoded?.email as string) ||
      (decoded?.[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
      ] as string) ||
      (decoded?.name as string) ||
      null
    return {
      token,
      email,
      isAuthenticated: !!token,
      ready,
      signIn,
      signOut,
    }
  }, [token, ready, signIn, signOut])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
