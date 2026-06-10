import { EventHandler } from './EventHandler.js';
import { UserDeletedSchema } from '../validation/schemas.js';

export class UserDeletedHandler extends EventHandler {
  supports(type) {
    return type === 'user.deleted';
  }

  async process(event) {
    return UserDeletedSchema.parse(event);
  }
}
