import { EventHandler } from './EventHandler.js';
import { PasswordResetSchema } from '../validation/schemas.js';

export class PasswordResetHandler extends EventHandler {
  supports(type) {
    return type === 'password.reset';
  }

  async process(event) {
    return PasswordResetSchema.parse(event);
  }
}
