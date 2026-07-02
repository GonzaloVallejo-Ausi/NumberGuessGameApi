// API client for the "Picas y Famas" C# / .NET backend.
// The backend runs separately (e.g. http://localhost:5164), so the base URL
// is configurable at runtime and stored in the browser.

const API_BASE_KEY = 'pf_api_base'
const TOKEN_KEY = 'pf_token'

const DEFAULT_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ||
  'http://localhost:5164'

export function getApiBase(): string {
  if (typeof window === 'undefined') return DEFAULT_BASE
  return window.localStorage.getItem(API_BASE_KEY) || DEFAULT_BASE
}

export function setApiBase(url: string) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(API_BASE_KEY, url.replace(/\/$/, ''))
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string | null) {
  if (typeof window === 'undefined') return
  if (token) window.localStorage.setItem(TOKEN_KEY, token)
  else window.localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {},
): Promise<T> {
  const { method = 'GET', body, auth = false } = options
  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (auth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  let res: Response
  try {
    res = await fetch(`${getApiBase()}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(
      'No se pudo contactar el servidor. Verifica la dirección de la API y que el backend esté encendido.',
      0,
    )
  }

  const text = await res.text()
  let data: unknown = undefined
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!res.ok) {
    const msg =
      (data && typeof data === 'object' && 'message' in data
        ? String((data as { message: unknown }).message)
        : typeof data === 'string'
          ? data
          : '') || `Error ${res.status} en la solicitud.`
    throw new ApiError(msg, res.status)
  }

  return data as T
}

// ---- Types matching the backend contract ----

export interface RegisterPayload {
  firstName: string
  lastName: string
  age: number
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
}

export interface StartGameResponse {
  gameId: number
  status?: string
  createdAt?: string
}

export interface GuessResponse {
  attemptedNumber: string
  famas: number
  picas: number
  status: string // "Active" | "Finished"
}

export interface UsersPerDay {
  date: string
  count: number
}

export interface TopGame {
  gameId: number
  playerEmail?: string
  attempts: number
}

export interface AttemptsStats {
  averageAttempts?: number
  averageFamas?: number
  averagePicas?: number
  totalGames?: number
  totalAttempts?: number
  [key: string]: number | string | undefined
}

const V1 = '/api/game/v1'

export const api = {
  register: (payload: RegisterPayload) =>
    request<AuthResponse>(`${V1}/register`, { method: 'POST', body: payload }),
  login: (payload: LoginPayload) =>
    request<AuthResponse>(`${V1}/login`, { method: 'POST', body: payload }),
  startGame: () =>
    request<StartGameResponse>(`${V1}/start`, { method: 'POST', auth: true }),
  guess: (gameId: number, attemptedNumber: string) =>
    request<GuessResponse>(`${V1}/guess`, {
      method: 'POST',
      body: { gameId, attemptedNumber },
      auth: true,
    }),
  usersPerDay: () =>
    request<UsersPerDay[]>(`${V1}/metrics/users-per-day`, { auth: true }),
  top5Games: () =>
    request<TopGame[]>(`${V1}/metrics/top-5-games`, { auth: true }),
  attemptsStats: () =>
    request<AttemptsStats>(`${V1}/metrics/attempts-stats`, { auth: true }),
}
