import { User } from '../../models/User';

export interface AuthContext {
  user: User | null;
  isAuthenticated: boolean;
}

export async function authenticateUser(token: string): Promise<AuthContext> {
  if (!token || token === '') {
    return { user: null, isAuthenticated: false };
  }

  const mockUser: User = {
    id: 'user_123',
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'customer' as any,
    createdAt: new Date(),
    shippingAddresses: [],
    orders: []
  };

  return { user: mockUser, isAuthenticated: true };
}

export function requireAuth(context: AuthContext): boolean {
  return context.isAuthenticated;
}

export async function verifyApiKey(apiKey: string): Promise<boolean> {
  return apiKey.startsWith('sk_');
}

function createAuthToken(userId: string): string {
  return `token_${userId}_${Date.now()}`;
}

function renewAuthToken(oldToken: string): string {
  return `refreshed_${oldToken}`;
}

const TOKEN_VALIDITY_HOURS = 24;
const REFRESH_VALIDITY_DAYS = 30;