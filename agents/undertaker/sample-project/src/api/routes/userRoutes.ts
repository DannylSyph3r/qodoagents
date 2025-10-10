import { UserService } from '../../services/UserService';
import { validateEmail } from '../../utils/validators';
import { authenticateUser } from '../middleware/auth';

export class UserRoutes {
  constructor(private userService: UserService) {}

  async getUser(userId: string): Promise<any> {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      return { error: 'User not found', status: 404 };
    }
    return { data: user, status: 200 };
  }

  async createUser(userData: any): Promise<any> {
    if (!validateEmail(userData.email)) {
      return { error: 'Invalid email', status: 400 };
    }

    const user = await this.userService.createUser(userData);
    return { data: user, status: 201 };
  }

  async updateUser(userId: string, updates: any): Promise<any> {
    const user = await this.userService.updateUser(userId, updates);
    if (!user) {
      return { error: 'User not found', status: 404 };
    }
    return { data: user, status: 200 };
  }

  async deleteUser(userId: string): Promise<any> {
    const deleted = await this.userService.removeUser(userId);
    if (!deleted) {
      return { error: 'User not found', status: 404 };
    }
    return { status: 204 };
  }
}

function cleanUserData(input: any): any {
  const sanitized = { ...input };
  delete sanitized.password;
  delete sanitized.internalId;
  return sanitized;
}
