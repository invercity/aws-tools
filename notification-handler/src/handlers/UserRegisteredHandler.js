import { EventHandler } from './EventHandler.js';
import { UserRegisteredSchema } from '../validation/schemas.js';

export class UserRegisteredHandler extends EventHandler {
  supports(type) {
    return type === 'user.registered';
  }

  async process(event) {
    return UserRegisteredSchema.parse(event);
  }
}
