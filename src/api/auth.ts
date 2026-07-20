import { apiClient, getAccessToken } from './client'
import type { AuthUser, LoginResponse } from '../types'
import { MOCK_API, mockResolve } from './mock'

export async function login(email: string, password: string): Promise<LoginResponse> {
  if (MOCK_API) {
    if (!email || !password) throw new Error('Email and password are required')
    const role = email.includes('user') ? 'USER' : 'ADMIN'
    return mockResolve({ accessToken: `mock.${role}.token`, refreshToken: 'mock-refresh', role })
  }
  const { data } = await apiClient.post<LoginResponse>('/auth/login', { email, password })
  return data
}

export async function fetchMe(): Promise<AuthUser> {
  if (MOCK_API) {
    const token = getAccessToken()
    const role = token?.includes('USER') ? 'USER' : 'ADMIN'
    return mockResolve({
      userId: 'usr_000',
      email: role === 'ADMIN' ? 'selam.tesfaye@speedway.et' : 'user@speedway.et',
      role,
      name: role === 'ADMIN' ? 'Selam Tesfaye' : 'Demo User',
    })
  }
  const { data } = await apiClient.get<AuthUser>('/auth/me')
  return data
}

export async function logout(): Promise<void> {
  if (MOCK_API) return mockResolve(undefined)
  await apiClient.post('/auth/logout')
}
