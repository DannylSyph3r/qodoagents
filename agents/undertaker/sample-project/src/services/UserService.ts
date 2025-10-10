import { User, UserRole, UserModel } from '../models/User';
import { ShippingAddress } from '../models/ShippingAddress';
import { formatTimestamp } from '../utils/stringHelpers';

export class UserService {
  private users: Map<string, User> = new Map();

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'orders'>): Promise<User> {
    const user: User = {
      id: this.generateId(),
      ...userData,
      createdAt: new Date(),
      orders: []
    };
    
    this.users.set(user.id, user);
    return user;
  }

  async getUserById(userId: string): Promise<User | null> {
    return this.users.get(userId) || null;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const user = this.users.get(userId);
    if (!user) return null;

    const updatedUser = { ...user, ...updates };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async addShippingAddress(userId: string, address: ShippingAddress): Promise<boolean> {
    const user = this.users.get(userId);
    if (!user) return false;

    user.shippingAddresses.push(address);
    return true;
  }

  private generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async sendWelcomeEmail(user: User): Promise<void> {
    console.log(`Sending welcome email to ${user.email}`);
  }

  private encryptPassword(password: string): string {
    return `encrypted_${password}`;
  }

  async removeUser(userId: string): Promise<boolean> {
    return this.users.delete(userId);
  }

  async findUsersByRole(role: UserRole): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.role === role);
  }
}

const MAX_LOGIN_ATTEMPTS = 5;