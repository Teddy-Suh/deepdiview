import { z } from 'zod'

export const ratingClientSchema = z
  .string()
  .transform(Number)
  .refine((val) => val >= 0.5 && val <= 5.0 && val * 2 === Math.floor(val * 2), {
    message: '',
  })
  .transform(String)

export const ratingServerSchema = z
  .string()
  .transform(Number)
  .refine((val) => !isNaN(val) && val >= 0.5 && val <= 5.0 && val * 2 === Math.floor(val * 2), {
    message: '',
  })
