import { describe, it, expect } from 'vitest';
import { UserRegisteredSchema } from '../src/validation/schemas.js';
import { DeduplicationService } from '../src/services/DeduplicationService.js';

describe('Notification Handler Logic', () => {
  describe('Validation & Normalization', () => {
    it('should normalize roles correctly', () => {
      const input = {
        type: 'user.registered',
        payload: {
          email: 'test@example.com',
          roles: 'admin, editor , manager',
          registered_at: '2021-04-01'
        }
      };
      const result = UserRegisteredSchema.parse(input);
      expect(result.payload.roles).toEqual(['admin', 'editor', 'manager']);
    });

    it('should handle empty or null roles', () => {
      const input = {
        type: 'user.registered',
        payload: {
          email: 'test@example.com',
          roles: null,
          registered_at: '2021-04-01'
        }
      };
      const result = UserRegisteredSchema.parse(input);
      expect(result.payload.roles).toEqual([]);
    });

    it('should normalize dates to ISO-8601', () => {
      const input = {
        type: 'user.registered',
        payload: {
          email: 'test@example.com',
          roles: 'admin',
          registered_at: '2021-04-01'
        }
      };
      const result = UserRegisteredSchema.parse(input);
      expect(result.payload.registered_at).toBe('2021-04-01T00:00:00.000Z');
    });

    it('should fail on invalid email', () => {
      const input = {
        type: 'user.registered',
        payload: {
          email: 'invalid-email',
          roles: 'admin',
          registered_at: '2021-04-01'
        }
      };
      expect(() => UserRegisteredSchema.parse(input)).toThrow();
    });
  });

  describe('DeduplicationService', () => {
    it('should identify duplicates', () => {
      const service = new DeduplicationService();
      expect(service.isDuplicate('id-1')).toBe(false);
      expect(service.isDuplicate('id-1')).toBe(true);
      expect(service.isDuplicate('id-2')).toBe(false);
    });
  });
});
