export const EMAIL_CODES = {
  ALREADY_EXIST_MEMBER: 'ALREADY_EXIST_MEMBER',
  EXPIRED_CODE: 'EXPIRED_CODE',
  INVALID_CODE: 'INVALID_CODE',
} as const

export type EmailCode = (typeof EMAIL_CODES)[keyof typeof EMAIL_CODES]

export const EMAIL_MESSAGES: Record<EmailCode, string> = {
  [EMAIL_CODES.ALREADY_EXIST_MEMBER]: '중복된 이메일입니다.',
  [EMAIL_CODES.EXPIRED_CODE]: '코드가 만료되었습니다.',
  [EMAIL_CODES.INVALID_CODE]: '코드가 일치하지 않습니다.',
}
