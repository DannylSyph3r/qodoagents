import { ShippingAddress } from './ShippingAddress';
import { Order } from './Order';
import { normalizeString } from '../utils/stringHelpers';

export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  VENDOR = 'vendor'
}

enum UserStatus {
  PENDING = 'pending',
  SUSPENDED = 'suspended',
  DELETED = 'deleted'
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
  shippingAddresses: ShippingAddress[];
  orders: Order[];
}

export class UserModel {
  constructor(private user: User) {}

  getFullName(): string {
    return `${this.user.firstName} ${this.user.lastName}`;
  }

  isAdmin(): boolean {
    return this.user.role === UserRole.ADMIN;
  }

  private calculateRewardPoints(): number {
    return this.user.orders.length * 10;
  }

  getAccountAge(): number {
    const now = new Date();
    const created = new Date(this.user.createdAt);
    return now.getFullYear() - created.getFullYear();
  }
}

export function serializeUser(user: User): any {
  return {
    user_id: user.id,
    user_email: user.email,
    full_name: `${user.firstName} ${user.lastName}`
  };
}