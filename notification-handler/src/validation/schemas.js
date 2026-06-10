import { z } from 'zod';

const dateNormalization = z.string().or(z.date()).transform((val) => {
  const date = new Date(val);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date');
  }
  return date.toISOString();
});

const rolesNormalization = z.preprocess((val) => {
  if (val === null || val === undefined) return [];
  if (typeof val === 'string') {
    return val.split(',').map(s => s.trim()).filter(s => s !== '');
  }
  if (Array.isArray(val)) {
    return val.map(s => typeof s === 'string' ? s.trim() : s).filter(s => s !== '' && s !== null && s !== undefined);
  }
  return val;
}, z.array(z.string()));

export const BaseEventSchema = z.object({
  event_id: z.string().optional(),
  type: z.string(),
  timestamp: dateNormalization.optional(),
  payload: z.object({
    email: z.string().email(),
  }).passthrough(),
});

export const UserRegisteredSchema = BaseEventSchema.extend({
  payload: z.object({
    email: z.string().email(),
    roles: rolesNormalization,
    registered_at: dateNormalization,
  }).passthrough(),
});

export const PasswordResetSchema = BaseEventSchema.extend({
  payload: z.object({
    email: z.string().email(),
    requested_at: dateNormalization,
  }).passthrough(),
});

export const UserDeletedSchema = BaseEventSchema.extend({
  payload: z.object({
    email: z.string().email(),
    deleted_at: dateNormalization,
  }).passthrough(),
});
