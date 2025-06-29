type ApiFetchOptions<B = undefined> = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: B
  headers?: Record<string, string>
  withAuth?: boolean
  token?: string | null
  cache?: RequestCache
  isFormData?: boolean
}

export async function apiClient<T, B = undefined>(
  path: string,
  {
    method = 'GET',
    body,
    headers = {},
    withAuth = false,
    token,
    cache = 'no-store',
    isFormData = false,
  }: ApiFetchOptions<B> = {}
): Promise<T> {
  const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}${path}`

  const finalHeaders: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...headers,
  }

  if (withAuth && token) {
    finalHeaders['Authorization'] = `Bearer ${token}`
  }

  const fetchOptions: RequestInit = {
    method,
    headers: finalHeaders,
    body: isFormData ? (body as BodyInit) : body ? JSON.stringify(body) : undefined,
    cache,
  }

  let res: Response
  try {
    res = await fetch(fullUrl, fetchOptions)
    if (process.env.NODE_ENV === 'development') {
      console.info(`[apiClient] ${method} ${path} → ${res.status}`)
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[apiClient] NETWORK_ERROR: ${method} ${path} `, error)
    }
    throw new Error('NETWORK_ERROR')
  }

  let data: unknown

  try {
    if (res.status === 204) {
      data = null
    } else {
      data = await res.json()
    }
  } catch {
    const raw = await res.text()
    if (process.env.NODE_ENV === 'development') {
      console.error('[apiClient] INVALID_JSON_RESPONSE: ', raw)
    }
    throw new Error('INVALID_JSON_RESPONSE')
  }

  if (!res.ok) {
    // errorCode가 없는 경우 (ex: "message": "Unauthorized") 등 예상 못 한 응답 포맷 대비용
    const maybeError = data as Record<string, unknown>

    const errorCode =
      typeof maybeError.errorCode === 'string' ? maybeError.errorCode : 'UNEXPECTED_ERROR'

    // ErrorCode있는 예상 가능한 에러
    if (process.env.NODE_ENV === 'development') {
      console.error(`[apiClient] EXPECTED_ERROR: ${method} ${path} `, errorCode)
    }

    // 디버깅을 위해 전체 응답 출력
    if (errorCode === 'UNEXPECTED_ERROR') {
      if (process.env.NODE_ENV === 'development') {
        console.error('[apiClient] UNEXPECTED_ERROR: ', data)
      }
    }

    throw new Error(errorCode)
  }

  return data as T
}
