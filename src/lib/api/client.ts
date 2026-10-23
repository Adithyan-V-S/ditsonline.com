/**
 * DITS Online API Client
 * Configurable to run against seeded mock data or the live Dev B backend API.
 */

export const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false';
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1';

export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: unknown) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    let errData;
    try {
      errData = await res.json();
    } catch {
      errData = null;
    }
    throw new ApiError(res.status, errData?.message || `API request failed with status ${res.status}`, errData);
  }

  return res.json() as Promise<T>;
}
