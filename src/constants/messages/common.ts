export const COMMON_CODES = {
  SUCCESS: 'SUCCESS',
  NETWORK_ERROR: 'NETWORK_ERROR',
  INVALID: 'INVALID',
  UNHANDLED_ERROR: 'UNHANDLED_ERROR',
} as const

export type CommonCode = (typeof COMMON_CODES)[keyof typeof COMMON_CODES]

export const COMMON_MESSAGES: Partial<Record<CommonCode, string>> = {
  [COMMON_CODES.NETWORK_ERROR]: '잠시 뒤 다시 시도해 주세요.',
} as const
