type ApiFetchOptions<B = undefined> = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: B
  headers?: Record<string, string>
  withAuth?: boolean
  token?: string | null
  cache?: RequestCache
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
  }: ApiFetchOptions<B> = {}
): Promise<T> {
  const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}${path}`

  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  }

  if (withAuth && token) {
    finalHeaders['Authorization'] = `Bearer ${token}`
  }

  const fetchOptions: RequestInit = {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
    cache,
  }

  let res: Response
  try {
    res = await fetch(fullUrl, fetchOptions)
    console.info(`✅ [apiClient] ${method} ${path} → ${res.status}`)
  } catch (err) {
    console.error(`❌ [apiClient] 네트워크 에러: ${method} ${path}`)
    console.error(err)
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
    console.error('❌ [apiClient] JSON 파싱 실패: ', raw)
    throw new Error('INVALID_JSON_RESPONSE')
  }

  if (!res.ok) {
    // errorCode가 없는 경우 (ex: "message": "Unauthorized") 등 예상 못 한 응답 포맷 대비용
    const maybeError = data as Record<string, unknown>

    const errorCode =
      typeof maybeError.errorCode === 'string' ? maybeError.errorCode : 'UNEXPECTED_ERROR'

    console.error(`❌ [apiClient] API 에러: ${method} ${path}`)
    console.error(`📦 상태 코드: ${res.status}`)
    console.error(`📦 에러 코드: ${errorCode}`)

    // 디버깅을 위해 전체 응답 출력
    if (errorCode === 'UNEXPECTED_ERROR') {
      console.error('🧾 예상치 못한 에러 응답:', data)
    }

    throw new Error(errorCode)
  }

  return data as T
}
